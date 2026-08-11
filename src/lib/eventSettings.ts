import { prisma } from "@/lib/prisma";

export interface EventSettingsData {
  eventName: string;
  organizationName: string;
  startDate: string | null;
  endDate: string | null;
  logoUrl: string | null;
}

const DEFAULTS: EventSettingsData = {
  eventName: "Aichi Nagoya 2026 Asian Para Games",
  organizationName: "Asian Paralympic Committee",
  startDate: null,
  endDate: null,
  logoUrl: null,
};

export async function getEventSettings(): Promise<EventSettingsData> {
  const row = await prisma.eventSettings.findUnique({ where: { id: "singleton" } });
  if (!row) return DEFAULTS;

  return {
    eventName: row.eventName,
    organizationName: row.organizationName,
    startDate: row.startDate ? row.startDate.toISOString().slice(0, 10) : null,
    endDate: row.endDate ? row.endDate.toISOString().slice(0, 10) : null,
    logoUrl: row.logoUrl,
  };
}
