"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
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

    router.push("/admin/dashboard");
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-red/25 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-brand-cyan/30 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-orange-300/30 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.9),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.25)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex flex-col items-center px-8 pt-10 pb-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-orange-500 shadow-[0_10px_25px_-5px_rgba(224,58,24,0.5)]">
                <i className="ti ti-wheelchair text-2xl text-white" aria-hidden="true" />
              </div>
              <h1 className="text-center text-lg font-semibold text-slate-800">
                APC Medical Portal
              </h1>
              <p className="mt-1 text-center text-xs text-slate-500">
                Aichi Nagoya 2026 Asian Para Games &mdash; Admin Login
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 px-8 py-8">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </label>
                <div className="relative">
                  <i
                    className="ti ti-mail pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    placeholder="admin@asianparalympic.org"
                    className={`w-full rounded-lg border bg-white/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-none ${
                      errors.email
                        ? "border-red-400/60"
                        : "border-slate-200 focus:border-brand-cyan/60 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <i
                    className="ti ti-lock pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-white/70 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-none ${
                      errors.password
                        ? "border-red-400/60"
                        : "border-slate-200 focus:border-brand-cyan/60 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
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
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Asian Paralympic Committee
          </p>
        </div>
      </div>
    </>
  );
}
