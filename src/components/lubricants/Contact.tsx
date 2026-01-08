'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import UniversalHeading from '../UniversalHeading'

gsap.registerPlugin(ScrollTrigger)

const steps = ['Base Oil', 'Additives', 'Blending', 'Packaging', 'Logistics', 'End-Use']

const ContactSection = () => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: 0.6,
        },
        defaults: {
          ease: 'power2.out',
        },
      })

      const stepElements = stepsRef.current.filter(Boolean)

      if (stepElements.length) {
        tl.fromTo(
          stepElements,
          {
            opacity: 0,
            y: 24,
            scale: 0.96,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: {
              each: 0.12,
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Top Divider */}
      <div className="w-full border-t border-dashed border-black/10 py-10" />

      <section ref={containerRef} className="w-full bg-[#fcfdf6] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <UniversalHeading
            title="Ready to Calculate Your Lubricants CO₂e?"
            description="Get a custom CO₂e model for your lubricant portfolio:"
            align="right"
          />

          {/* Steps */}
          <div className="flex items-center justify-center py-20">
            {/* Mobile / Tablet */}
            <div className="block w-full max-w-md lg:hidden">
              <div className="flex flex-col space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      stepsRef.current[index] = el
                    }}
                    className="relative flex items-center space-x-4 rounded-2xl border border-[#d1cebb] bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#b0ea1d] will-change-transform will-change-opacity"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b0ea1d] text-xl font-bold text-black transition-transform duration-300 group-hover:scale-110">
                      {index + 1}
                    </div>

                    <p className="text-xl font-semibold text-[#080c04] transition-colors duration-300 hover:text-[#6c5f31]">
                      {step}
                    </p>

                    {/* Vertical connector */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-7 top-full h-6 w-[2px] bg-[#d1cebb]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden w-full lg:block">
              <div className="relative flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      stepsRef.current[index] = el
                    }}
                    className="relative flex flex-1 flex-col items-center text-center will-change-transform will-change-opacity"
                  >
                    {/* Step circle */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#b0ea1d] text-2xl font-bold text-black shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
                      {index + 1}
                    </div>

                    {/* Label */}
                    <p className="px-2 text-xl font-semibold text-[#080c04] transition-colors duration-300 hover:text-[#6c5f31]">
                      {step}
                    </p>

                    {/* Horizontal connector */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-1/2 top-10 -z-10 h-[2px] w-full bg-[#d1cebb] transition-colors duration-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Divider */}
      <div className="w-full border-t border-dashed border-black/10" />
    </>
  )
}

export default ContactSection
