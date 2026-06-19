"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import ExampleTable from "@/components/ExampleTable";
import InjuryForm from "@/components/InjuryForm";
import IllnessForm from "@/components/IllnessForm";
import { useFormContext } from "@/context/FormContext";
import { InjuryEntry, IllnessEntry } from "@/types";

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

export default function Step2Page() {
  const router = useRouter();
  const { formData, setStep2, saveAndResumeLater } = useFormContext();

  const [injuries, setInjuries] = useState<InjuryEntry[]>(
    formData.step2.injuries.length > 0 ? formData.step2.injuries : [EMPTY_INJURY],
  );
  const [illnesses, setIllnesses] = useState<IllnessEntry[]>(
    formData.step2.illnesses.length > 0 ? formData.step2.illnesses : [EMPTY_ILLNESS],
  );

  const updateInjury = (index: number, value: InjuryEntry) => {
    setInjuries((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const updateIllness = (index: number, value: IllnessEntry) => {
    setIllnesses((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAddInjuryToggle = (checked: boolean) => {
    if (checked) {
      setInjuries((prev) => [...prev, { ...EMPTY_INJURY }]);
    }
  };

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

  const handleNext = () => {
    setStep2({
      injuries: injuries.filter(isInjuryFilled),
      illnesses: illnesses.filter(isIllnessFilled),
    });
    router.push("/form/step3");
  };

  return (
    <div>
      <ProgressBar step={2} />

      <div className="space-y-10">
        <section>
          <h3 className="mb-2 font-bold text-text-dark">1. Injury - Example</h3>
          <ExampleTable type="injury" />

          <div className="mt-4 space-y-4">
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

          <label className="mt-4 flex items-center gap-2 text-sm text-text-dark">
            <input
              type="checkbox"
              onChange={(e) => handleAddInjuryToggle(e.target.checked)}
            />
            Add Injury
          </label>
        </section>

        <section>
          <h3 className="mb-2 font-bold text-text-dark">2. Illness - Example</h3>
          <ExampleTable type="illness" />

          <div className="mt-4 space-y-4">
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
        </section>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/form/step1")}
            className="rounded-md bg-brand-cyan px-6 py-2 font-medium text-white hover:opacity-90"
          >
            PREVIOUS
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-md bg-brand-cyan px-6 py-2 font-medium text-white hover:opacity-90"
          >
            NEXT
          </button>
          <button
            type="button"
            onClick={() => {
              setStep2({ injuries, illnesses });
              saveAndResumeLater();
            }}
            className="text-sm text-link-teal hover:underline"
          >
            Save and Resume Later
          </button>
        </div>
      </div>
    </div>
  );
}
