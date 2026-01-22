'use client'

import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import { CardDescription, CardHeader, CardTitle } from '../ui/card'
import { error } from 'console'

interface ApiKeyStepProps {
  onNext?: () => void
  sourceType?: 'ads' | 'web' // NEW: Accept source type from parent
}

export default function ApiKeyStep({ onNext, sourceType = 'web' }: ApiKeyStepProps) {
  const [isCreating, setIsCreating] = useState(false)

  // Fetch API keys filtered by source type
  const {
    data: apiKeysData,
    isLoading: isLoadingKeys,
    isError: isKeysError,
    refetch,
  } = useQuery({
    queryKey: ['apiKeys', sourceType],
    queryFn: () => ApiKeyService.getApiKeys(sourceType),
    staleTime: 30000,
  })

  // Get the latest API key of the specified type
  const latestApiKey = apiKeysData?.data?.api_keys?.[0]

  const {
    data: installationGuideData,
    isLoading: isLoadingGuide,
    isError: isGuideError,
  } = useQuery({
    queryKey: ['installationGuide', latestApiKey?.id],
    queryFn: () => ApiKeyService.getInstallationGuide(latestApiKey?.id ?? ''),
    enabled: !!latestApiKey,
  })

  const hasAttemptedCreate = useRef(false)

  // Auto-create API key if none exists for this type

useEffect(() => {
  if (
    hasAttemptedCreate.current ||
    isLoadingKeys ||
    latestApiKey ||
    isKeysError
  ) {
    return
  }

  hasAttemptedCreate.current = true

  const create = async () => {
    try {
      const keyName =
        sourceType === 'ads' ? 'Ads Tracking Key' : 'Website Tracking Key'
      await ApiKeyService.createApiKey(keyName, '*', sourceType)
      toast.success('API key created')
      refetch()
    } catch {
      toast.error('Failed to create API key')
    }
  }

  create()
}, [isLoadingKeys, latestApiKey, isKeysError, sourceType])

  useEffect(() => {
    console.log('--- SDK Step Debug ---')
    console.log('Source Type:', sourceType)
    if (isLoadingKeys) {
      console.log('1. Loading API keys...')
    }
    if (isKeysError) {
      console.error('1. Error fetching API keys.')
    }
    if (apiKeysData) {
      console.log('1. API Keys Data Received:', apiKeysData)
      if (apiKeysData.data?.api_keys?.length > 0) {
        console.log('2. Found API Keys:', apiKeysData.data.api_keys)
        console.log('3. Latest API Key selected:', latestApiKey)
      } else {
        console.warn('2. No API keys found for source type:', sourceType)
        // console.error(error)
      }
    }
  }, [apiKeysData, isLoadingKeys, isKeysError, latestApiKey, sourceType])

  useEffect(() => {
    if (latestApiKey) {
      if (isLoadingGuide) {
        console.log('4. Loading Installation Guide for key ID:', latestApiKey.id)
      }
      if (isGuideError) {
        console.error('4. Error fetching Installation Guide.')
      }
      if (installationGuideData) {
        console.log('5. Installation Guide Data Received:', installationGuideData)
      }
    }
  }, [installationGuideData, isLoadingGuide, isGuideError, latestApiKey])

  const installationGuide = installationGuideData?.data?.installation
  const scriptTag = installationGuide?.script_tag || ''

  const handleCopy = () => {
    if (!scriptTag) return
    navigator.clipboard.writeText(scriptTag)
    toast.success('Script copied to clipboard!')
  }

  const isLoading = isLoadingKeys || (!!latestApiKey && isLoadingGuide) || isCreating

  return (
    <div className="w-full ">
      {/* <div>
        <h1 className="block text-sm font-medium text-black mb-2 mt-2">
          {' '}
          Install SDK for Web & Apps{' '}
        </h1>
        <p className=" text-xs font-normal text-gray-800">
          {' '}
          Follow these steps to integrate our tracking SDK into your Web & Apps{' '}
        </p>
      </div> */}
      {/* <label className="block text-sm font-medium text-black mb-2 mt-10">
        {sourceType === 'ads' ? 'Ads Tracking' : 'Website/App'} SDK Script Tag
        <span className="ml-2 text-xs font-normal text-gray-800">
          (Install this on your website)
        </span>
      </label> */}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4  overflow-x-auto font-mono min-h-[240px]">
          {isLoading ? 'Loading script...' : scriptTag || 'Creating API key...'}
        </pre>
        <Button
          size="sm"
          onClick={handleCopy}
          disabled={isLoading || !scriptTag}
          className="absolute top-2 right-2 bg-transparent hover:bg-transparent   text-white hover:text-gray-700/70  z-10"
        >
          <Copy className="" />
        </Button>
      </div>
      <div className="my-4 text-sm text-gray-800 space-y-2">
        <p>
          <strong>Placement:</strong> Add this script in the <code>&lt;head&gt;</code> or
          before closing <code>&lt;/body&gt;</code>.
        </p>  
      </div>

      <div className="">
        <Button
          onClick={onNext}
          disabled={isLoading || !scriptTag}
          className="card-nav-cta-button mt-5"
          style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
