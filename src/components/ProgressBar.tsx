"use client";

import { useRouter } from "next/navigation";

interface ProgressBarProps {
  step: 1 | 2 | 3 | 4;
}

const STEPS = [
  { id: 1, icon: "ti-user", label: "Reporter Info", path: "/form/step1" },
  { id: 2, icon: "ti-bandage", label: "Injuries", path: "/form/step2" },
  { id: 3, icon: "ti-virus", label: "Illness", path: "/form/step3" },
  { id: 4, icon: "ti-clipboard-check", label: "Review & Submit", path: "/form/step4" },
] as const;

export default function ProgressBar({ step }: ProgressBarProps) {
  const router = useRouter();

  return (
    <nav
      aria-label="Report submission progress"
      className="mx-auto mb-6 w-full max-w-6xl rounded-xl border border-white/70 bg-white/60 px-4 py-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:px-8"
    >
      <p className="sr-only">
        Step {step} of {STEPS.length}: {STEPS[step - 1].label}
      </p>
      <ol className="flex items-center">
        {STEPS.map((s, i) => {
          const isCompleted = s.id < step;
          const isActive = s.id === step;

          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                aria-disabled={!isCompleted}
                onClick={() => isCompleted && router.push(s.path)}
                className={`flex flex-col items-center gap-1.5 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 ${
                  isCompleted ? "cursor-pointer" : "cursor-default"
                }`}
                aria-current={isActive ? "step" : undefined}
                aria-label={isCompleted ? `Go back to ${s.label}` : s.label}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-base transition-colors sm:h-11 sm:w-11 ${
                    isCompleted
                      ? "border-progress-green bg-progress-green text-white shadow-[0_6px_16px_-4px_rgba(76,175,80,0.5)] hover:opacity-80"
                      : isActive
                        ? "border-brand-cyan bg-gradient-to-br from-brand-cyan to-cyan-400 text-white shadow-[0_6px_16px_-4px_rgba(0,188,212,0.5)]"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                  aria-hidden="true"
                >
                  <i className={`ti ${isCompleted ? "ti-check" : s.icon}`} />
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    isActive ? "text-slate-800" : isCompleted ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>

              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full sm:mx-4 ${
                    isCompleted ? "bg-progress-green" : "bg-slate-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
