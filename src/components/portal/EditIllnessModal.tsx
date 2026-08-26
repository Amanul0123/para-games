"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { illnessEditSchema, type IllnessEditInput } from "@/lib/validations";
import { AthleteEntry, IllnessRecord } from "@/types";
import { AFFECTED_SYSTEMS, MAIN_SYMPTOMS, ILLNESS_CAUSES } from "@/lib/injuryIllnessCodes";

export default function EditIllnessModal({
  record,
  athletes,
  onClose,
  onSaved,
}: {
  record: IllnessRecord;
  athletes: AthleteEntry[];
  onClose: () => void;
  onSaved: (record: IllnessRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IllnessEditInput>({
    resolver: zodResolver(illnessEditSchema),
    defaultValues: {
      athleteId: record.athleteId,
      sportEvent: record.sportEvent,
      diagnosis: record.diagnosis,
      affectedSystem: record.affectedSystem ?? "",
      mainSymptoms: record.mainSymptoms ?? "",
      causeOfIllness: record.causeOfIllness ?? "",
      originalDaysLost: record.originalDaysLost,
    },
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    record.mainSymptoms ? record.mainSymptoms.split(",").map((s) => s.trim()).filter(Boolean) : []
  );

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms((prev) => {
      const next = prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label];
      setValue("mainSymptoms", next.join(", "), { shouldValidate: true });
      return next;
    });
  };

  const onSubmit = async (data: IllnessEditInput) => {
    try {
      const res = await fetch(`/api/portal/records/illness/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(typeof body?.error === "string" ? body.error : "Failed to save changes");
      }
      const updated: IllnessRecord = await res.json();
      onSaved(updated);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-amber-200 bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
            <i className="ti ti-virus text-amber-500" aria-hidden="true" />
            Edit Illness &mdash; {record.occurredOn}
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
            <Field label="Diagnosis" error={errors.diagnosis?.message}>
              <input
                {...register("diagnosis")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              />
            </Field>
            <Field label="Affected System" error={errors.affectedSystem?.message}>
              <select
                {...register("affectedSystem")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                <option value="" disabled>
                  Select system
                </option>
                {AFFECTED_SYSTEMS.map((s) => (
                  <option key={s.code} value={s.label}>
                    {s.code} — {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cause" error={errors.causeOfIllness?.message}>
              <select
                {...register("causeOfIllness")}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              >
                <option value="" disabled>
                  Select cause
                </option>
                {ILLNESS_CAUSES.map((c) => (
                  <option key={c.code} value={c.label}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Days Lost" error={errors.originalDaysLost?.message}>
              <input
                type="number"
                min={0}
                {...register("originalDaysLost", {
                  setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
                })}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
              />
            </Field>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Main Symptom(s)</label>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-md border border-slate-200 bg-white p-2.5 sm:grid-cols-3">
                {MAIN_SYMPTOMS.map((s) => (
                  <label key={s.code} className="flex items-center gap-1.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(s.label)}
                      onChange={() => toggleSymptom(s.label)}
                      className="rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan/60"
                    />
                    {s.code} — {s.label}
                  </label>
                ))}
              </div>
              {errors.mainSymptoms && (
                <p className="mt-1 text-xs text-red-500">{errors.mainSymptoms.message}</p>
              )}
            </div>
          </div>

          {errors.root && <p className="mt-3 text-xs text-red-600">{errors.root.message}</p>}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
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
