'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmissionConfig } from './useEmissionConfig'
import { dashboardApi } from '@/services/dashboardApi'
import { useSourceEmissions } from './useEmissionSources'

interface UseWorkforceDashboardOptions {
  year: number
  month?: number
}

export function useWorkforceDashboard({ year, month }: UseWorkforceDashboardOptions) {
  const queryClient = useQueryClient()
  const config = useEmissionConfig()
  const emissions = useSourceEmissions({
    source: ['workforce_office', 'workforce_remote'],
    year,
    month,
  })

  const recalculate = useMutation({
    mutationFn: (data: {
      total_employees: number
      remote_percentage: number
      office_locations: any[]
      month: number
      year: number
    }) => dashboardApi.calculateWorkforce(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    workforceConfig: config.workforceConfig,
    hasConfig: config.workforceConfig !== null,
    totalEmployees: config.workforceConfig?.total_employees ?? 0,
    remotePercentage: config.workforceConfig?.remote_employee_percentage ?? 0,
    locations: config.workforceConfig?.office_locations ?? [],
    ...emissions,
    recalculate: recalculate.mutateAsync,
    isRecalculating: recalculate.isPending,
    isLoading: config.isLoading || emissions.isLoading,
  }
}