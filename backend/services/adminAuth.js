/**
 * Server-side: verify admin JWT and return role for report API access.
 * Admin emails must be csa_admin@community.local and clinic_admin@community.local.
 */
import authService from './auth'

const EMAIL_TO_ROLE = {
  'csa_admin@community.local': 'csa_admin',
  'clinic_admin@community.local': 'clinic_admin',
}

/**
 * @param {string} accessToken - Supabase session access_token (Bearer)
 * @returns {Promise<{ role: string, email: string } | null>}
 */
export async function getAdminFromToken(accessToken) {
  if (!accessToken?.trim()) return null
  try {
    // authService.getSession returns { user } from Supabase
    const data = await authService.getSession(accessToken)
    const email = data?.user?.email?.toLowerCase?.()
    const role = EMAIL_TO_ROLE[email]
    if (!role) return null
    return { role, email }
  } catch {
    return null
  }
}
