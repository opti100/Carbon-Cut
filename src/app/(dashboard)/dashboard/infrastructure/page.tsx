'use client'
import InfrastructureContent from '@/components/dashboard/website/InfrastructureContent'
import { useQuery } from '@tanstack/react-query'
import { onboardingApi } from '@/services/onboarding/onboarding'
import { Loader2 } from 'lucide-react'

export default function InfrastructurePage() {
  const { data: configData, isLoading } = useQuery({
    queryKey: ['userConfig'],
    queryFn: () => onboardingApi.getConfig(),
    staleTime: 30000,
  })

  const config = configData?.data || {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <InfrastructureContent config={config} />
      </div>
    </div>
  )
}