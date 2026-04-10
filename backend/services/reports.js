import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import {
  processReportSubmission,
  isValidTransition,
  REPORT_STATUS,
} from './reportProcessing'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
let _supabase = null

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

function getSupabase() {
  // Important: do NOT throw at module import time. This file can be imported during builds.
  if (!SUPABASE_URL || !key) {
    throw new Error(
      '[reports service] Missing Supabase credentials. Set SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.'
    )
  }
  if (_supabase) return _supabase
  _supabase = createClient(SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
  return _supabase
}

// --- Multi-stage report processing (new reports table) ---

/**
 * Phase 1–3: Validate, sanitize, compute priority/assignment, then store in DB.
 * @param {{
 *   category: string
 *   locationCategory: string
 *   subLocation?: string
 *   subLocationRequired?: boolean
 *   description: string
 *   first_name?: string | null
 *   email: string
 *   photo_url: string (required)
 * }} userInput
 * @returns {Promise<{ report_id: string, id: string }>}
 */
export async function submitReport(userInput) {
  const supabase = getSupabase()

  // Rate limit: max 3 reports per day per email
  if (userInput.email) {
    const emailStr = String(userInput.email).trim()
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count, error: countErr } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('email', emailStr)
      .gte('created_at', twentyFourHoursAgo)

    if (!countErr && count >= 3) {
      const err = new Error(
        'You have reached the maximum limit of 3 reports per day. Please try again tomorrow.'
      )
      err.code = 'RATE_LIMIT_EXCEEDED'
      throw err
    }
  }

  const { reportID, status, priority, priority_score, assigned_to, sanitizedInput } =
    processReportSubmission(userInput)

  const row = {
    report_id: reportID,
    category: sanitizedInput.category,
    location_category: sanitizedInput.locationCategory,
    sub_location: sanitizedInput.subLocation || null,
    description: sanitizedInput.description,
    // DB column is NOT NULL; blank optional name is stored as a sentinel (not SQL NULL).
    first_name: sanitizedInput.first_name?.trim() || 'Anonymous',
    email: sanitizedInput.email,
    photo_url: userInput.photo_url ?? null,
    status,
    priority,
    priority_score,
    assigned_to,
  }

  const { data, error } = await supabase
    .from('reports')
    .insert(row)
    .select('id, report_id')
    .single()

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return { report_id: data.report_id, id: data.id }
}

/**
 * Phase 5: Update report status with valid transition, timeline log, and optional email.
 * @param {string} reportId - reports.report_id (text UUID from submission)
 * @param {string} newStatus - One of SUBMITTED, IN_PROGRESS, RESOLVED, CLOSED
 * @param {string} [adminId] - Admin who made the change (for timeline)
 */
export async function updateReportStatus(reportId, newStatus, adminId = null, note = null) {
  const supabase = getSupabase()
  const { data: report, error: fetchErr } = await supabase
    .from('reports')
    .select('id, report_id, status')
    .eq('report_id', reportId)
    .single()

  if (fetchErr || !report) {
    const err = new Error(`[reports service] Report not found: ${reportId}`)
    if (fetchErr) err.__supabase = fetchErr
    throw err
  }

  const currentStatus = report.status
  if (!isValidTransition(currentStatus, newStatus)) {
    const err = new Error(
      `[reports service] Invalid status transition: ${currentStatus} -> ${newStatus}`
    )
    err.code = 'INVALID_TRANSITION'
    throw err
  }

  const { error: logErr } = await supabase.from('report_timeline_log').insert({
    report_id: reportId,
    previous_status: currentStatus,
    new_status: newStatus,
    admin_id: adminId,
    note: note ?? null,
  })

  if (logErr) {
    const err = new Error(`[reports service] Timeline log failed: ${logErr.message}`)
    err.__supabase = logErr
    throw err
  }

  const { error: updateErr } = await supabase
    .from('reports')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('report_id', reportId)

  if (updateErr) {
    const err = new Error(`[reports service] Update status failed: ${updateErr.message}`)
    err.__supabase = updateErr
    throw err
  }

  // Send status update email for every transition (SUBMITTED receipt is in the API route)
  triggerEmailNotification(reportId, newStatus).catch((e) =>
    console.warn('[reports service] Email notification failed:', e?.message)
  )

  return { previous_status: currentStatus, new_status: newStatus }
}

/**
 * Build status-specific email copy.
 */
function getStatusEmailContent(status) {
  switch (status) {
    case REPORT_STATUS.IN_PROGRESS:
      return {
        title: 'Your Report is Now In Progress',
        description:
          'Our team has begun reviewing and working on your report. We will keep you updated on any further progress.',
        badgeColor: '#2563eb',
        badgeLabel: 'In Progress',
      }
    case REPORT_STATUS.RESOLVED:
      return {
        title: 'Your Report Has Been Resolved',
        description:
          'Great news! The issue you reported has been resolved. Thank you for helping make our community safer.',
        badgeColor: '#16a34a',
        badgeLabel: 'Resolved',
      }
    case REPORT_STATUS.CLOSED:
      return {
        title: 'Your Report Has Been Closed',
        description:
          'Your report has been closed and all required actions have been finalized. No further updates will be sent.',
        badgeColor: '#6b7280',
        badgeLabel: 'Closed',
      }
    default:
      return null
  }
}

/**
 * Build the HTML email template for status updates.
 */
function buildStatusEmailHtml({ title, description, badgeColor, badgeLabel, reportId, trackUrl }) {
  const trackSection = trackUrl
    ? `
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#111827; border-radius:10px;">
                      <a href="${trackUrl}" style="display:inline-block; padding:10px 14px; font-size:13px; font-weight:700; color:#ffffff; text-decoration:none;">
                        Track your report
                      </a>
                    </td>
                    <td style="padding-left:10px; font-size:12px; color:#6b7280;">
                      If the button doesn\u2019t work, copy this link:<br/>
                      <span style="word-break:break-all; color:#374151;">${trackUrl}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#f4f5fb;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f5fb; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,0.12);">
            <tr>
              <td style="padding:20px 24px; background:linear-gradient(135deg,#1C0770,#2F5BFF,#FFEB00); color:#ffffff;">
                <h1 style="margin:0; font-size:20px; font-weight:700; letter-spacing:0.01em;">
                  ${title}
                </h1>
                <p style="margin:6px 0 0; font-size:13px; opacity:0.9;">
                  Keep this email for your reference.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 4px; font-size:14px; color:#0f172a;">
                <p style="margin:0 0 8px;">Hi,</p>
                <p style="margin:0 0 12px; line-height:1.5;">
                  ${description}
                </p>
              </td>
            </tr>${trackSection}
            <tr>
              <td style="padding:0 24px 4px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:13px; color:#0f172a;">
                  <tr>
                    <td style="padding:8px 0; width:120px; font-weight:600; color:#6b7280;">Report ID</td>
                    <td style="padding:8px 0; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                      ${reportId}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:600; color:#6b7280;">New Status</td>
                    <td style="padding:8px 0;">
                      <span style="display:inline-block; padding:4px 12px; border-radius:6px; font-size:12px; font-weight:700; color:#ffffff; background-color:${badgeColor};">
                        ${badgeLabel}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 20px; font-size:12px; color:#6b7280;">
                <p style="margin:0 0 4px;">
                  Keep your <strong>Report ID</strong> safe. You may be asked for it when following up.
                </p>
                <p style="margin:0; color:#9ca3af;">
                  This is an automated notification from the CommUnity reporting system.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/**
 * Send a styled status-update email for every stage transition.
 * SUBMITTED receipt is handled separately in the POST route.
 */
async function triggerEmailNotification(_reportId, _newStatus) {
  if (process.env.SKIP_REPORT_EMAIL === 'true') return

  const content = getStatusEmailContent(_newStatus)
  if (!content) return // Unknown or SUBMITTED status — skip

  const apiKey = process.env.SENDGRID_API_KEY
  const from = process.env.SENDGRID_FROM
  if (!apiKey || !from) return

  const report = await getReportById(_reportId)
  const to = report?.email || null
  if (!to) return

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl
  const trackUrl = baseUrl || null

  const subject = `${content.title} (ID: ${_reportId})`

  await sgMail.send({
    to,
    from,
    subject,
    text: `Status update for your CommUnity report.\n\nReport ID: ${_reportId}\nNew status: ${_newStatus}\n\nThank you for helping us keep the community safe.`,
    html: buildStatusEmailHtml({
      ...content,
      reportId: _reportId,
      trackUrl,
    }),
  })
}

/**
 * List reports assigned to a given admin (csa_admin | clinic_admin).
 * @param {string} assignedTo
 * @returns {Promise<Array>}
 */
export async function listReports(assignedTo) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('assigned_to', assignedTo)
    .order('created_at', { ascending: false })

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return data ?? []
}

/**
 * List reports submitted by a given user email (end-user "My reports").
 * @param {string} email
 * @returns {Promise<Array>}
 */
export async function listReportsByEmail(email) {
  const emailStr = String(email || '').trim()
  if (!emailStr) return []

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('email', emailStr)
    .order('created_at', { ascending: false })

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return data ?? []
}

/**
 * Get a single report by its public report_id (for tracking).
 */
export async function getReportById(reportId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('report_id', reportId)
    .maybeSingle()

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return data
}

/**
 * Get timeline entries for a report (for admin UI).
 */
export async function getReportTimeline(reportId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('report_timeline_log')
    .select('*')
    .eq('report_id', reportId)
    .order('changed_at', { ascending: true })

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return data
}

// --- Legacy incident_reports (optional, keep for backward compat) ---

/**
 * Insert a new incident report into Supabase (legacy table).
 * @deprecated Prefer submitReport() for the multi-stage algorithm.
 */
export async function insertReport(data) {
  const supabase = getSupabase()
  const { data: row, error } = await supabase
    .from('incident_reports')
    .insert({
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      email: data.email,
      mobile_number: data.mobile_number || null,
      street: data.street,
      issue_type: data.issue_type,
      description: data.description || null,
      photo_url: data.photo_url || null,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    const err = new Error(`[reports service] ${error.message}`)
    err.__supabase = error
    throw err
  }
  return row
}

/**
 * Upload a report photo to Supabase Storage.
 */
export async function uploadReportPhoto(file, filename) {
  const supabase = getSupabase()
  const ext = (filename || '').split('.').pop() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('report-photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    const err = new Error(`[reports service] upload: ${error.message}`)
    err.__supabase = error
    throw err
  }

  const { data: urlData } = supabase.storage
    .from('report-photos')
    .getPublicUrl(data.path)
  return urlData.publicUrl
}

export { REPORT_STATUS }
export default {
  submitReport,
  updateReportStatus,
  listReports,
  listReportsByEmail,
  getReportById,
  getReportTimeline,
  insertReport,
  uploadReportPhoto,
  REPORT_STATUS,
}
