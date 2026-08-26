import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { athleteSchema } from "@/lib/validations";

async function requireTeam() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session || user?.role !== "team" || !user.id) return null;
  return user.id;
}

function serialize(a: { id: string; name: string; accreditationNo: string; sport: string | null; archived: boolean }) {
  return {
    id: a.id,
    name: a.name,
    accreditationNo: a.accreditationNo,
    sport: a.sport,
    archived: a.archived,
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.athlete.findFirst({ where: { id, teamUserId } });
  if (!existing) {
    return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
  }

  const body = await request.json();

  if (typeof body.archived === "boolean" && Object.keys(body).length === 1) {
    const updated = await prisma.athlete.update({
      where: { id },
      data: { archived: body.archived },
    });
    return NextResponse.json(serialize(updated));
  }

  const parsed = athleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.accreditationNo !== existing.accreditationNo) {
    const clash = await prisma.athlete.findUnique({
      where: { teamUserId_accreditationNo: { teamUserId, accreditationNo: parsed.data.accreditationNo } },
    });
    if (clash) {
      return NextResponse.json(
        { error: "An athlete with that accreditation number already exists" },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.athlete.update({
    where: { id },
    data: {
      name: parsed.data.name,
      accreditationNo: parsed.data.accreditationNo,
      sport: parsed.data.sport,
    },
  });

  return NextResponse.json(serialize(updated));
}
