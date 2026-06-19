"use client";

import { InjuryEntry } from "@/types";

interface InjuryFormProps {
  index: number;
  value: InjuryEntry;
  onChange: (index: number, value: InjuryEntry) => void;
  onRemove?: () => void;
}

function field<K extends keyof InjuryEntry>(
  value: InjuryEntry,
  onChange: (next: InjuryEntry) => void,
  key: K,
) {
  return {
    value: value[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: e.target.value }),
  };
}

export default function InjuryForm({ index, value, onChange, onRemove }: InjuryFormProps) {
  const update = (next: InjuryEntry) => onChange(index, next);

  return (
    <div className="rounded-md border border-border-gray p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-text-dark">Injury #{index + 1}</h4>
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
        <Input label="Round / Heat" {...field(value, update, "roundHeat")} />
        <Input label="Injury Date" type="date" {...field(value, update, "injuryDate")} />
        <Input label="Injury Time" type="time" {...field(value, update, "injuryTime")} />
        <Input label="Body Part" {...field(value, update, "bodyPart")} />
        <Input label="Body Part Code" {...field(value, update, "bodyPartCode")} />
        <Input label="Injury Type" {...field(value, update, "injuryType")} />
        <Input label="Injury Type Code" {...field(value, update, "injuryTypeCode")} />
        <Input label="Cause of Injury" {...field(value, update, "causeOfInjury")} />
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
