import { prisma } from "@/lib/prisma";
import ReportsTable from "@/components/admin/ReportsTable";
import ExportButtons from "@/components/admin/ExportButtons";
import { ReportSummary } from "@/types";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { injuries: true, illnesses: true } },
    },
  });

  const data: ReportSummary[] = reports.map((report) => ({
    id: report.id,
    npc: report.npc,
    reportedBy: report.reportedBy,
    dateOfReport: report.dateOfReport.toISOString(),
    email: report.email,
    phone: report.phone,
    status: report.status,
    createdAt: report.createdAt.toISOString(),
    injuryCount: report._count.injuries,
    illnessCount: report._count.illnesses,
  }));

  const npcOptions = [...new Set(reports.map((r) => r.npc))].sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-800">All Reports</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Complete list of injury and illness submissions
          </p>
        </div>
        <ExportButtons reports={data} />
      </div>

      <ReportsTable reports={data} npcOptions={npcOptions} />
    </div>
  );
}
