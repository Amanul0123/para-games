"use client";

import { useState } from "react";
import { InjuryRecord, IllnessRecord } from "@/types";

interface Row {
  id: string;
  type: "injury" | "illness";
  athleteName: string;
  label: string;
  date: string;
  originalDaysLost?: number | null;
  editedDaysLost?: number | null;
  timeLossStatus: string;
}

function toRows(injuries: InjuryRecord[], illnesses: IllnessRecord[]): Row[] {
  return [
    ...injuries.map((i) => ({
      id: i.id,
      type: "injury" as const,
      athleteName: i.athleteName,
      label: `${i.bodyPart} (${i.injuryType})`,
      date: i.injuryDate,
      originalDaysLost: i.originalDaysLost,
      editedDaysLost: i.editedDaysLost,
      timeLossStatus: i.timeLossStatus,
    })),
    ...illnesses.map((i) => ({
      id: i.id,
      type: "illness" as const,
      athleteName: i.athleteName,
      label: i.diagnosis,
      date: i.occurredOn,
      originalDaysLost: i.originalDaysLost,
      editedDaysLost: i.editedDaysLost,
      timeLossStatus: i.timeLossStatus,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function TimeLossPanel({
  injuries,
  illnesses,
}: {
  injuries: InjuryRecord[];
  illnesses: IllnessRecord[];
}) {
  const [rows, setRows] = useState<Row[]>(toRows(injuries, illnesses));
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleUpdate = async (row: Row) => {
    const draft = drafts[row.id];
    if (draft === undefined || draft === "") return;

    setSavingId(row.id);
    try {
      const res = await fetch(`/api/portal/records/${row.type}/${row.id}/time-loss`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editedDaysLost: Number(draft) }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, editedDaysLost: Number(draft), timeLossStatus: "edited" } : r,
        ),
      );
    } catch {
      alert("Failed to update time loss. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/60 text-left">
            <Th>Date</Th>
            <Th>Athlete</Th>
            <Th>Record</Th>
            <Th>Original Days Lost</Th>
            <Th>Edited Days Lost</Th>
            <Th>Status</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.type}-${row.id}`} className="border-t border-slate-200/70">
              <td className="px-4 py-2.5 text-xs text-slate-500">{row.date}</td>
              <td className="px-4 py-2.5 text-slate-800">{row.athleteName}</td>
              <td className="px-4 py-2.5 text-slate-600">
                <span
                  className={`mr-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                    row.type === "injury" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {row.type}
                </span>
                {row.label}
              </td>
              <td className="px-4 py-2.5 text-slate-600">{row.originalDaysLost ?? "—"}</td>
              <td className="px-4 py-2.5">
                <input
                  type="number"
                  min={0}
                  defaultValue={row.editedDaysLost ?? row.originalDaysLost ?? undefined}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                  className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
                />
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-500">
                {row.timeLossStatus === "edited" ? "Edited" : "Original"}
              </td>
              <td className="px-4 py-2.5">
                <button
                  type="button"
                  disabled={savingId === row.id}
                  onClick={() => handleUpdate(row)}
                  className="rounded-md bg-[#185FA5] px-3 py-1 text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {savingId === row.id ? "Saving..." : "Update"}
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                No records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
