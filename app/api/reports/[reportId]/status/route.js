import { NextResponse } from 'next/server'
import { updateReportStatus } from '../../../../../backend/services/reports'
import { getAdminFromToken } from '../../../../../backend/services/adminAuth'
import { REPORT_STATUS } from '../../../../../backend/services/reportProcessing'

const ALLOWED_STATUSES = Object.values(REPORT_STATUS)

/**
 * PATCH /api/reports/[reportId]/status
 * Admin only. Phase 5: Update report status with valid transition and timeline logging.
 * Requires Authorization: Bearer <access_token>.
 * Body: { "status": "IN_PROGRESS" | "RESOLVED" | "CLOSED", "admin_id": "optional" }
 */
export async function PATCH(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 })
    }

    const reportId = params?.reportId
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const newStatus = (body.status || '').toUpperCase()
    const adminId = body.admin_id ?? admin.role

    if (!ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    const result = await updateReportStatus(reportId, newStatus, adminId)
    return NextResponse.json(result)
  } catch (error) {
    if (error?.code === 'INVALID_TRANSITION') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error?.message?.includes('not found')) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    console.error('[reports API] status update', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to update status' },
      { status: 500 }
    )
  }
}
