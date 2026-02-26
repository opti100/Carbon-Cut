'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/services/dashboardApi'
import type { EmissionSourceType } from '@/types/dashboard'

interface UseSourceEmissionsOptions {
  source: EmissionSourceType | EmissionSourceType[]
  year: number
  month?: number
}

export function useSourceEmissions({ source, year, month }: UseSourceEmissionsOptions) {
  const queryClient = useQueryClient()
  const sources = Array.isArray(source) ? source : [source]

  const analyticsQuery = useQuery({
    queryKey: ['analytics', year, month],
    queryFn: async () => {
      const res = await dashboardApi.getAnalytics(year, month)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    staleTime: 3 * 60 * 1000,
  })

  // Filter analytics to this source
  const sourceData = analyticsQuery.data?.source_breakdown?.filter((s: any) =>
    sources.includes(s.source)
  ) ?? []

  const totalKg = sourceData.reduce((sum: number, s: any) => sum + (s.value_kg || 0), 0)
  const totalPct = sourceData.reduce((sum: number, s: any) => sum + (s.percentage || 0), 0)

  // Find in monthly trend
  const monthlyTrend = analyticsQuery.data?.monthly_trend ?? []

  // Scope info for this source
  const scopeMatrix = analyticsQuery.data?.source_scope_matrix?.filter((s: any) =>
    sources.includes(s.source)
  ) ?? []

  return {
    sourceData,
    totalKg,
    totalTonnes: totalKg / 1000,
    totalPercentage: totalPct,
    monthlyTrend,
    scopeMatrix,
    overview: analyticsQuery.data?.overview,
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    refetch: analyticsQuery.refetch,
  }
}