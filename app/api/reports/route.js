import { NextResponse } from 'next/server'
import { submitReport, uploadReportPhoto, listReports } from '../../../backend/services/reports'
import { getAdminFromToken } from '../../../backend/services/adminAuth'

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
    return NextResponse.json(
      { error: error?.message ?? 'Failed to load reports.' },
      { status: 500 }
    )
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
    const contentType = request.headers.get('content-type') || ''
    let body
    let photoUrl = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        category: formData.get('category')?.toString()?.trim() || '',
        locationCategory: formData.get('locationCategory')?.toString()?.trim() || '',
        subLocation: formData.get('subLocation')?.toString()?.trim() || null,
        description: formData.get('description')?.toString()?.trim() || '',
        first_name: formData.get('first_name')?.toString()?.trim() || '',
        email: formData.get('email')?.toString()?.trim() || '',
      }
      const file = formData.get('photo')
      if (file && file.size > 0) {
        try {
          photoUrl = await uploadReportPhoto(await file.arrayBuffer(), file.name)
        } catch (uploadErr) {
          console.warn('[reports API] Photo upload failed:', uploadErr?.message)
        }
      }
    } else {
      body = await request.json()
    }

    // Sub-location required when location has sub-options (frontend sends subLocationRequired or we infer)
    const locationHasSub = [
      '1st floor',
      '2nd floor',
      '3rd floor',
      '4th floor',
    ].includes((body.locationCategory || '').trim())
    body.subLocationRequired = locationHasSub

    body.photo_url = photoUrl ?? body.photo_url ?? null

    const result = await submitReport(body)
    return NextResponse.json({
      id: result.id,
      report_id: result.report_id,
      success: true,
    })
  } catch (error) {
    if (error?.code === 'MISSING_REQUIRED_FIELDS') {
      return NextResponse.json(
        { error: error.detail || 'Submission Failed. Please fill all required fields.' },
        { status: 400 }
      )
    }
    console.error('[reports API]', error)
    const message =
      error?.message ?? 'Failed to submit report. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
