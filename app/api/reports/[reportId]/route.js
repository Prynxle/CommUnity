import { NextResponse } from 'next/server'
import { getReportById, getReportTimeline } from '../../../../backend/services/reports'

/**
 * GET /api/reports/[reportId]
 * Public tracking endpoint. Returns limited report info + status timeline.
 */
export async function GET(_request, { params }) {
  try {
    const { reportId } = await params

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const report = await getReportById(reportId)
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    let timeline = []
    try {
      timeline = await getReportTimeline(reportId)
    } catch {
      timeline = []
    }

    const safeReport = {
      report_id: report.report_id,
      category: report.category,
      location_category: report.location_category,
      sub_location: report.sub_location,
      status: report.status,
      priority: report.priority,
      priority_score: report.priority_score,
      assigned_to: report.assigned_to,
      created_at: report.created_at,
    }

    return NextResponse.json({ report: safeReport, timeline })
  } catch (error) {
    console.error('[reports API] track', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to track report.' },
      { status: 500 }
    )
  }
}

