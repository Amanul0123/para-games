import { prisma } from "@/lib/prisma";
import { classifyBodyZone } from "@/lib/bodyZones";
import { DashboardStats, TrendPoint, BodyZoneStat, NpcStat } from "@/types";

export async function getReportsWithDetails() {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { injuries: true, illnesses: true },
  });
}

export type ReportWithDetails = Awaited<ReturnType<typeof getReportsWithDetails>>[number];

export function computeStats(reports: ReportWithDetails[]): DashboardStats {
  return {
    totalSubmissions: reports.length,
    totalInjuries: reports.reduce((sum, r) => sum + r.injuries.length, 0),
    totalIllnesses: reports.reduce((sum, r) => sum + r.illnesses.length, 0),
    npcsReporting: new Set(reports.map((r) => r.npc)).size,
  };
}

export function computeTrend(reports: ReportWithDetails[]): TrendPoint[] {
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
  for (const report of reports) {
    const key = report.createdAt.toISOString().slice(0, 10);
    const bucket = counts.get(key);
    if (bucket) {
      bucket.injuries += report.injuries.length;
      bucket.illnesses += report.illnesses.length;
    }
  }

  return days.map((d) => ({
    label: d.label,
    injuries: counts.get(d.key)?.injuries ?? 0,
    illnesses: counts.get(d.key)?.illnesses ?? 0,
  }));
}

export function computeBodyZones(reports: ReportWithDetails[]): BodyZoneStat[] {
  const zoneOrder = ["Upper limb", "Lower limb", "Spine / trunk", "Head / neck", "Other"];
  const counts = new Map<string, number>(zoneOrder.map((z) => [z, 0]));

  for (const report of reports) {
    for (const injury of report.injuries) {
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

export function computeTopNpcs(reports: ReportWithDetails[], limit = 5): NpcStat[] {
  const counts = new Map<string, number>();
  for (const report of reports) {
    counts.set(report.npc, (counts.get(report.npc) ?? 0) + 1);
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

export function computeInjuryTypeBreakdown(reports: ReportWithDetails[], limit = 6): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const report of reports) {
    for (const injury of report.injuries) {
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
  reports: ReportWithDetails[],
  limit = 6,
): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const report of reports) {
    for (const illness of report.illnesses) {
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
