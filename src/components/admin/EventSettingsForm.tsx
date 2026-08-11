"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSettingsSchema, type EventSettingsInput } from "@/lib/validations";
import { EventSettingsData } from "@/lib/eventSettings";

export default function EventSettingsForm({ initial }: { initial: EventSettingsData }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventSettingsInput>({
    resolver: zodResolver(eventSettingsSchema),
    defaultValues: {
      eventName: initial.eventName,
      organizationName: initial.organizationName,
      startDate: initial.startDate ?? "",
      endDate: initial.endDate ?? "",
      logoUrl: initial.logoUrl ?? "",
    },
  });

  const onSubmit = async (data: EventSettingsInput) => {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(typeof body?.error === "string" ? body.error : "Failed to save");
      setStatus({ type: "success", message: "Branding updated. Refresh other tabs to see it everywhere." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to save" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Event Name</label>
          <input
            {...register("eventName")}
            placeholder="e.g. Dubai 2027 Asian Para Games"
            className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
          {errors.eventName && <p className="mt-1 text-sm text-red-500">{errors.eventName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Organization Name</label>
          <input
            {...register("organizationName")}
            placeholder="e.g. UAE Paralympic Committee"
            className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
          {errors.organizationName && (
            <p className="mt-1 text-sm text-red-500">{errors.organizationName.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Logo URL</label>
          <input
            {...register("logoUrl")}
            placeholder="https://... (leave blank to use the default emblem)"
            className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Paste a hosted image URL for the client&apos;s logo. Leave empty to keep the default
            emblem.
          </p>
        </div>
      </div>

      {status && (
        <p className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gradient-to-r from-brand-cyan to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.4)] hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Branding"}
      </button>
    </form>
  );
}
