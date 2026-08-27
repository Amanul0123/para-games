import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TeamDetail from "@/components/admin/TeamDetail";
import { AthleteEntry, InjuryRecord, IllnessRecord } from "@/types";

export default async function AdminTeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = await prisma.teamUser.findUnique({
    where: { id },
    include: {
      athletes: { orderBy: { name: "asc" } },
      injuries: { include: { athlete: true }, orderBy: { createdAt: "desc" } },
      illnesses: { include: { athlete: true }, orderBy: { createdAt: "desc" } },
      teamDays: { include: { athletes: true }, orderBy: { date: "desc" } },
    },
  });

  if (!team) {
    notFound();
  }

  const recordIds = [...team.injuries.map((i) => i.id), ...team.illnesses.map((i) => i.id)];
  const notes = recordIds.length
    ? await prisma.recordNote.findMany({
        where: { recordId: { in: recordIds } },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const notesByRecord = new Map<string, typeof notes>();
  for (const note of notes) {
    const list = notesByRecord.get(note.recordId) ?? [];
    list.push(note);
    notesByRecord.set(note.recordId, list);
  }
  const notesFor = (recordId: string) =>
    (notesByRecord.get(recordId) ?? []).map((n) => ({
      id: n.id,
      author: n.author,
      message: n.message,
      createdAt: n.createdAt.toISOString(),
    }));

  const athletes: AthleteEntry[] = team.athletes.map((a) => ({
    id: a.id,
    name: a.name,
    accreditationNo: a.accreditationNo,
    sport: a.sport,
    archived: a.archived,
  }));

  const injuries: InjuryRecord[] = team.injuries.map((i) => ({
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
    notes: notesFor(i.id),
  }));

  const dailyReports = team.teamDays.map((day) => {
    const dateStr = day.date.toISOString().slice(0, 10);
    return {
      date: dateStr,
      athleteCount: day.athletes.length,
      noIncidentReported: day.noIncidentReported,
      injuryCount: team.injuries.filter((i) => i.injuryDate.toISOString().slice(0, 10) === dateStr).length,
      illnessCount: team.illnesses.filter((i) => i.occurredOn.toISOString().slice(0, 10) === dateStr).length,
    };
  });

  const illnesses: IllnessRecord[] = team.illnesses.map((ill) => ({
    id: ill.id,
    athleteId: ill.athleteId,
    athleteName: ill.athlete.name,
    sportEvent: ill.sportEvent,
    occurredOn: ill.occurredOn.toISOString().slice(0, 10),
    diagnosis: ill.diagnosis,
    affectedSystem: ill.affectedSystem ?? undefined,
    mainSymptoms: ill.mainSymptoms ?? undefined,
    causeOfIllness: ill.causeOfIllness ?? undefined,
    originalDaysLost: ill.originalDaysLost ?? undefined,
    editedDaysLost: ill.editedDaysLost,
    timeLossStatus: ill.timeLossStatus as "original" | "edited",
    status: ill.status as IllnessRecord["status"],
    createdAt: ill.createdAt.toISOString(),
    notes: notesFor(ill.id),
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/teams" className="text-sm text-brand-cyan hover:underline">
          &larr; Back to Teams
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          {team.npc} &mdash; {team.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{team.email}</p>
      </div>

      <TeamDetail
        teamId={team.id}
        athletes={athletes}
        injuries={injuries}
        illnesses={illnesses}
        dailyReports={dailyReports}
      />
    </div>
  );
}
