'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/services/dashboardApi'
import type { AnalyticsData } from '@/types/dashboard'

interface UseAnalyticsOptions {
  year: number
  month?: number
  enabled?: boolean
}

export function useAnalytics({ year, month, enabled = true }: UseAnalyticsOptions) {
  const query = useQuery<AnalyticsData>({
    queryKey: ['analytics', year, month],
    queryFn: async () => {
      const res = await dashboardApi.getAnalytics(year, month)
      if (!res.success) throw new Error(res.error || 'Failed to load analytics')
      return res.data
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  })

  return {
    data: query.data,
    overview: query.data?.overview,
    scopeBreakdown: query.data?.scope_breakdown ?? [],
    sourceBreakdown: query.data?.source_breakdown ?? [],
    monthlyTrend: query.data?.monthly_trend ?? [],
    topContributors: query.data?.top_contributors ?? [],
    yoyComparison: query.data?.yoy_comparison,
    intensityMetrics: query.data?.intensity_metrics,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}