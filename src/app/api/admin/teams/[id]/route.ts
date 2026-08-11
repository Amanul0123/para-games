import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const team = await prisma.teamUser.findUnique({
    where: { id },
    include: {
      athletes: { orderBy: { name: "asc" } },
      injuries: { include: { athlete: true }, orderBy: { createdAt: "desc" } },
      illnesses: { include: { athlete: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  return NextResponse.json({
    id: team.id,
    npc: team.npc,
    name: team.name,
    email: team.email,
    phone: team.phone,
    createdAt: team.createdAt.toISOString(),
    athletes: team.athletes.map((a) => ({
      id: a.id,
      name: a.name,
      accreditationNo: a.accreditationNo,
      sport: a.sport,
      archived: a.archived,
    })),
    injuries: team.injuries.map((i) => ({
      id: i.id,
      athleteId: i.athleteId,
      athleteName: i.athlete.name,
      sportEvent: i.sportEvent,
      injuryDate: i.injuryDate.toISOString().slice(0, 10),
      bodyPart: i.bodyPart,
      injuryType: i.injuryType,
      causeOfInjury: i.causeOfInjury,
      originalDaysLost: i.originalDaysLost,
      editedDaysLost: i.editedDaysLost,
      timeLossStatus: i.timeLossStatus,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
      notes: notesFor(i.id),
    })),
    illnesses: team.illnesses.map((ill) => ({
      id: ill.id,
      athleteId: ill.athleteId,
      athleteName: ill.athlete.name,
      sportEvent: ill.sportEvent,
      occurredOn: ill.occurredOn.toISOString().slice(0, 10),
      diagnosis: ill.diagnosis,
      affectedSystem: ill.affectedSystem,
      mainSymptoms: ill.mainSymptoms,
      causeOfIllness: ill.causeOfIllness,
      originalDaysLost: ill.originalDaysLost,
      editedDaysLost: ill.editedDaysLost,
      timeLossStatus: ill.timeLossStatus,
      status: ill.status,
      createdAt: ill.createdAt.toISOString(),
      notes: notesFor(ill.id),
    })),
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const teamDays = await prisma.teamDay.findMany({ where: { teamUserId: id }, select: { id: true } });
  const teamDayIds = teamDays.map((d) => d.id);

  await prisma.$transaction([
    prisma.teamDayAthlete.deleteMany({ where: { teamDayId: { in: teamDayIds } } }),
    prisma.teamDay.deleteMany({ where: { teamUserId: id } }),
    prisma.injury.deleteMany({ where: { teamUserId: id } }),
    prisma.illness.deleteMany({ where: { teamUserId: id } }),
    prisma.athlete.deleteMany({ where: { teamUserId: id } }),
    prisma.teamUser.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
