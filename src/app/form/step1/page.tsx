"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProgressBar from "@/components/ProgressBar";
import PhoneInput from "@/components/PhoneInput";
import { useFormContext } from "@/context/FormContext";
import { step1Schema, type Step1Input } from "@/lib/validations";

const NPC_OPTIONS = [
  "Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia",
  "China", "Chinese Taipei", "Hong Kong China", "India", "Indonesia", "Iran",
  "Iraq", "Japan", "Jordan", "Kazakhstan", "South Korea", "Kuwait",
  "Kyrgyzstan", "Laos", "Lebanon", "Macau China", "Malaysia", "Maldives",
  "Mongolia", "Myanmar", "Nepal", "Pakistan", "Palestine", "Philippines",
  "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syria", "Tajikistan",
  "Thailand", "Timor-Leste", "Turkmenistan", "UAE", "Uzbekistan", "Vietnam",
  "Yemen",
];

export default function Step1Page() {
  const router = useRouter();
  const { formData, setStep1, saveAndResumeLater } = useFormContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData.step1,
  });

  const onSubmit = (data: Step1Input) => {
    setStep1(data);
    router.push("/form/step2");
  };

  return (
    <div>
      <ProgressBar step={1} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-dark">NPC</label>
          <select
            {...register("npc")}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:border-brand-cyan focus:outline-none ${
              errors.npc ? "border-red-500" : "border-border-gray"
            }`}
          >
            <option value="">Select NPC</option>
            {NPC_OPTIONS.map((npc) => (
              <option key={npc} value={npc}>
                {npc}
              </option>
            ))}
          </select>
          {errors.npc && <p className="mt-1 text-sm text-red-500">{errors.npc.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-dark">
            Report by (name)
          </label>
          <input
            {...register("reportedBy")}
            placeholder="Full name"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:border-brand-cyan focus:outline-none ${
              errors.reportedBy ? "border-red-500" : "border-border-gray"
            }`}
          />
          {errors.reportedBy && (
            <p className="mt-1 text-sm text-red-500">{errors.reportedBy.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-dark">
            Date of report
          </label>
          <input
            type="date"
            {...register("dateOfReport")}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:border-brand-cyan focus:outline-none ${
              errors.dateOfReport ? "border-red-500" : "border-border-gray"
            }`}
          />
          {errors.dateOfReport && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfReport.message}</p>
          )}
        </div>

        <h3 className="font-bold text-text-dark">Contact Details</h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-dark">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="name@example.com"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:border-brand-cyan focus:outline-none ${
              errors.email ? "border-red-500" : "border-border-gray"
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              error={errors.phone?.message}
            />
          )}
        />

        <p className="rounded-md bg-orange-50 p-3 text-sm text-link-teal">
          Please ensure all contact details are accurate as they will be used
          to follow up on this report.
        </p>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="rounded-md bg-brand-cyan px-6 py-2 font-medium text-white hover:opacity-90"
          >
            NEXT
          </button>
          <button
            type="button"
            onClick={saveAndResumeLater}
            className="text-sm text-link-teal hover:underline"
          >
            Save and Resume Later
          </button>
        </div>
      </form>
    </div>
  );
}
