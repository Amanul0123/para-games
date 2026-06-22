"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import ExampleTable from "@/components/ExampleTable";
import IllnessForm from "@/components/IllnessForm";
import { useFormContext } from "@/context/FormContext";
import { IllnessEntry } from "@/types";

const EMPTY_ILLNESS: IllnessEntry = {
  accreditationNo: "",
  sportEvent: "",
  occurredOn: "",
  diagnosis: "",
  affectedSystem: "",
  systemCode: "",
  mainSymptoms: "",
  symptomCodes: "",
  causeOfIllness: "",
  causeCode: "",
  absenceDays: undefined,
};

const isIllnessFilled = (illness: IllnessEntry) =>
  Boolean(
    illness.accreditationNo.trim() ||
      illness.sportEvent.trim() ||
      illness.occurredOn.trim() ||
      illness.diagnosis.trim(),
  );

export default function Step3Page() {
  const router = useRouter();
  const { formData, setIllnesses: saveIllnesses, saveAndResumeLater } = useFormContext();

  const [illnesses, setIllnesses] = useState<IllnessEntry[]>(
    formData.step2.illnesses.length > 0 ? formData.step2.illnesses : [EMPTY_ILLNESS],
  );

  const updateIllness = (index: number, value: IllnessEntry) => {
    setIllnesses((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleNext = () => {
    saveIllnesses(illnesses.filter(isIllnessFilled));
    router.push("/form/step4");
  };

  const handlePrevious = () => {
    saveIllnesses(illnesses.filter(isIllnessFilled));
    router.push("/form/step2");
  };

  return (
    <div>
      <ProgressBar step={3} />

      <div className="space-y-8">
        <section className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 shadow-[0_6px_16px_-4px_rgba(186,117,23,0.4)]">
              <i className="ti ti-virus text-xl text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Illness</h3>
              <p className="text-xs text-slate-500">Reference example shown below</p>
            </div>
          </div>

          <ExampleTable type="illness" />

          <div className="mt-5 space-y-4">
            {illnesses.map((illness, i) => (
              <IllnessForm
                key={i}
                index={i}
                value={illness}
                onChange={updateIllness}
                onRemove={
                  illnesses.length > 1
                    ? () => setIllnesses((prev) => prev.filter((_, idx) => idx !== i))
                    : undefined
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIllnesses((prev) => [...prev, { ...EMPTY_ILLNESS }])}
            className="mt-4 flex items-center gap-1.5 text-sm text-link-teal hover:underline"
          >
            <i className="ti ti-circle-plus text-slate-400" aria-hidden="true" />
            Add another illness
          </button>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90"
          >
            <i className="ti ti-arrow-left" aria-hidden="true" />
            PREVIOUS
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90"
          >
            NEXT
            <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              saveIllnesses(illnesses.filter(isIllnessFilled));
              saveAndResumeLater();
            }}
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
