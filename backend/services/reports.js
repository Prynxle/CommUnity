import { createClient } from '@supabase/supabase-js'
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
 *   first_name: string
 *   email: string
 *   photo_url?: string | null
 * }} userInput
 * @returns {Promise<{ report_id: string, id: string }>}
 */
export async function submitReport(userInput) {
  const supabase = getSupabase()
  const { reportID, status, priority, priority_score, assigned_to, sanitizedInput } =
    processReportSubmission(userInput)

  const row = {
    report_id: reportID,
    category: sanitizedInput.category,
    location_category: sanitizedInput.locationCategory,
    sub_location: sanitizedInput.subLocation || null,
    description: sanitizedInput.description,
    first_name: sanitizedInput.first_name,
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

  // Placeholder: trigger email notification (implement with your email provider)
  triggerEmailNotification(reportId, newStatus).catch((e) =>
    console.warn('[reports service] Email notification failed:', e?.message)
  )

  return { previous_status: currentStatus, new_status: newStatus }
}

/**
 * Placeholder for Phase 5 email. Replace with your email provider (Resend, SendGrid, etc.).
 */
async function triggerEmailNotification(reportId, newStatus) {
  if (process.env.SKIP_REPORT_EMAIL === 'true') return
  // TODO: e.g. await sendEmail({ to: report.email, template: 'status-update', reportId, newStatus })
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
  getReportById,
  getReportTimeline,
  insertReport,
  uploadReportPhoto,
  REPORT_STATUS,
}
