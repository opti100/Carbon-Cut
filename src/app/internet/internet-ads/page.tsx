import { HeroInternetAds } from '@/components/internet/internet-ads/HeroInternetAds'
import InternetAds from '@/components/internet/internet-ads/LandingPage'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/main/Footer'
import { Inter } from 'next/font/google'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
         <HeroInternetAds />
      <InternetAds />
      <Footer />
      </LenisSmoothScroll>

    </div>
  )
}

export default page
