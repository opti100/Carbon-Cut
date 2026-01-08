'use client'
import {
  ArrowRight,
  Clock,
  DollarSign,
  EyeOff,
  FileClock,
  Puzzle,
  ShieldAlert,
} from 'lucide-react'

export default function ProblemWeareSolving() {
  return (
    <section className="relative w-full bg-[#fcfdf6] py-24 overflow-hidden">
      {/* background arcs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[900px] h-[900px] rounded-full border-[1px] border-[#cfc5b6]" />
        <div className="absolute -left-20 top-20 w-[900px] h-[900px] rounded-full border-[1px] border-[#d8cebf]" />
        <div className="absolute left-0 top-32 w-[900px] h-[900px] rounded-full border-[1px] border-[#e3dacd]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* subtitle */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
          The Problem We're Solving
        </div>

        {/* headline */}
        <h2 className="text-3xl md:text-5xl leading-tight font-serif max-w-6xl">
          An{' '}
          <span className="text-[#b0ea1d] italic">
            {' '}
            Traditional carbon accounting wasn't built for digital businesses.
          </span>{' '}
          <br /> <br /> Standard calculators focus on manufacturing, shipping,{' '}
          <span className="text-[#b0ea1d] italic">
            {' '}
            and office spaces they miss{' '}
          </span>{' '}
          your digital infrastructure entirely.
        </h2>

        {/* connecting line */}
        {/* <div className="mt-16 w-full flex justify-center">
          <div className="w-[85%] h-24 border-b border-l border-r rounded-b-[40px] border-[#ccbfae]" />
        </div> */}

        {/* two column content */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left card */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-xl">
                Here's what companies struggle with today:
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  <span>Blind spots in internet and digital emissions</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Enterprise tools costing $50K–$200K annually</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Months of implementation</span>
                </div>

                <div className="flex items-center gap-2">
                  <FileClock className="h-4 w-4" />
                  <span>Outdated annual reports</span>
                </div>

                <div className="flex items-center gap-2">
                  <Puzzle className="h-4 w-4" />
                  <span>Fragmented tooling</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Regulatory pressure with no compliance path</span>
                </div>
              </div>
            </p>
          </div>
          {/* Right card */}
          <div>
            <p className="text-black leading-relaxed font-mono font-semibold  text-xl">
              You're trying to hit net-zero targets with incomplete data and tools not
              designed for how modern businesses operate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
