import { DashboardStats } from "@/types";

interface StatsGridProps {
  stats: DashboardStats;
}

const TOTAL_NPCS = 42;

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      icon: "ti-file-report",
      value: stats.totalSubmissions,
      label: "Total Submissions",
      glow: "from-brand-red/40 to-orange-500/10",
      iconColor: "text-brand-red",
    },
    {
      icon: "ti-run",
      value: stats.totalInjuries,
      label: "Total Injuries",
      glow: "from-blue-400/30 to-cyan-300/10",
      iconColor: "text-blue-500",
    },
    {
      icon: "ti-virus",
      value: stats.totalIllnesses,
      label: "Total Illnesses",
      glow: "from-amber-400/30 to-yellow-300/10",
      iconColor: "text-amber-500",
    },
    {
      icon: "ti-flag",
      value: stats.npcsReporting,
      label: `NPCs Reporting (of ${TOTAL_NPCS})`,
      glow: "from-green-400/30 to-emerald-300/10",
      iconColor: "text-green-500",
    },
  ];

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl"
        >
          <div
            className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.glow} blur-2xl`}
            aria-hidden="true"
          />
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-white/80 bg-white shadow-sm">
              <i className={`ti ${card.icon} text-xl ${card.iconColor}`} aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-medium leading-none text-slate-800">{card.value}</div>
              <div className="mt-1 text-xs text-slate-500">{card.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
