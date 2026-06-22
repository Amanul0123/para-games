"use client";

import { useState } from "react";
import { ReportNoteEntry } from "@/types";

export default function ReportNotes({
  id,
  initialNotes,
}: {
  id: string;
  initialNotes: ReportNoteEntry[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to add note");

      const note: ReportNoteEntry = await res.json();
      setNotes((prev) => [note, ...prev]);
      setMessage("");
    } catch {
      setError("Failed to add note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-fit overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className="ti ti-notes text-slate-400" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">Internal Notes</span>
      </div>

      <div className="space-y-2 p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a note for the medical team..."
          rows={3}
          className="w-full rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-cyan/60 focus:outline-none"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="button"
          disabled={submitting || !message.trim()}
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#185FA5] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          <i className="ti ti-plus" aria-hidden="true" />
          {submitting ? "Adding..." : "Add Note"}
        </button>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto border-t border-slate-200/70 px-4 py-3">
        {notes.length === 0 && (
          <p className="text-xs text-slate-400">No notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="rounded-md bg-slate-50/80 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-600">{note.author}</span>
              <span>{new Date(note.createdAt).toLocaleString("en-US")}</span>
            </div>
            <p className="mt-1 text-sm text-slate-700">{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
