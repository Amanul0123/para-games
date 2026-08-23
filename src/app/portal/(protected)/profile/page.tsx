import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PortalProfileForm from "@/components/portal/PortalProfileForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function PortalProfilePage() {
  const session = await getServerSession(authOptions);
  const teamUserId = (session?.user as { id?: string } | undefined)?.id;
  const team = teamUserId ? await prisma.teamUser.findUnique({ where: { id: teamUserId } }) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">My Profile</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          {team?.npc} &mdash; {team?.email}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <h2 className="mb-4 text-sm font-medium text-slate-800">Details</h2>
          <PortalProfileForm name={team?.name ?? ""} phone={team?.phone} designation={team?.designation} />
        </div>

        <div className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <h2 className="mb-4 text-sm font-medium text-slate-800">Change Password</h2>
          <ChangePasswordForm endpoint="/api/portal/profile" />
        </div>
      </div>
    </div>
  );
}
