import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSettingsSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

function parseDate(value?: string) {
  if (!value) return null;
  return new Date(`${value}T00:00:00.000Z`);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = eventSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = {
    eventName: parsed.data.eventName,
    organizationName: parsed.data.organizationName,
    startDate: parseDate(parsed.data.startDate),
    endDate: parseDate(parsed.data.endDate),
    logoUrl: parsed.data.logoUrl || null,
  };

  await prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json({ success: true });
}
