import React from 'react';

interface StepperProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: 'Organization' },
  { id: 2, title: 'Campaign' },
  { id: 3, title: 'Activities' },
  { id: 4, title: 'Details' },
];

export default function StepperProgress({ currentStep }: StepperProgressProps) {
  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <div className="flex items-center gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 ${
                  currentStep >= step.id ? 'shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: currentStep >= step.id ? '#b0ea1d' : '#d1cebb',
                  color: currentStep >= step.id ? '#080c04' : '#fffff',
                  border: currentStep >= step.id ? 'none' : '1px solid #d1cebb'
                }}
              >
                {step.id}
              </div>
              <span
                className="text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap"
                style={{ color: currentStep >= step.id ? '#6c5f31' : '#9ca3af' }}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className="w-8 sm:w-12 md:w-16 lg:w-20 h-0.5 mx-1 sm:mx-2 md:mx-3 transition-all duration-300"
                style={{ backgroundColor: currentStep > step.id ? '#b0ea1d' : '#d1cebb' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
