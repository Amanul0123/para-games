"use client";

import { ReportSummary } from "@/types";
import { exportReportsToExcel, exportReportsToPdf } from "@/lib/exportReports";

interface ExportButtonsProps {
  reports: ReportSummary[];
}

export default function ExportButtons({ reports }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => exportReportsToExcel(reports)}
        className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
      >
        <i className="ti ti-file-spreadsheet text-slate-400" aria-hidden="true" />
        Export Excel
      </button>
      <button
        type="button"
        onClick={() => exportReportsToPdf(reports)}
        className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
      >
        <i className="ti ti-file-type-pdf text-slate-400" aria-hidden="true" />
        Export PDF
      </button>
    </div>
  );
}
