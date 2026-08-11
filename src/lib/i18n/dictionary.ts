export type Locale = "en" | "ar";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ar", label: "AR", dir: "rtl" },
];

type DictKey =
  | "brand.portalName"
  | "nav.dashboard"
  | "nav.teams"
  | "nav.athletes"
  | "nav.analytics"
  | "nav.settings"
  | "nav.home"
  | "nav.myAthletes"
  | "nav.myCalendar"
  | "nav.recordedData"
  | "nav.editTimeLoss"
  | "nav.reports"
  | "nav.myProfile"
  | "common.logout"
  | "login.email"
  | "login.password"
  | "login.button"
  | "login.loggingIn"
  | "login.adminTitle"
  | "login.teamTitle"
  | "login.invalidCredentials"
  | "landing.teamLogin"
  | "landing.adminLogin"
  | "portal.welcome";

export const DICTIONARY: Record<DictKey, Record<Locale, string>> = {
  "brand.portalName": { en: "APC Medical Portal", ar: "بوابة اللجنة الطبية" },
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.teams": { en: "Teams", ar: "الفرق" },
  "nav.athletes": { en: "Athletes", ar: "الرياضيون" },
  "nav.analytics": { en: "Analytics", ar: "التحليلات" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.myAthletes": { en: "My Athletes", ar: "رياضيّو فريقي" },
  "nav.myCalendar": { en: "My Calendar", ar: "التقويم" },
  "nav.recordedData": { en: "Recorded Data", ar: "البيانات المسجّلة" },
  "nav.editTimeLoss": { en: "Edit Time Loss", ar: "تعديل مدة الغياب" },
  "nav.reports": { en: "Reports", ar: "التقارير" },
  "nav.myProfile": { en: "My Profile", ar: "الملف الشخصي" },
  "common.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "login.email": { en: "Email", ar: "البريد الإلكتروني" },
  "login.password": { en: "Password", ar: "كلمة المرور" },
  "login.button": { en: "Login", ar: "تسجيل الدخول" },
  "login.loggingIn": { en: "Logging in...", ar: "جارٍ تسجيل الدخول..." },
  "login.adminTitle": { en: "Admin Login", ar: "دخول المسؤول" },
  "login.teamTitle": { en: "Team Login", ar: "دخول الفريق" },
  "login.invalidCredentials": { en: "Invalid email or password", ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
  "landing.teamLogin": { en: "Team Login", ar: "دخول الفريق" },
  "landing.adminLogin": { en: "Admin Login", ar: "دخول المسؤول" },
  "portal.welcome": { en: "Welcome", ar: "مرحباً" },
};

export function translate(locale: Locale, key: DictKey): string {
  return DICTIONARY[key]?.[locale] ?? DICTIONARY[key]?.en ?? key;
}
