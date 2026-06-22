import ReportsTable from "@/components/admin/ReportsTable";
import StatsGrid from "@/components/admin/StatsGrid";
import TrendChart from "@/components/admin/TrendChart";
import BodyZonesCard from "@/components/admin/BodyZonesCard";
import TopNpcsCard from "@/components/admin/TopNpcsCard";
import ExportButtons from "@/components/admin/ExportButtons";
import {
  getReportsWithDetails,
  computeStats,
  computeTrend,
  computeBodyZones,
  computeTopNpcs,
} from "@/lib/dashboardData";
import { ReportSummary } from "@/types";

export default async function AdminDashboardPage() {
  const reports = await getReportsWithDetails();

  const data: ReportSummary[] = reports.map((report) => ({
    id: report.id,
    npc: report.npc,
    reportedBy: report.reportedBy,
    dateOfReport: report.dateOfReport.toISOString(),
    email: report.email,
    phone: report.phone,
    status: report.status,
    createdAt: report.createdAt.toISOString(),
    injuryCount: report.injuries.length,
    illnessCount: report.illnesses.length,
  }));

  const stats = computeStats(reports);
  const trend = computeTrend(reports);
  const bodyZones = computeBodyZones(reports);
  const topNpcs = computeTopNpcs(reports);
  const npcOptions = [...new Set(reports.map((r) => r.npc))].sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-800">Medical Reports Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Aichi Nagoya 2026 Asian Para Games &mdash; Injury &amp; Illness Surveillance
          </p>
        </div>
        <ExportButtons reports={data} />
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <ReportsTable reports={data} npcOptions={npcOptions} />

        <div className="flex flex-col gap-4">
          <TrendChart data={trend} />
          <BodyZonesCard zones={bodyZones} />
          <TopNpcsCard npcs={topNpcs} />
        </div>
      </div>
    </div>
  );
}
