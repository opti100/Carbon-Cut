'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/services/dashboardApi'
import type { MonthlyReportStatus } from '@/types/dashboard'

interface UseMonthlyReportOptions {
  year: number
  month: number
  enabled?: boolean
}

export function useMonthlyReport({ year, month, enabled = true }: UseMonthlyReportOptions) {
  const queryClient = useQueryClient()
  const key = ['monthly-report', year, month]

  const query = useQuery<MonthlyReportStatus>({
    queryKey: key,
    queryFn: async () => {
      const res = await dashboardApi.getMonthlyReport(year, month)
      return res.data
    },
    staleTime: 2 * 60 * 1000,
    enabled,
  })

  const recalculate = useMutation({
    mutationFn: () => dashboardApi.recalculateMonth(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    report: query.data,
    dataSources: query.data?.data_sources ?? [],
    pendingEntries: query.data?.pending_entries ?? 0,
    isComplete: query.data?.is_complete ?? false,
    totalKg: query.data?.total_emissions_kg ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    recalculate: recalculate.mutateAsync,
    isRecalculating: recalculate.isPending,
  }
}