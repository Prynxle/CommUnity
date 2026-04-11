/**
 * Allowlist report evidence URLs (Supabase public bucket only).
 * Uses NEXT_PUBLIC_SUPABASE_URL so client and server share the same check.
 */
export function isTrustedReportPhotoUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false

    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!base) return false
    let expectedHost
    try {
      expectedHost = new URL(base).hostname
    } catch {
      return false
    }
    if (parsed.hostname !== expectedHost) return false

    const path = parsed.pathname
    return path.includes('/storage/v1/object/public/report-photos/')
  } catch {
    return false
  }
}
