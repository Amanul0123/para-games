import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PortalExportButtons from "@/components/portal/PortalExportButtons";
import { InjuryRecord, IllnessRecord } from "@/types";

export default async function PortalReportsPage() {
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

  const injuryData: InjuryRecord[] = injuries.map((i) => ({
    id: i.id,
    athleteId: i.athleteId,
    athleteName: i.athlete.name,
    sportEvent: i.sportEvent,
    injuryDate: i.injuryDate.toISOString().slice(0, 10),
    bodyPart: i.bodyPart,
    injuryType: i.injuryType,
    causeOfInjury: i.causeOfInjury ?? undefined,
    originalDaysLost: i.originalDaysLost ?? undefined,
    editedDaysLost: i.editedDaysLost,
    timeLossStatus: i.timeLossStatus as "original" | "edited",
    status: i.status as InjuryRecord["status"],
    createdAt: i.createdAt.toISOString(),
  }));

  const illnessData: IllnessRecord[] = illnesses.map((i) => ({
    id: i.id,
    athleteId: i.athleteId,
    athleteName: i.athlete.name,
    sportEvent: i.sportEvent,
    occurredOn: i.occurredOn.toISOString().slice(0, 10),
    diagnosis: i.diagnosis,
    affectedSystem: i.affectedSystem ?? undefined,
    mainSymptoms: i.mainSymptoms ?? undefined,
    causeOfIllness: i.causeOfIllness ?? undefined,
    originalDaysLost: i.originalDaysLost ?? undefined,
    editedDaysLost: i.editedDaysLost,
    timeLossStatus: i.timeLossStatus as "original" | "edited",
    status: i.status as IllnessRecord["status"],
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Reports</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Export your recorded injury and illness data as Excel. This excludes any mental health
          data.
        </p>
      </div>

      <div className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <PortalExportButtons injuries={injuryData} illnesses={illnessData} />
      </div>
    </div>
  );
}
