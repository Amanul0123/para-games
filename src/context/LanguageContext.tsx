"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale, LOCALES, translate } from "@/lib/i18n/dictionary";

const STORAGE_KEY = "para_games_locale";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: Parameters<typeof translate>[1]) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "ar") {
      // Hydrating from localStorage after mount (rather than in the lazy useState
      // initializer) avoids a server/client hydration mismatch, since the server
      // has no access to the browser's stored preference.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
    }
  }, []);

  const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LanguageContext.Provider
      value={{ locale, dir, setLocale, t: (key) => translate(locale, key) }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
