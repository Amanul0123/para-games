"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LoginSubtitle({
  eventName,
  variant,
}: {
  eventName: string;
  variant: "admin" | "team";
}) {
  const { t } = useLanguage();
  return (
    <p className="mt-1 text-center text-xs text-slate-500">
      {eventName} &mdash; {t(variant === "admin" ? "login.adminTitle" : "login.teamTitle")}
    </p>
  );
}
