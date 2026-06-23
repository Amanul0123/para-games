import { ReportDetail as ReportDetailType } from "@/types";

interface ReportDetailProps {
  report: ReportDetailType;
}

const STATUS_LABELS: Record<string, string> = {
  submitted: "New",
  under_review: "Under Review",
  resolved: "Resolved",
};

export default function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <h2 className="mb-3 text-base font-semibold text-slate-800">Reporter Information</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="NPC" value={report.npc} />
          <Field label="Reported By" value={report.reportedBy} />
          <Field
            label="Date of Report"
            value={new Date(report.dateOfReport).toLocaleDateString("en-US")}
          />
          <Field label="Email" value={report.email} />
          <Field label="Phone" value={report.phone} />
          <Field label="Status" value={STATUS_LABELS[report.status] ?? report.status} />
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-800">
          Injuries ({report.injuries.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left text-slate-500">
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Accreditation</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Sport / Event</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Round / Heat</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Date</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Time</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Body Part</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Type</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Cause</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Absence</th>
              </tr>
            </thead>
            <tbody>
              {report.injuries.map((injury, i) => (
                <tr key={i} className="border-t border-slate-200/70 text-slate-700">
                  <td className="px-3 py-2">{injury.accreditationNo}</td>
                  <td className="px-3 py-2">{injury.sportEvent}</td>
                  <td className="px-3 py-2">{injury.roundHeat}</td>
                  <td className="px-3 py-2">{injury.injuryDate}</td>
                  <td className="px-3 py-2">{injury.injuryTime}</td>
                  <td className="px-3 py-2">
                    {injury.bodyPart} {injury.bodyPartCode && `(${injury.bodyPartCode})`}
                  </td>
                  <td className="px-3 py-2">
                    {injury.injuryType} {injury.injuryTypeCode && `(${injury.injuryTypeCode})`}
                  </td>
                  <td className="px-3 py-2">
                    {injury.causeOfInjury} {injury.causeCode && `(${injury.causeCode})`}
                  </td>
                  <td className="px-3 py-2">{injury.absenceDays ?? "-"}</td>
                </tr>
              ))}
              {report.injuries.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-center text-slate-500">
                    No injuries reported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-800">
          Illnesses ({report.illnesses.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-left text-slate-500">
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Accreditation</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Sport / Event</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Diagnosis</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Occurred On</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">System</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Symptoms</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Cause</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium uppercase">Absence</th>
              </tr>
            </thead>
            <tbody>
              {report.illnesses.map((illness, i) => (
                <tr key={i} className="border-t border-slate-200/70 text-slate-700">
                  <td className="px-3 py-2">{illness.accreditationNo}</td>
                  <td className="px-3 py-2">{illness.sportEvent}</td>
                  <td className="px-3 py-2">{illness.diagnosis}</td>
                  <td className="px-3 py-2">{illness.occurredOn}</td>
                  <td className="px-3 py-2">
                    {illness.affectedSystem} {illness.systemCode && `(${illness.systemCode})`}
                  </td>
                  <td className="px-3 py-2">
                    {illness.mainSymptoms} {illness.symptomCodes && `(${illness.symptomCodes})`}
                  </td>
                  <td className="px-3 py-2">
                    {illness.causeOfIllness} {illness.causeCode && `(${illness.causeCode})`}
                  </td>
                  <td className="px-3 py-2">{illness.absenceDays ?? "-"}</td>
                </tr>
              ))}
              {report.illnesses.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-slate-500">
                    No illnesses reported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
