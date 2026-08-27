"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  variant?: "default" | "navbar" | "sidebar";
  callbackUrl?: string;
  compact?: boolean;
}

export default function LogoutButton({
  variant = "default",
  callbackUrl = "/admin/login",
  compact = false,
}: LogoutButtonProps) {
  if (variant === "navbar") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl })}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
      >
        <i className="ti ti-logout" aria-hidden="true" />
        Logout
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl })}
        title={compact ? "Logout" : undefined}
        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 ${
          compact ? "justify-center" : ""
        }`}
      >
        <i className="ti ti-logout shrink-0 text-[16px]" aria-hidden="true" />
        {!compact && "Logout"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className="rounded-md border border-border-gray px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
    >
      Logout
    </button>
  );
}
