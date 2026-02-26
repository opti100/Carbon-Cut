'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { onboardingApi } from '@/services/onboardingApi'
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
  BulkOnboardingPayload,
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

const QUERY_KEY = ['onboarding-status'] as const

/**
 * Core onboarding hook.
 *
 * Provides:
 *  - status query (progress, saved data per step)
 *  - per-step save mutations
 *  - bulk save + complete mutation
 *  - helper to know which steps are done
 *
 * Usage:
 *   const { status, saveCloud, saveCdn, ... } = useOnboarding()
 */
export function useOnboarding() {
  const queryClient = useQueryClient()

  // ---- Status query ----
  const statusQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await onboardingApi.getStatus()
      return res.data
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  }, [queryClient])

  // ---- Step mutations ----

  const cloudMutation = useMutation({
    mutationFn: (data: CloudProviderData) =>
      onboardingApi.saveCloud(cloudToPayload(data)),
    onSuccess: invalidate,
  })

  const cdnMutation = useMutation({
    mutationFn: (data: CdnData) => onboardingApi.saveCdn(cdnToPayload(data)),
    onSuccess: invalidate,
  })

  const onpremMutation = useMutation({
    mutationFn: (data: OnPremData) => onboardingApi.saveOnprem(onpremToPayload(data)),
    onSuccess: invalidate,
  })

  const workforceMutation = useMutation({
    mutationFn: (data: WorkforceEmissionsData) =>
      onboardingApi.saveWorkforce(workforceToPayload(data)),
    onSuccess: invalidate,
  })

  const travelMutation = useMutation({
    mutationFn: (data: TravelData) => onboardingApi.saveTravel(travelToPayload(data)),
    onSuccess: invalidate,
  })

  const energyMutation = useMutation({
    mutationFn: (data: EnergyData) => onboardingApi.saveEnergy(energyToPayload(data)),
    onSuccess: invalidate,
  })

  const adsMutation = useMutation({
    mutationFn: (data: AdsData) => onboardingApi.saveAds(adsToPayload(data)),
    onSuccess: invalidate,
  })

  const machineryMutation = useMutation({
    mutationFn: (data: MachineryData) =>
      onboardingApi.saveMachinery(machineryToPayload(data)),
    onSuccess: invalidate,
  })

  const oilGasMutation = useMutation({
    mutationFn: (data: OilGasData) => onboardingApi.saveOilGas(oilGasToPayload(data)),
    onSuccess: invalidate,
  })

  const completeMutation = useMutation({
    mutationFn: () => onboardingApi.complete(),
    onSuccess: () => {
      invalidate()
      // Also invalidate the user query so AuthContext picks up onboarded = true
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })

  const bulkMutation = useMutation({
    mutationFn: (payload: BulkOnboardingPayload) => onboardingApi.saveBulk(payload),
    onSuccess: () => {
      invalidate()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })

  // ---- Derived state ----
  const steps = statusQuery.data?.steps
  const isComplete = statusQuery.data?.onboarding_completed ?? false
  const completedSteps = statusQuery.data?.completed_steps ?? 0
  const progressPct = statusQuery.data?.progress_pct ?? 0

  return {
    // Status
    status: statusQuery.data,
    isStatusLoading: statusQuery.isLoading,
    isStatusError: statusQuery.isError,
    refetchStatus: statusQuery.refetch,

    // Derived
    steps,
    isComplete,
    completedSteps,
    progressPct,

    // Per-step save
    saveCloud: cloudMutation.mutateAsync,
    isSavingCloud: cloudMutation.isPending,
    cloudError: cloudMutation.error,

    saveCdn: cdnMutation.mutateAsync,
    isSavingCdn: cdnMutation.isPending,
    cdnError: cdnMutation.error,

    saveOnprem: onpremMutation.mutateAsync,
    isSavingOnprem: onpremMutation.isPending,
    onpremError: onpremMutation.error,

    saveWorkforce: workforceMutation.mutateAsync,
    isSavingWorkforce: workforceMutation.isPending,
    workforceError: workforceMutation.error,

    saveTravel: travelMutation.mutateAsync,
    isSavingTravel: travelMutation.isPending,
    travelError: travelMutation.error,

    saveEnergy: energyMutation.mutateAsync,
    isSavingEnergy: energyMutation.isPending,
    energyError: energyMutation.error,

    saveAds: adsMutation.mutateAsync,
    isSavingAds: adsMutation.isPending,
    adsError: adsMutation.error,

    saveMachinery: machineryMutation.mutateAsync,
    isSavingMachinery: machineryMutation.isPending,
    machineryError: machineryMutation.error,

    saveOilGas: oilGasMutation.mutateAsync,
    isSavingOilGas: oilGasMutation.isPending,
    oilGasError: oilGasMutation.error,

    // Complete
    completeOnboarding: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,

    // Bulk
    saveBulk: bulkMutation.mutateAsync,
    isSavingBulk: bulkMutation.isPending,

    // Any step saving
    isSaving:
      cloudMutation.isPending ||
      cdnMutation.isPending ||
      onpremMutation.isPending ||
      workforceMutation.isPending ||
      travelMutation.isPending ||
      energyMutation.isPending ||
      adsMutation.isPending ||
      machineryMutation.isPending ||
      oilGasMutation.isPending ||
      completeMutation.isPending ||
      bulkMutation.isPending,
  }
}
