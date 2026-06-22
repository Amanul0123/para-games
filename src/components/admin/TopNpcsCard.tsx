import { NpcStat } from "@/types";

interface TopNpcsCardProps {
  npcs: NpcStat[];
}

export default function TopNpcsCard({ npcs }: TopNpcsCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className="ti ti-flag text-slate-400" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">Top NPCs</span>
      </div>
      <div className="p-4">
        {npcs.length === 0 && (
          <p className="text-xs text-slate-400">No submissions yet.</p>
        )}
        {npcs.map((npc) => (
          <div
            key={npc.npc}
            className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0"
          >
            <span className="text-[13px] text-slate-700">{npc.npc}</span>
            <div className="mx-3 h-1 flex-1 rounded-full bg-slate-200">
              <div
                className="h-1 rounded-full bg-brand-red"
                style={{ width: `${npc.percent}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{npc.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
