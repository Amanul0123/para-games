"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import ExampleTable from "@/components/ExampleTable";
import InjuryForm from "@/components/InjuryForm";
import { useFormContext } from "@/context/FormContext";
import { InjuryEntry } from "@/types";

const EMPTY_INJURY: InjuryEntry = {
  accreditationNo: "",
  sportEvent: "",
  roundHeat: "",
  injuryDate: "",
  injuryTime: "",
  bodyPart: "",
  bodyPartCode: "",
  injuryType: "",
  injuryTypeCode: "",
  causeOfInjury: "",
  causeCode: "",
  absenceDays: undefined,
};

const isInjuryFilled = (injury: InjuryEntry) =>
  Boolean(
    injury.accreditationNo.trim() ||
      injury.sportEvent.trim() ||
      injury.injuryDate.trim() ||
      injury.bodyPart.trim() ||
      injury.injuryType.trim(),
  );

export default function Step2Page() {
  const router = useRouter();
  const { formData, setInjuries: saveInjuries, saveAndResumeLater } = useFormContext();

  const [injuries, setInjuries] = useState<InjuryEntry[]>(
    formData.step2.injuries.length > 0 ? formData.step2.injuries : [EMPTY_INJURY],
  );

  const updateInjury = (index: number, value: InjuryEntry) => {
    setInjuries((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleNext = () => {
    saveInjuries(injuries.filter(isInjuryFilled));
    router.push("/form/step3");
  };

  const handlePrevious = () => {
    saveInjuries(injuries.filter(isInjuryFilled));
    router.push("/form/step1");
  };

  return (
    <div>
      <ProgressBar step={2} />

      <div className="space-y-8">
        <section className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red to-orange-500 shadow-[0_6px_16px_-4px_rgba(224,58,24,0.4)]">
              <i className="ti ti-bandage text-xl text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Injuries</h3>
              <p className="text-xs text-slate-500">Reference example shown below</p>
            </div>
          </div>

          <ExampleTable type="injury" />

          <div className="mt-5 space-y-4">
            {injuries.map((injury, i) => (
              <InjuryForm
                key={i}
                index={i}
                value={injury}
                onChange={updateInjury}
                onRemove={
                  injuries.length > 1
                    ? () => setInjuries((prev) => prev.filter((_, idx) => idx !== i))
                    : undefined
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setInjuries((prev) => [...prev, { ...EMPTY_INJURY }])}
            className="mt-4 flex items-center gap-1.5 text-sm text-link-teal hover:underline"
          >
            <i className="ti ti-circle-plus text-slate-400" aria-hidden="true" />
            Add another injury
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
              saveInjuries(injuries.filter(isInjuryFilled));
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
