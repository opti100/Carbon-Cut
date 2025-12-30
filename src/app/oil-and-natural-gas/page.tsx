import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/NewLanding/Footer'
import { CoreCapabilities } from '@/components/oil-and-natural-gas/Core-Capabilities'
import { ExpandableSection } from '@/components/oil-and-natural-gas/expandableSection'
import { HeroOilGas } from '@/components/oil-and-natural-gas/hero'
import WhatWeDo from '@/components/oil-and-natural-gas/WhatWeDo'
import WhyItMatters from '@/components/oil-and-natural-gas/whyMatters'
import Lenis from 'lenis'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
        <HeroOilGas />
        <WhyItMatters />
        <WhatWeDo />
        <CoreCapabilities />
        {/* <ExpandableSection /> */}
        <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
