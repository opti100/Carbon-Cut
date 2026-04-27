'use client'

import { Zap, ShieldCheck, BarChart3, Globe } from 'lucide-react'
import UniversalHeading from '../UniversalHeading'

const pillars = [
  {
    icon: Zap,
    value: 'Real-Time',
    label: 'CO₂e Tracking',
  },
  {
    icon: ShieldCheck,
    value: 'Verified',
    label: 'Carbon Offsets',
  },
  {
    icon: BarChart3,
    value: 'CSRD / SECR',
    label: 'Compliance Ready',
  },
  {
    icon: Globe,
    value: 'Global',
    label: 'Registry Access',
  },
]

export default function AboutSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fcfdf6]">
      <div className="w-full border-t border-dashed border-[#6c5f31]/20 mb-8" />

      <div className="max-w-[1400px] mx-auto">
        <UniversalHeading
          title="About CarbonCut"
          description="Who We Are"
          align="right"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-12">
          {/* Left — Copy */}
          <div className="space-y-6">
            <p className="text-base md:text-lg text-[#6c5f31] leading-relaxed">
              CarbonCut is the world&apos;s first platform for real-time carbon emission
              tracking and reduction — built for the hyper-connected digital economy.
            </p>
            <p className="text-base md:text-lg text-[#6c5f31] leading-relaxed">
              We integrate directly with your digital infrastructure — ad platforms,
              servers, and data streams — to calculate CO₂e emissions in real time using
              live grid-intensity data and verified emission factors.
            </p>
            <p className="text-base md:text-lg text-[#6c5f31] leading-relaxed">
              From measurement to automatic offset retirement, CarbonCut delivers
              end-to-end carbon neutrality with reports aligned to SECR, SEC, and CSRD
              disclosure frameworks.
            </p>
          </div>

          {/* Right — Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-accent rounded-2xl border border-text/10 p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow duration-300"
              >
                <div className="w-10 h-10 bg-[#b0ea1d] rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#080c04]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#080c04]">{value}</div>
                  <div className="text-sm text-[#6c5f31] mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
