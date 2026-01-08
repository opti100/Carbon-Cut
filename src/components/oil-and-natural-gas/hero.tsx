'use client'

import { motion } from 'motion/react'
import CardNav from '../CardNav'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { navData } from '../NavData'

export function HeroOilGas() {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <video
          src="/Oil&Natural.mp4"
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content (single column, centered) */}
      <div className="relative z-10 flex min-h-screen  items-center ">
         <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto">
          
          <h1 className="text-white text-4xl md:text-5xl font-semibold leading-tight text-left ">
            Track oil and gas emissions across upstream, midstream, and downstream
            operations.
          </h1>

          <div className="mt-10 ">
            <div className="nav-right-section">
              <Link href="/oil-and-natural-gas/lubricant" className="desktop-cta-link">
                <button
                  type="button"
                  className="card-nav-cta-button "
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
