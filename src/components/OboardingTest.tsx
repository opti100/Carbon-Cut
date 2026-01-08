'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    content: (handleContinue: () => void) => (
      <div className="flex flex-col items-start gap-4 w-full max-w-xs">
        <Button
          className="bg-white text-gray-900 hover:bg-gray-100 border font-medium px-6 text-sm rounded-lg h-12 w-full gap-3"
          size="lg"
        >
          <Image src="/dsp/google-ads.svg" alt="Google Ads" width={24} height={24} />
          Connect with Google Ads
        </Button>
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loading accounts..." />
          </SelectTrigger>
        </Select>
        <Button
          onClick={handleContinue}
          className="mt-4 bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full"
        >
          Continue
        </Button>
      </div>
    ),
  },
  {
    id: 2,
    content: (handleContinue: () => void) => (
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          SDK Script Tag
          <span className="ml-2 text-xs font-normal text-gray-500">
            (Install this on your website)
          </span>
        </label>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono">
            {`<script 
  src="https://cdn.jsdelivr.net/gh/rishi-optiminastic/cc-cdn@main/dist/carboncut.min.js?v=2"
  data-token="cc_LeAktDLl23TQGdWHVkghUJSNOHYgzVh889dO9fRvYRTwv21Jx85bkrIk2Hu5Bemf"
  data-api-url="http://127.0.0.1:8000/api/v1/events/"
  data-debug="false"
  data-domain="*"
</script>`}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
          >
            Copy
          </Button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Placement:</strong> Add this script in the <code>&lt;head&gt;</code>{' '}
            or before closing <code>&lt;/body&gt;</code>.
          </p>
        </div>
        <Button
          onClick={handleContinue}
          className="mt-4 bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full"
        >
          Continue
        </Button>
      </div>
    ),
  },
  {
    id: 3,
    content: () => (
      <div className="flex flex-col items-start gap-4 w-full max-w-xs">
        <Button className="bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full">
          Create Campaign & Finish
        </Button>
      </div>
    ),
  },
]

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleContinue = () => {
    // Ensure the current step increments correctly
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }

  const yOffset = 350 // Vertical distance between steps

  return (
    <div className="h-screen flex items-center justify-center p-6 relative bg-[#f7f7f1] overflow-hidden">
      <div className="w-full max-w-4xl h-[500px] relative">
        {/* Animated Container for all steps */}
        <motion.div
          className="h-full"
          animate={{ y: -currentStep * yOffset }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="w-full h-full flex absolute"
              style={{ top: index * yOffset }}
            >
              {/* Left Side: Step Indicator */}
              <div className="w-1/2 h-full flex items-center justify-center relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 mt-8 h-full w-px bg-gray-200" />
                )}
                <div className="bg-white border border-dashed rounded-full h-16 w-16 flex items-center justify-center z-10">
                  {step.id}
                </div>
              </div>

              {/* Right Side: Step Content */}
              <motion.div
                className="w-1/2 h-full flex flex-col items-start justify-center"
                initial={false}
                animate={{
                  filter: index === currentStep ? 'blur(0px)' : 'blur(4px)',
                  opacity: index === currentStep ? 1 : 0.5,
                }}
                transition={{ duration: 0.4 }}
              >
                {step.content(handleContinue)}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Page
