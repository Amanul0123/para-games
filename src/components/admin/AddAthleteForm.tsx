"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { athleteSchema, type AthleteInput } from "@/lib/validations";
import { AthleteEntry } from "@/types";

export default function AddAthleteForm({
  teamId,
  onAdded,
}: {
  teamId: string;
  onAdded: (athlete: AthleteEntry) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AthleteInput>({
    resolver: zodResolver(athleteSchema),
  });

  const onSubmit = async (data: AthleteInput) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/teams/${teamId}/athletes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "Failed to add athlete");
      }
      onAdded(body as AthleteEntry);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-b border-slate-200/70 bg-slate-50/40 px-4 py-3"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1.5fr_1.5fr_auto]">
        <div>
          <input
            placeholder="Athlete name"
            {...register("name")}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <input
            placeholder="Accreditation No."
            {...register("accreditationNo")}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          />
          {errors.accreditationNo && (
            <p className="mt-1 text-xs text-red-500">{errors.accreditationNo.message}</p>
          )}
        </div>
        <input
          placeholder="Sport (optional)"
          {...register("sport")}
          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1 rounded-md bg-brand-cyan px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          <i className="ti ti-plus" aria-hidden="true" />
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}
