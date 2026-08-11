"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { athleteSchema, type AthleteInput } from "@/lib/validations";
import { AthleteEntry } from "@/types";

export default function AthletesPanel({ initialAthletes }: { initialAthletes: AthleteEntry[] }) {
  const [athletes, setAthletes] = useState(initialAthletes);
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
      const res = await fetch("/api/portal/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to add athlete");
      }
      const athlete: AthleteEntry = await res.json();
      setAthletes((prev) => [...prev, athlete].sort((a, b) => a.name.localeCompare(b.name)));
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl"
      >
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-800">
          <i className="ti ti-user-plus text-slate-500" aria-hidden="true" />
          Create Athlete
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-600">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="accreditationNo" className="mb-1 block text-xs font-medium text-slate-600">
              Accreditation No.
            </label>
            <input
              id="accreditationNo"
              type="text"
              {...register("accreditationNo")}
              className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
            {errors.accreditationNo && (
              <p className="mt-1 text-xs text-red-500">{errors.accreditationNo.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="sport" className="mb-1 block text-xs font-medium text-slate-600">
              Sport (optional)
            </label>
            <input
              id="sport"
              type="text"
              {...register("sport")}
              className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Create Athlete"}
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
          <span className="text-sm font-medium text-slate-800">My Athletes</span>
          <span className="text-xs text-slate-500">{athletes.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-left">
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Accreditation No.
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Sport
              </th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr key={a.id} className="border-t border-slate-200/70">
                <td className="px-4 py-2.5 text-slate-800">{a.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.accreditationNo}</td>
                <td className="px-4 py-2.5 text-slate-600">{a.sport || "—"}</td>
              </tr>
            ))}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                  No athletes yet. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
