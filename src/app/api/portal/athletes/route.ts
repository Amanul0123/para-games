import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
