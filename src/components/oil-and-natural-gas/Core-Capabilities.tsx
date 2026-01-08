'use client'
import { StickyScroll } from '../ui/sticky-scroll-reveal'

import React, { useEffect, useRef, useState } from 'react'
import { BlurFade } from '../ui/blur-fade'
import UniversalHeading from '../UniversalHeading'
import AnimatedHeading from '../internet/InternetHeading'

const content = [
  {
    description: ' Drilling, production, and methane monitoring',
    title: (
      <AnimatedHeading text="Upstream Emissions" className="text-3xl font-semibold" />
    ),
  },
  {
    description: 'Compressor stations, pipelines, and processing plants',
    title: (
      <AnimatedHeading text="Midstream Tracking" className="text-3xl font-semibold" />
    ),
  },
  {
    description: 'Refineries, terminals, distribution networks',
    title: (
      <AnimatedHeading text="Downstream Footprint " className="text-3xl font-semibold" />
    ),
  },
  {
    description: 'Every tonne tied to a certificate trail + smart-contract record',
    title: <AnimatedHeading text="Verified Path" className="text-3xl font-semibold" />,
  },
]

export function CoreCapabilities() {
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <UniversalHeading title="Core Capabilities" align="right" />

        <div className="w-full bg-[#fcfdf6]">
          <StickyScroll content={content} />
        </div>
      </div>
    </>
  )
}
