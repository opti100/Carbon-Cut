import { Check } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

const CalculatorPreFooter = () => {
  return (
    <div
      className="py-12 px-6 lg:px-28"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'url("/Calculator-Prefooter.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain',
      }}
    >
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-3xl lg:text-5xl lg:leading-tight tracking-tight font-medium text-white py-4">
              Achieve Net Zero, Smarter <br />
              with <span className="text-tertiary">CarbonCut</span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-start text-gray-300 font-semibold gap-2">
                <Check className="mt-1" />
                <span>Accurate Flexible insights at scale</span>
              </div>
              <div className="flex items-start text-gray-300 font-semibold gap-2">
                <Check className="mt-1" />
                <span>Navigate internal and external demands</span>
              </div>
              <div className="flex items-start text-gray-300 font-semibold gap-2">
                <Check className="mt-1" />
                <span>Automated, easy to use platform</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="mt-8 lg:mt-0 lg:ml-12">
            <p className="text-lg text-white py-2">
              Get a Free, personalized demo
            </p>
            <div className="flex gap-4">
              <Button
                className="bg-tertiary text-white px-6 py-3 rounded-md text-lg hover:bg-green-600 transition"
                asChild
              >
                <a href="/demo">Book Free Demo</a>
              </Button>
              <Button
                className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg hover:bg-orange-600 transition"
                asChild
              >
                <a href="#">Try Calculator</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPreFooter
