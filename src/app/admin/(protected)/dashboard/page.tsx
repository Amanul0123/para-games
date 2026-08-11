import TeamsTable from "@/components/admin/TeamsTable";
import StatsGrid from "@/components/admin/StatsGrid";
import TrendChart from "@/components/admin/TrendChart";
import BodyZonesCard from "@/components/admin/BodyZonesCard";
import TopNpcsCard from "@/components/admin/TopNpcsCard";
import ExportButtons from "@/components/admin/ExportButtons";
import {
  getTeamsWithDetails,
  computeStats,
  computeTrend,
  computeBodyZones,
  computeTopNpcs,
} from "@/lib/dashboardData";
import { TeamSummary } from "@/types";
import { getEventSettings } from "@/lib/eventSettings";

export default async function AdminDashboardPage() {
  const [teams, { eventName }] = await Promise.all([getTeamsWithDetails(), getEventSettings()]);

  const data: TeamSummary[] = teams.map((team) => ({
    id: team.id,
    npc: team.npc,
    name: team.name,
    email: team.email,
    phone: team.phone,
    athleteCount: team.athletes.length,
    injuryCount: team.injuries.length,
    illnessCount: team.illnesses.length,
    createdAt: team.createdAt.toISOString(),
  }));

  const stats = computeStats(teams);
  const trend = computeTrend(teams);
  const bodyZones = computeBodyZones(teams);
  const topNpcs = computeTopNpcs(teams);
  const npcOptions = [...new Set(teams.map((t) => t.npc))].sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-800">Medical Reports Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {eventName} &mdash; Injury &amp; Illness Surveillance
          </p>
        </div>
        <ExportButtons teams={data} />
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <TeamsTable teams={data} npcOptions={npcOptions} />

        <div className="flex flex-col gap-4">
          <TrendChart data={trend} />
          <BodyZonesCard zones={bodyZones} />
          <TopNpcsCard npcs={topNpcs} />
        </div>
      </div>
    </div>
  );
}
