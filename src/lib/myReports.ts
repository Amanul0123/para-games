export interface MyReportEntry {
  id: string;
  email: string;
  npc: string;
  reportedBy: string;
  createdAt: string;
}

const STORAGE_KEY = "para_games_my_reports";
const MAX_ENTRIES = 20;

export function getMyReports(): MyReportEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MyReportEntry[]) : [];
  } catch {
    return [];
  }
}

export function addMyReport(entry: MyReportEntry) {
  if (typeof window === "undefined") return;
  const next = [entry, ...getMyReports().filter((r) => r.id !== entry.id)].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
