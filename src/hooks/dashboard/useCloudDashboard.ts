'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmissionConfig } from './useEmissionConfig'
import { useMonthlyReport } from './useMonthlyReport'
import { dashboardApi } from '@/services/dashboardApi'
import { useSourceEmissions } from './useEmissionSources'

interface UseCloudDashboardOptions {
  year: number
  month: number
}

export function useCloudDashboard({ year, month }: UseCloudDashboardOptions) {
  const queryClient = useQueryClient()
  const config = useEmissionConfig()
  const emissions = useSourceEmissions({
    source: ['cloud_aws', 'cloud_gcp', 'cloud_azure'],
    year,
    month,
  })
  const monthly = useMonthlyReport({ year, month })

  const submitCost = useMutation({
    mutationFn: (data: { provider: string; monthly_cost_usd: number }) =>
      dashboardApi.submitCloudEntry(year, month, {
        provider: data.provider,
        entry_type: 'cloud_cost',
        monthly_cost_usd: data.monthly_cost_usd,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-report', year, month] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  const uploadCSV = useMutation({
    mutationFn: (formData: FormData) => dashboardApi.uploadCloudCSV(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-report', year, month] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    // Config from onboarding
    providers: config.cloudProviders,
    hasConfig: config.cloudProviders.length > 0,

    // Emissions
    ...emissions,

    // Monthly status
    monthlyReport: monthly.report,
    pendingEntries: monthly.pendingEntries,

    // Actions
    submitCost: submitCost.mutateAsync,
    isSubmittingCost: submitCost.isPending,
    uploadCSV: uploadCSV.mutateAsync,
    isUploadingCSV: uploadCSV.isPending,

    isLoading: config.isLoading || emissions.isLoading,
  }
}