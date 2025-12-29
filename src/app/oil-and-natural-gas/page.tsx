import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/NewLanding/Footer'
import { ExpandableSection } from '@/components/oil-and-natural-gas/expandableSection'
import { HeroOilGas } from '@/components/oil-and-natural-gas/hero'
import WhyItMatters from '@/components/oil-and-natural-gas/whyMatters'
import Lenis from 'lenis'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
        <HeroOilGas />
        <WhyItMatters />
        {/* <ExpandableSection /> */}
        <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
