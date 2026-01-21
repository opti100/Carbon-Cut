'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Key, Trash2, Power, Clock, AlertCircle, Loader2, Shield, Copy, Eye, EyeOff, Check, ExternalLink } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiKeyService } from '@/services/apikey/apikey'
import { ConversionRulesDialog } from './ConversionRuleDialog'

export function ApiKeysList() {
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)
  const [verifyKeyId, setVerifyKeyId] = useState<string | null>(null)
  const [conversionRulesKeyId, setConversionRulesKeyId] = useState<string | null>(null)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
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

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const handleCopyKey = async (apiKey: { id: string; prefix: string; key?: string }) => {
    const keyToCopy = apiKey.key || `${apiKey.prefix}••••••••••••••••`
    
    try {
      await navigator.clipboard.writeText(keyToCopy)
      setCopiedKeyId(apiKey.id)
      setTimeout(() => setCopiedKeyId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatApiKey = (apiKey: { id: string; prefix: string; key?: string }) => {
    const isVisible = visibleKeys.has(apiKey.id)
    if (isVisible && apiKey.key) {
      return apiKey.key
    }
    return `${apiKey.prefix}••••••••••••••••••••••••••••••••••••••••••••••••`
  }

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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600 text-sm">Loading API keys...</span>
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
      <div className="text-center py-8">
        <Key className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Create your first API key to start integrating CarbonCut with your applications.
        </p>
      </div>
    )
  }

  const selectedApiKey = apiKeys.find((key) => key.id === verifyKeyId)
  const selectedConversionApiKey = apiKeys.find((k) => k.id === conversionRulesKeyId)

  return (
    <>
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/30">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <Key className="h-4 w-4 text-gray-500 shrink-0" />
                  <h3 className="font-medium text-gray-900 truncate">{apiKey.name}</h3>
                  <Badge
                    variant={apiKey.is_active ? 'default' : 'secondary'}
                    className={`text-xs shrink-0 ${
                      apiKey.is_active
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {apiKey.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* API Key Display */}
                <div className="flex items-center gap-2 mb-3 bg-white border border-gray-200 rounded-md p-2">
                  <code className="flex-1 font-mono text-xs text-gray-700 overflow-hidden">
                    {formatApiKey(apiKey)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="h-7 w-7 p-0 shrink-0"
                    title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKey(apiKey)}
                    className="h-7 w-7 p-0 shrink-0"
                    title="Copy API Key"
                  >
                    {copiedKeyId === apiKey.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Domain */}
                {apiKey.domain && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <span className="text-gray-500">Domain:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                      {apiKey.domain}
                    </code>
                  </div>
                )}

                {/* Source Type */}
                {/* {apiKey.source_type && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <span className="text-gray-500">Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {apiKey.source_type === 'web' ? 'Website' : 'Ads'}
                    </Badge>
                  </div>
                )} */}

                {/* Timestamps */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Created {format(new Date(apiKey.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {apiKey.last_used_at && (
                    <div className="flex items-center gap-1">
                      <span>
                        Last used {format(new Date(apiKey.last_used_at), 'MMM d')}
                      </span>
                    </div>
                  )}
                  {/* {apiKey.installation_verified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Shield className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConversionRulesKeyId(apiKey.id)}
                  className="text-xs h-8"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Rules
                </Button>

                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVerifyKeyId(apiKey.id)}
                  className="h-8 w-8 p-0"
                  title="Verify Installation"
                >
                  <Shield className="h-3 w-3 text-blue-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMutation.mutate(apiKey.id)}
                  disabled={toggleMutation.isPending}
                  className="h-8 w-8 p-0"
                  title={apiKey.is_active ? 'Deactivate' : 'Activate'}
                >
                  <Power
                    className={`h-3 w-3 ${
                      apiKey.is_active ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                </Button> */}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteKeyId(apiKey.id)}
                  disabled={deleteMutation.isPending}
                  className="h-8 w-8 p-0"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Delete */}
      {deleteKeyId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete API Key</h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. This will permanently delete the API key and any integrations using it will stop working.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteKeyId(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(deleteKeyId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* {selectedApiKey && (
        <VerifyInstallationDialog
          open={verifyKeyId !== null}
          onOpenChange={(open) => !open && setVerifyKeyId(null)}
          apiKeyId={selectedApiKey.id}
          apiKeyName={selectedApiKey.name}
          apiKeyPrefix={selectedApiKey.prefix}
        />
      )} */}
      
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