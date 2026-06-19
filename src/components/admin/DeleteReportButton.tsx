"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function DeleteReportButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete report");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      alert("Failed to delete report. Please try again.");
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Delete Report
      </button>

      <ConfirmDialog
        open={open}
        title="Delete report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
