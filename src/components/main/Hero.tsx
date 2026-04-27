'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'

function LandingPageVideo({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <video
        src="/LandingPage.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={onLoad}
        onCanPlay={onLoad}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <section
      className="relative h-screen w-full isolate overflow-hidden"
      data-scroll-section
    >
      {/* Fallback image — absolutely positioned so it never affects normal flow */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 -z-20">
          <Image
            src="/CarbonCut-fe/hero3.jpg"
            alt="CarbonCut hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Video */}
      <div className="absolute inset-0 -z-20">
        <LandingPageVideo onLoad={() => setIsVideoLoaded(true)} />
      </div>

      {/* Darkening overlay — sits just above the video */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* Hero content */}
      <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-lg">
          Track - Decarbon - Report
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl drop-shadow">
          Co2e emission in real time
        </p>
        <p className="text-base md:text-lg lg:text-xl max-w-4xl drop-shadow">
          We provide real-time emissions intelligence for digital operations
        </p>
        <Link href="/signup" className="mt-16">
          <button
            className="px-6 py-3 rounded-lg text-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
          >
            Get In Touch
          </button>
        </Link>
      </div>
    </section>
  )
}

export default Hero
