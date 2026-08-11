import { prisma } from "@/lib/prisma";

export default async function AdminAthletesPage() {
  const athletes = await prisma.athlete.findMany({
    orderBy: { name: "asc" },
    include: {
      teamUser: { select: { npc: true } },
      _count: { select: { injuries: true, illnesses: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Athletes</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Full roster across all teams
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-left text-slate-500">
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">Name</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Accreditation No.
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">NPC</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">Sport</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Injuries
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide">
                Illnesses
              </th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr
                key={a.id}
                className="border-t border-slate-200/70 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-2.5 text-slate-800">{a.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.accreditationNo}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.teamUser.npc}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.sport || "—"}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                    {a._count.injuries}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                    {a._count.illnesses}
                  </span>
                </td>
              </tr>
            ))}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No athletes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
