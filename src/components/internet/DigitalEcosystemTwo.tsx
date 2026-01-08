'use client'
import { StickyScroll } from '../ui/sticky-scroll-reveal'

import React, { useEffect, useRef, useState } from 'react'
import AnimatedHeading from './InternetHeading'
import { BlurFade } from '../ui/blur-fade'
import UniversalHeading from '../UniversalHeading'

const content = [
  {
    description:
      'Track emissions from transactions, API calls, data processing, and customer authentication systems. Meet ESG requirements that investors and regulators demand.',
    title: (
      <AnimatedHeading
        text="Fintech & Digital Banking"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Measure the carbon cost of your platform's compute power, storage, and data transfer. Show customers you're serious about sustainability.",
    title: (
      <AnimatedHeading
        text="SaaS / Enterprise Software"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      'From product browsing to checkout, understand the emissions your online store generates. Factor in payment processing, inventory systems, and recommendation engines.',
    title: <AnimatedHeading text="E-Commerce" className="text-3xl font-semibold" />,
  },
  {
    description:
      'Your content library has a carbon cost. Track emissions from encoding, storage, CDN delivery, and billions of streaming minutes.',
    title: (
      <AnimatedHeading
        text="Media Streaming & Content Platforms"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Every ad served, every email sent, every course delivered—measure it all. Prove to clients and students that you're building a sustainable future.",
    title: (
      <AnimatedHeading
        text="Digital Advertising, MarTech & EdTech"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      'Beyond the emissions from the trips you facilitate, track the digital operations powering your booking systems, route optimisation, and real-time updates.',
    title: (
      <AnimatedHeading
        text="Mobility & Travel Platforms"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      'Rendering, processing, file storage, and collaboration tools all have environmental impact. Show your community you care about more than just the final product.',
    title: (
      <AnimatedHeading
        text="Gaming, Design & Creator Platforms"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "If you're building the backbone of the internet, you need transparency into your emissions. We help you track, report, and optimize at scale.",
    title: (
      <AnimatedHeading
        text="Telecom, Cloud & Internet Infrastructure"
        className="text-3xl font-semibold"
      />
    ),
  },
]

export function DigitalEcosystemTwo() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <UniversalHeading
          title="Built for the Entire Digital Ecosystem"
          description="Whether you're disrupting finance or revolutionising entertainment, we understand your business:"
          align="right"
        />

        <div className="w-full bg-[#fcfdf6]">
          <StickyScroll content={content} />
        </div>
      </div>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
    </>
  )
}
