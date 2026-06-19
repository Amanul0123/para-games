"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReportButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this report? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete report");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      alert("Failed to delete report. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Report"}
    </button>
  );
}
