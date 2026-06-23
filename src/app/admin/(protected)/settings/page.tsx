import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Settings</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Manage your admin account</p>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <h2 className="mb-3 text-sm font-medium text-slate-800">Profile</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">Name</dt>
            <dd className="text-slate-800">{session?.user?.name ?? "Admin"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Email</dt>
            <dd className="text-slate-800">{session?.user?.email}</dd>
          </div>
        </dl>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <h2 className="mb-3 text-sm font-medium text-slate-800">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
