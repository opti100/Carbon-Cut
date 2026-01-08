import CalculatorFAQ from '@/components/calculator/CalculatorFAQ'
import CalculatorLanding from '@/components/calculator/calculatorLanding'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/main/Footer'
import Navbar from '@/components/main/Navbar'
import PreFooter from '@/components/main/PreFooter'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
        <Navbar />
        <CalculatorLanding />
        <CalculatorFAQ />
        <PreFooter />
        <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
