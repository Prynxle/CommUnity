const STORAGE_KEY = "community:user";

const isBrowser = () => typeof window !== "undefined";

const safeStorage = (persistent) => {
  if (!isBrowser()) return null;
  try {
    return persistent ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const saveUserProfile = (profile, persistent = false) => {
  const storage = safeStorage(persistent);
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota or serialization errors; loader will fall back to defaults.
  }
};

export const getUserProfile = () => {
  if (!isBrowser()) return null;
  try {
    const sessionValue = window.sessionStorage?.getItem(STORAGE_KEY);
    const localValue = window.localStorage?.getItem(STORAGE_KEY);
    const raw = sessionValue ?? localValue;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearUserProfile = () => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage?.removeItem(STORAGE_KEY);
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors.
  }
};

export { STORAGE_KEY };

