import FormSection from '@/components/adopters/form'
import Form from '@/components/adopters/form'
import HeroSectionOne from '@/components/adopters/hero'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'

import React from 'react'

const page = () => {
  return (
    <div className="w-full">
      <LenisSmoothScroll>
        <HeroSectionOne />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
