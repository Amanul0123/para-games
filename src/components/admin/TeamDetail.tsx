"use client";

import { useState } from "react";
import { AthleteEntry, InjuryRecord, IllnessRecord } from "@/types";
import RecordStatusPanel from "@/components/admin/RecordStatusPanel";
import RecordNotes from "@/components/admin/RecordNotes";
import AddAthleteForm from "@/components/admin/AddAthleteForm";

interface TeamDetailProps {
  teamId: string;
  athletes: AthleteEntry[];
  injuries: InjuryRecord[];
  illnesses: IllnessRecord[];
}

export default function TeamDetail({ teamId, athletes: initialAthletes, injuries, illnesses }: TeamDetailProps) {
  const [athletes, setAthletes] = useState(initialAthletes);

  return (
    <div className="space-y-6">
      <Section title="Athlete Roster" icon="ti-users">
        <AddAthleteForm
          teamId={teamId}
          onAdded={(athlete) =>
            setAthletes((prev) => [...prev, athlete].sort((a, b) => a.name.localeCompare(b.name)))
          }
        />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-left">
              <Th>Name</Th>
              <Th>Accreditation No.</Th>
              <Th>Sport</Th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr key={a.id} className="border-t border-slate-200/70">
                <td className="px-4 py-2.5 text-slate-800">{a.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.accreditationNo}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.sport || "—"}</td>
              </tr>
            ))}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                  No athletes on the roster yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Injuries" icon="ti-bandage">
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
            {injuries.map((inj) => (
              <tr key={inj.id} className="border-t border-slate-200/70 align-top">
                <td className="px-4 py-2.5 text-slate-800">{inj.athleteName}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500">{inj.injuryDate}</td>
                <td className="px-4 py-2.5 text-slate-600">{inj.bodyPart}</td>
                <td className="px-4 py-2.5 text-slate-600">{inj.injuryType}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {inj.editedDaysLost ?? inj.originalDaysLost ?? "—"}
                  {inj.timeLossStatus === "edited" && (
                    <span className="ml-1 text-[10px] text-amber-600">(edited)</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <RecordStatusPanel type="injury" id={inj.id} initialStatus={inj.status} />
                  <RecordNotes type="injury" id={inj.id} initialNotes={inj.notes ?? []} />
                </td>
              </tr>
            ))}
            {injuries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                  No injuries recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Illnesses" icon="ti-virus">
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
            {illnesses.map((ill) => (
              <tr key={ill.id} className="border-t border-slate-200/70 align-top">
                <td className="px-4 py-2.5 text-slate-800">{ill.athleteName}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500">{ill.occurredOn}</td>
                <td className="px-4 py-2.5 text-slate-600">{ill.diagnosis}</td>
                <td className="px-4 py-2.5 text-slate-600">{ill.affectedSystem || "—"}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {ill.editedDaysLost ?? ill.originalDaysLost ?? "—"}
                  {ill.timeLossStatus === "edited" && (
                    <span className="ml-1 text-[10px] text-amber-600">(edited)</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <RecordStatusPanel type="illness" id={ill.id} initialStatus={ill.status} />
                  <RecordNotes type="illness" id={ill.id} initialNotes={ill.notes ?? []} />
                </td>
              </tr>
            ))}
            {illnesses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                  No illnesses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className={`ti ${icon} text-slate-500`} aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">{title}</span>
      </div>
      <div className="overflow-x-auto">{children}</div>
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
