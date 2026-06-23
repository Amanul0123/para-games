"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  variant?: "default" | "navbar";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  if (variant === "navbar") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
      >
        <i className="ti ti-logout" aria-hidden="true" />
        Logout
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-md border border-border-gray px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
    >
      Logout
    </button>
  );
}
