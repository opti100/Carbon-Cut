'use client'

import React from 'react'
import UniversalHeading from '../UniversalHeading'
import { TreeDeciduous } from 'lucide-react'

export default function AIOptimizationSection() {
  return (
    <section className="relative w-full bg-[#fcfdf6] text-lack py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Heading */}
       
        <UniversalHeading title='Why it matters' align='right' />

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT CARD — Visualization */}
          <div className="bg-[#d1cebb] rounded-2xl p-8 flex items-center justify-center min-h-[420px]">
            <MatrixVisual />
          </div>

          {/* CENTER CARD — Text */}
          <div className="bg-[#d1cebb] rounded-2xl p-10 flex flex-col justify-between min-h-[420px]">
            <div>
             

              <h3 className="text-2xl lg:text-3xl font-medium mb-6">
                Oil and gas operations generate complex and widespread carbon emissions
              </h3>

              <p className="text-sm text-[#6c5f31] max-w-md">
                That require accurate measurement and reporting to meet regulatory standards and ESG goals.
              </p>
            </div>

            {/* KPI */}
            <div className="flex items-center gap-6 mt-12">
              <div>
                <p className="text-xs text-black uppercase mb-1">
                 Built on industry-accepted methodologies
                </p>
               
              </div>

              
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* Image / Glow Card */}
            <div className="relative bg-[#d1cebb] rounded-2xl overflow-hidden min-h-[260px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d1cebb] via-[#b6a157] to-transparent blur-2xl" />
              <div className="relative p-8 h-full flex flex-col justify-end">
               
                <h4 className="text-xl font-medium">
                 Traditional methods miss key sources like methane leaks and flaring, leading to gaps in compliance and decarbonization
                </h4>
              </div>
            </div>

            {/* Feature Card */}
            <div className="bg-[#d1cebb] rounded-2xl p-8 flex items-center gap-6 min-h-[140px]">
              <TreeDeciduous className=" h-15 w-16" />
              <div>
                <p className="text-xs tracking-widest text-[#6c5f31]/20 uppercase mb-2">
                  Oil and Natural Gas
                </p>
                <h4 className="text-lg font-medium">
                 Provide real-time emissions monitoring across operations for accurate reporting 
                </h4>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Icons & Visuals -------------------------------- */

function MatrixVisual() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`w-12 h-12 rounded-md border ${
            [1, 6, 12].includes(i)
              ? 'border-[#6c5f31]'
              : i === 2 || i === 9
              ? 'border-black'
              : 'border-gray-400/30'
          }`}
        />
      ))}
    </div>
  )
}


