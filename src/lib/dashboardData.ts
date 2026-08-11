import { prisma } from "@/lib/prisma";
import { classifyBodyZone } from "@/lib/bodyZones";
import { DashboardStats, TrendPoint, BodyZoneStat, NpcStat } from "@/types";

export async function getTeamsWithDetails() {
  return prisma.teamUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { injuries: true, illnesses: true, athletes: true },
  });
}

export type TeamWithDetails = Awaited<ReturnType<typeof getTeamsWithDetails>>[number];

export function computeStats(teams: TeamWithDetails[]): DashboardStats {
  return {
    totalTeams: teams.length,
    totalInjuries: teams.reduce((sum, t) => sum + t.injuries.length, 0),
    totalIllnesses: teams.reduce((sum, t) => sum + t.illnesses.length, 0),
    npcsReporting: new Set(teams.map((t) => t.npc)).size,
  };
}

export function computeTrend(teams: TeamWithDetails[]): TrendPoint[] {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const counts = new Map(days.map((d) => [d.key, { injuries: 0, illnesses: 0 }]));
  for (const team of teams) {
    for (const injury of team.injuries) {
      const key = injury.createdAt.toISOString().slice(0, 10);
      const bucket = counts.get(key);
      if (bucket) bucket.injuries += 1;
    }
    for (const illness of team.illnesses) {
      const key = illness.createdAt.toISOString().slice(0, 10);
      const bucket = counts.get(key);
      if (bucket) bucket.illnesses += 1;
    }
  }

  return days.map((d) => ({
    label: d.label,
    injuries: counts.get(d.key)?.injuries ?? 0,
    illnesses: counts.get(d.key)?.illnesses ?? 0,
  }));
}

export function computeBodyZones(teams: TeamWithDetails[]): BodyZoneStat[] {
  const zoneOrder = ["Upper limb", "Lower limb", "Spine / trunk", "Head / neck", "Other"];
  const counts = new Map<string, number>(zoneOrder.map((z) => [z, 0]));

  for (const team of teams) {
    for (const injury of team.injuries) {
      const zone = classifyBodyZone(injury.bodyPart);
      counts.set(zone, (counts.get(zone) ?? 0) + 1);
    }
  }

  const max = Math.max(1, ...counts.values());
  return zoneOrder
    .map((zone) => ({
      zone,
      count: counts.get(zone) ?? 0,
      percent: Math.round(((counts.get(zone) ?? 0) / max) * 100),
    }))
    .filter((z) => z.count > 0);
}

export function computeTopNpcs(teams: TeamWithDetails[], limit = 5): NpcStat[] {
  const counts = new Map<string, number>();
  for (const team of teams) {
    const total = team.injuries.length + team.illnesses.length;
    counts.set(team.npc, (counts.get(team.npc) ?? 0) + total);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = sorted[0]?.[1] ?? 1;

  return sorted.map(([npc, count]) => ({
    npc,
    count,
    percent: Math.round((count / max) * 100),
  }));
}

interface BreakdownItem {
  label: string;
  count: number;
  percent: number;
}

export function computeInjuryTypeBreakdown(teams: TeamWithDetails[], limit = 6): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const team of teams) {
    for (const injury of team.injuries) {
      const label = injury.injuryType.trim() || "Unspecified";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = sorted[0]?.[1] ?? 1;
  return sorted.map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / max) * 100),
  }));
}

export function computeIllnessSystemBreakdown(
  teams: TeamWithDetails[],
  limit = 6,
): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const team of teams) {
    for (const illness of team.illnesses) {
      const label = illness.affectedSystem?.trim() || "Unspecified";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = sorted[0]?.[1] ?? 1;
  return sorted.map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / max) * 100),
  }));
}
