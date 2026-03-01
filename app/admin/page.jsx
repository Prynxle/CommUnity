"use client";

import { useEffect, useState } from "react";
import { getAdminSession } from "../../lib/adminStorage";
import { poppins } from "../../lib/fonts";

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

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const admin = getAdminSession();
  const token = admin?.access_token;

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
        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to load reports");
        }
        setReports(data.reports ?? []);
      } catch (e) {
        setError(e.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function updateStatus(reportId, newStatus) {
    if (!token) return;
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      setReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId ? { ...r, status: newStatus } : r
        )
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b-4 border-blue-600 pb-4">
        <h1
          className={`${poppins.className} text-2xl font-bold text-gray-900 sm:text-3xl`}
        >
          Reports assigned to you
        </h1>
        <p className="mt-1 text-gray-600">
          Update status to move reports through the workflow: Submitted → In progress → Resolved → Closed.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(38,28,193,0.08)]">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            Loading reports…
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No reports assigned to your account yet. New submissions will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Report ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Reporter
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reports.map((report) => {
                  const nextStatus = NEXT_STATUS[report.status];
                  const isUpdating = updatingId === report.report_id;
                  return (
                    <tr
                      key={report.report_id}
                      className="hover:bg-gray-50/80 transition"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-700 sm:px-6">
                        {report.report_id?.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 sm:px-6">
                        {report.category}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            PRIORITY_STYLES[report.priority] ?? PRIORITY_STYLES.NORMAL
                          }`}
                        >
                          {report.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            STATUS_STYLES[report.status] ?? ""
                          }`}
                        >
                          {STATUS_LABELS[report.status] ?? report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 sm:px-6">
                        <span className="font-medium">{report.first_name}</span>
                        <br />
                        <span className="text-gray-500 text-xs">{report.email}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                        {report.created_at
                          ? new Date(report.created_at).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm sm:px-6">
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(report.report_id, nextStatus)}
                            disabled={isUpdating}
                            className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Updating…"
                              : `→ ${STATUS_LABELS[nextStatus]}`}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
