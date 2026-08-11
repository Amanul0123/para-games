import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { illnessSchema } from "@/lib/validations";

async function requireTeam() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session || user?.role !== "team" || !user.id) return null;
  return user.id;
}

function parseDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function serialize(i: {
  id: string;
  athleteId: string;
  athlete: { name: string };
  sportEvent: string;
  occurredOn: Date;
  diagnosis: string;
  affectedSystem: string | null;
  mainSymptoms: string | null;
  causeOfIllness: string | null;
  originalDaysLost: number | null;
  editedDaysLost: number | null;
  timeLossStatus: string;
  status: string;
  createdAt: Date;
}) {
  return {
    id: i.id,
    athleteId: i.athleteId,
    athleteName: i.athlete.name,
    sportEvent: i.sportEvent,
    occurredOn: i.occurredOn.toISOString().slice(0, 10),
    diagnosis: i.diagnosis,
    affectedSystem: i.affectedSystem,
    mainSymptoms: i.mainSymptoms,
    causeOfIllness: i.causeOfIllness,
    originalDaysLost: i.originalDaysLost,
    editedDaysLost: i.editedDaysLost,
    timeLossStatus: i.timeLossStatus,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  };
}

export async function GET(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const illnesses = await prisma.illness.findMany({
    where: { teamUserId, ...(date ? { occurredOn: parseDate(date) } : {}) },
    include: { athlete: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(illnesses.map(serialize));
}

export async function POST(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = illnessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const date = parseDate(parsed.data.occurredOn);
  const teamDay = await prisma.teamDay.findUnique({
    where: { teamUserId_date: { teamUserId, date } },
  });
  if (!teamDay) {
    return NextResponse.json(
      { error: "Set the Daily Team Size for this date before recording an illness" },
      { status: 400 },
    );
  }

  const athlete = await prisma.athlete.findFirst({
    where: { id: parsed.data.athleteId, teamUserId },
  });
  if (!athlete) {
    return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
  }

  const illness = await prisma.illness.create({
    data: {
      teamUserId,
      athleteId: parsed.data.athleteId,
      sportEvent: parsed.data.sportEvent,
      occurredOn: date,
      diagnosis: parsed.data.diagnosis,
      affectedSystem: parsed.data.affectedSystem,
      mainSymptoms: parsed.data.mainSymptoms,
      causeOfIllness: parsed.data.causeOfIllness,
      originalDaysLost: parsed.data.originalDaysLost,
    },
    include: { athlete: true },
  });

  return NextResponse.json(serialize(illness), { status: 201 });
}
