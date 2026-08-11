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

export async function GET() {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const athletes = await prisma.athlete.findMany({
    where: { teamUserId, archived: false },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    athletes.map((a) => ({
      id: a.id,
      name: a.name,
      accreditationNo: a.accreditationNo,
      sport: a.sport,
      archived: a.archived,
    })),
  );
}

export async function POST(request: Request) {
  const teamUserId = await requireTeam();
  if (!teamUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      { error: "An athlete with that accreditation number already exists" },
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
