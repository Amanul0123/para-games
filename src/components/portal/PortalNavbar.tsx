"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import BrandLogo from "@/components/BrandLogo";

const NAV_ITEMS = [
  { href: "/portal", icon: "ti-home", label: "Home" },
  { href: "/portal/athletes", icon: "ti-users", label: "My Athletes" },
  { href: "/portal/record", icon: "ti-calendar", label: "My Calendar" },
  { href: "/portal/recorded", icon: "ti-list", label: "Recorded Data" },
  { href: "/portal/time-loss", icon: "ti-clock-edit", label: "Edit Time Loss" },
  { href: "/portal/reports", icon: "ti-file-report", label: "Reports" },
  { href: "/portal/codes", icon: "ti-list-numbers", label: "Codes Reference" },
  { href: "/portal/profile", icon: "ti-user", label: "My Profile" },
];

export default function PortalNavbar({
  npc,
  logoUrl,
  eventName = "Injuries and Illness",
}: {
  npc?: string;
  logoUrl?: string | null;
  eventName?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/60 bg-white/70 px-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <Link href="/portal" className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]">
          <BrandLogo logoUrl={logoUrl} alt={eventName} size={36} className="h-9 w-9 object-contain" />
        </div>
        <div className="text-sm font-medium leading-tight text-slate-800">
          Injuries and Illness
          <span className="block text-[11px] font-normal text-brand-red/80">{npc ?? "Team"}</span>
        </div>
      </Link>

      <div className="hidden items-center gap-1 xl:flex">
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
        <LogoutButton variant="navbar" callbackUrl="/portal/login" />
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
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] transition-colors ${
        active
          ? "bg-brand-red text-white shadow-[0_4px_12px_rgba(224,58,24,0.4)]"
          : "text-slate-500 hover:bg-slate-900/5 hover:text-slate-800"
      }`}
    >
      <i className={`ti ${icon} text-[14px]`} aria-hidden="true" />
      {label}
    </Link>
  );
}
