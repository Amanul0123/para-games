"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { href: "/admin/reports", icon: "ti-file-report", label: "Reports" },
  { href: "/admin/athletes", icon: "ti-users", label: "Athletes" },
  { href: "/admin/analytics", icon: "ti-chart-bar", label: "Analytics" },
  { href: "/admin/settings", icon: "ti-settings", label: "Settings" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/60 bg-white/70 px-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <Link href="/admin/dashboard" className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]">
          <Image
            src="/Asian Paralympic Committee Emblem_PNG.png"
            alt="Asian Paralympic Committee"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
        </div>
        <div className="text-sm font-medium leading-tight text-slate-800">
          APC Medical Portal
          <span className="block text-[11px] font-normal text-brand-red/80">
            Aichi Nagoya 2026
          </span>
        </div>
      </Link>

      <div className="hidden items-center gap-1 md:flex">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-orange-500 text-xs font-medium text-white shadow-[0_4px_10px_rgba(224,58,24,0.35)]">
          AD
        </div>
        <LogoutButton variant="navbar" />
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
        active
          ? "bg-brand-red text-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]"
          : "text-slate-500 hover:bg-slate-900/5 hover:text-slate-800"
      }`}
    >
      <i className={`ti ${icon} text-[15px]`} aria-hidden="true" />
      {label}
    </Link>
  );
}
