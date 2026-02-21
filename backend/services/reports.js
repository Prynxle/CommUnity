import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
// Service role key bypasses RLS – use it for server-side reports so inserts always work
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
if (!SUPABASE_URL || !key) {
  throw new Error(
    '[reports service] Missing Supabase credentials. Set SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.'
  )
}

const supabase = createClient(SUPABASE_URL, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

/**
 * Insert a new incident report into Supabase.
 * @param {{
 *   first_name?: string
 *   last_name?: string
 *   email: string
 *   mobile_number?: string
 *   street: string
 *   issue_type: string
 *   description?: string
 *   photo_url?: string
 * }} data
 */
export async function insertReport(data) {
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
 * Bucket must exist (e.g. "report-photos") with policy allowing anon insert.
 * @param {Buffer | Blob} file
 * @param {string} filename
 * @returns {Promise<string>} public URL of the uploaded file
 */
export async function uploadReportPhoto(file, filename) {
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

export default { insertReport, uploadReportPhoto }
