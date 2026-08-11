"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TeamSummary } from "@/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface TeamsTableProps {
  teams: TeamSummary[];
  npcOptions: string[];
}

export default function TeamsTable({ teams, npcOptions }: TeamsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [npcFilter, setNpcFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesSearch =
        !q ||
        team.name.toLowerCase().includes(q) ||
        team.npc.toLowerCase().includes(q) ||
        team.email.toLowerCase().includes(q);

      const matchesNpc = npcFilter === "all" || team.npc === npcFilter;

      return matchesSearch && matchesNpc;
    });
  }, [teams, search, npcFilter]);

  const handleDelete = async () => {
    if (!pendingId) return;
    const id = pendingId;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete team");
      router.refresh();
    } catch {
      alert("Failed to delete team. Please try again.");
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
            All Teams
          </div>
          <span className="text-xs text-slate-500">
            {filtered.length} of {teams.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 bg-slate-50/60 px-4 py-3">
          <label htmlFor="teams-search" className="sr-only">
            Search teams by name, NPC, or email
          </label>
          <input
            id="teams-search"
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left">
                <Th>#</Th>
                <Th>NPC</Th>
                <Th>Team Doctor</Th>
                <Th>Email</Th>
                <Th>Athletes</Th>
                <Th>Injuries</Th>
                <Th>Illnesses</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team, i) => (
                <tr
                  key={team.id}
                  className="border-t border-slate-200/70 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                      {team.npc}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-800">{team.name}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{team.email}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {team.athleteCount}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <CountBadge count={team.injuryCount} kind="injury" />
                  </td>
                  <td className="px-4 py-2.5">
                    <CountBadge count={team.illnessCount} kind="illness" />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/teams/${team.id}`}
                        aria-label={`View team ${team.name}`}
                        className="flex items-center gap-1 rounded-md bg-[#185FA5] px-2.5 py-1 text-xs text-white shadow-sm hover:opacity-90"
                      >
                        <i className="ti ti-eye text-[13px]" aria-hidden="true" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingId(team.id)}
                        aria-label={`Delete team ${team.name}`}
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
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                    No teams match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete team"
        message="Are you sure you want to delete this team? This removes their athletes, injuries, and illnesses too. This action cannot be undone."
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

  const styles = kind === "injury" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      <i className={`ti ${kind === "injury" ? "ti-bandage" : "ti-virus"} text-[11px]`} aria-hidden="true" />
      {count}
    </span>
  );
}
