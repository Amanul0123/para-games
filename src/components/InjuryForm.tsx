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
    <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 font-semibold text-slate-800">
          <i className="ti ti-bandage text-brand-red" aria-hidden="true" />
          Injury #{index + 1}
        </h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove injury #${index + 1}`}
            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            <i className="ti ti-trash" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input id={`injury-${index}-accreditationNo`} icon="ti-id-badge-2" label="Accreditation No." {...field(value, update, "accreditationNo")} />
        <Input id={`injury-${index}-sportEvent`} icon="ti-run" label="Sport / Event" {...field(value, update, "sportEvent")} />
        <Input id={`injury-${index}-roundHeat`} icon="ti-flag-3" label="Round / Heat" {...field(value, update, "roundHeat")} />
        <Input id={`injury-${index}-injuryDate`} icon="ti-calendar-event" label="Injury Date" type="date" {...field(value, update, "injuryDate")} />
        <Input id={`injury-${index}-injuryTime`} icon="ti-clock" label="Injury Time" type="time" {...field(value, update, "injuryTime")} />
        <Input id={`injury-${index}-bodyPart`} icon="ti-bone" label="Body Part" {...field(value, update, "bodyPart")} />
        <Input id={`injury-${index}-bodyPartCode`} icon="ti-hash" label="Body Part Code" {...field(value, update, "bodyPartCode")} />
        <Input id={`injury-${index}-injuryType`} icon="ti-bandage" label="Injury Type" {...field(value, update, "injuryType")} />
        <Input id={`injury-${index}-injuryTypeCode`} icon="ti-hash" label="Injury Type Code" {...field(value, update, "injuryTypeCode")} />
        <Input id={`injury-${index}-causeOfInjury`} icon="ti-alert-triangle" label="Cause of Injury" {...field(value, update, "causeOfInjury")} />
        <Input id={`injury-${index}-causeCode`} icon="ti-hash" label="Cause Code" {...field(value, update, "causeCode")} />
        <Input
          id={`injury-${index}-absenceDays`}
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
  id,
  icon,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  icon: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <i className={`ti ${icon} text-slate-400`} aria-hidden="true" />
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
      />
    </div>
  );
}
