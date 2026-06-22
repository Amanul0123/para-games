import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportSummary, InjuryEntry, IllnessEntry, Step1Data } from "@/types";

const COLUMNS = [
  "NPC",
  "Reported By",
  "Date",
  "Email",
  "Phone",
  "Injuries",
  "Illnesses",
  "Status",
] as const;

function toRows(reports: ReportSummary[]) {
  return reports.map((report) => [
    report.npc,
    report.reportedBy,
    new Date(report.dateOfReport).toLocaleDateString("en-US"),
    report.email,
    report.phone,
    report.injuryCount,
    report.illnessCount,
    report.status,
  ]);
}

export function exportReportsToExcel(reports: ReportSummary[], fileName = "para-games-reports") {
  const rows = toRows(reports);
  const sheetData: (string | number)[][] = [[...COLUMNS], ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = COLUMNS.map(() => ({ wch: 18 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportReportsToPdf(reports: ReportSummary[], fileName = "para-games-reports") {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Aichi Nagoya 2026 Asian Para Games", 14, 15);
  doc.setFontSize(10);
  doc.text("Report on Injuries and Illnesses - Submissions Export", 14, 21);

  autoTable(doc, {
    head: [[...COLUMNS]],
    body: toRows(reports),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 58, 24] },
  });

  doc.save(`${fileName}.pdf`);
}

const STATUS_LABELS: Record<string, string> = {
  submitted: "New",
  under_review: "Under Review",
  resolved: "Resolved",
};

export function exportReportDetailToPdf(report: {
  id: string;
  status: string;
  step1: Step1Data;
  injuries: InjuryEntry[];
  illnesses: IllnessEntry[];
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
    head: [["NPC", "Reported By", "Date", "Email", "Phone", "Status"]],
    body: [
      [
        report.step1.npc,
        report.step1.reportedBy,
        new Date(report.step1.dateOfReport).toLocaleDateString("en-US"),
        report.step1.email,
        report.step1.phone,
        STATUS_LABELS[report.status] ?? report.status,
      ],
    ],
  });

  let nextY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Injuries (${report.injuries.length})`, 14, nextY);
  autoTable(doc, {
    startY: nextY + 4,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 58, 24] },
    head: [["Accreditation", "Sport / Event", "Date", "Body Part", "Type", "Cause", "Absence"]],
    body: report.injuries.map((injury) => [
      injury.accreditationNo,
      injury.sportEvent,
      injury.injuryDate,
      injury.bodyPart,
      injury.injuryType,
      injury.causeOfInjury ?? "-",
      injury.absenceDays ?? "-",
    ]),
  });

  nextY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Illnesses (${report.illnesses.length})`, 14, nextY);
  autoTable(doc, {
    startY: nextY + 4,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [186, 117, 23] },
    head: [["Accreditation", "Sport / Event", "Diagnosis", "Occurred On", "System", "Absence"]],
    body: report.illnesses.map((illness) => [
      illness.accreditationNo,
      illness.sportEvent,
      illness.diagnosis,
      illness.occurredOn,
      illness.affectedSystem ?? "-",
      illness.absenceDays ?? "-",
    ]),
  });

  doc.save(`para-games-report-${report.id.slice(0, 8)}.pdf`);
}
