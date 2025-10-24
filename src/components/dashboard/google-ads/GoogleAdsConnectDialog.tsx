"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Link2, Loader2, RefreshCw, ShieldCheck, CheckCircle2, Unlink, ExternalLink } from "lucide-react";

import { googleAdsApi } from '@/services/google-ads';
import { Badge } from '@/components/ui/badge';

interface GoogleAdsConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isConnected?: boolean;
  onSuccess?: () => void;
}

export function GoogleAdsConnectDialog({
  open,
  onOpenChange,
  isConnected,
  onSuccess
}: GoogleAdsConnectDialogProps) {
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: connectionStatus, isLoading: checkingConnection, refetch } = useQuery({
    queryKey: ['google-ads-connection'],
    queryFn: googleAdsApi.checkConnection,
    enabled: open,
  });

  const disconnectMutation = useMutation({
    mutationFn: (credentialId: string) => googleAdsApi.disconnect(credentialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] });
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      refetch();
    },
  });


  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const authUrl = 'http://localhost:8000/api/v1/impressions/google/redirect-url/';
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'Google Ads Authorization',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setIsConnecting(false);
          setTimeout(() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
          }, 1000);
        }
      }, 500);

    } catch (err) {
      console.error('❌ OAuth error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_ADS_AUTH_SUCCESS') {
        setIsConnecting(false);
        refetch();
        if (onSuccess) onSuccess();
      } else if (event.data.type === 'GOOGLE_ADS_AUTH_ERROR') {
        setError(event.data.error || 'Authentication failed');
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Google Ads Integration
          </DialogTitle>
          <DialogDescription>
            {connectionStatus?.is_connected
              ? 'Your Google Ads account is connected'
              : 'Connect your Google Ads account to start tracking campaigns'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {checkingConnection ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : connectionStatus?.is_connected ? (
            // Connected State
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your Google Ads account is successfully connected. You can now create and track campaigns.
                </AlertDescription>
              </Alert>

              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    Connected
                  </Badge>
                </div>

                {connectionStatus.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account</span>
                    <span className="text-sm text-muted-foreground">
                      {connectionStatus.email}
                    </span>
                  </div>
                )}

                {connectionStatus.customer_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer ID</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {connectionStatus.customer_id}
                    </span>
                  </div>
                )}

                {connectionStatus.connected_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Connected</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(connectionStatus.connected_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => refetch()}
                  disabled={checkingConnection}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (confirm('Are you sure you want to disconnect Google Ads?')) {
                      // You'll need to get the credential ID from the connection status
                      // disconnectMutation.mutate(credentialId);
                    }
                  }}
                  disabled={disconnectMutation.isPending}
                >
                  {disconnectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            // Not Connected State
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Connecting Google Ads allows you to:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Track campaign performance</li>
                    <li>Monitor ad impressions</li>
                    <li>Calculate carbon emissions</li>
                    <li>Generate detailed reports</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-3">What we&apos;ll access:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Campaign performance data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Impression and click metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Ad group and creative information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Geographic and device data</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-blue-900 text-sm">
                      Secure OAuth 2.0 Authentication
                    </h4>
                    <p className="text-xs text-blue-700">
                      Your credentials are never stored. We use Google&apos;s official OAuth flow
                      to securely access your data with your permission.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {connectionStatus?.is_connected ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to disconnect Google Ads?')) {
                    // You'll need to get the credential ID from the connection status
                    // disconnectMutation.mutate(credentialId);
                  }
                }}
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="mr-2 h-4 w-4" />
                )}
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-[#4285F4] hover:bg-[#357ABD]"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect with Google
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}