'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/services/dashboardApi'
import type { ConfigData } from '@/types/dashboard'

export function useEmissionConfig() {
  const query = useQuery<ConfigData>({
    queryKey: ['emission-config'],
    queryFn: async () => {
      const res = await dashboardApi.getConfig()
      if (!res.success) throw new Error(res.error || 'Failed to load config')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })

  return {
    config: query.data,
    cloudProviders: query.data?.cloud_providers ?? [],
    cdnConfigs: query.data?.cdn_configs ?? [],
    workforceConfig: query.data?.workforce_config ?? null,
    onpremConfigs: query.data?.onprem_configs ?? [],
    travelConfigs: query.data?.travel_configs ?? [],
    isOnboarded: query.data?.onboarding_completed ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}