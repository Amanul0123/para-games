import Link from "next/link";
import { ReportSummary } from "@/types";

interface ReportsTableProps {
  reports: ReportSummary[];
}

export default function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border-gray">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-text-dark">#</th>
            <th className="px-4 py-3 font-semibold text-text-dark">NPC</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Reported By</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Date</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Email</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Phone</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Injuries</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Illnesses</th>
            <th className="px-4 py-3 font-semibold text-text-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, i) => (
            <tr key={report.id} className="border-t border-border-gray">
              <td className="px-4 py-3">{i + 1}</td>
              <td className="px-4 py-3">{report.npc}</td>
              <td className="px-4 py-3">{report.reportedBy}</td>
              <td className="px-4 py-3">
                {new Date(report.dateOfReport).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{report.email}</td>
              <td className="px-4 py-3">{report.phone}</td>
              <td className="px-4 py-3">{report.injuryCount}</td>
              <td className="px-4 py-3">{report.illnessCount}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/report/${report.id}`}
                  className="rounded-md bg-brand-cyan px-3 py-1 text-white hover:opacity-90"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                No submissions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
