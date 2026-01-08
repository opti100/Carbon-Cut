import { Mail, Inbox, Send, Tag } from 'lucide-react'
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  StepperDescription,
} from '@/components/ui/stepper'

interface VerticalStepperProps {
  activeStep: number
  isConnected: boolean
  steps: Array<{ title: string; description: string; icon: React.ReactNode }>
}

export default function VerticalStepper({
  activeStep,
  isConnected,
  steps,
}: VerticalStepperProps) {
  const getStepStatus = (index: number) => {
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'inactive'
  }

  const getStepValue = () => {
    return activeStep + 1
  }

  return (
    <div className="w-full">
      <Stepper
        className="flex flex-col w-full"
        value={getStepValue()}
        orientation="vertical"
      >
        <StepperNav className="w-full">
          {steps.map((step, index) => {
            const status = getStepStatus(index)
            const isCurrentStep = index === activeStep

            return (
              <StepperItem
                key={index}
                step={index + 1}
                className="relative items-start w-full"
                data-state={status}
              >
                <StepperTrigger className="items-start pb-8 gap-4 w-full cursor-default">
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`relative z-10 rounded-full p-3 flex items-center justify-center flex-shrink-0 ${
                          status === 'completed'
                            ? 'bg-green-100'
                            : status === 'active'
                              ? 'bg-orange-100'
                              : 'bg-gray-100'
                        }`}
                      >
                        <div
                          className={`${
                            status === 'completed'
                              ? 'text-green-600'
                              : status === 'active'
                                ? 'text-orange-600'
                                : 'text-gray-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 text-left pt-1">
                      <StepperTitle
                        className={`font-semibold text-base mb-1.5 ${isCurrentStep ? 'text-gray-900' : 'text-gray-700'}`}
                      >
                        {step.title}
                      </StepperTitle>
                      <StepperDescription className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>

                {/* Properly aligned connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-5 top-12 w-0.5 h-[calc(100%-10px)] border-l-2 border-dashed ${
                      index < activeStep ? 'border-green-500' : 'border-gray-300'
                    }`}
                  />
                )}
              </StepperItem>
            )
          })}
        </StepperNav>
      </Stepper>
    </div>
  )
}
