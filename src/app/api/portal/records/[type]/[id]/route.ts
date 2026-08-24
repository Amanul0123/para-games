import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { injuryEditSchema, illnessEditSchema } from "@/lib/validations";

async function requireTeam() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session || user?.role !== "team" || !user.id) return null;
  return user.id;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, id } = await params;
  if (type !== "injury" && type !== "illness") {
    return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
  }

  const body = await request.json();

  if (type === "injury") {
    const existing = await prisma.injury.findFirst({ where: { id, teamUserId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const parsed = injuryEditSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const athlete = await prisma.athlete.findFirst({
      where: { id: parsed.data.athleteId, teamUserId },
    });
    if (!athlete) return NextResponse.json({ error: "Athlete not found" }, { status: 404 });

    const updated = await prisma.injury.update({
      where: { id },
      data: {
        athleteId: parsed.data.athleteId,
        sportEvent: parsed.data.sportEvent,
        bodyPart: parsed.data.bodyPart,
        injuryType: parsed.data.injuryType,
        causeOfInjury: parsed.data.causeOfInjury,
        originalDaysLost: parsed.data.originalDaysLost,
      },
      include: { athlete: true },
    });

    return NextResponse.json({
      id: updated.id,
      athleteId: updated.athleteId,
      athleteName: updated.athlete.name,
      sportEvent: updated.sportEvent,
      injuryDate: updated.injuryDate.toISOString().slice(0, 10),
      bodyPart: updated.bodyPart,
      injuryType: updated.injuryType,
      causeOfInjury: updated.causeOfInjury,
      originalDaysLost: updated.originalDaysLost,
      editedDaysLost: updated.editedDaysLost,
      timeLossStatus: updated.timeLossStatus,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
    });
  }

  const existing = await prisma.illness.findFirst({ where: { id, teamUserId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = illnessEditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const athlete = await prisma.athlete.findFirst({
    where: { id: parsed.data.athleteId, teamUserId },
  });
  if (!athlete) return NextResponse.json({ error: "Athlete not found" }, { status: 404 });

  const updated = await prisma.illness.update({
    where: { id },
    data: {
      athleteId: parsed.data.athleteId,
      sportEvent: parsed.data.sportEvent,
      diagnosis: parsed.data.diagnosis,
      affectedSystem: parsed.data.affectedSystem,
      mainSymptoms: parsed.data.mainSymptoms,
      causeOfIllness: parsed.data.causeOfIllness,
      originalDaysLost: parsed.data.originalDaysLost,
    },
    include: { athlete: true },
  });

  return NextResponse.json({
    id: updated.id,
    athleteId: updated.athleteId,
    athleteName: updated.athlete.name,
    sportEvent: updated.sportEvent,
    occurredOn: updated.occurredOn.toISOString().slice(0, 10),
    diagnosis: updated.diagnosis,
    affectedSystem: updated.affectedSystem,
    mainSymptoms: updated.mainSymptoms,
    causeOfIllness: updated.causeOfIllness,
    originalDaysLost: updated.originalDaysLost,
    editedDaysLost: updated.editedDaysLost,
    timeLossStatus: updated.timeLossStatus,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
  });
}
