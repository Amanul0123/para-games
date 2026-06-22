import TrendChart from "@/components/admin/TrendChart";
import BodyZonesCard from "@/components/admin/BodyZonesCard";
import TopNpcsCard from "@/components/admin/TopNpcsCard";
import BreakdownCard from "@/components/admin/BreakdownCard";
import StatsGrid from "@/components/admin/StatsGrid";
import {
  getReportsWithDetails,
  computeStats,
  computeTrend,
  computeBodyZones,
  computeTopNpcs,
  computeInjuryTypeBreakdown,
  computeIllnessSystemBreakdown,
} from "@/lib/dashboardData";

export default async function AdminAnalyticsPage() {
  const reports = await getReportsWithDetails();

  const stats = computeStats(reports);
  const trend = computeTrend(reports);
  const bodyZones = computeBodyZones(reports);
  const topNpcs = computeTopNpcs(reports, 8);
  const injuryTypes = computeInjuryTypeBreakdown(reports);
  const illnessSystems = computeIllnessSystemBreakdown(reports);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Analytics</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Trends and breakdowns across all submitted reports
        </p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendChart data={trend} />
        <BodyZonesCard zones={bodyZones} />
        <BreakdownCard
          title="Injury types"
          icon="ti-bandage"
          items={injuryTypes}
          barColor="#E03A18"
          emptyMessage="No injuries reported yet."
        />
        <BreakdownCard
          title="Illness affected systems"
          icon="ti-virus"
          items={illnessSystems}
          barColor="#BA7517"
          emptyMessage="No illnesses reported yet."
        />
        <TopNpcsCard npcs={topNpcs} />
      </div>
    </div>
  );
}
