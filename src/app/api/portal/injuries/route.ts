import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { injurySchema } from "@/lib/validations";

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
  injuryDate: Date;
  bodyPart: string;
  injuryType: string;
  causeOfInjury: string | null;
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
    injuryDate: i.injuryDate.toISOString().slice(0, 10),
    bodyPart: i.bodyPart,
    injuryType: i.injuryType,
    causeOfInjury: i.causeOfInjury,
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

  const injuries = await prisma.injury.findMany({
    where: { teamUserId, ...(date ? { injuryDate: parseDate(date) } : {}) },
    include: { athlete: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(injuries.map(serialize));
}

export async function POST(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = injurySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const date = parseDate(parsed.data.injuryDate);
  const teamDay = await prisma.teamDay.findUnique({
    where: { teamUserId_date: { teamUserId, date } },
  });
  if (!teamDay) {
    return NextResponse.json(
      { error: "Set the Daily Team Size for this date before recording an injury" },
      { status: 400 },
    );
  }

  const athlete = await prisma.athlete.findFirst({
    where: { id: parsed.data.athleteId, teamUserId },
  });
  if (!athlete) {
    return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
  }

  const injury = await prisma.injury.create({
    data: {
      teamUserId,
      athleteId: parsed.data.athleteId,
      sportEvent: parsed.data.sportEvent,
      injuryDate: date,
      bodyPart: parsed.data.bodyPart,
      injuryType: parsed.data.injuryType,
      causeOfInjury: parsed.data.causeOfInjury,
      originalDaysLost: parsed.data.originalDaysLost,
    },
    include: { athlete: true },
  });

  return NextResponse.json(serialize(injury), { status: 201 });
}
