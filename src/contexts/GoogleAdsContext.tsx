"use client";

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface GoogleAdsAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  is_manager: boolean;
  status: string;
  is_test_account: boolean;
  is_selected: boolean;
}

interface GoogleAdsStatus {
  is_connected: boolean;
  credential_id?: number;
  customer_id?: string;
  customer_name?: string;
  email?: string;
  currency?: string;
  timezone?: string;
  connected_at?: string;
  last_updated?: string;
  total_accounts?: number;
  message?: string;
}

interface GoogleAdsAccountsData {
  accounts: GoogleAdsAccount[];
  total_count: number;
  selected_account_id: string;
  note?: string;
}

interface GoogleAdsContextType {
  // Connection status
  status: GoogleAdsStatus | null;
  isLoading: boolean;
  
  // Accounts
  accounts: GoogleAdsAccount[];
  accountsLoading: boolean;
  
  // Actions
  connect: () => void;
  disconnect: () => Promise<void>;
  checkConnection: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  switchAccount: (customerId: string) => Promise<void>;
}

const GoogleAdsContext = createContext<GoogleAdsContextType | undefined>(undefined);

export const useGoogleAds = () => {
  const context = useContext(GoogleAdsContext);
  if (!context) {
    throw new Error('useGoogleAds must be used within GoogleAdsProvider');
  }
  return context;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const checkGoogleAdsStatus = async (): Promise<GoogleAdsStatus> => {
  const response = await fetch(`${API_BASE_URL}/impressions/google-ads/status/`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to check status');
  }
  
  const data = await response.json();
  return data.data;
};

const fetchGoogleAdsAccounts = async (): Promise<GoogleAdsAccountsData> => {
  const response = await fetch(`${API_BASE_URL}/impressions/google-ads/accounts/`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  
  const data = await response.json();
  return data.data;
};

const disconnectGoogleAds = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/impressions/google-ads/disconnect/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to disconnect');
  }
};

const switchGoogleAdsAccount = async (customerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/impressions/google-ads/switch-account/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customer_id: customerId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to switch account');
  }
};

export const GoogleAdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Check connection status
  const { data: status = null, isLoading } = useQuery({
    queryKey: ['googleAdsStatus'],
    queryFn: checkGoogleAdsStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Fetch accounts
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['googleAdsAccounts'],
    queryFn: fetchGoogleAdsAccounts,
    enabled: status?.is_connected || false, // Only fetch if connected
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogleAds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] });
    },
  });

  // Switch account mutation
  const switchAccountMutation = useMutation({
    mutationFn: switchGoogleAdsAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] });
    },
  });

  const connect = () => {
    window.location.href = `${API_BASE_URL}/impressions/google/redirect-url`;
  };

  const disconnect = async () => {
    await disconnectMutation.mutateAsync();
  };

  const checkConnection = async () => {
    await queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
  };

  const fetchAccounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] });
  };

  const switchAccount = async (customerId: string) => {
    await switchAccountMutation.mutateAsync(customerId);
  };

  return (
    <GoogleAdsContext.Provider
      value={{
        status,
        isLoading,
        accounts: accountsData?.accounts || [],
        accountsLoading,
        connect,
        disconnect,
        checkConnection,
        fetchAccounts,
        switchAccount,
      }}
    >
      {children}
    </GoogleAdsContext.Provider>
  );
};