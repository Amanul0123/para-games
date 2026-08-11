"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export default function PortalProfileForm({ name, phone }: { name: string; phone?: string | null }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, phone: phone ?? "" },
  });

  const onSubmit = async (data: ProfileInput) => {
    setStatus(null);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(typeof body?.error === "string" ? body.error : "Failed to update");
      setStatus({ type: "success", message: "Profile updated." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to update" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          {...register("name")}
          className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
        <input
          {...register("phone")}
          className="w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
        />
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
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
