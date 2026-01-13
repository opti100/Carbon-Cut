import React from 'react'
import WebAndApps from '../internet/web-&-app/LandingPage'
import ApiKeyStep from '@/components/live/onboardingSdk'
interface Props {
      onNext: () => void;
      canProceed: boolean;
    }
export default function Sdk({ onNext }: Props ) {
    
  return (
    <div>
       <ApiKeyStep  sourceType="web" />

          <div className="flex items-center justify-end pt-6 border-t border-neutral-200">
                
                <button className='min-w-[140px] rounded-lg px-8 py-3 text-base font-medium text-white transition-all  bg-black hover:bg-neutral-800 cursor-pointer shadow-sm hover:shadow'
                  onClick={onNext}
                >
                  Continue
                </button>
              </div>
    </div>
  )
}
