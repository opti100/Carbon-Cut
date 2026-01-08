'use client'

import { FileCheck2, Gauge, Leaf, Radar, Recycle } from 'lucide-react'
import UniversalHeading from '../UniversalHeading'
import Link from 'next/link'

export default function Lubricant() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
        {/* LEFT IMAGE */}
        <div className="hidden lg:block min-h-screen w-full">
          <img
            src="/oil-natural-gas/Track-Report.png"
            alt="Tracking & aReporting"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="flex flex-col justify-center items-center px-6 sm:px-8 md:px-12 bg-[#d1cebb] bg-[url('/texture.png')] bg-cover bg-blend-overlay lg:min-h-screen py-12 lg:py-0">
          <div className="space-y-6 text-black w-full max-w-6xl">
            <UniversalHeading
              title="Tracking & Reporting"
              className="whitespace-nowrap text-left sm:text-left"
            />

            <p className="text-sm sm:text-base md:text-base leading-relaxed opacity-90">
              We help organizations accurately measure and manage the carbon emissions
              associated with lubricants across their full lifecycle — from raw material
              extraction and blending to distribution, use, and end-of-life.
            </p>

            <div>
              <p className="text-md sm:text-base font-semibold leading-relaxed opacity-90 mb-3">
                What we Track
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Recycle className="h-5 w-5 mr-2 mt-1" />
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    Lifecycle-based carbon footprinting for lubricant products
                  </p>
                </li>
                <li className="flex items-start">
                  <Gauge className="h-5 w-5 mr-2 mt-1" />
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    Product-level emissions intensity metrics
                  </p>
                </li>
                <li className="flex items-start">
                  <FileCheck2 className="h-5 w-5 mr-2 mt-1" />
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    Data-backed ESG and regulatory reporting
                  </p>
                </li>
                <li className="flex items-start">
                  <Radar className="h-5 w-5 mr-2 mt-1" />
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    Identification of emission hotspots across the value chain
                  </p>
                </li>
                <li className="flex items-start">
                  <Leaf className="h-5 w-5 mr-2 mt-1" />
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    Support for low-carbon and alternative lubricant strategies
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <Link href="/oil-and-natural-gas/lubricant">
                <button
                  type="button"
                  className="px-6 py-2 rounded-md font-semibold text-sm sm:text-base"
                  style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                >
                  Lubricant
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
