import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") return null;
  return session;
}

function parseDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  if (!dateParam) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  const date = parseDate(dateParam);

  const [teams, teamDays, injuries, illnesses] = await Promise.all([
    prisma.teamUser.findMany({ orderBy: { npc: "asc" } }),
    prisma.teamDay.findMany({ where: { date }, include: { athletes: true } }),
    prisma.injury.findMany({ where: { injuryDate: date } }),
    prisma.illness.findMany({ where: { occurredOn: date } }),
  ]);

  const teamDayByTeamId = new Map(teamDays.map((d) => [d.teamUserId, d]));

  const countBy = (rows: { teamUserId: string }[]) => {
    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.teamUserId, (map.get(row.teamUserId) ?? 0) + 1);
    }
    return map;
  };
  const injuryCountByTeam = countBy(injuries);
  const illnessCountByTeam = countBy(illnesses);

  const rows = teams.map((team) => {
    const day = teamDayByTeamId.get(team.id);
    return {
      teamId: team.id,
      npc: team.npc,
      doctorName: team.name,
      teamSizeRecorded: !!day,
      athleteCount: day?.athletes.length ?? 0,
      noIncidentReported: day?.noIncidentReported ?? false,
      injuryCount: injuryCountByTeam.get(team.id) ?? 0,
      illnessCount: illnessCountByTeam.get(team.id) ?? 0,
    };
  });

  return NextResponse.json(rows);
}
