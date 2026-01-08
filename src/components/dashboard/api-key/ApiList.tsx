'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Key, Trash2, Power, Clock, AlertCircle, Loader2, Shield } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiKeyService } from '@/services/apikey/apikey'
import { VerifyInstallationDialog } from './VerifyInstallationDialog'
import { ConversionRulesDialog } from './ConversionRuleDialog'

export function ApiKeysList() {
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)
  const [verifyKeyId, setVerifyKeyId] = useState<string | null>(null)
  // hold the apiKey id for which the conversion rules dialog is open
  const [conversionRulesKeyId, setConversionRulesKeyId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('🚀 ApiKeysList component mounted')
    console.log('🔑 Checking cookies:', document.cookie)
  }, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      console.log('⏳ Starting API keys fetch...')
      const result = await ApiKeyService.getApiKeys()
      console.log('📦 Query result:', result)
      return result
    },
    retry: 1,
    staleTime: 30000,
  })

  const deleteMutation = useMutation({
    mutationFn: (keyId: string) => ApiKeyService.deleteApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      setDeleteKeyId(null)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (keyId: string) => ApiKeyService.toggleApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
  })

  // Handle the response structure from backend
  const apiKeys = data?.data?.api_keys || []

  console.log('📊 Current state:', {
    isLoading,
    hasError: !!error,
    dataExists: !!data,
    apiKeysCount: apiKeys.length,
    rawData: data,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading API keys...</span>
      </div>
    )
  }

  if (error) {
    console.error('❌ Error loading API keys:', error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load API keys:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
          <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (apiKeys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Key className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Create your first API key to start integrating CarbonCut with your
            applications.
          </p>
        </CardContent>
      </Card>
    )
  }

  const selectedApiKey = apiKeys.find((key) => key.id === verifyKeyId)
  // selected conversion rules apiKey (for Verify dialog it's separate)
  const selectedConversionApiKey = apiKeys.find((k) => k.id === conversionRulesKeyId)

  return (
    <>
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="bg-[#fcfdf6] border-none">
            <CardContent className="p-6 ">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                    <Badge
                      variant={apiKey.is_active ? 'default' : 'secondary'}
                      className={
                        apiKey.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {apiKey.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{apiKey.prefix}••••••••••••••••</span>
                    </div>
                    {apiKey.domain && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Domain:</span>
                        <span className="font-medium">{apiKey.domain}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Created {format(new Date(apiKey.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {apiKey.last_used_at && (
                      <div className="flex items-center gap-1">
                        <span>
                          Last used {format(new Date(apiKey.last_used_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="bg-[#fcfdf6] shadow-none hover:bg-[#fcfdf6] text-[#6c5f31]"
                    onClick={() => setConversionRulesKeyId(apiKey.id)}
                  >
                    Manage Conversions
                  </Button>

                  <ConversionRulesDialog
                    apiKeyId={apiKey.id}
                    apiKeyName={apiKey.name}
                    open={conversionRulesKeyId === apiKey.id}
                    onOpenChange={(open) => {
                      // when dialog is closed, clear the id; when opened via dialog control, ensure id is set
                      if (open) setConversionRulesKeyId(apiKey.id)
                      else setConversionRulesKeyId(null)
                    }}
                  />
                  <Button
                    className="bg-[#fcfdf6] shadow-none hover:bg-[#fcfdf6]"
                    size="sm"
                    onClick={() => setVerifyKeyId(apiKey.id)}
                    title="Verify Installation"
                  >
                    <Shield className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    className="bg-[#fcfdf6] shadow-none hover:bg-[#fcfdf6]"
                    size="sm"
                    onClick={() => toggleMutation.mutate(apiKey.id)}
                    disabled={toggleMutation.isPending}
                    title={apiKey.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <Power
                      className={`h-4 w-4 ${
                        apiKey.is_active ? 'text-green-600' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                  <Button
                    className="bg-[#fcfdf6] shadow-none hover:bg-[#fcfdf6]/  "
                    size="sm"
                    onClick={() => setDeleteKeyId(apiKey.id)}
                    disabled={deleteMutation.isPending}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedApiKey && (
        <VerifyInstallationDialog
          open={verifyKeyId !== null}
          onOpenChange={(open) => !open && setVerifyKeyId(null)}
          apiKeyId={selectedApiKey.id}
          apiKeyName={selectedApiKey.name}
          apiKeyPrefix={selectedApiKey.prefix}
        />
      )}
      {selectedConversionApiKey && (
        <ConversionRulesDialog
          apiKeyId={selectedConversionApiKey.id}
          apiKeyName={selectedConversionApiKey.name}
          open={conversionRulesKeyId !== null}
          onOpenChange={(open) => !open && setConversionRulesKeyId(null)}
        />
      )}
    </>
  )
}
