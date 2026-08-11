import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeLossSchema } from "@/lib/validations";

async function requireTeam() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session || user?.role !== "team" || !user.id) return null;
  return user.id;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, id } = await params;
  if (type !== "injury" && type !== "illness") {
    return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = timeLossSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = { editedDaysLost: parsed.data.editedDaysLost, timeLossStatus: "edited" as const };

  if (type === "injury") {
    const injury = await prisma.injury.findFirst({ where: { id, teamUserId } });
    if (!injury) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.injury.update({ where: { id }, data });
  } else {
    const illness = await prisma.illness.findFirst({ where: { id, teamUserId } });
    if (!illness) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.illness.update({ where: { id }, data });
  }

  return NextResponse.json({ ok: true });
}
