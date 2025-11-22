
import CalculatorLanding from '@/components/calculator/calculatorLanding'
import CalculatorFAQ from '@/components/calculator/CalculatorFAQ';
import Header from '@/components/calculator/Header';
import Footer from '@/components/main/Footer';
import PreFooter from '@/components/main/PreFooter';
import React from 'react'

const page = () => {
  return (
    <div>
      <Header/>
      <CalculatorLanding/>
      {/* <CalculatorFAQ/>  */}
       {/* <PreFooter/> */}
       {/* <Footer /> */}
    </div>
  )
}

export default page
