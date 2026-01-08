'use client'

import React, { useRef, useEffect } from 'react'
import { BlurFade } from './ui/blur-fade'
import UniversalHeading from './UniversalHeading'

export type TimelineStep = {
  number: string
  title: string
  description?: string
  side: 'left' | 'right'
  render?: () => React.ReactNode
}

type Props = {
  title: string
  subtitle?: string
  steps: TimelineStep[]
  activeStep: number
}

export function VerticalTimeline({ title, subtitle, steps, activeStep }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = stepsRef.current[activeStep]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeStep])

  return (
    <section className="bg-[#fcfdf6] text-[#080c04] min-h-screen py-20 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <UniversalHeading title={title} description={subtitle} />

      {/* Timeline */}
      <div ref={sectionRef} className="relative max-w-6xl mx-auto">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] bg-[#d1cebb] h-full" />

        {/* Progress line */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#6c5f31] to-white rounded-full transition-all duration-700"
          style={{
            height: `${((activeStep + 1) / steps.length) * 100}%`,
          }}
        />

        <div className="space-y-40">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => {
                stepsRef.current[i] = el
              }}
              className={`relative transition-all duration-500 ${
                i === activeStep ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT */}
                <div
                  className={
                    step.side === 'left' ? 'md:pr-16 text-right' : 'md:col-start-1'
                  }
                >
                  {step.side === 'left' && (
                    <>
                      <span className="text-sm font-semibold text-[#6c5f31]">
                        Step {step.number}
                      </span>
                      <h2 className="text-3xl font-bold mt-2 mb-4 text-[#6c5f31]">
                        {step.title}
                      </h2>
                      {step.description && (
                        <p className="text-gray-700 mb-6">{step.description}</p>
                      )}
                      {i === activeStep && step.render?.()}
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div
                  className={
                    step.side === 'right' ? 'md:pl-16 text-left' : 'md:col-start-2'
                  }
                >
                  {step.side === 'right' && (
                    <>
                      <span className="text-sm font-semibold text-[#6c5f31]">
                        Step {step.number}
                      </span>
                      <h2 className="text-3xl font-bold mt-2 mb-4 text-[#6c5f31]">
                        {step.title}
                      </h2>
                      {step.description && (
                        <p className="text-gray-700 mb-6">{step.description}</p>
                      )}
                      {i === activeStep && step.render?.()}
                    </>
                  )}
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    i <= activeStep
                      ? 'bg-[#b0ea1d] border-[#b0ea1d]'
                      : 'bg-white border-gray-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
