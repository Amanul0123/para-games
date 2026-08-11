import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RecordFlow from "@/components/portal/RecordFlow";
import { AthleteEntry } from "@/types";

export default async function PortalRecordPage() {
  const session = await getServerSession(authOptions);
  const teamUserId = (session?.user as { id?: string } | undefined)?.id;

  const athletes = teamUserId
    ? await prisma.athlete.findMany({
        where: { teamUserId, archived: false },
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
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">My Calendar</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Record daily team size, then injuries and illnesses, for a given date
        </p>
      </div>

      <RecordFlow athletes={data} />
    </div>
  );
}
