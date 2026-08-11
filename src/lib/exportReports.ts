import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { TeamSummary, AthleteEntry, InjuryRecord, IllnessRecord } from "@/types";

const TEAM_COLUMNS = ["NPC", "Team Doctor", "Email", "Athletes", "Injuries", "Illnesses"] as const;

function toTeamRows(teams: TeamSummary[]) {
  return teams.map((team) => [
    team.npc,
    team.name,
    team.email,
    team.athleteCount,
    team.injuryCount,
    team.illnessCount,
  ]);
}

export function exportTeamsToExcel(teams: TeamSummary[], fileName = "para-games-teams") {
  const rows = toTeamRows(teams);
  const sheetData: (string | number)[][] = [[...TEAM_COLUMNS], ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = TEAM_COLUMNS.map(() => ({ wch: 18 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportTeamsToPdf(teams: TeamSummary[], fileName = "para-games-teams") {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Aichi Nagoya 2026 Asian Para Games", 14, 15);
  doc.setFontSize(10);
  doc.text("Report on Injuries and Illnesses - Teams Export", 14, 21);

  autoTable(doc, {
    head: [[...TEAM_COLUMNS]],
    body: toTeamRows(teams),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 58, 24] },
  });

  doc.save(`${fileName}.pdf`);
}

const INJURY_COLUMNS = ["Athlete", "Sport / Event", "Date", "Body Part", "Type", "Cause", "Days Lost", "Status"] as const;
const ILLNESS_COLUMNS = ["Athlete", "Sport / Event", "Occurred On", "Diagnosis", "System", "Cause", "Days Lost", "Status"] as const;

function toInjuryRows(injuries: InjuryRecord[]) {
  return injuries.map((i) => [
    i.athleteName,
    i.sportEvent,
    i.injuryDate,
    i.bodyPart,
    i.injuryType,
    i.causeOfInjury ?? "-",
    i.editedDaysLost ?? i.originalDaysLost ?? "-",
    i.status,
  ]);
}

function toIllnessRows(illnesses: IllnessRecord[]) {
  return illnesses.map((i) => [
    i.athleteName,
    i.sportEvent,
    i.occurredOn,
    i.diagnosis,
    i.affectedSystem ?? "-",
    i.causeOfIllness ?? "-",
    i.editedDaysLost ?? i.originalDaysLost ?? "-",
    i.status,
  ]);
}

/** Team-scoped export used by the portal's own "Download All/Injuries/Illness" buttons. */
export function exportTeamRecordsToExcel(
  injuries: InjuryRecord[],
  illnesses: IllnessRecord[],
  fileName = "my-team-records",
) {
  const workbook = XLSX.utils.book_new();

  if (injuries.length > 0) {
    const sheet = XLSX.utils.aoa_to_sheet([[...INJURY_COLUMNS], ...toInjuryRows(injuries)]);
    sheet["!cols"] = INJURY_COLUMNS.map(() => ({ wch: 16 }));
    XLSX.utils.book_append_sheet(workbook, sheet, "Injuries");
  }
  if (illnesses.length > 0) {
    const sheet = XLSX.utils.aoa_to_sheet([[...ILLNESS_COLUMNS], ...toIllnessRows(illnesses)]);
    sheet["!cols"] = ILLNESS_COLUMNS.map(() => ({ wch: 16 }));
    XLSX.utils.book_append_sheet(workbook, sheet, "Illnesses");
  }
  if (injuries.length === 0 && illnesses.length === 0) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["No records yet"]]), "Injuries");
  }

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportTeamDetailToPdf(team: {
  npc: string;
  name: string;
  email: string;
  athletes: AthleteEntry[];
  injuries: InjuryRecord[];
  illnesses: IllnessRecord[];
}) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Aichi Nagoya 2026 Asian Para Games", 14, 15);
  doc.setFontSize(10);
  doc.text("Report on Injuries and Illnesses", 14, 21);

  autoTable(doc, {
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [24, 95, 165] },
    head: [["NPC", "Team Doctor", "Email", "Athletes"]],
    body: [[team.npc, team.name, team.email, team.athletes.length]],
  });

  let nextY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Injuries (${team.injuries.length})`, 14, nextY);
  autoTable(doc, {
    startY: nextY + 4,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 58, 24] },
    head: [[...INJURY_COLUMNS]],
    body: toInjuryRows(team.injuries),
  });

  nextY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Illnesses (${team.illnesses.length})`, 14, nextY);
  autoTable(doc, {
    startY: nextY + 4,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [186, 117, 23] },
    head: [[...ILLNESS_COLUMNS]],
    body: toIllnessRows(team.illnesses),
  });

  doc.save(`para-games-team-${team.npc.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
