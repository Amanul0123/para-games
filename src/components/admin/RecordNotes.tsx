"use client";

import { useState } from "react";
import { RecordNoteEntry } from "@/types";

export default function RecordNotes({
  type,
  id,
  initialNotes,
}: {
  type: "injury" | "illness";
  id: string;
  initialNotes: RecordNoteEntry[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/records/${type}/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to add note");

      const note: RecordNoteEntry = await res.json();
      setNotes((prev) => [note, ...prev]);
      setMessage("");
    } catch {
      setError("Failed to add note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-cyan"
      >
        <i className="ti ti-notes text-[13px]" aria-hidden="true" />
        {notes.length > 0 ? `${notes.length} note${notes.length > 1 ? "s" : ""}` : "Add note"}
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50/80 p-2.5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-500 focus:border-brand-cyan/60 focus:outline-none"
          />
          {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
          <button
            type="button"
            disabled={submitting || !message.trim()}
            onClick={handleAdd}
            className="mt-1.5 rounded-md bg-[#185FA5] px-2.5 py-1 text-[11px] font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Note"}
          </button>

          <div className="mt-2 max-h-40 space-y-2 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="rounded-md bg-white px-2.5 py-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-medium text-slate-600">{note.author}</span>
                  <span>{new Date(note.createdAt).toLocaleString("en-US")}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-700">{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
