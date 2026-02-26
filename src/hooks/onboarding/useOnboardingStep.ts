'use client'

import { useState, useCallback } from 'react'
import { useOnboarding } from './useOnboarding'
import type {
  CloudProviderData,
  CdnData,
  OnPremData,
  WorkforceEmissionsData,
  TravelData,
  EnergyData,
  AdsData,
  MachineryData,
  OilGasData,
} from '@/types/onboarding'
import {
  cloudToPayload,
  cdnToPayload,
  onpremToPayload,
  workforceToPayload,
  travelToPayload,
  energyToPayload,
  adsToPayload,
  machineryToPayload,
  oilGasToPayload,
} from './transforms'

type StepData = CloudProviderData | CdnData | OnPremData | WorkforceEmissionsData | TravelData | EnergyData | AdsData | MachineryData | OilGasData

interface UseOnboardingStepOptions {
  /** Current step number (1-9) */
  step: number
  /** Called after successful save — typically setStep(step + 1) */
  onSuccess?: () => void
  /** Called on error */
  onError?: (error: Error) => void
}

/**
 * Convenience hook for a single onboarding step.
 *
 * Encapsulates save logic, loading/error state, and
 * auto-advances on success.
 *
 * Usage:
 *   const { save, isSaving, error } = useOnboardingStep({
 *     step: 1,
 *     onSuccess: () => setStep(2),
 *   })
 *
 *   // In your "Next" button handler:
 *   await save(cloudProviderData)
 */
export function useOnboardingStep({ step, onSuccess, onError }: UseOnboardingStepOptions) {
  const {
    saveCloud,
    saveCdn,
    saveOnprem,
    saveWorkforce,
    saveTravel,
    saveEnergy,
    saveAds,
    saveMachinery,
    saveOilGas,
    isSavingCloud,
    isSavingCdn,
    isSavingOnprem,
    isSavingWorkforce,
    isSavingTravel,
    isSavingEnergy,
    isSavingAds,
    isSavingMachinery,
    isSavingOilGas,
  } = useOnboarding()

  const [error, setError] = useState<Error | null>(null)
  const [lastResult, setLastResult] = useState<any>(null)

  const save = useCallback(
    async (data: StepData) => {
      setError(null)
      try {
        let result: any

        switch (step) {
          case 1:
            result = await saveCloud(data as CloudProviderData)
            break
          case 2:
            result = await saveCdn(data as CdnData)
            break
          case 3:
            result = await saveOnprem(data as OnPremData)
            break
          case 4:
            result = await saveWorkforce(data as WorkforceEmissionsData)
            break
          case 5:
            result = await saveTravel(data as TravelData)
            break
          case 6:
            result = await saveEnergy(data as EnergyData)
            break
          case 7:
            result = await saveAds(data as AdsData)
            break
          case 8:
            result = await saveMachinery(data as MachineryData)
            break
          case 9:
            result = await saveOilGas(data as OilGasData)
            break
          default:
            throw new Error(`Invalid step: ${step}`)
        }

        setLastResult(result)
        onSuccess?.()
        return result
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        setError(e)
        onError?.(e)
        throw e
      }
    },
    [step, saveCloud, saveCdn, saveOnprem, saveWorkforce, saveTravel, saveEnergy, saveAds, saveMachinery, saveOilGas, onSuccess, onError]
  )

  const isSaving = (() => {
    switch (step) {
      case 1:
        return isSavingCloud
      case 2:
        return isSavingCdn
      case 3:
        return isSavingOnprem
      case 4:
        return isSavingWorkforce
      case 5:
        return isSavingTravel
      case 6:
        return isSavingEnergy
      case 7:
        return isSavingAds
      case 8:
        return isSavingMachinery
      case 9:
        return isSavingOilGas
      default:
        return false
    }
  })()

  return { save, isSaving, error, lastResult }
}