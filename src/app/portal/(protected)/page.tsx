import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PortalHomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const mustResetPassword = (session?.user as { mustResetPassword?: boolean } | undefined)
    ?.mustResetPassword;

  const team = userId ? await prisma.teamUser.findUnique({ where: { id: userId } }) : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-slate-200/70 px-5 py-3">
          <i className="ti ti-home text-slate-500" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-800">Home Page</span>
        </div>
        <div className="space-y-4 px-5 py-5 text-sm text-slate-700">
          <p className="font-medium text-slate-800">Welcome {team?.name ?? "Team Doctor"}</p>

          {mustResetPassword && (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              <i className="ti ti-alert-triangle mt-0.5 flex-shrink-0" aria-hidden="true" />
              You&apos;re using a temporary password. Please{" "}
              <a href="/portal/profile" className="font-medium underline">
                set a new password
              </a>{" "}
              in My Profile.
            </p>
          )}

          <ol className="list-decimal space-y-3 pl-5">
            <li>
              Go to <strong>My Athletes</strong> to add athletes to your roster (name +
              accreditation number) before you start recording.
            </li>
            <li>
              Go to <strong>My Calendar</strong> to record each day. For each day, the{" "}
              <strong>Daily Team Size</strong> must be submitted first &mdash; tick which
              athletes were part of the team that day &mdash; before you can log an injury or
              illness for that date.
            </li>
            <li>
              Once the day&apos;s team size is set, choose <strong>No Injury/Illness</strong>,{" "}
              <strong>Record Injury</strong>, or <strong>Record Illness</strong> for that date.
            </li>
            <li>
              As recovery progresses, adjust days lost under <strong>Edit Time Loss</strong>.
            </li>
            <li>
              You can export your recorded data at any time under <strong>Reports</strong>.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
