"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReportSummary } from "@/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface ReportsTableProps {
  reports: ReportSummary[];
  npcOptions: string[];
}

type TypeFilter = "all" | "injury" | "illness";
type StatusFilter = "all" | "submitted" | "under_review" | "resolved";

export default function ReportsTable({ reports, npcOptions }: ReportsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [npcFilter, setNpcFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !q ||
        report.reportedBy.toLowerCase().includes(q) ||
        report.npc.toLowerCase().includes(q) ||
        report.email.toLowerCase().includes(q);

      const matchesNpc = npcFilter === "all" || report.npc === npcFilter;

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "injury" && report.injuryCount > 0) ||
        (typeFilter === "illness" && report.illnessCount > 0);

      const matchesStatus = statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesNpc && matchesType && matchesStatus;
    });
  }, [reports, search, npcFilter, typeFilter, statusFilter]);

  const handleDelete = async () => {
    if (!pendingId) return;
    const id = pendingId;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete report");
      router.refresh();
    } catch {
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeletingId(null);
      setPendingId(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <i className="ti ti-table text-slate-500" aria-hidden="true" />
            All Submissions
          </div>
          <span className="text-xs text-slate-500">{filtered.length} of {reports.length}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 bg-slate-50/60 px-4 py-3">
          <label htmlFor="reports-search" className="sr-only">
            Search reports by name, NPC, or email
          </label>
          <input
            id="reports-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, NPC, email..."
            className="min-w-[180px] flex-1 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl placeholder:text-slate-500 focus:border-brand-cyan/60 focus:outline-none"
          />
          <label htmlFor="npc-filter" className="sr-only">
            Filter by NPC
          </label>
          <select
            id="npc-filter"
            value={npcFilter}
            onChange={(e) => setNpcFilter(e.target.value)}
            className="rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl focus:border-brand-cyan/60 focus:outline-none"
          >
            <option value="all">All NPCs</option>
            {npcOptions.map((npc) => (
              <option key={npc} value={npc}>
                {npc}
              </option>
            ))}
          </select>
          <label htmlFor="type-filter" className="sr-only">
            Filter by report type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl focus:border-brand-cyan/60 focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="injury">Injury</option>
            <option value="illness">Illness</option>
          </select>
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl focus:border-brand-cyan/60 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="submitted">New</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left">
                <Th>#</Th>
                <Th>NPC</Th>
                <Th>Reported by</Th>
                <Th>Date</Th>
                <Th>Email</Th>
                <Th>Injuries</Th>
                <Th>Illnesses</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report, i) => (
                <tr
                  key={report.id}
                  className="border-t border-slate-200/70 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                      {report.npc}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-800">{report.reportedBy}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {new Date(report.dateOfReport).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{report.email}</td>
                  <td className="px-4 py-2.5">
                    <CountBadge count={report.injuryCount} kind="injury" />
                  </td>
                  <td className="px-4 py-2.5">
                    <CountBadge count={report.illnessCount} kind="illness" />
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusDot status={report.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/report/${report.id}`}
                        aria-label={`View report for ${report.reportedBy}`}
                        className="flex items-center gap-1 rounded-md bg-[#185FA5] px-2.5 py-1 text-xs text-white shadow-sm hover:opacity-90"
                      >
                        <i className="ti ti-eye text-[13px]" aria-hidden="true" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingId(report.id)}
                        aria-label={`Delete report for ${report.reportedBy}`}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <i className="ti ti-trash text-[13px]" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                    No submissions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        loading={deletingId !== null}
        onConfirm={handleDelete}
        onCancel={() => setPendingId(null)}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function CountBadge({ count, kind }: { count: number; kind: "injury" | "illness" }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        0
      </span>
    );
  }

  const styles =
    kind === "injury"
      ? "bg-red-50 text-red-600"
      : "bg-amber-50 text-amber-600";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      <i className={`ti ${kind === "injury" ? "ti-bandage" : "ti-virus"} text-[11px]`} aria-hidden="true" />
      {count}
    </span>
  );
}

const STATUS_STYLES: Record<string, { label: string; dot: string }> = {
  submitted: { label: "New", dot: "bg-green-500" },
  under_review: { label: "Under Review", dot: "bg-amber-500" },
  resolved: { label: "Resolved", dot: "bg-slate-400" },
};

function StatusDot({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.submitted;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
