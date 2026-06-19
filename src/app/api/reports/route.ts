import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportSubmitSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reportSubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { step1, injuries, illnesses } = parsed.data;

  const report = await prisma.report.create({
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

  return NextResponse.json({ success: true, id: report.id });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { injuries: true, illnesses: true } },
    },
  });

  const data = reports.map((report) => ({
    id: report.id,
    npc: report.npc,
    reportedBy: report.reportedBy,
    dateOfReport: report.dateOfReport,
    email: report.email,
    phone: report.phone,
    status: report.status,
    createdAt: report.createdAt,
    injuryCount: report._count.injuries,
    illnessCount: report._count.illnesses,
  }));

  return NextResponse.json(data);
}
