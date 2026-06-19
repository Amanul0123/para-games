import { prisma } from "@/lib/prisma";
import ReportsTable from "@/components/admin/ReportsTable";
import { ReportSummary } from "@/types";

export default async function AdminDashboardPage() {
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold text-text-dark">All Submissions</h1>
      <ReportsTable reports={data} />
    </div>
  );
}
