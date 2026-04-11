import { NextResponse } from 'next/server'
import authService from '../../../backend/services/auth'
import { listReportsByEmail } from '../../../backend/services/reports'

/**
 * GET /api/my-reports
 * End-user endpoint. Requires Authorization: Bearer <access_token>.
 * Returns a user's own reports (by email).
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { user } = await authService.getSession(token)
    const email = user?.email ?? null
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const reports = await listReportsByEmail(email)

    // Keep the payload small; details/timeline use /api/reports/[reportId]
    const safeReports = (reports ?? []).map((r) => ({
      report_id: r.report_id,
      category: r.category,
      location_category: r.location_category,
      sub_location: r.sub_location,
      status: r.status,
      assigned_to: r.assigned_to,
      created_at: r.created_at,
    }))

    return NextResponse.json({ reports: safeReports })
  } catch (error) {
    console.error('[my-reports API] GET', error)
    return NextResponse.json({ error: 'Failed to load your reports.' }, { status: 500 })
  }
}

