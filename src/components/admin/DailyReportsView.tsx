"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DailyRow {
  teamId: string;
  npc: string;
  doctorName: string;
  teamSizeRecorded: boolean;
  athleteCount: number;
  noIncidentReported: boolean;
  injuryCount: number;
  illnessCount: number;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyReportsView() {
  const [date, setDate] = useState(today());
  const [rows, setRows] = useState<DailyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/reports/daily?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const reportedCount = rows.filter((r) => r.teamSizeRecorded).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <label htmlFor="report-date" className="text-xs font-medium text-slate-600">
          Date
        </label>
        <input
          id="report-date"
          type="date"
          value={date}
          max={today()}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        />
        {!loading && (
          <span className="text-xs text-slate-500">
            {reportedCount} of {rows.length} teams have reported for this date
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-left">
              <Th>NPC</Th>
              <Th>Team Doctor</Th>
              <Th>Athletes Present</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.teamId} className="border-t border-slate-200/70">
                  <td className="px-4 py-2.5 text-slate-800">{row.npc}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.doctorName}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {row.teamSizeRecorded ? row.athleteCount : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    {!row.teamSizeRecorded ? (
                      <span className="text-xs text-slate-400">Not recorded</span>
                    ) : row.noIncidentReported ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
                        <i className="ti ti-circle-check text-[11px]" aria-hidden="true" />
                        No injury or illness reported
                      </span>
                    ) : row.injuryCount > 0 || row.illnessCount > 0 ? (
                      <span className="text-slate-600">
                        {row.injuryCount > 0 &&
                          `${row.injuryCount} ${row.injuryCount > 1 ? "injuries" : "injury"}`}
                        {row.injuryCount > 0 && row.illnessCount > 0 && ", "}
                        {row.illnessCount > 0 &&
                          `${row.illnessCount} ${row.illnessCount > 1 ? "illnesses" : "illness"}`}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not yet declared</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/admin/teams/${row.teamId}`}
                      className="text-xs text-brand-cyan hover:underline"
                    >
                      View team
                    </Link>
                  </td>
                </tr>
              ))
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}
