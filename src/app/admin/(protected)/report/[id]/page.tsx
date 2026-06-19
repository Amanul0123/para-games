import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportDetail from "@/components/admin/ReportDetail";
import { ReportDetail as ReportDetailType } from "@/types";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: { injuries: true, illnesses: true },
  });

  if (!report) {
    notFound();
  }

  const data: ReportDetailType = {
    id: report.id,
    npc: report.npc,
    reportedBy: report.reportedBy,
    dateOfReport: report.dateOfReport.toISOString(),
    email: report.email,
    phone: report.phone,
    status: report.status,
    createdAt: report.createdAt.toISOString(),
    injuries: report.injuries.map((injury) => ({
      accreditationNo: injury.accreditationNo,
      sportEvent: injury.sportEvent,
      roundHeat: injury.roundHeat ?? undefined,
      injuryDate: injury.injuryDate,
      injuryTime: injury.injuryTime ?? undefined,
      bodyPart: injury.bodyPart,
      bodyPartCode: injury.bodyPartCode ?? undefined,
      injuryType: injury.injuryType,
      injuryTypeCode: injury.injuryTypeCode ?? undefined,
      causeOfInjury: injury.causeOfInjury ?? undefined,
      causeCode: injury.causeCode ?? undefined,
      absenceDays: injury.absenceDays ?? undefined,
    })),
    illnesses: report.illnesses.map((illness) => ({
      accreditationNo: illness.accreditationNo,
      sportEvent: illness.sportEvent,
      occurredOn: illness.occurredOn,
      diagnosis: illness.diagnosis,
      affectedSystem: illness.affectedSystem ?? undefined,
      systemCode: illness.systemCode ?? undefined,
      mainSymptoms: illness.mainSymptoms ?? undefined,
      symptomCodes: illness.symptomCodes ?? undefined,
      causeOfIllness: illness.causeOfIllness ?? undefined,
      causeCode: illness.causeCode ?? undefined,
      absenceDays: illness.absenceDays ?? undefined,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-block text-sm text-link-teal hover:underline"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="mb-6 text-xl font-bold text-text-dark">Report Detail</h1>
      <ReportDetail report={data} />
    </div>
  );
}
