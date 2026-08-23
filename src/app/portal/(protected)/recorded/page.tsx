import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RecordedDataView from "@/components/portal/RecordedDataView";

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

  const injuryRows = injuries.map((i) => ({
    id: i.id,
    athleteName: i.athlete.name,
    date: i.injuryDate.toISOString().slice(0, 10),
    bodyPart: i.bodyPart,
    injuryType: i.injuryType,
    causeOfInjury: i.causeOfInjury,
    daysLost: i.editedDaysLost ?? i.originalDaysLost ?? "—",
    status: i.status,
  }));

  const illnessRows = illnesses.map((i) => ({
    id: i.id,
    athleteName: i.athlete.name,
    date: i.occurredOn.toISOString().slice(0, 10),
    diagnosis: i.diagnosis,
    affectedSystem: i.affectedSystem,
    causeOfIllness: i.causeOfIllness,
    daysLost: i.editedDaysLost ?? i.originalDaysLost ?? "—",
    status: i.status,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Recorded Data</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Everything your team has recorded so far</p>
      </div>

      <RecordedDataView injuries={injuryRows} illnesses={illnessRows} />
    </div>
  );
}
