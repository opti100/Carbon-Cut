import { Check } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

const PreFooter = () => {
  return (
    <div
      className='py-12 px-6 lg:px-28 bg-gray-50'
      style={{
        backgroundImage: 'url("/LandingGroup.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain'
      }}
    >
      <div className="text-center mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="">
            <h2 className="text-3xl lg:text-6xl lg:leading-tight mx-auto text-left tracking-tight font-bold text-black">
              Partner in <br />
              <span className='text-tertiary'>Climate Accountability</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl text-left py-8">
              <span className='text-orange-500'>Work with CarbonCut </span> to bring measurable, real-time climate action
            </p>

            <div className='space-y-2 mb-8'>
              <div className='flex items-start text-left text-black font-semibold gap-2'>
                <Check className="mt-1 flex-shrink-0" />
                <span>Adopt CarbonCut</span>
              </div>

              <div className='flex items-start text-left text-black font-semibold gap-2'>
                <Check className="mt-1 flex-shrink-0" />
                <span>Integrate as an agency or platform</span>
              </div>

              <div className='flex items-start text-left text-black font-semibold gap-2'>
                <Check className="mt-1 flex-shrink-0" />
                <span>Collaborate on industry-wide solutions</span>
              </div>
            </div>

            <div className='text-left'>
              <Button
                className="bg-black text-white px-6 py-3 rounded-md text-lg hover:bg-gray-800 transition"
                asChild
              >
                <a href="/demo">Contact CarbonCut</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreFooter