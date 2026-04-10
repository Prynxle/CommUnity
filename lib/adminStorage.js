/**
 * Admin session storage: role (csa_admin | clinic_admin) and access_token for API calls.
 * Separate from userStorage so student and admin sessions don't mix.
 */
const STORAGE_KEY = "community:admin";

const isBrowser = () => typeof window !== "undefined";

const safeStorage = (persistent) => {
  if (!isBrowser()) return null;
  try {
    return persistent ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

/**
 * @param {{ email: string, role: 'csa_admin' | 'clinic_admin', access_token: string }} admin
 * @param {boolean} persistent
 */
export function saveAdminSession(admin, persistent = false) {
  const storage = safeStorage(persistent);
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(admin));
  } catch {
    // ignore
  }
}

/**
 * @returns {{ email: string, role: string, access_token: string } | null}
 */
export function getAdminSession() {
  if (!isBrowser()) return null;
  try {
    const sessionValue = window.sessionStorage?.getItem(STORAGE_KEY);
    const localValue = window.localStorage?.getItem(STORAGE_KEY);
    const raw = sessionValue ?? localValue;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ADMIN_ROLES = new Set(["csa_admin", "clinic_admin"]);

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function hasValidAdminSession(session) {
  if (!session || typeof session !== "object") return false;
  if (!ADMIN_ROLES.has(session.role)) return false;
  if (!session.access_token || typeof session.access_token !== "string") return false;

  const payload = decodeJwtPayload(session.access_token);
  // If token can't be decoded, treat as invalid to force re-auth.
  if (!payload) return false;
  if (typeof payload.exp !== "number") return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function clearAdminSession() {
  if (!isBrowser()) return;
  try {
    window.sessionStorage?.removeItem(STORAGE_KEY);
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export { STORAGE_KEY as ADMIN_STORAGE_KEY };
