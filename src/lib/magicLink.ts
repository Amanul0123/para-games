import crypto from "crypto";

const SECRET = process.env.REPORT_LINK_SECRET || process.env.NEXTAUTH_SECRET || "";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

interface LinkPayload {
  id: string;
  email: string;
  exp: number;
}

function sign(payloadB64: string) {
  return crypto.createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function signReportLink(id: string, email: string, ttlMs = DEFAULT_TTL_MS): string {
  const payload: LinkPayload = { id, email, exp: Date.now() + ttlMs };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifyReportLink(token: string): { id: string; email: string } | null {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature || !safeEqual(signature, sign(payloadB64))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString()) as LinkPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (typeof payload.id !== "string" || typeof payload.email !== "string") return null;
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}
