"use client";

import { useState } from "react";
import { AthleteEntry } from "@/types";

export default function DailyTeamSizeForm({
  date,
  athletes,
  initialSelected,
  onSaved,
}: {
  date: string;
  athletes: AthleteEntry[];
  initialSelected: string[];
  onSaved: (athleteIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkAll = () => setSelected(new Set(athletes.map((a) => a.id)));
  const uncheckAll = () => setSelected(new Set());

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const athleteIds = [...selected];
      const res = await fetch("/api/portal/team-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, athleteIds }),
      });
      if (!res.ok) throw new Error("Failed to save daily team size");
      onSaved(athleteIds);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <h3 className="mb-1 text-sm font-medium text-slate-800">Record Daily Team Size</h3>
      <p className="mb-4 text-xs text-slate-500">
        Tick all the athletes who are part of the team on {date}. This must be submitted before
        you can log an injury or illness for this date.
      </p>

      {athletes.length === 0 ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          You have no athletes on your roster yet. Add athletes under &ldquo;My Athletes&rdquo;
          first.
        </p>
      ) : (
        <>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-2">
            {athletes.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.has(a.id)}
                  onChange={() => toggle(a.id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan"
                />
                {a.name}
                <span className="text-xs text-slate-400">{a.accreditationNo}</span>
              </label>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={checkAll}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              Check All
            </button>
            <button
              type="button"
              onClick={uncheckAll}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              Uncheck All
            </button>
            <span className="ml-auto text-xs text-slate-500">{selected.size} selected</span>
          </div>
        </>
      )}

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={handleSubmit}
        className="mt-4 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Record"}
      </button>
    </div>
  );
}
