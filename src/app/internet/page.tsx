
import { InternetAdsWebApp } from '@/components/internet/AdsApp'
import { HeroInternet } from '@/components/internet/hero'
import HowInternetWorks from '@/components/internet/howInternetWorks'
import HowWeCalculate from '@/components/internet/HowWeCalculate'
import { ImpactSection } from '@/components/internet/impactsection'
import Problem from '@/components/internet/problem'
import Footer from '@/components/NewLanding/Footer'
import PreFooter from '@/components/NewLanding/PreFooter'
import React from 'react'


const page = () => {
  return (
    <div>
      <HeroInternet />
      <Problem />
      <InternetAdsWebApp />
      <HowWeCalculate />
      <ImpactSection />
      <Footer />    
    </div>
  )
}

export default page
