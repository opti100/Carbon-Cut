import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import BusinessImpact from '@/components/lubricants/BusinessImpact'
import { CarbonCutFix } from '@/components/lubricants/CarbonCutFix'
import Comparision from '@/components/lubricants/Comparision'
import ContactSection from '@/components/lubricants/Contact'
import ContactUs from '@/components/lubricants/ContactUs'
import Hero from '@/components/lubricants/Hero'
import LubricantHowWorks from '@/components/lubricants/LubricantHowWorks'
import Problem from '@/components/lubricants/Problem'
import TechnicalEngine from '@/components/lubricants/TechnicalEngine'
import WhoUses from '@/components/lubricants/WhoUses'
import Footer from '@/components/main/Footer'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
        <Hero />
        <Problem />
        <CarbonCutFix />
        <LubricantHowWorks />
        <WhoUses />
        <BusinessImpact />
        <Comparision />
        <TechnicalEngine />
        <ContactSection />
        <ContactUs />
        <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
