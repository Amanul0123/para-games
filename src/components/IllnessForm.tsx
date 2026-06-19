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
    <div className="rounded-md border border-border-gray p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-text-dark">Illness #{index + 1}</h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Accreditation No." {...field(value, update, "accreditationNo")} />
        <Input label="Sport / Event" {...field(value, update, "sportEvent")} />
        <Input label="Diagnosis" {...field(value, update, "diagnosis")} />
        <Input label="Occurred On" type="date" {...field(value, update, "occurredOn")} />
        <Input label="Affected System" {...field(value, update, "affectedSystem")} />
        <Input label="System Code" {...field(value, update, "systemCode")} />
        <Input label="Main Symptoms" {...field(value, update, "mainSymptoms")} />
        <Input label="Symptom Codes" {...field(value, update, "symptomCodes")} />
        <Input label="Cause of Illness" {...field(value, update, "causeOfIllness")} />
        <Input label="Cause Code" {...field(value, update, "causeCode")} />
        <Input
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
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text-dark">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border-gray px-3 py-2 text-sm focus:border-brand-cyan focus:outline-none"
      />
    </div>
  );
}
