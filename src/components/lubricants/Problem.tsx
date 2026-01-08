'use client'
import React, { useEffect, useRef, useState } from 'react'
import UniversalHeading from '../UniversalHeading'
import {
  Calculator,
  CalendarClock,
  Clock,
  Coins,
  Crosshair,
  EyeOff,
  FileSpreadsheet,
  FileX2,
  Handshake,
  ThumbsDown,
} from 'lucide-react'

export default function StackedCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return

      const cards = Array.from(containerRef.current.children) as HTMLDivElement[]

      if (cards.length < 2) return

      const secondCardTop = cards[1].getBoundingClientRect().top

      const start = window.innerHeight * 0.7
      const end = window.innerHeight * 0.3

      const raw = (start - secondCardTop) / (start - end)
      const clamped = Math.min(Math.max(raw, 0), 1)

      setProgress(clamped)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6lg:px-8">
      <UniversalHeading
        title="The Lubricants Industry’s Hidden Problem"
        description="Your CO₂e data is outdated, averaged, and full of blind spots."
        align="right"
      />

      <div
        ref={containerRef}
        className="
          relative 
          min-h-[220vh] 
          sm:min-h-[260vh]
          lg:min-h-[300vh]
          bg-[#fcfdf6] 
          px-4 
          sm:px-6
        "
      >
        {/* Card 1 */}
        <div
          className="
            sticky 
            top-16 
            sm:top-20 
            lg:top-24
            rounded-3xl
            bg-[#d1cebb]
            shadow-lg
            p-5 
            sm:p-8 
            lg:p-12
            mt-8
            sm:m-10
            mb-32
          "
          style={{
            transform: `scale(${1 - progress * 0.06})`,
            transformOrigin: 'top center',
            zIndex: 1,
          }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#6c5f31] mb-6 sm:mb-10 font-mono">
            Traditional ESG systems rely on:
          </h2>

          <hr className="border-[#3a2626]/40 mb-6 sm:mb-10" />

          <ul className="space-y-3 text-base sm:text-lg text-[#6c5f31] max-w-2xl font-mono">
            <li className="flex items-start gap-3">
              <Calculator className="h-5 w-5 shrink-0" />
              <span>Generic emission factors</span>
            </li>

            <li className="flex items-start gap-3">
              <FileSpreadsheet className="h-5 w-5 shrink-0" />
              <span>Vendor PDFs and manual spreadsheets</span>
            </li>

            <li className="flex items-start gap-3">
              <Crosshair className="h-5 w-5 shrink-0" />
              <span>No product-level accuracy</span>
            </li>

            <li className="flex items-start gap-3">
              <Clock className="h-5 w-5 shrink-0" />
              <span>No real-time traceability</span>
            </li>

            <li className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 shrink-0" />
              <span>Annual sustainability reporting</span>
            </li>
          </ul>
        </div>

        {/* Card 2 */}
        <div
          className="
            sticky 
            top-16 
            sm:top-20 
            lg:top-24
            rounded-3xl
            bg-[#d1cebb]
            shadow-lg
            p-5 
            sm:p-8 
            lg:p-12
            mt-8
            sm:m-10
            mb-32
          "
          style={{ zIndex: 2 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#6c5f31] mb-6 sm:mb-10 font-mono">
            This Leads To:
          </h2>

          <hr className="border-[#3a2626]/40 mb-6 sm:mb-10" />

          <ul className="space-y-3 text-base sm:text-lg text-[#6c5f31] max-w-2xl font-mono">
            <li className="flex items-start gap-3">
              <FileX2 className="h-5 w-5 shrink-0" />
              <span>Incorrect emission disclosures</span>
            </li>

            <li className="flex items-start gap-3">
              <Coins className="h-5 w-5 shrink-0" />
              <span>Higher carbon taxes</span>
            </li>

            <li className="flex items-start gap-3">
              <ThumbsDown className="h-5 w-5 shrink-0" />
              <span>Poor ESG scores</span>
            </li>

            <li className="flex items-start gap-3">
              <Handshake className="h-5 w-5 shrink-0" />
              <span>Lost B2B contracts</span>
            </li>

            <li className="flex items-start gap-3">
              <EyeOff className="h-5 w-5 shrink-0" />
              <span>No Scope 1 / 2 / 3 visibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
