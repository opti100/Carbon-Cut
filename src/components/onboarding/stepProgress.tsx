"use client";

type ProgressProps = {
  total: number;
  current: number;
  onChange?: (step: number) => void;
};

export function StepProgress({ total, current, onChange }: ProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step <= current;

        return (
          <button
            key={step}
            type="button"
            onClick={() => onChange?.(step)}
            className={`
              h-1 rounded-full transition-all duration-200
              ${isActive ? "w-37 bg-[#6c5f31]" : "w-37 bg-neutral-300 hover:bg-[#d1cebb]"}
            `}
            aria-label={`Step ${step}`}
          />
        );
      })}
    </div>
  );
}
