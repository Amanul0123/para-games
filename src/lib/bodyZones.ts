export type BodyZone = "Upper limb" | "Lower limb" | "Spine / trunk" | "Head / neck" | "Other";

const ZONE_KEYWORDS: Record<Exclude<BodyZone, "Other">, string[]> = {
  "Upper limb": ["wrist", "shoulder", "elbow", "arm", "hand", "finger", "forearm", "bicep", "tricep"],
  "Lower limb": ["ankle", "knee", "leg", "foot", "thigh", "hip", "toe", "calf", "hamstring", "quad"],
  "Spine / trunk": ["back", "spine", "trunk", "chest", "abdomen", "rib", "torso", "core"],
  "Head / neck": ["head", "neck", "face", "skull", "concussion", "jaw", "eye"],
};

export function classifyBodyZone(bodyPart: string): BodyZone {
  const text = bodyPart.toLowerCase();
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS) as [
    Exclude<BodyZone, "Other">,
    string[],
  ][]) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return zone;
    }
  }
  return "Other";
}
