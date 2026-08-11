import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PortalRecordedPage() {
  const session = await getServerSession(authOptions);
  const teamUserId = (session?.user as { id?: string } | undefined)?.id;

  const [injuries, illnesses] = teamUserId
    ? await Promise.all([
        prisma.injury.findMany({
          where: { teamUserId },
          include: { athlete: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.illness.findMany({
          where: { teamUserId },
          include: { athlete: true },
          orderBy: { createdAt: "desc" },
        }),
      ])
    : [[], []];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Recorded Data</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Everything your team has recorded so far</p>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
            <i className="ti ti-bandage text-slate-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-800">Injuries ({injuries.length})</span>
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
              {injuries.map((i) => (
                <tr key={i.id} className="border-t border-slate-200/70">
                  <td className="px-4 py-2.5 text-slate-800">{i.athlete.name}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {i.injuryDate.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{i.bodyPart}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.injuryType}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {i.editedDaysLost ?? i.originalDaysLost ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i.status}</td>
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
        </div>

        <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
            <i className="ti ti-virus text-slate-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-800">Illnesses ({illnesses.length})</span>
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
              {illnesses.map((i) => (
                <tr key={i.id} className="border-t border-slate-200/70">
                  <td className="px-4 py-2.5 text-slate-800">{i.athlete.name}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {i.occurredOn.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{i.diagnosis}</td>
                  <td className="px-4 py-2.5 text-slate-600">{i.affectedSystem || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {i.editedDaysLost ?? i.originalDaysLost ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{i.status}</td>
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
        </div>
      </div>
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
