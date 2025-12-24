import Footer from '@/components/NewLanding/Footer'
import { ExpandableSection } from '@/components/oil-and-natural-gas/expandableSection'
import { HeroOilGas } from '@/components/oil-and-natural-gas/hero'
import React from 'react'

const page = () => {
  return (
    <div>
    <HeroOilGas />
    <ExpandableSection />
    <Footer />
    </div>
  )
}

export default page
