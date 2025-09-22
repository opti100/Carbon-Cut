
import Calculator from '@/components/calculator/calculator'
import CalculatorFAQ from '@/components/calculator/CalculatorFAQ';
import CalculatorFooter from '@/components/calculator/CalculatorFooter';
import CalculatorPreFooter from '@/components/calculator/CalculatorPreFooter';
import HowItWorksDemo from "@/components/HowItWorksDemo";
import React from 'react'

const page = () => {
  return (
    <div>
      <Calculator/>
      {/* <HowItWorksDemo/> */}
      <CalculatorFAQ/>
      <CalculatorPreFooter/>
      <CalculatorFooter/>
    </div>
  )
}

export default page
