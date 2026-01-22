'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
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

  const handleVideoLoad = () => setIsVideoLoaded(true)

  useEffect(() => {
    if (isVideoLoaded) {
      const t = setTimeout(() => {}, 100)
      return () => clearTimeout(t)
    }
  }, [isVideoLoaded])

  return (
    <section className="relative h-screen w-full px-4 sm:px-6 lg:px-8" data-scroll-section>
      {!isVideoLoaded && (
        <div className="w-full h-full overflow-hidden rounded-xl">
          <Image
            src="/CarbonCut-fe/hero3.jpg"
            alt="Carbon Cut Logo"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="absolute inset-0 -z-10">
        <LandingPageVideo onLoad={handleVideoLoad} />
      </div>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center space-y-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
          Track - Decarbon - Report
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl">
          Co2e emission in real time
        </p>
        <p className="text-base md:text-lg lg:text-xl max-w-4xl px-4">
          We provide real-time emissions intelligence for digital operations
        </p>
        <Link href="/signup" className='mt-16'> 
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