'use client'
import SetupContent from '@/components/dashboard/website/SetupContent'
import { useQuery } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { Loader2 } from 'lucide-react'

export default function SetupPage() {
  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: ['apiKeys', 'web'],
    queryFn: () => ApiKeyService.getApiKeys(),
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const webApiKey = apiKeys[0]

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
        <SetupContent apiKey={webApiKey} />
      </div>
    </div>
  )
}