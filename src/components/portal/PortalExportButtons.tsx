"use client";

import { InjuryRecord, IllnessRecord } from "@/types";
import { exportTeamRecordsToExcel } from "@/lib/exportReports";

export default function PortalExportButtons({
  injuries,
  illnesses,
}: {
  injuries: InjuryRecord[];
  illnesses: IllnessRecord[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => exportTeamRecordsToExcel(injuries, illnesses, "my-team-all-records")}
        className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
      >
        <i className="ti ti-download text-slate-400" aria-hidden="true" />
        Download All
      </button>
      <button
        type="button"
        onClick={() => exportTeamRecordsToExcel(injuries, [], "my-team-injuries")}
        className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
      >
        <i className="ti ti-bandage text-slate-400" aria-hidden="true" />
        Download Injuries
      </button>
      <button
        type="button"
        onClick={() => exportTeamRecordsToExcel([], illnesses, "my-team-illnesses")}
        className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
      >
        <i className="ti ti-virus text-slate-400" aria-hidden="true" />
        Download Illness
      </button>
    </div>
  );
}
