"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { athleteSchema, type AthleteInput } from "@/lib/validations";
import { AthleteEntry } from "@/types";

export default function EditAthleteModal({
  athlete,
  onClose,
  onSaved,
}: {
  athlete: AthleteEntry;
  onClose: () => void;
  onSaved: (athlete: AthleteEntry) => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AthleteInput>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: athlete.name,
      accreditationNo: athlete.accreditationNo,
      sport: athlete.sport ?? "",
    },
  });

  const onSubmit = async (data: AthleteInput) => {
    try {
      const res = await fetch(`/api/portal/athletes/${athlete.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "Failed to save changes");
      }
      onSaved(body as AthleteEntry);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
            <i className="ti ti-user-edit text-slate-500" aria-hidden="true" />
            Edit Athlete
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
            <input
              {...register("name")}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Accreditation No.</label>
            <input
              {...register("accreditationNo")}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
            {errors.accreditationNo && (
              <p className="mt-1 text-xs text-red-500">{errors.accreditationNo.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Sport (optional)</label>
            <input
              {...register("sport")}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
            />
          </div>

          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
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
