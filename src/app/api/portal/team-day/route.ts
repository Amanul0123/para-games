import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamDaySchema, noIncidentSchema } from "@/lib/validations";

async function requireTeam() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session || user?.role !== "team" || !user.id) return null;
  return user.id;
}

function parseDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  return d;
}

export async function GET(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const teamDay = await prisma.teamDay.findUnique({
    where: { teamUserId_date: { teamUserId, date: parseDate(date) } },
    include: { athletes: { select: { athleteId: true } } },
  });

  return NextResponse.json({
    exists: !!teamDay,
    athleteIds: teamDay?.athletes.map((a) => a.athleteId) ?? [],
    noIncidentReported: teamDay?.noIncidentReported ?? false,
  });
}

export async function POST(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = teamDaySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const date = parseDate(parsed.data.date);

  const teamDay = await prisma.teamDay.upsert({
    where: { teamUserId_date: { teamUserId, date } },
    update: {},
    create: { teamUserId, date },
  });

  await prisma.teamDayAthlete.deleteMany({ where: { teamDayId: teamDay.id } });
  if (parsed.data.athleteIds.length > 0) {
    await prisma.teamDayAthlete.createMany({
      data: parsed.data.athleteIds.map((athleteId) => ({ teamDayId: teamDay.id, athleteId })),
    });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = noIncidentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const date = parseDate(parsed.data.date);

  const teamDay = await prisma.teamDay.findUnique({ where: { teamUserId_date: { teamUserId, date } } });
  if (!teamDay) {
    return NextResponse.json(
      { error: "Set the Daily Team Size for this date before recording this" },
      { status: 400 },
    );
  }

  await prisma.teamDay.update({
    where: { id: teamDay.id },
    data: { noIncidentReported: parsed.data.noIncidentReported },
  });

  return NextResponse.json({ ok: true, noIncidentReported: parsed.data.noIncidentReported });
}
