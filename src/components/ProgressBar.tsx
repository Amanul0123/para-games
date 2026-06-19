interface ProgressBarProps {
  step: 1 | 2 | 3;
}

const STEP_PERCENT: Record<1 | 2 | 3, number> = {
  1: 33,
  2: 66,
  3: 100,
};

export default function ProgressBar({ step }: ProgressBarProps) {
  const percent = STEP_PERCENT[step];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-4">
      <p className="mb-2 text-sm text-gray-500">Step {step} of 3</p>
      <div className="h-3 w-full rounded-full bg-border-gray/40">
        <div
          className="h-3 rounded-full bg-progress-green transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
