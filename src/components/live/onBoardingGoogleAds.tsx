"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { useGoogleAds } from "@/contexts/GoogleAdsContext"
import { GoogleAdsConnectDialog } from "@/components/dashboard/google-ads/GoogleAdsConnectDialog"

interface OnboardingGoogleAdsProps {
  onNext: () => void
}

export default function OnboardingGoogleAds({ onNext }: OnboardingGoogleAdsProps) {
  const { status, isLoading, accounts, accountsLoading, switchAccount } = useGoogleAds()
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(status?.customer_id || "")
  const [isSwitching, setIsSwitching] = useState(false)

  const isConnected = status?.is_connected === true

  const handleAccountChange = async (customerId: string) => {
    if (!customerId || customerId === status?.customer_id) return

    try {
      setIsSwitching(true)
      setSelectedAccount(customerId)
      await switchAccount(customerId)
    } catch (error) {
      console.error("Failed to switch account:", error)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleConnectionSuccess = () => {
    setConnectDialogOpen(false)
    // Wait for status to update, then auto-advance if customer_id is set
    setTimeout(() => {
      if (status?.customer_id) {
        onNext()
      }
    }, 500)
  }

  useEffect(() => {
    if (isConnected && status?.customer_id && !isSwitching) {
      setSelectedAccount(status.customer_id)
    }
  }, [isConnected, status?.customer_id, isSwitching])

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-md">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Connect Google Ads</h3>
        {/* <p className="text-sm text-gray-600">
          Connect your Google Ads account to start tracking campaigns. After connection, select one of your customer accounts to proceed.
        </p> */}
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <div className="space-y-4 w-full">
          {/* <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You&apos;ll be redirected to Google to authorize CarbonCut to access your Google Ads data. We only request read-only permissions.
            </AlertDescription>
          </Alert> */}

          {/* Connect Button */}
          <Button
            onClick={() => setConnectDialogOpen(true)}
            disabled={isLoading}
            className="bg-white text-gray-900 hover:bg-gray-100 border font-medium px-6 text-sm rounded-lg h-12 w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Connect with Google Ads
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <label htmlFor="account-select" className="text-sm font-medium text-gray-900">
              Select Customer Account
            </label>
            {accountsLoading ? (
              <Select disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loading accounts..." />
                </SelectTrigger>
              </Select>
            ) : accounts.length === 0 ? (
              <div className="p-4 border rounded-md bg-muted text-center">
                <p className="text-sm text-gray-600">No Google Ads accounts found.</p>
              </div>
            ) : (
              <Select
                value={selectedAccount}
                onValueChange={handleAccountChange}
                disabled={isSwitching}
              >
                <SelectTrigger id="account-select" className="w-full">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="truncate">{account.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                          {account.id}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {isSwitching && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Switching account...
              </p>
            )}
          </div>

          {/* Continue Button */}
          <Button
            onClick={onNext}
            disabled={!selectedAccount || isSwitching || accountsLoading}
            className="mt-2 bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full h-11"
            size="lg"
          >
            Continue to Next Step
          </Button>
        </div>
      )}

      {/* Google Ads Connect Dialog */}
      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={isConnected}
        onSuccess={handleConnectionSuccess}
      />
    </div>
  )
}