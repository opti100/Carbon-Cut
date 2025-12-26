import InternetAds from '@/components/internet/internet-ads/LandingPage'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import { Inter } from 'next/font/google'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
      <InternetAds />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
