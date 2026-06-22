"use client";

import { IllnessEntry } from "@/types";

interface IllnessFormProps {
  index: number;
  value: IllnessEntry;
  onChange: (index: number, value: IllnessEntry) => void;
  onRemove?: () => void;
}

function field<K extends keyof IllnessEntry>(
  value: IllnessEntry,
  onChange: (next: IllnessEntry) => void,
  key: K,
) {
  return {
    value: value[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: e.target.value }),
  };
}

export default function IllnessForm({ index, value, onChange, onRemove }: IllnessFormProps) {
  const update = (next: IllnessEntry) => onChange(index, next);

  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 font-semibold text-slate-800">
          <i className="ti ti-virus text-amber-500" aria-hidden="true" />
          Illness #{index + 1}
        </h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            <i className="ti ti-trash" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input icon="ti-id-badge-2" label="Accreditation No." {...field(value, update, "accreditationNo")} />
        <Input icon="ti-run" label="Sport / Event" {...field(value, update, "sportEvent")} />
        <Input icon="ti-stethoscope" label="Diagnosis" {...field(value, update, "diagnosis")} />
        <Input icon="ti-calendar-event" label="Occurred On" type="date" {...field(value, update, "occurredOn")} />
        <Input icon="ti-lungs" label="Affected System" {...field(value, update, "affectedSystem")} />
        <Input icon="ti-hash" label="System Code" {...field(value, update, "systemCode")} />
        <Input icon="ti-thermometer" label="Main Symptoms" {...field(value, update, "mainSymptoms")} />
        <Input icon="ti-hash" label="Symptom Codes" {...field(value, update, "symptomCodes")} />
        <Input icon="ti-alert-triangle" label="Cause of Illness" {...field(value, update, "causeOfIllness")} />
        <Input icon="ti-hash" label="Cause Code" {...field(value, update, "causeCode")} />
        <Input
          icon="ti-calendar-x"
          label="Absence (days)"
          type="number"
          value={value.absenceDays ?? ""}
          onChange={(e) =>
            update({ ...value, absenceDays: e.target.value ? Number(e.target.value) : undefined })
          }
        />
      </div>
    </div>
  );
}

function Input({
  icon,
  label,
  type = "text",
  value,
  onChange,
}: {
  icon: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <i className={`ti ${icon} text-slate-400`} aria-hidden="true" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
      />
    </div>
  );
}
