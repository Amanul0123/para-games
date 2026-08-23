"use client";

import { useMemo, useState } from "react";

interface InjuryRow {
  id: string;
  athleteName: string;
  date: string;
  bodyPart: string;
  injuryType: string;
  causeOfInjury: string | null;
  daysLost: number | string;
  status: string;
}

interface IllnessRow {
  id: string;
  athleteName: string;
  date: string;
  diagnosis: string;
  affectedSystem: string | null;
  causeOfIllness: string | null;
  daysLost: number | string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "logged", label: "Logged" },
  { value: "under_review", label: "Under Review" },
  { value: "resolved", label: "Resolved" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All records" },
  { value: "injury", label: "Injuries only" },
  { value: "illness", label: "Illnesses only" },
] as const;

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

export default function RecordedDataView({
  injuries,
  illnesses,
}: {
  injuries: InjuryRow[];
  illnesses: IllnessRow[];
}) {
  const [search, setSearch] = useState("");
  const [athlete, setAthlete] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]["value"]>("all");

  const athleteOptions = useMemo(() => {
    const names = new Set<string>();
    injuries.forEach((i) => names.add(i.athleteName));
    illnesses.forEach((i) => names.add(i.athleteName));
    return Array.from(names).sort();
  }, [injuries, illnesses]);

  const q = search.trim().toLowerCase();

  const filteredInjuries = useMemo(() => {
    if (type === "illness") return [];
    return injuries.filter((i) => {
      if (athlete && i.athleteName !== athlete) return false;
      if (status && i.status !== status) return false;
      if (!q) return true;
      return [i.athleteName, i.bodyPart, i.injuryType, i.causeOfInjury ?? "", i.date]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [injuries, athlete, status, q, type]);

  const filteredIllnesses = useMemo(() => {
    if (type === "injury") return [];
    return illnesses.filter((i) => {
      if (athlete && i.athleteName !== athlete) return false;
      if (status && i.status !== status) return false;
      if (!q) return true;
      return [i.athleteName, i.diagnosis, i.affectedSystem ?? "", i.causeOfIllness ?? "", i.date]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [illnesses, athlete, status, q, type]);

  const hasActiveFilters = Boolean(search || athlete || status || type !== "all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <i className="ti ti-search pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search athlete, body part, diagnosis, cause..."
            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          />
        </div>

        <select
          value={athlete}
          onChange={(e) => setAthlete(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        >
          <option value="">All athletes</option>
          {athleteOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof TYPE_OPTIONS)[number]["value"])}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setAthlete("");
              setStatus("");
              setType("all");
            }}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
          >
            Clear filters
          </button>
        )}
      </div>

      {type !== "illness" && (
        <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
            <i className="ti ti-bandage text-slate-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-800">
              Injuries ({filteredInjuries.length}
              {filteredInjuries.length !== injuries.length ? ` of ${injuries.length}` : ""})
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left">
                <Th>Athlete</Th>
                <Th>Date</Th>
                <Th>Body Part</Th>
                <Th>Type</Th>
                <Th>Days Lost</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filteredInjuries.map((i) => (
                <tr key={i.id} className="border-t border-slate-200/70">
                  <td className="px-4 py-2.5 text-slate-800">{i.athleteName}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i.date}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.bodyPart}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.injuryType}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.daysLost}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{statusLabel(i.status)}</td>
                </tr>
              ))}
              {filteredInjuries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                    {injuries.length === 0 ? "No injuries recorded yet." : "No injuries match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {type !== "injury" && (
        <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
            <i className="ti ti-virus text-slate-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-800">
              Illnesses ({filteredIllnesses.length}
              {filteredIllnesses.length !== illnesses.length ? ` of ${illnesses.length}` : ""})
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left">
                <Th>Athlete</Th>
                <Th>Date</Th>
                <Th>Diagnosis</Th>
                <Th>System</Th>
                <Th>Days Lost</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filteredIllnesses.map((i) => (
                <tr key={i.id} className="border-t border-slate-200/70">
                  <td className="px-4 py-2.5 text-slate-800">{i.athleteName}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i.date}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.diagnosis}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.affectedSystem || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.daysLost}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{statusLabel(i.status)}</td>
                </tr>
              ))}
              {filteredIllnesses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                    {illnesses.length === 0 ? "No illnesses recorded yet." : "No illnesses match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}
