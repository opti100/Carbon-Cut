import React from 'react'
import CalculatorForm from './calculator-form'
import CalculatorLanding from './calculatorLanding'
import PreFooter from '../main/PreFooter'

const Calculator = () => {
  return (
    <main className="min-h-screen">
      {/* <CalculatorForm/> */}
      <CalculatorLanding />
      <PreFooter />
    </main>
  )
}

export default Calculator
