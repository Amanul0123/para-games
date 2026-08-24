"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function PortalLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/portal");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 px-8 py-8">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Email
        </label>
        <div className="relative">
          <i
            className="ti ti-mail pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="teamdoctor@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-lg border bg-white/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-500 shadow-inner focus:outline-none ${
              errors.email
                ? "border-red-400/60"
                : "border-slate-200 focus:border-brand-cyan/60 focus:bg-white"
            }`}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Password
        </label>
        <div className="relative">
          <i
            className="ti ti-lock pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            placeholder="••••••••"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full rounded-lg border bg-white/70 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-500 shadow-inner focus:outline-none ${
              errors.password
                ? "border-red-400/60"
                : "border-slate-200 focus:border-brand-cyan/60 focus:bg-white"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_-5px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
