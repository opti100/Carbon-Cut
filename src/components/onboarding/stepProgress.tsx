"use client";

type ProgressProps = {
  total: number;
  current: number;
  onChange?: (step: number) => void;
};

export function StepProgress({ total, current, onChange }: ProgressProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          const isActive = step === current;

          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange?.(step)}
              className={`h-2 w-6 rounded-full transition-colors
                ${isActive ? "bg-black" : "bg-gray-300 hover:bg-gray-400"}
              `}
              aria-label={`Step ${step}`}
            />
          );
        })}
      </div>

      
    </div>
  );
}
