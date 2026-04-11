import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { submitReport, uploadReportPhoto, listReports } from '../../../backend/services/reports'
import { getAdminFromToken } from '../../../backend/services/adminAuth'
import { escapeHtml } from '../../../lib/escapeHtml'
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

/**
 * GET /api/reports
 * Admin only. Requires Authorization: Bearer <access_token>.
 * Returns reports where assigned_to matches the admin's role.
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 })
    }
    const reports = await listReports(admin.role)
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('[reports API] GET', error)
    return NextResponse.json({ error: 'Failed to load reports.' }, { status: 500 })
  }
}

/**
 * POST /api/reports
 * Multi-stage report submission (Phase 1–3):
 * - Required fields validation
 * - Sanitization, unique report_id, status SUBMITTED
 * - Priority score & level, assigned_to (csa_admin | clinic_admin)
 */
export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`report-submit:${ip}`, { limit: 40, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many submissions from this network. Please try again later.' },
        { status: 429 }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          error:
            'Reports must be submitted with multipart/form-data including a photo attachment.',
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const body = {
      category: formData.get('category')?.toString()?.trim() || '',
      locationCategory: formData.get('locationCategory')?.toString()?.trim() || '',
      subLocation: formData.get('subLocation')?.toString()?.trim() || null,
      description: formData.get('description')?.toString()?.trim() || '',
      first_name: formData.get('first_name')?.toString()?.trim() || '',
      email: formData.get('email')?.toString()?.trim() || '',
    }

    const file = formData.get('photo')
    const hasFile =
      file &&
      typeof file === 'object' &&
      typeof file.arrayBuffer === 'function' &&
      file.size > 0

    if (!hasFile) {
      return NextResponse.json(
        { error: 'Please attach evidence (a photo or screenshot).' },
        { status: 400 }
      )
    }

    let photoUrl
    try {
      photoUrl = await uploadReportPhoto(await file.arrayBuffer(), file.name)
    } catch (uploadErr) {
      console.warn('[reports API] Photo upload failed:', uploadErr?.message)
      const raw = uploadErr?.message || ''
      const friendly = raw.includes('too large')
        ? 'Photo must be 5MB or smaller.'
        : raw.includes('supported image') || raw.includes('JPG, PNG')
          ? 'Please upload a valid JPG, PNG, GIF, or WEBP image.'
          : 'Evidence upload failed. Please try a different file.'
      return NextResponse.json({ error: friendly }, { status: 400 })
    }

    const locationHasSub = [
      '1st floor',
      '2nd floor',
      '3rd floor',
      '4th floor',
    ].includes((body.locationCategory || '').trim())
    body.subLocationRequired = locationHasSub
    body.photo_url = photoUrl

    const result = await submitReport(body)

    const reportId = result.report_id
    const userEmail = body.email || null

    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl
    const trackUrl = baseUrl && reportId ? `${baseUrl}` : null

    const safeEmail = escapeHtml(userEmail)
    const safeCategory = escapeHtml(body.category || '-')
    const safeLocation = escapeHtml(body.locationCategory || '-')
    const safeSubLoc = body.subLocation ? escapeHtml(body.subLocation) : ''
    const safeDescription = escapeHtml(body.description || '-')
    const safeTrack = trackUrl ? escapeHtml(trackUrl) : ''
    const safeReportId = escapeHtml(String(reportId ?? 'unknown'))

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM && userEmail) {
      try {
        const msg = {
          to: userEmail,
          from: process.env.SENDGRID_FROM,
          subject: `Your CommUnity report receipt (ID: ${reportId ?? 'unknown'})`,
          text: `Thanks for submitting a report to CommUnity.

Report ID: ${reportId ?? 'unknown'}
Category: ${body.category || '-'}
Location: ${body.locationCategory || '-'}${body.subLocation ? ' - ' + body.subLocation : ''}
Submitted email: ${userEmail}
${trackUrl ? `\nTrack your report: ${trackUrl}\n` : ''}

Description:
${body.description || '-'}
`,
          html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Your report receipt</title>
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
                  Your Report Progress
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
                  Thanks for submitting a report to CommUnity. Below is your receipt and reference information.
                </p>
              </td>
            </tr>

            ${trackUrl
              ? `
            <tr>
              <td style="padding:0 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#111827; border-radius:10px;">
                      <a href="${safeTrack}" style="display:inline-block; padding:10px 14px; font-size:13px; font-weight:700; color:#ffffff; text-decoration:none;">
                        Track your report
                      </a>
                    </td>
                    <td style="padding-left:10px; font-size:12px; color:#6b7280;">
                      If the button doesn’t work, copy this link:<br/>
                      <span style="word-break:break-all; color:#374151;">${safeTrack}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            `
              : ''
            }

            <tr>
              <td style="padding:0 24px 4px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:13px; color:#0f172a;">
                  <tr>
                    <td style="padding:8px 0; width:120px; font-weight:600; color:#6b7280;">Report ID</td>
                    <td style="padding:8px 0; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                      ${safeReportId}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:600; color:#6b7280;">Your email</td>
                    <td style="padding:8px 0;">
                      ${safeEmail}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:600; color:#6b7280;">Category</td>
                    <td style="padding:8px 0;">
                      ${safeCategory}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:600; color:#6b7280;">Location</td>
                    <td style="padding:8px 0;">
                      ${safeLocation}${safeSubLoc ? ` — ${safeSubLoc}` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;">
                <div style="border-radius:10px; border:1px solid #e5e7eb; background-color:#f9fafb; padding:14px 16px;">
                  <div style="font-size:13px; font-weight:600; color:#111827; margin-bottom:6px;">
                    Description
                  </div>
                  <div style="font-size:13px; color:#374151; line-height:1.55; white-space:pre-wrap;">
                    ${safeDescription}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 20px; font-size:12px; color:#6b7280;">
                <p style="margin:0 0 4px;">
                  Keep your <strong>Report ID</strong> safe. You may be asked for it when following up.
                </p>
                <p style="margin:0; color:#9ca3af;">
                  This is an automated receipt from the CommUnity reporting system.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
          `,
        }

        await sgMail.send(msg)
      } catch (emailError) {
        console.error('[reports API] SendGrid email failed', emailError)
      }
    }

    return NextResponse.json({
      id: result.id,
      report_id: reportId,
      success: true,
    })
  } catch (error) {
    if (error?.code === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      )
    }
    if (error?.code === 'MISSING_REQUIRED_FIELDS') {
      return NextResponse.json(
        { error: error.detail || 'Submission Failed. Please fill all required fields.' },
        { status: 400 }
      )
    }
    console.error('[reports API]', error)
    return NextResponse.json(
      { error: 'Failed to submit report. Please try again.' },
      { status: 500 }
    )
  }
}
