interface ProgressBarProps {
  step: 1 | 2 | 3;
}

const STEPS = [
  { id: 1, icon: "ti-user", label: "Reporter Info" },
  { id: 2, icon: "ti-bandage", label: "Injuries & Illnesses" },
  { id: 3, icon: "ti-clipboard-check", label: "Review & Submit" },
] as const;

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <nav
      aria-label="Report submission progress"
      className="mx-auto mb-6 w-full max-w-6xl rounded-xl border border-white/70 bg-white/60 px-4 py-5 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:px-8"
    >
      <p className="sr-only">
        Step {step} of 3: {STEPS[step - 1].label}
      </p>
      <ol className="flex items-center">
        {STEPS.map((s, i) => {
          const isCompleted = s.id < step;
          const isActive = s.id === step;

          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5 text-center" aria-current={isActive ? "step" : undefined}>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-base transition-colors sm:h-11 sm:w-11 ${
                    isCompleted
                      ? "border-progress-green bg-progress-green text-white shadow-[0_6px_16px_-4px_rgba(76,175,80,0.5)]"
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
              </div>

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
