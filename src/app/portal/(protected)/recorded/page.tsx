import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RecordedDataView from "@/components/portal/RecordedDataView";
import { AthleteEntry, InjuryRecord, IllnessRecord } from "@/types";

export default async function PortalRecordedPage() {
  const session = await getServerSession(authOptions);
  const teamUserId = (session?.user as { id?: string } | undefined)?.id;

  const [athletes, injuries, illnesses] = teamUserId
    ? await Promise.all([
        prisma.athlete.findMany({
          where: { teamUserId, archived: false },
          orderBy: { name: "asc" },
        }),
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
    : [[], [], []];

  const athleteData: AthleteEntry[] = athletes.map((a) => ({
    id: a.id,
    name: a.name,
    accreditationNo: a.accreditationNo,
    sport: a.sport,
    archived: a.archived,
  }));

  const injuryRecords: InjuryRecord[] = injuries.map((i) => ({
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
    timeLossStatus: i.timeLossStatus as InjuryRecord["timeLossStatus"],
    status: i.status as InjuryRecord["status"],
    createdAt: i.createdAt.toISOString(),
  }));

  const illnessRecords: IllnessRecord[] = illnesses.map((i) => ({
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
    timeLossStatus: i.timeLossStatus as IllnessRecord["timeLossStatus"],
    status: i.status as IllnessRecord["status"],
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Recorded Data</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Everything your team has recorded so far</p>
      </div>

      <RecordedDataView athletes={athleteData} injuries={injuryRecords} illnesses={illnessRecords} />
    </div>
  );
}
