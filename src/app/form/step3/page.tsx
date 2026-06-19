"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import { useFormContext } from "@/context/FormContext";
import { InjuryEntry, IllnessEntry } from "@/types";

const isInjuryFilled = (injury: InjuryEntry) =>
  Boolean(
    injury.accreditationNo.trim() ||
      injury.sportEvent.trim() ||
      injury.injuryDate.trim() ||
      injury.bodyPart.trim() ||
      injury.injuryType.trim(),
  );

const isIllnessFilled = (illness: IllnessEntry) =>
  Boolean(
    illness.accreditationNo.trim() ||
      illness.sportEvent.trim() ||
      illness.occurredOn.trim() ||
      illness.diagnosis.trim(),
  );

export default function Step3Page() {
  const router = useRouter();
  const { formData, saveAndResumeLater, resetForm } = useFormContext();
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
          injuries: formData.step2.injuries.filter(isInjuryFilled),
          illnesses: formData.step2.illnesses.filter(isIllnessFilled),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ? JSON.stringify(body.error) : "Failed to submit report");
      }

      resetForm();
      router.push("/form/success");
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
      <ProgressBar step={3} />

      <div className="space-y-6">
        <h3 className="font-bold text-text-dark">Review & Submit</h3>

        <section className="rounded-md border border-border-gray p-4">
          <h4 className="mb-2 font-semibold text-text-dark">Reporter Information</h4>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-gray-500">NPC</dt>
              <dd>{formData.step1.npc}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Reported By</dt>
              <dd>{formData.step1.reportedBy}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Date of Report</dt>
              <dd>{formData.step1.dateOfReport}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Email</dt>
              <dd>{formData.step1.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Phone</dt>
              <dd>{formData.step1.phone}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-border-gray p-4">
          <h4 className="mb-2 font-semibold text-text-dark">
            Injuries ({formData.step2.injuries.length})
          </h4>
          <p className="text-sm text-gray-600">
            {formData.step2.injuries.length} injury record(s) will be submitted.
          </p>
        </section>

        <section className="rounded-md border border-border-gray p-4">
          <h4 className="mb-2 font-semibold text-text-dark">
            Illnesses ({formData.step2.illnesses.length})
          </h4>
          <p className="text-sm text-gray-600">
            {formData.step2.illnesses.length} illness record(s) will be submitted.
          </p>
        </section>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/form/step2")}
            className="rounded-md bg-brand-cyan px-6 py-2 font-medium text-white hover:opacity-90"
          >
            PREVIOUS
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="rounded-md bg-brand-cyan px-6 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "SUBMIT"}
          </button>
          <button
            type="button"
            onClick={saveAndResumeLater}
            className="text-sm text-link-teal hover:underline"
          >
            Save and Resume Later
          </button>
        </div>
      </div>
    </div>
  );
}
