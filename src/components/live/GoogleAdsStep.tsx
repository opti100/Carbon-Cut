"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleAdsConnectDialog } from "@/components/dashboard/google-ads/GoogleAdsConnectDialog";
import { useRouter, usePathname } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface GoogleAdsStepProps {
  onComplete: () => void;
}

export default function GoogleAdsStep({ onComplete }: GoogleAdsStepProps) {
  const { status, isLoading, accounts, accountsLoading, switchAccount } = useGoogleAds();
  const {  user, isLoading: authLoading } = useAuth();
  console.log("Auth User in GoogleAdsStep:", user);
  const { isAuthenticated, redirectToLogin, redirectToSignup } = useAuthRedirect();
  console.log("isAuthenticated in GoogleAdsStep:", isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(status?.customer_id || "");
  const [isSwitching, setIsSwitching] = useState(false);

  const isConnected = status?.is_connected === true;

  const handleAccountChange = async (customerId: string) => {
    if (!customerId || customerId === status?.customer_id) return;

    try {
      setIsSwitching(true);
      setSelectedAccount(customerId);
      await switchAccount(customerId);
    } catch (error) {
      console.error("Failed to switch account:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleConnectionSuccess = () => {
    setConnectDialogOpen(false);
    if (status?.customer_id) {
      setTimeout(() => onComplete(), 500);
    }
  };

  React.useEffect(() => {
    if (isConnected && status?.customer_id && !isSwitching) {
      setSelectedAccount(status.customer_id);
    }
  }, [isConnected, status?.customer_id, isSwitching]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-tertiary font-medium">
            STEP 1 OF 3
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Connect Google Ads Account</h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-tertiary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-tertiary font-medium">
            STEP 1 OF 3
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Connect Google Ads Account</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            You need to log in to your account to connect Google Ads and start tracking campaigns.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => redirectToLogin()}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            Login
          </Button>
          <Button
           onClick={() => redirectToSignup()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
          >
            Signup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-tertiary font-medium">
          STEP 1 OF 3
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Connect Google Ads Account</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Connect your Google Ads account to start tracking campaigns. After connection, select one of your customer accounts to proceed with campaign setup.
        </p>
      </div>

      {/* Connection Card */}
      <div className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You&apos;ll be redirected to Google to authorize CarbonCut to access your Google Ads data. We only request read-only permissions.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setConnectDialogOpen(true)}
              disabled={isLoading}
              className="bg-white text-gray-900 hover:bg-gray-100 border font-medium px-6 py-2.5 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Google Ads account connected successfully!
              </AlertDescription>
            </Alert>

            {/* Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="account-select" className="text-sm font-medium">
                Select Customer Account
              </Label>
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
                  <SelectTrigger id="account-select">
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
            <div className="pt-2">
              <Button
                onClick={onComplete}
                disabled={!selectedAccount || isSwitching || accountsLoading}
                className="w-full bg-tertiary hover:bg-tertiary/90 text-white"
                size="lg"
              >
                Continue to Next Step
              </Button>
            </div>
          </div>
        )}
      </div>

      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={isConnected}
        onSuccess={handleConnectionSuccess}
      />
    </div>
  );
}