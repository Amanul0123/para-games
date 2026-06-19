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

  return (
    <div className="overflow-x-auto rounded-md border border-border-gray bg-gray-50">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, val]) => (
            <tr key={label} className="border-b border-border-gray last:border-0">
              <td className="w-1/3 px-4 py-2 font-medium text-gray-600">
                {label}
              </td>
              <td className="px-4 py-2 text-text-dark">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
