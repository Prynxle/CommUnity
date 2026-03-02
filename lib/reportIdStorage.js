/**
 * Persist report IDs for "Your reports" on the home page.
 * IDs are stored in localStorage (submitted or added by search).
 */

const STORAGE_KEY = "community_my_report_ids";
const MAX_IDS = 50;

export function getMyReportIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function addMyReportId(reportId) {
  if (!reportId || typeof window === "undefined") return;
  const ids = getMyReportIds();
  if (ids.includes(reportId)) return;
  const next = [reportId, ...ids].slice(0, MAX_IDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeMyReportId(reportId) {
  if (typeof window === "undefined") return;
  const ids = getMyReportIds().filter((id) => id !== reportId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
