"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyReports, type MyReportEntry } from "@/lib/myReports";
import { getNpcFlag } from "@/lib/npcFlags";

export default function ManageLookupPage() {
  const router = useRouter();
  const [myReports, setMyReports] = useState<MyReportEntry[]>([]);

  const [reportId, setReportId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [linkEmail, setLinkEmail] = useState("");
  const [linkSending, setLinkSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    setMyReports(getMyReports());
  }, []);

  const openReport = (id: string, ownerEmail: string) => {
    sessionStorage.setItem("reportAccess", JSON.stringify({ id, email: ownerEmail }));
    router.push(`/form/manage/${id}`);
  };

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

      openReport(id, email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkSending(true);
    setLinkSent(false);

    try {
      await fetch("/api/public/reports/resend-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: linkEmail.trim() }),
      });
    } finally {
      setLinkSending(false);
      setLinkSent(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-16">
      {myReports.length > 0 && (
        <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-6 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <i className="ti ti-history text-slate-400" aria-hidden="true" />
            My Reports on This Device
          </h3>
          <div className="space-y-2">
            {myReports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openReport(r.id, r.email)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-left text-sm hover:border-brand-cyan/60"
              >
                <span className="text-slate-700">
                  {getNpcFlag(r.npc)} {r.npc} &mdash; {r.reportedBy}
                </span>
                <i className="ti ti-arrow-right text-slate-400" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

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

      <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/60 p-6 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
        <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <i className="ti ti-mail-forward text-slate-400" aria-hidden="true" />
          Lost your Report ID?
        </h3>
        <p className="mb-3 text-xs text-slate-500">
          Enter the email you used and we&apos;ll send you a link to access your report(s).
        </p>

        {linkSent ? (
          <p className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
            <i className="ti ti-circle-check mt-0.5 flex-shrink-0" aria-hidden="true" />
            If that email matches a submitted report, a link is on its way.
          </p>
        ) : (
          <form onSubmit={handleSendLink} className="flex gap-2">
            <input
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="flex-1 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
            <button
              type="submit"
              disabled={linkSending}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {linkSending ? "Sending..." : "Email Me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
