import BrandLogo from "@/components/BrandLogo";
import LandingButtons from "@/components/LandingButtons";
import { getEventSettings } from "@/lib/eventSettings";

export default async function HomePage() {
  const { eventName, logoUrl } = await getEventSettings();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#e2264a]/25 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-brand-cyan/30 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(224,58,24,0.5)]">
          <BrandLogo logoUrl={logoUrl} alt={eventName} />
        </div>
        <h1 className="text-lg font-semibold text-slate-800">Injuries and Illness</h1>
        <p className="mt-1 text-sm text-slate-500">{eventName}</p>

        <LandingButtons />
      </div>
    </div>
  );
}
