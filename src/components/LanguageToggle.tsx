"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LOCALES } from "@/lib/i18n/dictionary";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`flex items-center gap-0.5 rounded-md border border-slate-200 bg-white/70 p-0.5 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
            locale === l.code
              ? "bg-brand-cyan text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
