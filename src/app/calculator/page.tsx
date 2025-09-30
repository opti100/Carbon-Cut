
import Calculator from '@/components/calculator/calculator'
import CalculatorFAQ from '@/components/calculator/CalculatorFAQ';
import CalculatorFooter from '@/components/calculator/CalculatorFooter';
import CalculatorPreFooter from '@/components/calculator/CalculatorPreFooter';
import Header from '@/components/calculator/Header';
import HowItWorksDemo from "@/components/HowItWorksDemo";
import Hero from '@/components/main/Hero';
import React from 'react'

const page = () => {
  return (
    <div>
      <Header/>
      <Calculator/>
      {/* <HowItWorksDemo/> */}
      <CalculatorFAQ/>
      <CalculatorPreFooter/>
      <CalculatorFooter/>
    </div>
  )
}

export default page
