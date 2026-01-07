import { HeroSectionWebApps } from '@/components/internet/web-&-app/Hero'
import WebAndApps from '@/components/internet/web-&-app/LandingPage'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/main/Footer'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
        <HeroSectionWebApps />
        <WebAndApps />
        <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page