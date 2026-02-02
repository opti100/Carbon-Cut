'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Info,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'

export default function GoogleAdsCallbackPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [status, setStatus] = useState<
    'processing' | 'success' | 'error' | 'create_account'
  >('processing')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const showCreateAccount = searchParams.get('showCreateAccount')

    if (error) {
      if (error === 'no_customer_accounts' && showCreateAccount === 'true') {
        setStatus('create_account')
        setMessage('No Google Ads account found. You need to create one to continue.')
        return
      }

      setStatus('error')
      setMessage(`Authentication failed: ${error}`)

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_ADS_AUTH_ERROR',
            error: error,
          },
          window.location.origin
        )
      }
      return
    }

    if (success === 'true') {
      setStatus('success')
      setMessage('Successfully connected to Google Ads!')

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_ADS_AUTH_SUCCESS',
            success: true,
          },
          window.location.origin
        )
      }

      // Close window after 3 seconds
      setTimeout(() => {
        window.close()
      }, 3000)
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] })
      return
    }

    if (!code || !state) {
      setStatus('error')
      setMessage('Missing authorization code or state parameter')

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_ADS_AUTH_ERROR',
            error: 'Missing parameters',
          },
          window.location.origin
        )
      }
      return
    }

    setStatus('success')
    setMessage('Successfully connected to Google Ads!')

    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'GOOGLE_ADS_AUTH_SUCCESS',
          code,
          state,
        },
        window.location.origin
      )
    }

    // Close window after 3 seconds
    setTimeout(() => {
      window.close()
    }, 3000)
  }, [searchParams, queryClient])

  const handleCreateGoogleAdsAccount = () => {
    window.open('https://business.google.com/in/google-ads/', '_blank')
  }

  const handleRetryConnection = () => {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'GOOGLE_ADS_RETRY_CONNECTION',
        },
        window.location.origin
      )
    }
    window.close()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'processing' && (
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            )}
            {status === 'success' && (
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
            {status === 'create_account' && (
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Info className="h-8 w-8 text-orange-600" />
              </div>
            )}
          </div>
          <CardTitle>
            {status === 'processing' && 'Connecting to Google Ads'}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Failed'}
            {status === 'create_account' && 'Google Ads Account Required'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                This window will close automatically in 3 seconds...
              </AlertDescription>
            </Alert>
          )}

          {status === 'create_account' && (
            <div className="space-y-6">
              <Alert className="bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  To connect CarbonCut to Google Ads, you need an active Google Ads
                  account.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What you&apos;ll need:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• A Google account (Gmail)</li>
                    <li>• Business information</li>
                    <li>• Website URL (optional)</li>
                    <li>• Billing information</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCreateGoogleAdsAccount}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Google Ads Account
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    Already have a Google Ads account?
                  </div>

                  <Button
                    onClick={handleRetryConnection}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Try Connection Again
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-800">
                    After creating your Google Ads account, it may take a few minutes to
                    become active. You can retry the connection once your account is set
                    up.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button onClick={() => window.close()} variant="outline" className="w-full">
                Close Window
              </Button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center text-sm text-muted-foreground">
              Please wait while we complete the authorization...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}