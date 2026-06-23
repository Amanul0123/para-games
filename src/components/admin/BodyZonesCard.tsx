import { BodyZoneStat } from "@/types";
import BodyMap from "@/components/admin/BodyMap";

interface BodyZonesCardProps {
  zones: BodyZoneStat[];
}

const ZONE_COLORS: Record<string, string> = {
  "Upper limb": "#E03A18",
  "Lower limb": "#BA7517",
  "Spine / trunk": "#185FA5",
  "Head / neck": "#533AB7",
  Other: "#6B7280",
};

export default function BodyZonesCard({ zones }: BodyZonesCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className="ti ti-body-scan text-slate-500" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">Injury zones</span>
      </div>
      {zones.length > 0 && (
        <div className="flex justify-center border-b border-slate-200/70 py-3">
          <BodyMap zones={zones} />
        </div>
      )}
      <div className="space-y-2 p-4">
        {zones.length === 0 && (
          <p className="text-xs text-slate-500">No injuries reported yet.</p>
        )}
        {zones.map((zone) => (
          <div
            key={zone.zone}
            className="flex items-center gap-2 rounded-md bg-slate-50/80 px-3 py-2"
          >
            <span className="flex-1 text-xs text-slate-600">{zone.zone}</span>
            <div className="h-1 w-16 rounded-full bg-slate-200">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${zone.percent}%`,
                  backgroundColor: ZONE_COLORS[zone.zone] ?? "#6B7280",
                }}
              />
            </div>
            <span className="w-5 text-right text-[11px] font-medium text-slate-800">
              {zone.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
