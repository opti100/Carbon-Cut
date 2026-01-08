
import { InternetAdsWebApp } from '@/components/internet/AdsApp'
import PricingHero from '@/components/internet/ContactUs'
import FAQInternet from '@/components/internet/faqInternet'
import { InternetHero } from '@/components/internet/hero'
import { DigitalEcosystemTwo } from '@/components/internet/DigitalEcosystemTwo'
import ImpactSection from '@/components/internet/impactsection'
import OtherFactor from '@/components/internet/otherFactor'
import Problem from '@/components/internet/problem'
import ProblemWeareSolving from '@/components/internet/ProblemSolving'
import WhatWeDoing from '@/components/internet/whatwedoing'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/main/Footer'


const page = () => {
  return (
    <LenisSmoothScroll>
      <InternetHero />
      <Problem />
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
