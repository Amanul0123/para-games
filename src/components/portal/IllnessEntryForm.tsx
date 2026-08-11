"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { illnessSchema, type IllnessInput } from "@/lib/validations";
import { AthleteEntry, IllnessRecord } from "@/types";

export default function IllnessEntryForm({
  date,
  athletes,
  onSaved,
  onCancel,
}: {
  date: string;
  athletes: AthleteEntry[];
  onSaved: (record: IllnessRecord) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IllnessInput>({
    resolver: zodResolver(illnessSchema),
    defaultValues: { occurredOn: date },
  });

  const onSubmit = async (data: IllnessInput) => {
    try {
      const res = await fetch("/api/portal/illnesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, occurredOn: date }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(typeof body?.error === "string" ? body.error : "Failed to save illness");
      }
      const record: IllnessRecord = await res.json();
      onSaved(record);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-amber-200 bg-amber-50/50 p-5"
    >
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-800">
        <i className="ti ti-virus text-amber-500" aria-hidden="true" />
        Record Illness &mdash; {date}
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Athlete" error={errors.athleteId?.message}>
          <select
            {...register("athleteId")}
            defaultValue=""
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          >
            <option value="" disabled>
              Select athlete
            </option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.accreditationNo})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sport / Event" error={errors.sportEvent?.message}>
          <input {...register("sportEvent")} className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none" />
        </Field>
        <Field label="Diagnosis" error={errors.diagnosis?.message}>
          <input {...register("diagnosis")} className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none" />
        </Field>
        <Field label="Affected System (optional)">
          <input {...register("affectedSystem")} placeholder="e.g. respiratory, GI" className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none" />
        </Field>
        <Field label="Main Symptoms (optional)">
          <input {...register("mainSymptoms")} className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none" />
        </Field>
        <Field label="Cause (optional)">
          <input {...register("causeOfIllness")} placeholder="e.g. infection" className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none" />
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
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Record Illness"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
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
