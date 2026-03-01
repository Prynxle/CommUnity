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
