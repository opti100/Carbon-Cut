'use client'
import { RealtimeEmissionsWidget } from '@/components/dashboard/website/RealtimePage' // Adjust path if needed
import { useQuery } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { Loader2 } from 'lucide-react'

export default function RealtimePage() {
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
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6">
        {webApiKey ? (
          <RealtimeEmissionsWidget apiKey={webApiKey?.prefix || webApiKey?.key} />
        ) : (
          <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] py-16 text-center">
            <p className="text-[13px] text-gray-500 font-medium">Setting up real-time tracking…</p>
          </div>
        )}
      </div>
    </div>
  )
}