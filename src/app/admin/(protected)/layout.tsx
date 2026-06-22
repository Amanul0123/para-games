import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      <div
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50"
        suppressHydrationWarning
      >
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-red/20 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-cyan/25 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-300/25 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <AdminNavbar />
          {children}
        </div>
      </div>
    </>
  );
}
