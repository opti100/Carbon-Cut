import clsx from "clsx";

interface StepsSidebarProps {
  currentStep: number;
}

const STEPS = [
  "Cloud",
  "CDN",
  "On-Prem",
  "Workforce",
  "Travel",
];

export function StepsSidebar({ currentStep }: StepsSidebarProps) {
  return (
    <aside className="sticky top-32 h-fit">
      <nav className="space-y-0">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={label}>
              <button
                className={clsx(
                  "w-full text-left py-4 transition-all duration-200",
                  isActive && "font-bold text-neutral-900",
                  isCompleted && "font-medium text-neutral-600",
                  !isActive && !isCompleted && "font-normal text-neutral-400",
                  isActive && "pl-2 border-l-2 border-neutral-900"
                )}
              >
                <span className="text-base leading-relaxed ">{label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className="h-px bg-neutral-200/60 ml-2" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
