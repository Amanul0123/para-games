import {
  BODY_REGIONS,
  INJURY_TYPES,
  INJURY_CAUSES,
  AFFECTED_SYSTEMS,
  MAIN_SYMPTOMS,
  ILLNESS_CAUSES,
  ABSENCE_DAYS,
} from "@/lib/injuryIllnessCodes";

function CodeList({ items }: { items: readonly { code: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.code} className="flex items-baseline gap-2 text-sm text-slate-700">
          <span className="inline-flex min-w-[1.75rem] justify-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
            {item.code}
          </span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function CodeCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <h2 className="mb-3 text-sm font-medium text-slate-800">{title}</h2>
      {children}
    </div>
  );
}

export default function CodesReferencePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Codes &amp; Classifications</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Reference for the codes used across the Injury and Illness forms &mdash; based on the F-MARC
          &ldquo;Daily Report on Injuries and Illnesses&rdquo; standard.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-red-600">
            <i className="ti ti-bandage" aria-hidden="true" />
            For Injuries
          </h2>
          <div className="space-y-4">
            <CodeCard title="Injured Body Part">
              <div className="space-y-4">
                {BODY_REGIONS.map((region) => (
                  <div key={region.label}>
                    <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                      {region.label}
                    </h3>
                    <CodeList items={region.parts} />
                  </div>
                ))}
              </div>
            </CodeCard>

            <CodeCard title="Type of Injury (Diagnosis)">
              <CodeList items={INJURY_TYPES} />
            </CodeCard>

            <CodeCard title="Cause of Injury">
              <CodeList items={INJURY_CAUSES} />
            </CodeCard>
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-amber-600">
            <i className="ti ti-virus" aria-hidden="true" />
            For Illnesses
          </h2>
          <div className="space-y-4">
            <CodeCard title="Affected System">
              <CodeList items={AFFECTED_SYSTEMS} />
            </CodeCard>

            <CodeCard title="Main Symptom(s)">
              <CodeList items={MAIN_SYMPTOMS} />
            </CodeCard>

            <CodeCard title="Cause of Illness">
              <CodeList items={ILLNESS_CAUSES} />
            </CodeCard>
          </div>
        </div>

        <CodeCard title="Estimated Absence (Days Lost)">
          <CodeList items={ABSENCE_DAYS} />
        </CodeCard>
      </div>
    </div>
  );
}
