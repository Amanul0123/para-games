"use client";

import { useEffect, useState } from "react";
import { AthleteEntry, InjuryRecord, IllnessRecord } from "@/types";
import DailyTeamSizeForm from "@/components/portal/DailyTeamSizeForm";
import InjuryEntryForm from "@/components/portal/InjuryEntryForm";
import IllnessEntryForm from "@/components/portal/IllnessEntryForm";

function today() {
  return new Date().toISOString().slice(0, 10);
}

type ActiveForm = null | "injury" | "illness";

export default function RecordFlow({ athletes }: { athletes: AthleteEntry[] }) {
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [teamSizeSet, setTeamSizeSet] = useState(false);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [dayInjuries, setDayInjuries] = useState<InjuryRecord[]>([]);
  const [dayIllnesses, setDayIllnesses] = useState<IllnessRecord[]>([]);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`/api/portal/team-day?date=${date}`).then((r) => r.json()),
      fetch(`/api/portal/injuries?date=${date}`).then((r) => r.json()),
      fetch(`/api/portal/illnesses?date=${date}`).then((r) => r.json()),
    ]).then(([teamDay, injuries, illnesses]) => {
      if (cancelled) return;
      setTeamSizeSet(!!teamDay.exists);
      setSelectedAthleteIds(teamDay.athleteIds ?? []);
      setDayInjuries(Array.isArray(injuries) ? injuries : []);
      setDayIllnesses(Array.isArray(illnesses) ? illnesses : []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [date]);

  const dayAthletes = athletes.filter((a) => selectedAthleteIds.includes(a.id));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <label htmlFor="record-date" className="mb-1 block text-xs font-medium text-slate-600">
          Date
        </label>
        <input
          id="record-date"
          type="date"
          value={date}
          max={today()}
          onChange={(e) => {
            setLoading(true);
            setActiveForm(null);
            setDate(e.target.value);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : !teamSizeSet ? (
        <DailyTeamSizeForm
          date={date}
          athletes={athletes}
          initialSelected={selectedAthleteIds}
          onSaved={(ids) => {
            setTeamSizeSet(true);
            setSelectedAthleteIds(ids);
          }}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Daily team size recorded for {date} ({selectedAthleteIds.length} athletes).
            <button
              type="button"
              onClick={() => setTeamSizeSet(false)}
              className="ml-auto text-xs underline"
            >
              Edit
            </button>
          </div>

          {activeForm === null && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                No Injury / Illness Today
              </button>
              <button
                type="button"
                onClick={() => setActiveForm("injury")}
                className="rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
              >
                Record Injury
              </button>
              <button
                type="button"
                onClick={() => setActiveForm("illness")}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
              >
                Record Illness
              </button>
            </div>
          )}

          {activeForm === "injury" && (
            <InjuryEntryForm
              date={date}
              athletes={dayAthletes}
              onCancel={() => setActiveForm(null)}
              onSaved={(record) => {
                setDayInjuries((prev) => [record, ...prev]);
                setActiveForm(null);
              }}
            />
          )}

          {activeForm === "illness" && (
            <IllnessEntryForm
              date={date}
              athletes={dayAthletes}
              onCancel={() => setActiveForm(null)}
              onSaved={(record) => {
                setDayIllnesses((prev) => [record, ...prev]);
                setActiveForm(null);
              }}
            />
          )}

          {(dayInjuries.length > 0 || dayIllnesses.length > 0) && (
            <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <h3 className="mb-2 text-sm font-medium text-slate-800">Recorded on {date}</h3>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {dayInjuries.map((i) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                      <i className="ti ti-bandage text-[11px]" aria-hidden="true" />
                      Injury
                    </span>
                    {i.athleteName} &mdash; {i.bodyPart} ({i.injuryType})
                  </li>
                ))}
                {dayIllnesses.map((i) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                      <i className="ti ti-virus text-[11px]" aria-hidden="true" />
                      Illness
                    </span>
                    {i.athleteName} &mdash; {i.diagnosis}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
