import { Check } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button' // adjust if you're using another button component

const PreFooter = () => {
    return (
        <div className='bg-[#FFD02F] py-12 px-6 lg:px-28'>
            <div className="text-center mb-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    {/* Left Content */}
                    <div className="flex-1">
                        <h2 className="text-3xl lg:text-5xl lg:leading-tight mx-auto text-left tracking-tight font-medium text-black">
                            Achieve Net Zero, Smarter <br />
                            with CarbonCut
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl text-left py-8">
                            Turn climate action into a competitive advantage
                        </p>

                        <div className='flex items-start text-left text-black font-semibold gap-2'>
                            <Check className="mt-1" />
                            <span>Accurate Flexible insights at scale</span>
                        </div>
                        <div className='flex items-start text-left text-black font-semibold gap-2 mt-2'>
                            <Check className="mt-1" />
                            <span>Navigate internal and external demands</span>
                        </div>
                        <div className='flex items-start text-left text-black font-semibold gap-2 mt-2'>
                            <Check className="mt-1" />
                            <span>Automated, easy to use platform</span>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-0 lg:ml-12">
                        <p className="text-lg text-gray-600 max-w-3xl text-left py-2">
                            Get a Free, personalized demo
                        </p>
                        <Button
                            className="bg-black text-white px-6 py-3 rounded-md text-lg hover:bg-gray-800 transition"
                            asChild
                        >
                            <a href="/demo">Book Free Demo</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreFooter
