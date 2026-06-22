"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import { useFormContext } from "@/context/FormContext";
import { getNpcFlag } from "@/lib/npcFlags";

export default function Step4Page() {
  const router = useRouter();
  const { formData, resetForm, saveAndResumeLater } = useFormContext();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: formData.step1,
          injuries: formData.step2.injuries,
          illnesses: formData.step2.illnesses,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ? JSON.stringify(body.error) : "Failed to submit report");
      }

      const { id } = await res.json();
      resetForm();
      router.push(`/form/success?id=${id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your report. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ProgressBar step={4} />

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <i className="ti ti-clipboard-check text-xl text-brand-cyan" aria-hidden="true" />
          <h3 className="font-semibold text-slate-800">Review &amp; Submit</h3>
        </div>

        <section className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <h4 className="mb-3 flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="ti ti-user text-slate-400" aria-hidden="true" />
            Reporter Information
          </h4>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-400">NPC</dt>
              <dd className="text-slate-800">
                {getNpcFlag(formData.step1.npc)} {formData.step1.npc}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Reported By</dt>
              <dd className="text-slate-800">{formData.step1.reportedBy}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Date of Report</dt>
              <dd className="text-slate-800">{formData.step1.dateOfReport}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Email</dt>
              <dd className="text-slate-800">{formData.step1.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Phone</dt>
              <dd className="text-slate-800">{formData.step1.phone}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <h4 className="mb-2 flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="ti ti-bandage text-brand-red" aria-hidden="true" />
            Injuries ({formData.step2.injuries.length})
          </h4>
          <p className="text-sm text-slate-500">
            {formData.step2.injuries.length} injury record(s) will be submitted.
          </p>
        </section>

        <section className="rounded-xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <h4 className="mb-2 flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="ti ti-virus text-amber-500" aria-hidden="true" />
            Illnesses ({formData.step2.illnesses.length})
          </h4>
          <p className="text-sm text-slate-500">
            {formData.step2.illnesses.length} illness record(s) will be submitted.
          </p>
        </section>

        {error && (
          <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <i className="ti ti-alert-circle mt-0.5 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/form/step3")}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90"
          >
            <i className="ti ti-arrow-left" aria-hidden="true" />
            PREVIOUS
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "SUBMIT"}
            {!submitting && <i className="ti ti-send" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={saveAndResumeLater}
            className="flex items-center gap-1.5 text-sm text-link-teal hover:underline"
          >
            <i className="ti ti-clock-pause" aria-hidden="true" />
            Save and Resume Later
          </button>
        </div>
      </div>
    </div>
  );
}
