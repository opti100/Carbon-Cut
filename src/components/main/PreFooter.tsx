'use client'

import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function PreFooter() {
  return (
    <>
      {/* Divider */}
      <div className="w-full border-t border-dashed border-text/10 my-8" />

      <section className="relative w-full min-h-screen bg-[#fcfdf6] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Card */}
          <div
            className="
              relative
              bg-[#d1cebb]
              rounded-2xl
              max-w-[1400px]
              min-h-[520px]
             px-4 sm:px-6 lg:px-8
              py-6 sm:py-8 lg:py-10
              flex flex-col justify-between
              overflow-hidden
            "
          >
            {/* Top — Animated Circles */}
            <div className="hidden lg:block self-start">
              <AnimatedCircles />
            </div>

            {/* Bottom — Content */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16">
              
              {/* Text Block */}
              <div className="max-w-4xl">
                <p className="mb-4 text-[10px] sm:text-xs tracking-widest uppercase text-black/80">
                  Get accurate reporting
                </p>

                <h2 className="font-bold text-[#6c5f31] leading-[1.1] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Get in Contact with <br className="hidden sm:block" />
                  Our Team
                </h2>

                <p className="mt-6  font-mono text-[10px] sm:text-xs tracking-wider text-black/80">
                  Every request consumes energy. We help you measure the emissions behind it.
                </p>
              </div>

              {/* CTA */}
              <div className="w-full lg:w-auto">
                <Link href="/early-adopters">
                  <button
                    type="button"
                    className="card-nav-cta-button px-6 py-3 rounded-xl text-sm sm:text-base w-full lg:w-auto"
                    style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                  >
                    Contact CarbonCut
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function AnimatedCircles() {
  return (
    <div className="relative pointer-events-none">
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 120 120"
        fill="none"
        animate={{
          rotate: 360,
          y: [0, -12, 0],
        }}
        transition={{
          rotate: {
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <circle cx="60" cy="60" r="36" stroke="#111" />
        <circle cx="64" cy="56" r="36" stroke="#111" />
        <circle cx="56" cy="64" r="36" stroke="#111" />
      </motion.svg>
    </div>
  )
}
