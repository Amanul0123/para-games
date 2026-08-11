"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamCreateSchema, type TeamCreateInput } from "@/lib/validations";
import { NPC_OPTIONS } from "@/lib/npcFlags";

interface CreatedTeam {
  npc: string;
  email: string;
  tempPassword: string;
}

export default function AddTeamForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTeam | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamCreateInput>({
    resolver: zodResolver(teamCreateSchema),
  });

  const onSubmit = async (data: TeamCreateInput) => {
    setError(null);
    setCreated(null);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error ?? "Failed to create team");
      }
      setCreated({ npc: data.npc, email: data.email, tempPassword: body.tempPassword });
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl"
    >
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-800">
        <i className="ti ti-user-plus text-slate-500" aria-hidden="true" />
        Add Team
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="npc" className="mb-1 block text-xs font-medium text-slate-600">
            NPC
          </label>
          <select
            id="npc"
            {...register("npc")}
            defaultValue=""
            className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          >
            <option value="" disabled>
              Select NPC
            </option>
            {NPC_OPTIONS.map((npc) => (
              <option key={npc} value={npc}>
                {npc}
              </option>
            ))}
          </select>
          {errors.npc && <p className="mt-1 text-xs text-red-500">{errors.npc.message}</p>}
        </div>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-600">
            Team Doctor Name
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
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs font-medium text-slate-600">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="text"
            {...register("phone")}
            className="w-full rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm text-slate-800 focus:border-brand-cyan/60 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      {created && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Team account created for {created.npc}. Email delivery was also attempted, but may not
            be configured &mdash; share these credentials yourself if needed.
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/80">
            This password is shown once and can&apos;t be retrieved later &mdash; copy it now.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-700">
            <span className="rounded-md bg-white px-2 py-1">
              Email: <strong>{created.email}</strong>
            </span>
            <span className="rounded-md bg-white px-2 py-1">
              Password: <strong>{created.tempPassword}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md bg-[#185FA5] px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:opacity-90"
            >
              <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} aria-hidden="true" />
              {copied ? "Copied" : "Copy Password"}
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Team Account"}
      </button>
    </form>
  );
}
