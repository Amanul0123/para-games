import { AthleteEntry } from "@/types";

export default function AthletesPanel({ initialAthletes }: { initialAthletes: AthleteEntry[] }) {
  const athletes = initialAthletes;

  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
        <span className="text-sm font-medium text-slate-800">My Athletes</span>
        <span className="text-xs text-slate-500">{athletes.length} total</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/60 text-left">
            <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Name
            </th>
            <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Accreditation No.
            </th>
            <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Sport
            </th>
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
              <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                No athletes on your roster yet. Contact your event admin to have athletes added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
