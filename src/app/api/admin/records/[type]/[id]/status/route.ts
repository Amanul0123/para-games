import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordStatusSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, id } = await params;
  if (type !== "injury" && type !== "illness") {
    return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = recordStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (type === "injury") {
    await prisma.injury.update({ where: { id }, data: { status: parsed.data.status } });
  } else {
    await prisma.illness.update({ where: { id }, data: { status: parsed.data.status } });
  }

  return NextResponse.json({ ok: true });
}
