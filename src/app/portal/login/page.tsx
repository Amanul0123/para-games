import BrandLogo from "@/components/BrandLogo";
import PortalLoginForm from "@/components/portal/PortalLoginForm";
import LoginSubtitle from "@/components/LoginSubtitle";
import LanguageToggle from "@/components/LanguageToggle";
import { getEventSettings } from "@/lib/eventSettings";

export const dynamic = "force-dynamic";

export default async function PortalLoginPage() {
  const { eventName, logoUrl } = await getEventSettings();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-red/25 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-brand-cyan/30 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-orange-300/30 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.9),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-3 flex justify-end">
            <LanguageToggle />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.25)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex flex-col items-center px-8 pt-10 pb-2">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(224,58,24,0.5)]">
                <BrandLogo logoUrl={logoUrl} alt={eventName} />
              </div>
              <h1 className="text-center text-lg font-semibold text-slate-800">
                APC Medical Portal
              </h1>
              <LoginSubtitle eventName={eventName} variant="team" />
            </div>

            <PortalLoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Asian Paralympic Committee
          </p>
        </div>
      </div>
    </>
  );
}
