import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { athleteSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamUserId } = await params;

  const team = await prisma.teamUser.findUnique({ where: { id: teamUserId } });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = athleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.athlete.findUnique({
    where: { teamUserId_accreditationNo: { teamUserId, accreditationNo: parsed.data.accreditationNo } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An athlete with that accreditation number already exists on this team" },
      { status: 409 },
    );
  }

  const athlete = await prisma.athlete.create({
    data: {
      teamUserId,
      name: parsed.data.name,
      accreditationNo: parsed.data.accreditationNo,
      sport: parsed.data.sport,
    },
  });

  return NextResponse.json(
    {
      id: athlete.id,
      name: athlete.name,
      accreditationNo: athlete.accreditationNo,
      sport: athlete.sport,
      archived: athlete.archived,
    },
    { status: 201 },
  );
}
