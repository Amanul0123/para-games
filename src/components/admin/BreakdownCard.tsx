interface BreakdownItem {
  label: string;
  count: number;
  percent: number;
}

interface BreakdownCardProps {
  title: string;
  icon: string;
  items: BreakdownItem[];
  barColor: string;
  emptyMessage: string;
}

export default function BreakdownCard({
  title,
  icon,
  items,
  barColor,
  emptyMessage,
}: BreakdownCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className={`ti ${icon} text-slate-500`} aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">{title}</span>
      </div>
      <div className="space-y-2 p-4">
        {items.length === 0 && <p className="text-xs text-slate-500">{emptyMessage}</p>}
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-md bg-slate-50/80 px-3 py-2">
            <span className="flex-1 truncate text-xs text-slate-600">{item.label}</span>
            <div className="h-1 w-20 rounded-full bg-slate-200">
              <div
                className="h-1 rounded-full"
                style={{ width: `${item.percent}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="w-5 text-right text-[11px] font-medium text-slate-800">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
