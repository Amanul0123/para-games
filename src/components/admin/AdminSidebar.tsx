"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import BrandLogo from "@/components/BrandLogo";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { href: "/admin/teams", icon: "ti-flag", label: "Teams" },
  { href: "/admin/reports", icon: "ti-calendar-stats", label: "Daily Reports" },
  { href: "/admin/athletes", icon: "ti-users", label: "Athletes" },
  { href: "/admin/analytics", icon: "ti-chart-bar", label: "Analytics" },
  { href: "/admin/settings", icon: "ti-settings", label: "Settings" },
];

export default function AdminSidebar({
  eventName = "Aichi Nagoya 2026",
  logoUrl,
}: {
  eventName?: string;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const brand = (compact: boolean) => (
    <Link href="/admin/dashboard" className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]">
        <BrandLogo logoUrl={logoUrl} alt={eventName} size={32} className="h-8 w-8 object-contain" />
      </div>
      {!compact && (
        <div className="text-sm font-medium leading-tight text-white">
          Injuries and Illness
          <span className="block text-[11px] font-normal text-brand-red/90">{eventName}</span>
        </div>
      )}
    </Link>
  );

  const nav = (compact: boolean, onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={compact ? item.label : undefined}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors ${
              active
                ? "bg-brand-red text-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            } ${compact ? "justify-center" : ""}`}
          >
            <i className={`ti ${item.icon} shrink-0 text-[16px]`} aria-hidden="true" />
            {!compact && item.label}
          </Link>
        );
      })}
    </nav>
  );

  const adminBadge = (compact: boolean) => (
    <div className={`flex items-center gap-2.5 px-3 py-2 ${compact ? "justify-center" : ""}`}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-orange-500 text-[11px] font-medium text-white shadow-[0_4px_10px_rgba(224,58,24,0.35)]">
        AD
      </div>
      {!compact && <span className="text-[13px] text-slate-300">Admin</span>}
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-slate-900 px-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-slate-300 hover:text-white"
        >
          <i className="ti ti-menu-2 text-xl" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
            <BrandLogo logoUrl={logoUrl} alt={eventName} size={22} className="h-5 w-5 object-contain" />
          </div>
          <span className="text-sm font-medium text-white">Injuries and Illness</span>
        </div>
        <LogoutButton variant="sidebar" compact />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-64 flex-col bg-slate-900">
            {brand(false)}
            {nav(false, () => setMobileOpen(false))}
            <div className="border-t border-white/10 p-2">
              {adminBadge(false)}
              <LogoutButton variant="sidebar" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-slate-900 transition-[width] duration-150 md:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {brand(collapsed)}
        {nav(collapsed)}
        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mb-1 flex w-full items-center justify-center rounded-md py-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <i className={`ti ${collapsed ? "ti-chevron-right" : "ti-chevron-left"}`} aria-hidden="true" />
          </button>
          {adminBadge(collapsed)}
          <LogoutButton variant="sidebar" compact={collapsed} />
        </div>
      </div>
    </>
  );
}
