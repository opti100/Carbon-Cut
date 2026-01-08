'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Copy,
  CheckCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { CreateApiKeyDialog } from '@/components/dashboard/api-key/CreateAPIKeyDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface ApiKeyStepProps {
  onComplete: () => void
}

export default function ApiKeyStep({ onComplete }: ApiKeyStepProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [installationGuide, setInstallationGuide] = useState<any>(null)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const queryClient = useQueryClient()

  const {
    data: apiKeysData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const result = await ApiKeyService.getApiKeys()
      return result
    },
    retry: 1,
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const latestApiKey = apiKeys.length > 0 ? apiKeys[0] : null

  useEffect(() => {
    const fetchInstallationGuide = async () => {
      if (latestApiKey && !installationGuide) {
        setLoadingGuide(true)
        try {
          const response = await ApiKeyService.getInstallationGuide(latestApiKey.id)
          setInstallationGuide(response.data.installation)
        } catch (error) {
          console.error('Error fetching installation guide:', error)
          toast.error('Failed to load installation guide')
        } finally {
          setLoadingGuide(false)
        }
      }
    }

    fetchInstallationGuide()
  }, [latestApiKey, installationGuide])

  const handleDialogChange = (open: boolean) => {
    setShowCreateDialog(open)
    if (!open) {
      refetch()
    }
  }

  const handleCopyScript = async () => {
    if (!installationGuide?.script_tag) return
    await navigator.clipboard.writeText(installationGuide.script_tag)
    setCopiedScript(true)
    toast.success('Script copied to clipboard!')
    setTimeout(() => setCopiedScript(false), 2000)
  }

  const handleCopyKey = async () => {
    if (!latestApiKey) return
    // Copy the prefix (this is just for display, the full key was shown during creation)
    await navigator.clipboard.writeText(latestApiKey.prefix)
    setCopiedKey(true)
    toast.info('API key prefix copied')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleVerify = async () => {
    if (!verificationUrl.trim() || !latestApiKey) return

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const result = await ApiKeyService.verifyInstallation(
        latestApiKey.id,
        verificationUrl
      )
      setVerificationResult(result)

      if (result.data.status === 'verified') {
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
        toast.success('Installation verified successfully!')
      } else {
        toast.warning('Verification completed with warnings')
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Failed to verify installation')
      setVerificationResult({
        success: false,
        data: {
          status: 'error',
          message: 'Failed to verify installation',
        },
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRetryGuide = async () => {
    if (!latestApiKey) return
    setLoadingGuide(true)
    try {
      const response = await ApiKeyService.getInstallationGuide(latestApiKey.id)
      setInstallationGuide(response.data.installation)
      toast.success('Installation guide loaded')
    } catch (error) {
      console.error('Error fetching installation guide:', error)
      toast.error('Failed to load installation guide')
    } finally {
      setLoadingGuide(false)
    }
  }

  const handleSkipVerification = () => {
    toast.info('You can verify installation later from your profile')
    onComplete()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs text-tertiary font-semibold mb-3">STEP 2 OF 3</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        API Key & Script Installation
      </h2>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {!latestApiKey
          ? "Create an API key by providing your website domain. You'll receive the SDK script to install on your site."
          : 'Your API key has been created. Install the SDK script on your website to start tracking campaigns.'}
      </p>

      <div className="space-y-6 mb-8">
        {!latestApiKey ? (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                <strong>Step 1:</strong> Enter your website domain to generate an API key
                and get your installation script.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="w-full bg-tertiary hover:bg-tertiary/90"
            >
              Create API Key
            </Button>
          </>
        ) : (
          <>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>API Key Created!</strong> Your key has been generated for{' '}
                <strong>{latestApiKey.domain || 'your domain'}</strong>
              </AlertDescription>
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Your API Key
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={`${latestApiKey.prefix}`}
                  readOnly
                  className="flex-1 bg-gray-50 font-mono"
                />
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleCopyKey}
                  title="Copy key prefix"
                >
                  {copiedKey ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Key name: {latestApiKey.name} • Domain:{' '}
                {latestApiKey.domain || 'All domains'} • Created:{' '}
                {new Date(latestApiKey.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SDK Script Tag
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (Install this on your website)
                </span>
              </label>
              {loadingGuide ? (
                <Skeleton className="h-32 w-full rounded-lg" />
              ) : installationGuide ? (
                <>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-lg px-4 py-3 text-xs overflow-x-auto font-mono">
                      {installationGuide.script_tag}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyScript}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                    >
                      {copiedScript ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {installationGuide.placement && (
                    <Alert className="mt-3 bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800 text-sm">
                        <strong>Installation:</strong> {installationGuide.placement}
                      </AlertDescription>
                    </Alert>
                  )}
                  {installationGuide.next_steps &&
                    installationGuide.next_steps.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Next Steps:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                          {installationGuide.next_steps.map(
                            (step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            )
                          )}
                        </ol>
                      </div>
                    )}
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center justify-between">
                    <span>Failed to load installation guide.</span>
                    <Button variant="outline" size="sm" onClick={handleRetryGuide}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Collapsible open={showVerification} onOpenChange={setShowVerification}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm font-medium">
                    {showVerification ? 'Hide' : 'Show'} Optional Verification
                  </span>
                  {showVerification ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Verify Installation (Optional)
                  </p>
                  <p className="text-xs text-gray-600 mb-4">
                    Enter your website URL to verify the SDK is properly installed. You
                    can skip this step and verify later.
                  </p>

                  {verificationResult && (
                    <div className="mb-4">
                      {verificationResult.data.status === 'verified' ? (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Installation verified successfully! ✅ All checks passed.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            {verificationResult.data.message ||
                              'Verification completed with warnings.'}
                            {verificationResult.data.warnings &&
                              verificationResult.data.warnings.length > 0 && (
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                  {verificationResult.data.warnings.map(
                                    (warning: string, idx: number) => (
                                      <li key={idx}>{warning}</li>
                                    )
                                  )}
                                </ul>
                              )}
                          </AlertDescription>
                        </Alert>
                      )}

                      {verificationResult.data.details && (
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div
                            className={`flex items-center gap-1.5 text-xs ${
                              verificationResult.data.details.sdk_script_found
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full ${
                                verificationResult.data.details.sdk_script_found
                                  ? 'bg-green-100'
                                  : 'bg-red-100'
                              } flex items-center justify-center text-xs`}
                            >
                              {verificationResult.data.details.sdk_script_found
                                ? '✓'
                                : '✕'}
                            </span>
                            SDK Script
                          </div>
                          <div
                            className={`flex items-center gap-1.5 text-xs ${
                              verificationResult.data.details.token_found
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full ${
                                verificationResult.data.details.token_found
                                  ? 'bg-green-100'
                                  : 'bg-red-100'
                              } flex items-center justify-center text-xs`}
                            >
                              {verificationResult.data.details.token_found ? '✓' : '✕'}
                            </span>
                            API Token
                          </div>
                          <div
                            className={`flex items-center gap-1.5 text-xs ${
                              verificationResult.data.details.correct_token
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full ${
                                verificationResult.data.details.correct_token
                                  ? 'bg-green-100'
                                  : 'bg-red-100'
                              } flex items-center justify-center text-xs`}
                            >
                              {verificationResult.data.details.correct_token ? '✓' : '✕'}
                            </span>
                            Correct Token
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={verificationUrl}
                      onChange={(e) => setVerificationUrl(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                    />
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifying || !verificationUrl.trim()}
                      className="bg-gray-900 hover:bg-gray-800 whitespace-nowrap"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>

                  <a
                    href="/docs/installation"
                    target="_blank"
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline flex items-center gap-1"
                  >
                    View Installation Guide
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-3">
              <Button
                onClick={handleSkipVerification}
                variant="outline"
                className="flex-1"
              >
                Skip Verification
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1 bg-tertiary hover:bg-tertiary/90"
                disabled={!installationGuide}
              >
                Continue to Campaigns
              </Button>
            </div>
          </>
        )}
      </div>

      {!latestApiKey && (
        <CreateApiKeyDialog open={showCreateDialog} onOpenChange={handleDialogChange} />
      )}
    </>
  )
}
