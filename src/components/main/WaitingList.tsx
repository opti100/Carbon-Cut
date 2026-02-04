'use client'

import React from 'react'
import Script from 'next/script'
import { PixelatedCanvas } from '../ui/pixelated-canvas'
import { BlurFade } from '../ui/blur-fade'

export default function WaitingList() {
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />

      <section className="min-h-screen bg-[#fcfdf6] flex items-center py-16">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col justify-center h-full font-mono">
              <BlurFade delay={0.1} inView>
                <p className="mb-4 text-xs sm:text-sm tracking-widest uppercase text-black/80">
                  Join the Waiting List
                </p>
                
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#6c5f31] leading-tight mb-8">
                  Be Part of the Carbon Revolution
                </h1>

                <p className="text-[#6c5f31] text-sm sm:text-base md:text-base mb-4 leading-relaxed">
                  Sign up to get early access and exclusive updates on our carbon tracking solutions. 
                  Every request consumes energy — we help you measure the emissions behind it.
                </p>
              </BlurFade>

              {/* <div className="max-w-lg mt-8">
                <PixelatedCanvas
                  src="/CarbonCut-fe/CC.svg"
                  width={500}
                  height={600}
                  cellSize={3}
                  dotScale={0.9}
                  shape="square"
                  backgroundColor="#fcfdf6"
                  dropoutStrength={0.4}
                  interactive
                  distortionStrength={3}
                  distortionRadius={80}
                  distortionMode="swirl"
                  followSpeed={0.2}
                  jitterStrength={4}
                  jitterSpeed={4}
                  sampleAverage
                  tintColor="#FFFFFF"
                  tintStrength={0.2}
                />
              </div> */}
            </div>

            {/* RIGHT COLUMN - Form */}
            <div className="flex items-center">
              <div className="w-full h-screen overflow-hidden rounded-xl">
                <iframe
                  data-tally-src="https://tally.so/r/jaP2BR?transparentBackground=1"
                  width="100%"
                  height="100%"
                  marginHeight={0}
                  marginWidth={0}
                  title="CarbonCut - Waiting List"
                  style={{ border: 0 }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}