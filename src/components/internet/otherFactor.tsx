'use client'

import { useState } from 'react'
import { BlurFade } from '../ui/blur-fade'
import UniversalHeading from '../UniversalHeading'

const DATA = [
  {
    title: 'Accurate Real-Time Emission Tracking',
    desc: 'Forget waiting months for a carbon report. See your emissions as they happen. Track the impact of a marketing campaign launch, a traffic spike, or a new feature release in real-time.',
  },
  {
    title: 'No Expensive Tools Required',
    desc: "We've eliminated the six-figure price tag. Get enterprise-grade carbon accounting at a fraction of the cost. No hidden fees, no surprise charges.",
  },
  {
    title: 'No Hiring Agencies Needed',
    desc: 'Skip the consultants and sustainability firms. Our platform is designed for your existing team to use, no specialised knowledge required.',
  },
  {
    title: 'Simple Integration',
    desc: 'Connect your tech stack in minutes, not months. We integrate with your analytics, cloud providers, advertising platforms, and CMS with just a few clicks.',
  },
  {
    title: 'Industry-Specific Benchmarking',
    desc: "Compare your emissions against competitors in your sector. Know if you're leading or lagging in your industry's race to net-zero.",
  },
  {
    title: 'Actionable Reduction Strategies',
    desc: "We don't just show numbers. We give prioritised, practical steps based on impact and ease of implementation.",
  },
]

export default function OtherFactor() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <>
      <section className="w-full bg-[#fcfdf6] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <UniversalHeading description="Additional Value" align="right" />

          {/* ---------- LARGE SCREEN GRID ---------- */}
          <div className="hidden lg:grid grid-cols-2 gap-16 items-center">
            {/* LEFT GRID */}
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
                {DATA.map((item, i) => {
                  const isTopLeft = i === 0
                  const isTopRight = i === 2
                  const isBottomLeft = i === DATA.length - 3
                  const isBottomRight = i === DATA.length - 1

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className={`flex items-center justify-center p-4 h-32 md:h-40
                        border border-[#6d6031] font-mono text-sm md:text-base font-medium tracking-wide
                        text-[#6d6031] cursor-pointer transition-colors
                        hover:bg-[#fbffe6] hover:text-black text-center
                        ${isTopLeft ? 'rounded-tl-2xl' : ''}
                        ${isTopRight ? 'rounded-tr-2xl' : ''}
                        ${isBottomLeft ? 'rounded-bl-2xl' : ''}
                        ${isBottomRight ? 'rounded-br-2xl' : ''}
                      `}
                    >
                      {item.title}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="relative min-h-[320px] flex items-center justify-center">
              {/* DEFAULT HEADING */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  activeIndex !== null
                    ? 'opacity-0 -translate-y-6'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="text-3xl md:text-4xl font-mono font-semibold flex items-center justify-center px-6 text-[#6d6031] leading-tight">
                  <BlurFade>Other Factors We’re Also Resolving</BlurFade>
                </div>
              </div>

              {/* DESCRIPTIONS */}
              {DATA.map((item, i) => (
                <p
                  key={i}
                  className={`absolute inset-0 flex items-center justify-center px-6 text-base md:text-lg font-mono text-[#6d6031] leading-relaxed transition-all duration-500 ${
                    activeIndex === i
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-4 scale-95'
                  }`}
                >
                  {item.desc}
                </p>
              ))}
            </div>
          </div>

          {/* ---------- MOBILE / TABLET STACKED ---------- */}
          <div className="lg:hidden flex flex-col gap-4 mt-10">
            {DATA.map((item, i) => {
              const isOpen = activeIndex === i
              return (
                <div
                  key={i}
                  className="bg-[#fcfdf6] border border-[#6d6031] rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-medium text-[#6d6031]"
                  >
                    {item.title}
                    <span
                      className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#6d6031]">{item.desc}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
    </>
  )
}
