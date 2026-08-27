import DailyReportsView from "@/components/admin/DailyReportsView";

export default function AdminDailyReportsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-slate-800">Daily Reports</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          See every team&apos;s reporting status for a given date, at a glance
        </p>
      </div>

      <DailyReportsView />
    </div>
  );
}
