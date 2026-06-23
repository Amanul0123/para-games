"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProgressBar from "@/components/ProgressBar";
import PhoneInput from "@/components/PhoneInput";
import { useFormContext } from "@/context/FormContext";
import { step1Schema, type Step1Input } from "@/lib/validations";
import { getNpcFlag } from "@/lib/npcFlags";

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

      <div className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red to-orange-500 shadow-[0_6px_16px_-4px_rgba(224,58,24,0.4)]">
            <i className="ti ti-user text-xl text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Reporter Information</h2>
            <p className="text-xs text-slate-500">Tell us who you are and which NPC you represent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="npc" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-flag text-slate-400" aria-hidden="true" />
              NPC
            </label>
            <select
              id="npc"
              {...register("npc")}
              aria-invalid={errors.npc ? true : undefined}
              aria-describedby={errors.npc ? "npc-error" : undefined}
              className={`w-full rounded-lg border bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 ${
                errors.npc ? "border-red-400" : "border-slate-200 focus:border-brand-cyan/60"
              }`}
            >
              <option value="">Select NPC</option>
              {NPC_OPTIONS.map((npc) => (
                <option key={npc} value={npc}>
                  {getNpcFlag(npc)} {npc}
                </option>
              ))}
            </select>
            {errors.npc && (
              <p id="npc-error" className="mt-1 text-sm text-red-500">
                {errors.npc.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reportedBy" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-id-badge-2 text-slate-400" aria-hidden="true" />
              Report by (name)
            </label>
            <input
              id="reportedBy"
              {...register("reportedBy")}
              placeholder="Full name"
              aria-invalid={errors.reportedBy ? true : undefined}
              aria-describedby={errors.reportedBy ? "reportedBy-error" : undefined}
              className={`w-full rounded-lg border bg-white/80 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 ${
                errors.reportedBy ? "border-red-400" : "border-slate-200 focus:border-brand-cyan/60"
              }`}
            />
            {errors.reportedBy && (
              <p id="reportedBy-error" className="mt-1 text-sm text-red-500">
                {errors.reportedBy.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfReport" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-calendar-event text-slate-400" aria-hidden="true" />
              Date of report
            </label>
            <input
              id="dateOfReport"
              type="date"
              {...register("dateOfReport")}
              aria-invalid={errors.dateOfReport ? true : undefined}
              aria-describedby={errors.dateOfReport ? "dateOfReport-error" : undefined}
              className={`w-full rounded-lg border bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 ${
                errors.dateOfReport ? "border-red-400" : "border-slate-200 focus:border-brand-cyan/60"
              }`}
            />
            {errors.dateOfReport && (
              <p id="dateOfReport-error" className="mt-1 text-sm text-red-500">
                {errors.dateOfReport.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200/70 pt-5">
            <i className="ti ti-address-book text-slate-400" aria-hidden="true" />
            <h3 className="font-semibold text-slate-800">Contact Details</h3>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-mail text-slate-400" aria-hidden="true" />
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg border bg-white/80 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 ${
                errors.email ? "border-red-400" : "border-slate-200 focus:border-brand-cyan/60"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
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

          <p className="flex items-start gap-2 rounded-lg border border-cyan-100 bg-cyan-50/70 p-3 text-sm text-link-teal">
            <i className="ti ti-info-circle mt-0.5 flex-shrink-0" aria-hidden="true" />
            Please ensure all contact details are accurate as they will be used
            to follow up on this report.
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90"
            >
              NEXT
              <i className="ti ti-arrow-right" aria-hidden="true" />
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
        </form>
      </div>
    </div>
  );
}
