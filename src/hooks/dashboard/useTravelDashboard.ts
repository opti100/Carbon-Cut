'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmissionConfig } from './useEmissionConfig'

import { useMonthlyReport } from './useMonthlyReport'
import { dashboardApi } from '@/services/dashboardApi'
import { useSourceEmissions } from './useEmissionSources'

interface UseTravelDashboardOptions {
  year: number
  month: number
}

export function useTravelDashboard({ year, month }: UseTravelDashboardOptions) {
  const queryClient = useQueryClient()
  const config = useEmissionConfig()
  const emissions = useSourceEmissions({
    source: ['travel_flight', 'travel_rail', 'travel_road'],
    year,
    month,
  })
  const monthly = useMonthlyReport({ year, month })

  const submitTrips = useMutation({
    mutationFn: (data: { trips: any[] }) =>
      dashboardApi.submitTravelEntry(year, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-report', year, month] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    travelConfigs: config.travelConfigs,
    hasConfig: config.travelConfigs.length > 0,
    ...emissions,
    monthlyReport: monthly.report,
    pendingEntries: monthly.pendingEntries,
    submitTrips: submitTrips.mutateAsync,
    isSubmitting: submitTrips.isPending,
    isLoading: config.isLoading || emissions.isLoading,
  }
}