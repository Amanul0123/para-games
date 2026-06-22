import { BodyZoneStat } from "@/types";

interface BodyMapProps {
  zones: BodyZoneStat[];
}

const ZONE_COLORS: Record<string, string> = {
  "Upper limb": "#E03A18",
  "Lower limb": "#BA7517",
  "Spine / trunk": "#185FA5",
  "Head / neck": "#533AB7",
};

function getZone(zones: BodyZoneStat[], zone: string): BodyZoneStat {
  return zones.find((z) => z.zone === zone) ?? { zone, count: 0, percent: 0 };
}

function opacityFor(percent: number) {
  if (percent <= 0) return 0.08;
  return 0.3 + (percent / 100) * 0.7;
}

export default function BodyMap({ zones }: BodyMapProps) {
  const headNeck = getZone(zones, "Head / neck");
  const upperLimb = getZone(zones, "Upper limb");
  const spineTrunk = getZone(zones, "Spine / trunk");
  const lowerLimb = getZone(zones, "Lower limb");

  return (
    <svg viewBox="0 0 200 320" className="h-72 w-auto">
      {/* head */}
      <circle
        cx="100"
        cy="32"
        r="22"
        fill={ZONE_COLORS["Head / neck"]}
        opacity={opacityFor(headNeck.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Head / neck: ${headNeck.count} injuries`}</title>
      </circle>
      {/* neck */}
      <rect
        x="90"
        y="52"
        width="20"
        height="14"
        rx="4"
        fill={ZONE_COLORS["Head / neck"]}
        opacity={opacityFor(headNeck.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Head / neck: ${headNeck.count} injuries`}</title>
      </rect>

      {/* torso */}
      <rect
        x="62"
        y="64"
        width="76"
        height="120"
        rx="24"
        fill={ZONE_COLORS["Spine / trunk"]}
        opacity={opacityFor(spineTrunk.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Spine / trunk: ${spineTrunk.count} injuries`}</title>
      </rect>

      {/* left arm */}
      <rect
        x="28"
        y="70"
        width="26"
        height="110"
        rx="13"
        fill={ZONE_COLORS["Upper limb"]}
        opacity={opacityFor(upperLimb.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Upper limb: ${upperLimb.count} injuries`}</title>
      </rect>
      {/* right arm */}
      <rect
        x="146"
        y="70"
        width="26"
        height="110"
        rx="13"
        fill={ZONE_COLORS["Upper limb"]}
        opacity={opacityFor(upperLimb.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Upper limb: ${upperLimb.count} injuries`}</title>
      </rect>

      {/* left leg */}
      <rect
        x="68"
        y="188"
        width="28"
        height="120"
        rx="14"
        fill={ZONE_COLORS["Lower limb"]}
        opacity={opacityFor(lowerLimb.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Lower limb: ${lowerLimb.count} injuries`}</title>
      </rect>
      {/* right leg */}
      <rect
        x="104"
        y="188"
        width="28"
        height="120"
        rx="14"
        fill={ZONE_COLORS["Lower limb"]}
        opacity={opacityFor(lowerLimb.percent)}
        stroke="#fff"
        strokeWidth="1.5"
      >
        <title>{`Lower limb: ${lowerLimb.count} injuries`}</title>
      </rect>

      {/* count labels */}
      {headNeck.count > 0 && (
        <text x="100" y="37" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
          {headNeck.count}
        </text>
      )}
      {spineTrunk.count > 0 && (
        <text x="100" y="128" textAnchor="middle" fontSize="16" fontWeight="600" fill="#fff">
          {spineTrunk.count}
        </text>
      )}
      {upperLimb.count > 0 && (
        <>
          <text x="41" y="128" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
            {upperLimb.count}
          </text>
          <text x="159" y="128" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
            {upperLimb.count}
          </text>
        </>
      )}
      {lowerLimb.count > 0 && (
        <>
          <text x="82" y="252" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
            {lowerLimb.count}
          </text>
          <text x="118" y="252" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
            {lowerLimb.count}
          </text>
        </>
      )}
    </svg>
  );
}
