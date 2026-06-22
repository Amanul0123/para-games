"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageLookupPage() {
  const router = useRouter();
  const [reportId, setReportId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const id = reportId.trim();
      const res = await fetch(
        `/api/public/reports/${encodeURIComponent(id)}?email=${encodeURIComponent(email.trim())}`,
      );

      if (!res.ok) {
        throw new Error("We couldn't find a report matching that ID and email.");
      }

      sessionStorage.setItem("reportAccess", JSON.stringify({ id, email: email.trim() }));
      router.push(`/form/manage/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-8 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan to-cyan-400 shadow-[0_6px_16px_-4px_rgba(0,188,212,0.4)]">
            <i className="ti ti-search text-xl text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">View or Edit a Report</h2>
            <p className="text-xs text-slate-500">
              Enter the Report ID and email used at submission
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-id-badge-2 text-slate-400" aria-hidden="true" />
              Report ID
            </label>
            <input
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              required
              placeholder="e.g. 8f3c1e2a-..."
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-mail text-slate-400" aria-hidden="true" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <i className="ti ti-alert-circle mt-0.5 flex-shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Find My Report"}
            {!loading && <i className="ti ti-arrow-right" aria-hidden="true" />}
          </button>
        </form>
      </div>
    </div>
  );
}
