import { Check } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

const PreFooter = () => {
  return (
    <div
      className='py-16 px-6 lg:px-28 bg-gray-50'
      style={{
        backgroundImage: 'url("/LandingGroup.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain'
      }}
    >
      <div className="max-w-4xl">
        <div className="text-left">
          <h2 className="text-4xl lg:text-5xl lg:leading-tight font-bold text-gray-900 mb-6">
            Partner in <span className="text-tertiary">Climate Accountability</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Work with us to bring measurable climate action into marketing.
          </p>

          <div className="space-y-4 mb-8">
            <div className='flex items-center gap-3 text-gray-800'>
              <div className="w-6 h-6  rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">Adopt CarbonCut for your campaigns</span>
            </div>
            <div className='flex items-center gap-3 text-gray-800'>
              <div className="w-6 h-6  rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">Integrate as an agency or platform</span>
            </div>
            <div className='flex items-center gap-3 text-gray-800'>
              <div className="w-6 h-6  rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">Collaborate on industry-wide solutions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreFooter