import { ReportDetail as ReportDetailType } from "@/types";

interface ReportDetailProps {
  report: ReportDetailType;
}

export default function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-md border border-border-gray p-4">
        <h2 className="mb-3 text-lg font-semibold text-text-dark">Reporter Information</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="NPC" value={report.npc} />
          <Field label="Reported By" value={report.reportedBy} />
          <Field
            label="Date of Report"
            value={new Date(report.dateOfReport).toLocaleDateString()}
          />
          <Field label="Email" value={report.email} />
          <Field label="Phone" value={report.phone} />
          <Field label="Status" value={report.status} />
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-dark">
          Injuries ({report.injuries.length})
        </h2>
        <div className="overflow-x-auto rounded-md border border-border-gray">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Accreditation</th>
                <th className="px-3 py-2">Sport / Event</th>
                <th className="px-3 py-2">Round / Heat</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Body Part</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Cause</th>
                <th className="px-3 py-2">Absence</th>
              </tr>
            </thead>
            <tbody>
              {report.injuries.map((injury, i) => (
                <tr key={i} className="border-t border-border-gray">
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
                  <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                    No injuries reported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-dark">
          Illnesses ({report.illnesses.length})
        </h2>
        <div className="overflow-x-auto rounded-md border border-border-gray">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Accreditation</th>
                <th className="px-3 py-2">Sport / Event</th>
                <th className="px-3 py-2">Diagnosis</th>
                <th className="px-3 py-2">Occurred On</th>
                <th className="px-3 py-2">System</th>
                <th className="px-3 py-2">Symptoms</th>
                <th className="px-3 py-2">Cause</th>
                <th className="px-3 py-2">Absence</th>
              </tr>
            </thead>
            <tbody>
              {report.illnesses.map((illness, i) => (
                <tr key={i} className="border-t border-border-gray">
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
                  <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
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
      <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
      <dd className="text-text-dark">{value}</dd>
    </div>
  );
}
