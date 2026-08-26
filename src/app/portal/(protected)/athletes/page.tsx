import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AthletesPanel from "@/components/portal/AthletesPanel";
import { AthleteEntry } from "@/types";

export default async function PortalAthletesPage() {
  const session = await getServerSession(authOptions);
  const teamUserId = (session?.user as { id?: string } | undefined)?.id;

  const athletes = teamUserId
    ? await prisma.athlete.findMany({
        where: { teamUserId },
        orderBy: { name: "asc" },
      })
    : [];

  const data: AthleteEntry[] = athletes.map((a) => ({
    id: a.id,
    name: a.name,
    accreditationNo: a.accreditationNo,
    sport: a.sport,
    archived: a.archived,
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">My Athletes</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Your team&apos;s athlete roster, used when recording daily team size and injuries/illnesses
        </p>
      </div>

      <AthletesPanel initialAthletes={data} />
    </div>
  );
}
