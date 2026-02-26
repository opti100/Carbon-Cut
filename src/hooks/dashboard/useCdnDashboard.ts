'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmissionConfig } from './useEmissionConfig'

import { useMonthlyReport } from './useMonthlyReport'
import { dashboardApi } from '@/services/dashboardApi'
import { useSourceEmissions } from './useEmissionSources'

interface UseCdnDashboardOptions {
  year: number
  month: number
}

export function useCdnDashboard({ year, month }: UseCdnDashboardOptions) {
  const queryClient = useQueryClient()
  const config = useEmissionConfig()
  const emissions = useSourceEmissions({ source: 'cdn', year, month })
  const monthly = useMonthlyReport({ year, month })

  const submitEntry = useMutation({
    mutationFn: (data: { gb_transferred: number }) =>
      dashboardApi.submitCDNEntry(year, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-report', year, month] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    cdnConfigs: config.cdnConfigs,
    hasConfig: config.cdnConfigs.length > 0,
    ...emissions,
    monthlyReport: monthly.report,
    pendingEntries: monthly.pendingEntries,
    submitEntry: submitEntry.mutateAsync,
    isSubmitting: submitEntry.isPending,
    isLoading: config.isLoading || emissions.isLoading,
  }
}