"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  LogOut,
  Info 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGoogleAds } from '@/contexts/GoogleAdsContext';

interface GoogleAdsConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isConnected?: boolean;
  onSuccess?: () => void;
}

// Constants
const DIALOG_WIDTH = 500;
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 700;
const REFRESH_DELAY = 500;
const STATUS_REFRESH_DELAY = 1000;

export function GoogleAdsConnectDialog({
  open,
  onOpenChange,
  isConnected,
  onSuccess
}: GoogleAdsConnectDialogProps) {
  const {
    status,
    isLoading: statusLoading,
    accounts,
    accountsLoading,
    disconnect,
    switchAccount,
    fetchAccounts,
    checkConnection,
  } = useGoogleAds();
  
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(
    status?.customer_id || ''
  );

  const isConnectedState = status?.is_connected === true;
  useEffect(() => {
    if (status?.customer_id) {
      setSelectedAccountId(status.customer_id);
    }
  }, [status?.customer_id]);

  useEffect(() => {
    if (!open) return;

    console.log('Dialog opened, checking connection...');
    const timer = setTimeout(() => {
      checkConnection();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [open, checkConnection]);

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const authUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/impressions/google/redirect-url/`;
      const left = window.screen.width / 2 - POPUP_WIDTH / 2;
      const top = window.screen.height / 2 - POPUP_HEIGHT / 2;

      const popup = window.open(
        authUrl,
        'Google Ads Authorization',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setIsConnecting(false);
          console.log('Popup closed, refreshing connection status...');
          
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
            queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] });
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            checkConnection();
          }, REFRESH_DELAY);
        }
      }, 500);

    } catch (err) {
      console.error('OAuth error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
    }
  }, [checkConnection, queryClient]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      console.log('Received message:', event.data);

      if (event.data.type === 'GOOGLE_ADS_AUTH_SUCCESS') {
        console.log('Auth success message received');
        setIsConnecting(false);
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
          queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] });
          checkConnection();
          onSuccess?.();
        }, STATUS_REFRESH_DELAY);
      } else if (event.data.type === 'GOOGLE_ADS_AUTH_ERROR') {
        console.error('Auth error message received:', event.data.error);
        setError(event.data.error || 'Authentication failed');
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, checkConnection, queryClient]);

  const handleDisconnect = useCallback(async () => {
    if (!confirm('Are you sure you want to disconnect your Google Ads account?')) {
      return;
    }

    setIsDisconnecting(true);
    setError(null);
    
    try {
      console.log('Disconnecting...');
      await disconnect();
      console.log('Disconnect successful');
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
        queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] });
        queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] });
        queryClient.invalidateQueries({ queryKey: ['credentials'] });
        checkConnection();
        onOpenChange(false);
      }, REFRESH_DELAY);
    } catch (error) {
      console.error('Disconnect failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  }, [disconnect, queryClient, checkConnection, onOpenChange]);

  const handleSwitchAccount = useCallback(async () => {
    if (!selectedAccountId || selectedAccountId === status?.customer_id) {
      return;
    }

    setIsSwitching(true);
    setError(null);
    
    try {
      console.log('Switching to account:', selectedAccountId);
      await switchAccount(selectedAccountId);
      console.log('Switch successful');
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
        queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] });
        checkConnection();
        onOpenChange(false);
      }, REFRESH_DELAY);
    } catch (error) {
      console.error('❌ Switch failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to switch account');
    } finally {
      setIsSwitching(false);
    }
  }, [selectedAccountId, status?.customer_id, switchAccount, queryClient, checkConnection, onOpenChange]);

  const handleRefresh = useCallback(async () => {
    console.log('Refreshing accounts...');
    await fetchAccounts();
  }, [fetchAccounts]);

  if (statusLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`sm:max-w-[${DIALOG_WIDTH}px]`}>
          <DialogHeader>
            <DialogTitle>Google Ads Connection</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[${DIALOG_WIDTH}px]`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isConnectedState ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Google Ads Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Connect Google Ads
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isConnectedState
              ? 'Manage your Google Ads integration and switch between accounts.'
              : 'Connect your Google Ads account to track campaign emissions and optimize for sustainability.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isConnectedState ? (
            <ConnectedState
              status={status}
              accounts={accounts}
              accountsLoading={accountsLoading}
              selectedAccountId={selectedAccountId}
              onAccountChange={setSelectedAccountId}
              onRefresh={handleRefresh}
              onSwitchAccount={handleSwitchAccount}
              isSwitching={isSwitching}
              error={error}
            />
          ) : (
            <DisconnectedState error={error} />
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isConnectedState ? (
            <ConnectedFooter
              onClose={() => onOpenChange(false)}
              onDisconnect={handleDisconnect}
              isDisconnecting={isDisconnecting}
            />
          ) : (
            <DisconnectedFooter
              onClose={() => onOpenChange(false)}
              onConnect={handleConnect}
              isConnecting={isConnecting}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConnectedStateProps {
  status: any;
  accounts: any[];
  accountsLoading: boolean;
  selectedAccountId: string;
  onAccountChange: (id: string) => void;
  onRefresh: () => void;
  onSwitchAccount: () => void;
  isSwitching: boolean;
  error: string | null;
}

function ConnectedState({
  status,
  accounts,
  accountsLoading,
  selectedAccountId,
  onAccountChange,
  onRefresh,
  onSwitchAccount,
  isSwitching,
  error
}: ConnectedStateProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-900">Connected Account</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Active
          </Badge>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-green-900">
            {status?.customer_name || 'Google Ads Account'}
          </p>
          <p className="text-green-700">
            ID: {status?.customer_id}
          </p>
          <p className="text-green-700">
            {status?.email}
          </p>
          {status?.connected_at && (
            <p className="text-xs text-green-600 mt-2">
              Connected on {new Date(status.connected_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {accounts && accounts.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Switch Account</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={accountsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${accountsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Select
            value={selectedAccountId}
            onValueChange={onAccountChange}
            disabled={accountsLoading || isSwitching}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{account.name}</span>
                    {account.is_selected && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedAccountId && selectedAccountId !== status?.customer_id && (
            <Button
              onClick={onSwitchAccount}
              disabled={isSwitching}
              className="w-full"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Switching...
                </>
              ) : (
                'Switch Account'
              )}
            </Button>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function DisconnectedState({ error }: { error: string | null }) {
  return (
    <div className="space-y-4"> 
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You&apos;ll be redirected to Google to authorize access to your Google Ads accounts.
          We only request read-only access to your campaign data.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">What we track:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Campaign performance metrics</li>
          <li>Ad impressions and clicks</li>
          <li>Carbon emissions per campaign</li>
          <li>Geographic distribution</li>
        </ul>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ConnectedFooterProps {
  onClose: () => void;
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

function ConnectedFooter({ onClose, onDisconnect, isDisconnecting }: ConnectedFooterProps) {
  return (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Close
      </Button>
      <Button
        variant="destructive"
        onClick={onDisconnect}
        disabled={isDisconnecting}
        className="w-full sm:w-auto"
      >
        {isDisconnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Disconnecting...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </>
        )}
      </Button>
    </>
  );
}

interface DisconnectedFooterProps {
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
}

function DisconnectedFooter({ onClose, onConnect, isConnecting }: DisconnectedFooterProps) {
  return (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
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
  );
}