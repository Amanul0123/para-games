import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportDetail from "@/components/admin/ReportDetail";
import DeleteReportButton from "@/components/admin/DeleteReportButton";
import ReportStatusPanel from "@/components/admin/ReportStatusPanel";
import ReportNotes from "@/components/admin/ReportNotes";
import { ReportDetail as ReportDetailType } from "@/types";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: { injuries: true, illnesses: true, notes: { orderBy: { createdAt: "desc" } } },
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
    notes: report.notes.map((note) => ({
      id: note.id,
      author: note.author,
      message: note.message,
      createdAt: note.createdAt.toISOString(),
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="text-sm text-brand-cyan hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <ReportStatusPanel id={report.id} initialStatus={report.status} />
          <DeleteReportButton id={report.id} />
        </div>
      </div>
      <h1 className="mb-6 text-xl font-bold text-slate-800">Report Detail</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <ReportDetail report={data} />
        <ReportNotes id={report.id} initialNotes={data.notes} />
      </div>
    </div>
  );
}
