import BusinessImpact from '@/components/lubricants/BusinessImpact'
import CarbonCutFix from '@/components/lubricants/CarbonCutFix'
import Comparision from '@/components/lubricants/Comparision'
import ContactUs from '@/components/lubricants/ContactUs'
import Hero from '@/components/lubricants/Hero'
import LubricantHowWorks from '@/components/lubricants/LubricantHowWorks'
import Problem from '@/components/lubricants/Problem'
import TechnicalEngine from '@/components/lubricants/TechnicalEngine'
import WhoUses from '@/components/lubricants/WhoUses'
import Footer from '@/components/NewLanding/Footer'
import Navbar from '@/components/NewLanding/Navbar'
import SignupFormDemo from '@/components/signup-form-demo'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Problem />
      <CarbonCutFix />
      <LubricantHowWorks />
      <WhoUses />
      <BusinessImpact />
      <Comparision />
      <TechnicalEngine />
      <ContactUs />


    </div>
  )
}

export default page
