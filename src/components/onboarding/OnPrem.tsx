"use client";

import React from 'react'
import FloatingInput from '../ui/FloatingInput'
import { OnPremData } from '@/types/onboarding'
import clsx from 'clsx'

interface Props {
  data: OnPremData;
  onDataChange: (data: OnPremData) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

const OnPrem = ({ data, onDataChange, onBack, onNext, canProceed }: Props) => {
    
  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8">
        On-Premises
      </h1>

      <div className="flex flex-col gap-4 sm:gap-6">
        <FloatingInput 
          placeholder="Name" 
          size="medium"
          value={data.name}
          onChange={(value) => onDataChange({ ...data, name: value })}
        />
        <FloatingInput 
        type='number'
          placeholder="CPU cores" 
          size="medium"
          value={data.cpuCores}
          onChange={(value) => onDataChange({ ...data, cpuCores: value })}
        />
        <FloatingInput 
        type='number'
          placeholder="RAM (GB)" 
          size="medium"
          value={data.ramGB}
          onChange={(value) => onDataChange({ ...data, ramGB: value })}
        />
        <FloatingInput 
        type='number'
          placeholder="Storage (TB)" 
          size="medium"
          value={data.storageTB}
          onChange={(value) => onDataChange({ ...data, storageTB: value })}
        />
        <FloatingInput 
        type='number'
          placeholder="AVG CPU Utilization" 
          size="medium"
          value={data.avgCpuUtilization}
          onChange={(value) => onDataChange({ ...data, avgCpuUtilization: value })}
        />
        <FloatingInput 
        type='number'
          placeholder="Hours/Day" 
          size="medium"
          value={data.hoursPerDay}
          onChange={(value) => onDataChange({ ...data, hoursPerDay: value })}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto min-w-[120px] rounded-md border border-neutral-300 px-6 py-2.5 text-sm sm:text-base font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={clsx(
            "w-full sm:w-auto min-w-[120px] rounded-md px-6 py-2.5 text-sm sm:text-base font-medium text-white transition-colors",
            canProceed 
              ? "bg-black hover:bg-neutral-800 cursor-pointer" 
              : "bg-neutral-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default OnPrem
