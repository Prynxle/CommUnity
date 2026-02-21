import { NextResponse } from 'next/server'
import { insertReport, uploadReportPhoto } from '../../../backend/services/reports'

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let body
    let photoUrl = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        first_name: formData.get('first_name')?.toString() || null,
        last_name: formData.get('last_name')?.toString() || null,
        email: formData.get('email')?.toString(),
        mobile_number: formData.get('mobile_number')?.toString() || null,
        street: formData.get('street')?.toString(),
        issue_type: formData.get('issue_type')?.toString(),
        description: formData.get('description')?.toString() || null,
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

    const { email, street, issue_type } = body
    if (!email || !street || !issue_type) {
      return NextResponse.json(
        { error: 'Email, street, and issue type are required.' },
        { status: 400 }
      )
    }

    const row = await insertReport({
      ...body,
      photo_url: photoUrl ?? body.photo_url ?? null,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ id: row.id, success: true })
  } catch (error) {
    console.error('[reports API]', error)
    const message =
      error?.message ?? 'Failed to submit report. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
