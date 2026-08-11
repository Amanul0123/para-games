"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "logged", label: "Logged" },
  { value: "under_review", label: "Under Review" },
  { value: "resolved", label: "Resolved" },
];

export default function RecordStatusPanel({
  type,
  id,
  initialStatus,
}: {
  type: "injury" | "illness";
  id: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: string) => {
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${type}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch {
      setStatus(initialStatus);
      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      aria-label="Record status"
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-white/70 bg-white/60 px-2.5 py-1 text-xs text-slate-700 shadow-sm backdrop-blur-xl focus:border-brand-cyan/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
