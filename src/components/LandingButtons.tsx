"use client";

import Link from "next/link";

export default function LandingButtons() {
  return (
    <div className="mt-8 flex flex-col gap-3">
      <Link
        href="/portal/login"
        className="rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_-5px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90"
      >
        Team Login
      </Link>
      <Link
        href="/admin/login"
        className="rounded-lg border border-slate-200 bg-white/70 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-opacity hover:bg-white"
      >
        Admin Login
      </Link>
    </div>
  );
}
