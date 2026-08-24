"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { injuryEditSchema, type InjuryEditInput } from "@/lib/validations";
import { AthleteEntry, InjuryRecord } from "@/types";
import { BODY_REGIONS, INJURY_TYPES, INJURY_CAUSES } from "@/lib/injuryIllnessCodes";

function regionForPart(bodyPart: string) {
  return BODY_REGIONS.find((r) => r.parts.some((p) => p.label === bodyPart))?.label ?? "";
}

export default function EditInjuryModal({
  record,
  athletes,
  onClose,
  onSaved,
}: {
  record: InjuryRecord;
  athletes: AthleteEntry[];
  onClose: () => void;
  onSaved: (record: InjuryRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InjuryEditInput>({
    resolver: zodResolver(injuryEditSchema),
    defaultValues: {
      athleteId: record.athleteId,
      sportEvent: record.sportEvent,
      bodyPart: record.bodyPart,
      injuryType: record.injuryType,
      causeOfInjury: record.causeOfInjury ?? "",
      originalDaysLost: record.originalDaysLost,
    },
  });

  const [bodyRegion, setBodyRegion] = useState(regionForPart(record.bodyPart));
  const regionParts = BODY_REGIONS.find((r) => r.label === bodyRegion)?.parts ?? [];

  const onSubmit = async (data: InjuryEditInput) => {
    try {
      const res = await fetch(`/api/portal/records/injury/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(typeof body?.error === "string" ? body.error : "Failed to save changes");
      }
      const updated: InjuryRecord = await res.json();
      onSaved(updated);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
            <i className="ti ti-bandage text-red-500" aria-hidden="true" />
            Edit Injury &mdash; {record.injuryDate}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Athlete" error={errors.athleteId?.message}>
              <select
                {...register("athleteId")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.accreditationNo})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sport / Event" error={errors.sportEvent?.message}>
              <input
                {...register("sportEvent")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              />
            </Field>
            <Field label="Body Region">
              <select
                value={bodyRegion}
                onChange={(e) => {
                  setBodyRegion(e.target.value);
                  setValue("bodyPart", "", { shouldValidate: true });
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                <option value="" disabled>
                  Select region
                </option>
                {BODY_REGIONS.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Body Part" error={errors.bodyPart?.message}>
              <select
                {...register("bodyPart")}
                disabled={!bodyRegion}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="" disabled>
                  {bodyRegion ? "Select part" : "Select a region first"}
                </option>
                {regionParts.map((p) => (
                  <option key={p.code} value={p.label}>
                    {p.code} — {p.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Injury Type" error={errors.injuryType?.message}>
              <select
                {...register("injuryType")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                {INJURY_TYPES.map((t) => (
                  <option key={t.code} value={t.label}>
                    {t.code} — {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cause of Injury (optional)">
              <select
                {...register("causeOfInjury")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                <option value="">Select cause (optional)</option>
                {INJURY_CAUSES.map((c) => (
                  <option key={c.code} value={c.label}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Days Lost (optional)">
              <input
                type="number"
                min={0}
                {...register("originalDaysLost", {
                  setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
                })}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              />
            </Field>
          </div>

          {errors.root && <p className="mt-3 text-xs text-red-600">{errors.root.message}</p>}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
