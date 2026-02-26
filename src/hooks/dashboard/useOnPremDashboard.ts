'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmissionConfig } from './useEmissionConfig'
import { dashboardApi } from '@/services/dashboardApi'
import { useSourceEmissions } from './useEmissionSources'

interface UseOnPremDashboardOptions {
  year: number
  month?: number
}

export function useOnPremDashboard({ year, month }: UseOnPremDashboardOptions) {
  const queryClient = useQueryClient()
  const config = useEmissionConfig()
  const emissions = useSourceEmissions({ source: 'onprem_server', year, month })

  const recalculate = useMutation({
    mutationFn: (data: {
      servers: any[]
      location_country_code: string
      pue: number
      month: number
      year: number
    }) => dashboardApi.calculateOnprem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    servers: config.onpremConfigs,
    hasConfig: config.onpremConfigs.length > 0,
    ...emissions,
    recalculate: recalculate.mutateAsync,
    isRecalculating: recalculate.isPending,
    isLoading: config.isLoading || emissions.isLoading,
  }
}