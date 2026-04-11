/**
 * Simple in-memory rate limiter (best-effort per server instance).
 * For multi-instance production, use Redis/Upstash or edge rate limiting.
 */
const buckets = new Map()

/**
 * @param {string} key
 * @param {{ limit: number, windowMs: number }} opts
 * @returns {boolean} true if under limit, false if exceeded
 */
export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  let entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    entry = { resetAt: now + windowMs, count: 0 }
    buckets.set(key, entry)
  }
  entry.count += 1
  return entry.count <= limit
}

export function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}
