interface ExampleTableProps {
  type: "injury" | "illness";
}

const INJURY_ROW = [
  ["Accreditation No.", "123456789"],
  ["Sport / Event", "Athletics 100m"],
  ["Round / Heat", "Quarter Final / 1st Heat"],
  ["Date & Time", "10.12.2025 13:15"],
  ["Body Part (Code)", "Wrist left (Code: 5)"],
  ["Injury Type (Code)", "Sprain (Code: 8)"],
  ["Cause of Injury (Code)", "Slipped & fell (Code: 21)"],
  ["Absence (days)", "10"],
];

const ILLNESS_ROW = [
  ["Accreditation No.", "123456789"],
  ["Sport / Event", "Football Men"],
  ["Diagnosis", "Tonsillitis / Cold"],
  ["Occurred On", "10.12.2025"],
  ["Affected System (Code)", "Respiratory (Code: 1)"],
  ["Main Symptoms (Code)", "Fever, Pain (Code: 1,2)"],
  ["Cause of Illness (Code)", "Infection (Code: 9)"],
  ["Absence (days)", "10"],
];

export default function ExampleTable({ type }: ExampleTableProps) {
  const rows = type === "injury" ? INJURY_ROW : ILLNESS_ROW;
  const icon = type === "injury" ? "ti-bandage" : "ti-virus";
  const accent = type === "injury" ? "text-brand-red" : "text-amber-500";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/70 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-slate-200/70 bg-white/50 px-4 py-2.5">
        <i className={`ti ${icon} ${accent}`} aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Example
        </span>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">Example {type} report values</caption>
        <thead>
          <tr className="sr-only">
            <th scope="col">Field</th>
            <th scope="col">Example value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, val]) => (
            <tr key={label} className="border-b border-slate-200/60 last:border-0">
              <th scope="row" className="w-1/3 px-4 py-2 text-left font-medium text-slate-500">
                {label}
              </th>
              <td className="px-4 py-2 text-slate-700">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
