import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportUpdateSchema } from "@/lib/validations";

async function verifyOwnership(id: string, email: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report || report.email.toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }
  return report;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const email = request.nextUrl.searchParams.get("email") ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const owned = await verifyOwnership(id, email);
  if (!owned) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = await prisma.report.findUnique({
    where: { id },
    include: { injuries: true, illnesses: true },
  });

  return NextResponse.json(report);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = reportUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, step1, injuries, illnesses } = parsed.data;

  const owned = await verifyOwnership(id, email);
  if (!owned) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  await prisma.injury.deleteMany({ where: { reportId: id } });
  await prisma.illness.deleteMany({ where: { reportId: id } });

  await prisma.report.update({
    where: { id },
    data: {
      npc: step1.npc,
      reportedBy: step1.reportedBy,
      dateOfReport: new Date(step1.dateOfReport),
      email: step1.email,
      phone: step1.phone,
      injuries: {
        create: injuries.map((injury) => ({
          accreditationNo: injury.accreditationNo,
          sportEvent: injury.sportEvent,
          roundHeat: injury.roundHeat,
          injuryDate: injury.injuryDate,
          injuryTime: injury.injuryTime,
          bodyPart: injury.bodyPart,
          bodyPartCode: injury.bodyPartCode,
          injuryType: injury.injuryType,
          injuryTypeCode: injury.injuryTypeCode,
          causeOfInjury: injury.causeOfInjury,
          causeCode: injury.causeCode,
          absenceDays: injury.absenceDays,
        })),
      },
      illnesses: {
        create: illnesses.map((illness) => ({
          accreditationNo: illness.accreditationNo,
          sportEvent: illness.sportEvent,
          occurredOn: illness.occurredOn,
          diagnosis: illness.diagnosis,
          affectedSystem: illness.affectedSystem,
          systemCode: illness.systemCode,
          mainSymptoms: illness.mainSymptoms,
          symptomCodes: illness.symptomCodes,
          causeOfIllness: illness.causeOfIllness,
          causeCode: illness.causeCode,
          absenceDays: illness.absenceDays,
        })),
      },
    },
  });

  return NextResponse.json({ success: true });
}
