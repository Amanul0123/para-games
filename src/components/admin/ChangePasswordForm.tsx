"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations";

export default function ChangePasswordForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof body?.error === "string" ? body.error : "Failed to update password",
        );
      }

      setStatus({ type: "success", message: "Password updated successfully." });
      reset();
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field
        label="Current Password"
        type="password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Field
        label="New Password"
        type="password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Field
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

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
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        {...props}
        className={`w-full rounded-md border bg-white/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:outline-none ${
          error ? "border-red-400" : "border-slate-200 focus:border-brand-cyan/60"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
