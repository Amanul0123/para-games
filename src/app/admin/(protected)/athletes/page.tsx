import { prisma } from "@/lib/prisma";

interface AthleteRow {
  accreditationNo: string;
  npcs: Set<string>;
  sportEvents: Set<string>;
  injuryCount: number;
  illnessCount: number;
}

export default async function AdminAthletesPage() {
  const [injuries, illnesses] = await Promise.all([
    prisma.injury.findMany({
      select: {
        accreditationNo: true,
        sportEvent: true,
        report: { select: { npc: true } },
      },
    }),
    prisma.illness.findMany({
      select: {
        accreditationNo: true,
        sportEvent: true,
        report: { select: { npc: true } },
      },
    }),
  ]);

  const athletes = new Map<string, AthleteRow>();

  const upsert = (accreditationNo: string, npc: string, sportEvent: string) => {
    const existing = athletes.get(accreditationNo) ?? {
      accreditationNo,
      npcs: new Set<string>(),
      sportEvents: new Set<string>(),
      injuryCount: 0,
      illnessCount: 0,
    };
    existing.npcs.add(npc);
    existing.sportEvents.add(sportEvent);
    athletes.set(accreditationNo, existing);
  };

  for (const injury of injuries) {
    upsert(injury.accreditationNo, injury.report.npc, injury.sportEvent);
    athletes.get(injury.accreditationNo)!.injuryCount += 1;
  }
  for (const illness of illnesses) {
    upsert(illness.accreditationNo, illness.report.npc, illness.sportEvent);
    athletes.get(illness.accreditationNo)!.illnessCount += 1;
  }

  const rows = [...athletes.values()].sort(
    (a, b) => b.injuryCount + b.illnessCount - (a.injuryCount + a.illnessCount),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Athletes</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Aggregated by accreditation number across all injury and illness records
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-left text-slate-500">
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Accreditation No.
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">NPC</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Sport / Event
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Injuries
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Illnesses
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.accreditationNo}
                className="border-t border-slate-200/70 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-2.5 text-slate-800">{row.accreditationNo}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {[...row.npcs].join(", ")}
                </td>
                <td className="px-4 py-2.5 text-slate-600">
                  {[...row.sportEvents].join(", ")}
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                    {row.injuryCount}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                    {row.illnessCount}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No athlete records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
