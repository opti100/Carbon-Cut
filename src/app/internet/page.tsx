
import { InternetAdsWebApp } from '@/components/internet/AdsApp'
import PricingHero from '@/components/internet/ContactUs'
import { DigitalEcosystem } from '@/components/internet/DigitalEcosystem'
import FAQInternet from '@/components/internet/faqInternet'
import { InternetHero } from '@/components/internet/hero'

import HowInternetWorks from '@/components/internet/howInternetWorks'
import { DigitalEcosystemTwo } from '@/components/internet/DigitalEcosystemTwo'
import ImpactSection from '@/components/internet/impactsection'
import OtherFactor from '@/components/internet/otherFactor'
import Problem from '@/components/internet/problem'
import ProblemWeareSolving from '@/components/internet/ProblemSolving'
import WhatWeDoing from '@/components/internet/whatwedoing'
import Footer from '@/components/NewLanding/Footer'
import PreFooter from '@/components/NewLanding/PreFooter'
import React from 'react'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'


const page = () => {
  return (
    <LenisSmoothScroll>
      <InternetHero />
      <Problem />
      {/* <HowInternetWorks /> */}
      {/* <DigitalEcosystem /> */}
      <InternetAdsWebApp />
      <ImpactSection />
      <WhatWeDoing />
      <ProblemWeareSolving />
      <OtherFactor />
      <DigitalEcosystemTwo />
      <FAQInternet />
      <PricingHero />
      <Footer />
    </LenisSmoothScroll>
  )
}

export default page
