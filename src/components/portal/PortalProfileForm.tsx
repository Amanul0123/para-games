"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";

const DESIGNATION_OPTIONS = [
  "Team doctor/physician",
  "Team physical therapist",
  "Polyclinic doctor/physician",
  "Polyclinic physical therapist",
  "International Paralympic Medical Committee (IPMC) member",
  "Dentist",
  "Radiologist",
  "Other",
] as const;

export default function PortalProfileForm({
  name,
  phone,
  designation,
}: {
  name: string;
  phone?: string | null;
  designation?: string | null;
}) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const isPreset = designation ? (DESIGNATION_OPTIONS as readonly string[]).includes(designation) : false;
  const [selectedDesignation, setSelectedDesignation] = useState(
    designation ? (isPreset ? designation : "Other") : ""
  );
  const [otherDesignation, setOtherDesignation] = useState(isPreset ? "" : designation ?? "");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, phone: phone ?? "", designation: designation ?? "" },
  });

  const onSubmit = async (data: ProfileInput) => {
    setStatus(null);

    const finalDesignation =
      selectedDesignation === "Other" ? otherDesignation.trim() : selectedDesignation;

    if (!finalDesignation) {
      setError("designation", { message: "Please select your professional designation" });
      return;
    }

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, designation: finalDesignation }),
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

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Professional Designation
        </label>
        <div className="space-y-1.5">
          {DESIGNATION_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="designation"
                value={option}
                checked={selectedDesignation === option}
                onChange={() => setSelectedDesignation(option)}
                className="border-slate-300 text-brand-cyan focus:ring-brand-cyan/60"
              />
              {option === "Other" ? "Other (please provide professional designation)" : option}
            </label>
          ))}
        </div>
        {selectedDesignation === "Other" && (
          <input
            value={otherDesignation}
            onChange={(e) => setOtherDesignation(e.target.value)}
            placeholder="Enter your professional designation"
            className="mt-2 w-full rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none"
          />
        )}
        {errors.designation && (
          <p className="mt-1 text-sm text-red-500">{errors.designation.message}</p>
        )}
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
