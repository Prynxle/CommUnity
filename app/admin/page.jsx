"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "../../lib/adminStorage";
import { poppins, georama, inter } from "../../lib/fonts";
import { FiCopy, FiArrowRight, FiPhone, FiX, FiImage } from "react-icons/fi";

const REPORT_STATUS = {
  SUBMITTED: "SUBMITTED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

const NEXT_STATUS = {
  [REPORT_STATUS.SUBMITTED]: REPORT_STATUS.IN_PROGRESS,
  [REPORT_STATUS.IN_PROGRESS]: REPORT_STATUS.RESOLVED,
  [REPORT_STATUS.RESOLVED]: REPORT_STATUS.CLOSED,
  [REPORT_STATUS.CLOSED]: null,
};

const STATUS_LABELS = {
  [REPORT_STATUS.SUBMITTED]: "Submitted",
  [REPORT_STATUS.IN_PROGRESS]: "In progress",
  [REPORT_STATUS.RESOLVED]: "Resolved",
  [REPORT_STATUS.CLOSED]: "Closed",
};

const PRIORITY_STYLES = {
  CRITICAL: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-amber-100 text-amber-800 border-amber-200",
  NORMAL: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_STYLES = {
  [REPORT_STATUS.SUBMITTED]: "bg-blue-100 text-blue-800 border-blue-200",
  [REPORT_STATUS.IN_PROGRESS]: "bg-indigo-100 text-indigo-800 border-indigo-200",
  [REPORT_STATUS.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
  [REPORT_STATUS.CLOSED]: "bg-slate-100 text-slate-700 border-slate-200",
};

const HOTLINES = [
  { office: "Garcia General Hospital", desc: "Emergency & general healthcare", num1: "8941-5511", tel: "8941-5511" },
  { office: "ST. Vincent General Hospital", desc: "Emergency & general healthcare", num1: "8948-0314", tel: "8948-0314" },
  { office: "Marikina Valley Medical Center", desc: "Specialized care & advanced services", num1: "8682-2222", tel: "8682-2222" },
  { office: "SDS Medical Center", desc: "Specialized care & advanced services", num1: "", tel: "8682-8888" },
  { office: "Guidance Office", desc: "Counseling", num1: "0948-0979", tel: "09480979" },
  { office: "PNP Marikina", desc: "1st Line", num1: "0927-968-4311", tel: "0927-968-4311" },
  { office: "PNP Marikina Other Line", desc: "2nd Line", num1: "0998-598-7876", tel: "0998-598-7876" },
  { office: "Bureau of Fire Protection", desc: "Main Line", num1: "117", tel: "117" },
  { office: "City Emergency Hotline", desc: "Life-threatening", num1: "161", tel: "161" },
];

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, report: null, note: "" });
  const [photoModal, setPhotoModal] = useState({ open: false, photoUrl: null });

  const router = useRouter();
  const admin = getAdminSession();
  const token = admin?.access_token;

  useEffect(() => {
    if (!admin?.access_token) {
      router.replace("/admin/login");
      return;
    }
  }, [admin, router]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error ?? "Failed to load reports");
        setReports(data.reports ?? []);
      } catch (e) {
        setError(e.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const copyReportId = useCallback((reportId) => {
    if (!reportId) return;
    navigator.clipboard.writeText(reportId).then(() => {
      setCopiedId(reportId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  async function updateStatus(reportId, newStatus, note = "") {
    if (!token) return;
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      setReports((prev) =>
        prev.map((r) => (r.report_id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const openStatusModal = (report) => {
    const nextStatus = NEXT_STATUS[report.status];
    if (!nextStatus) return;
    setStatusModal({ open: true, report, note: "" });
  };

  const closeStatusModal = () => {
    setStatusModal({ open: false, report: null, note: "" });
  };

  const handleStatusUpdate = async () => {
    if (!statusModal.report) return;
    const { report, note } = statusModal;
    const nextStatus = NEXT_STATUS[report.status];
    await updateStatus(report.report_id, nextStatus, note);
    closeStatusModal();
  };

  const byStatus = useMemo(() => {
    const map = { SUBMITTED: [], IN_PROGRESS: [], RESOLVED: [], CLOSED: [] };
    reports.forEach((r) => {
      const key = r.status in map ? r.status : "SUBMITTED";
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [reports]);

  const stats = useMemo(
    () => [
      { key: "SUBMITTED", label: "Submitted", value: byStatus.SUBMITTED?.length ?? 0, percent: 85 },
      { key: "IN_PROGRESS", label: "In progress", value: byStatus.IN_PROGRESS?.length ?? 0, percent: 60 },
      { key: "RESOLVED", label: "Resolved", value: byStatus.RESOLVED?.length ?? 0, percent: 90 },
      { key: "CLOSED", label: "Closed", value: byStatus.CLOSED?.length ?? 0, percent: 100 },
    ],
    [byStatus]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Background blobs (match home UI) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-44 top-24 h-[400px] w-[400px] rounded-full bg-[#261CC1]/08 blur-[100px]" />
        <div className="absolute right-[-180px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#261CC1]/08 blur-[110px]" />
        <div className="absolute left-1/2 top-64 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.08] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-8 sm:space-y-10">
        {/* Page title */}
        <div className="border-b-4 border-[#2F5BFF] pb-4">
          <h1 className={`${poppins.className} text-[22px] font-bold text-gray-900 sm:text-[28px] lg:text-3xl`}>
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[14px] sm:text-[16px] text-gray-600">
            Manage reports, view stats, and access emergency contacts.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* School Dashboard – Quick stats */}
        <section className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]">
          <div className="relative overflow-hidden px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute -left-20 top-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#2F5BFF]/55 blur-[100px]" />
            <div className="absolute right-[-60px] bottom-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#FFEB00]/55 blur-[110px]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10">
              <div className={`${georama.className} text-[18px] sm:text-[20px] font-bold`}>School Dashboard</div>
              <div className={`${inter.className} mt-1 text-[13px] sm:text-[15px] text-white/90`}>
                Report counts by status
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.key}
                className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_35px_rgba(38,28,193,0.08)]"
              >
                <div className="text-[12px] sm:text-[13px] font-semibold text-gray-500">{s.label}</div>
                <div className="mt-1 text-[24px] sm:text-[28px] font-bold text-[#1C0770]">{s.value}</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#2F5BFF]"
                    style={{ width: `${Math.min(100, (s.value || 0) * 5 + 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Response */}
        <section className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]">
          <div className="relative overflow-hidden border-b border-gray-200 px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className={`${georama.className} text-[18px] sm:text-[20px] font-bold`}>Emergency Response</div>
                <div className={`${inter.className} mt-1 text-[13px] sm:text-[15px] text-white/90`}>
                  Campus hotlines for urgent assistance
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {HOTLINES.map((h) => (
              <a
                key={h.office}
                href={`tel:${h.tel}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#D7E0FF] bg-white p-3 shadow-sm transition hover:border-[#2F5BFF]/40 hover:shadow-md sm:p-4"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-gray-900">{h.office}</div>
                  <div className="text-[12px] text-gray-500">{h.desc}</div>
                  <div className="mt-1 text-[13px] font-medium text-[#1a138f]">{h.num1}</div>
                </div>
                <span className="shrink-0 rounded-full bg-[#261CC1]/10 p-2 text-[#1a138f]">
                  <FiPhone className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Reports by status */}
        <section className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]">
          <div className="relative overflow-hidden border-b border-gray-200 px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10">
              <div className={`${georama.className} text-[18px] sm:text-[20px] font-bold`}>Your Reports Database</div>
              <div className={`${inter.className} mt-1 text-[13px] sm:text-[15px] text-white/90`}>
                Advance status: Submitted → In progress → Resolved → Closed
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">Loading reports…</div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-[15px] text-gray-500">
              No reports assigned yet. New submissions will appear here.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {(["SUBMITTED", "IN_PROGRESS", "RESOLVED", "CLOSED"]).map((statusKey) => {
                const list = byStatus[statusKey] ?? [];
                if (list.length === 0) return null;
                return (
                  <div key={statusKey} className="p-4 sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-[16px] font-semibold text-gray-900">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[statusKey] ?? ""}`}
                      >
                        {STATUS_LABELS[statusKey]}
                      </span>
                      <span className="text-gray-500">({list.length})</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {list.map((report) => {
                        const nextStatus = NEXT_STATUS[report.status];
                        const isUpdating = updatingId === report.report_id;
                        const isCopied = copiedId === report.report_id;
                        return (
                          <div
                            key={report.report_id}
                            className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_30px_rgba(38,28,193,0.08)] transition hover:shadow-[0_18px_45px_rgba(38,28,193,0.12)] sm:p-5"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[13px] sm:text-[14px] text-gray-700">
                                    {report.report_id?.slice(0, 12)}…
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyReportId(report.report_id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:bg-gray-100"
                                    title="Copy full Report ID"
                                  >
                                    <FiCopy className="h-3.5 w-3.5" />
                                    {isCopied ? "Copied!" : "Copy ID"}
                                  </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[14px] font-medium text-gray-900">{report.category}</span>
                                  <span
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                      PRIORITY_STYLES[report.priority] ?? PRIORITY_STYLES.NORMAL
                                    }`}
                                  >
                                    {report.priority}
                                  </span>
                                </div>
                                <div className="text-[12px] sm:text-[13px] text-gray-500">
                                  <span className="font-medium text-gray-700">{report.first_name}</span>
                                  {" · "}
                                  {report.email}
                                </div>
                                {report.created_at && (
                                  <div className="text-[11px] sm:text-[12px] text-gray-400">
                                    {new Date(report.created_at).toLocaleString(undefined, {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })}
                                  </div>
                                )}
                                {report.photo_url && (
                                  <button
                                    type="button"
                                    onClick={() => setPhotoModal({ open: true, photoUrl: report.photo_url })}
                                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[12px] font-semibold text-blue-700 transition hover:bg-blue-100"
                                  >
                                    <FiImage className="h-4 w-4" />
                                    View photo
                                  </button>
                                )}
                              </div>
                              <div className="shrink-0">
                                {nextStatus ? (
                                  <button
                                    type="button"
                                    onClick={() => openStatusModal(report)}
                                    disabled={isUpdating}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2F5BFF] bg-gradient-to-b from-[#2F5BFF] to-[#261CC1] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
                                  >
                                    {isUpdating ? "Updating…" : (
                                      <>
                                        {STATUS_LABELS[nextStatus]}
                                        <FiArrowRight className="h-3.5 w-3.5" />
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <span className="inline-flex rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[12px] font-medium text-gray-500">
                                    Closed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Status Update Modal */}
        {statusModal.open && statusModal.report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Report Status
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Changing status from <span className="font-medium">{STATUS_LABELS[statusModal.report.status]}</span> to{" "}
                  <span className="font-medium">{STATUS_LABELS[NEXT_STATUS[statusModal.report.status]]}</span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a note (optional):
                </label>
                <textarea
                  value={statusModal.note}
                  onChange={(e) => setStatusModal(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Describe what actions were taken..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2F5BFF] focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeStatusModal}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingId === statusModal.report.report_id}
                  className="flex-1 rounded-lg bg-[#2F5BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#261CC1] disabled:opacity-50"
                >
                  {updatingId === statusModal.report.report_id ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Viewer Modal */}
        {photoModal.open && photoModal.photoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative max-w-2xl w-full max-h-[85vh] flex flex-col">
              <button
                onClick={() => setPhotoModal({ open: false, photoUrl: null })}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              >
                <FiX className="h-6 w-6" />
              </button>
              <div className="flex-1 overflow-auto rounded-xl bg-white flex items-center justify-center">
                <img
                  src={photoModal.photoUrl}
                  alt="Report photo"
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={() => setPhotoModal({ open: false, photoUrl: null })}
                className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
