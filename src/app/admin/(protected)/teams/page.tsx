import { prisma } from "@/lib/prisma";
import TeamsTable from "@/components/admin/TeamsTable";
import AddTeamForm from "@/components/admin/AddTeamForm";
import { TeamSummary } from "@/types";

export default async function AdminTeamsPage() {
  const teams = await prisma.teamUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { athletes: true, injuries: true, illnesses: true } } },
  });

  const data: TeamSummary[] = teams.map((team) => ({
    id: team.id,
    npc: team.npc,
    name: team.name,
    email: team.email,
    phone: team.phone,
    athleteCount: team._count.athletes,
    injuryCount: team._count.injuries,
    illnessCount: team._count.illnesses,
    createdAt: team.createdAt.toISOString(),
  }));

  const npcOptions = [...new Set(teams.map((t) => t.npc))].sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Teams</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          NPC team accounts and their recorded injury/illness data
        </p>
      </div>

      <AddTeamForm />
      <TeamsTable teams={data} npcOptions={npcOptions} />
    </div>
  );
}
