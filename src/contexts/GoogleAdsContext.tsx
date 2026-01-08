'use client'

import React, { createContext, useContext, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { googleAdsApi } from '@/services/google-ads'

interface GoogleAdsAccount {
  id: string
  name: string
  currency: string
  timezone: string
  is_manager: boolean
  status: string
  is_test_account: boolean
  is_selected: boolean
}

interface GoogleAdsStatus {
  is_connected: boolean
  credential_id?: number
  customer_id?: string
  customer_name?: string
  email?: string
  currency?: string
  timezone?: string
  connected_at?: string
  last_updated?: string
  total_accounts?: number
  message?: string
}

interface GoogleAdsAccountsData {
  accounts: GoogleAdsAccount[]
  total_count: number
  selected_account_id: string
  note?: string
}

interface GoogleAdsContextType {
  status: GoogleAdsStatus | null
  isLoading: boolean
  accounts: GoogleAdsAccount[]
  accountsLoading: boolean
  isSwitchingAccount: boolean
  connect: () => void
  disconnect: () => Promise<void>
  checkConnection: () => Promise<void>
  fetchAccounts: () => Promise<void>
  switchAccount: (customerId: string) => Promise<void>
}

const GoogleAdsContext = createContext<GoogleAdsContextType | undefined>(undefined)

export const useGoogleAds = () => {
  const context = useContext(GoogleAdsContext)
  if (!context) {
    throw new Error('useGoogleAds must be used within GoogleAdsProvider')
  }
  return context
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const GoogleAdsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient()
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)

  const {
    data: statusData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['googleAdsStatus'],
    queryFn: async () => {
      const result = await googleAdsApi.checkConnection()
      return result
    },
    retry: 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchInterval: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['googleAdsAccounts'],
    queryFn: async () => {
      console.log('📡 Fetching Google Ads accounts from API...')
      const result = await googleAdsApi.getAccounts()
      // console.log('✅ Accounts fetched:', result);
      return result.data || result
    },
    enabled: statusData?.is_connected === true,
    staleTime: 15 * 60 * 1000, // 15 minutes - data stays fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnReconnect: false, // Don't refetch on reconnect
  })

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return googleAdsApi.disconnect()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] })
      queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] })
      queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] })
      queryClient.invalidateQueries({ queryKey: ['credentials'] })
    },
    onError: (error) => {
      console.error('Disconnect error:', error)
    },
  })

  const switchAccountMutation = useMutation({
    mutationFn: (customerId: string) => {
      console.log('Switching to account:', customerId)
      return googleAdsApi.switchAccount(customerId)
    },
    onMutate: () => {
      setIsSwitchingAccount(true)
    },
    onSuccess: () => {
      console.log('Switch account successful, invalidating queries')
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] })
      queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] })
      queryClient.invalidateQueries({ queryKey: ['google-ads-connection'] })
      queryClient.invalidateQueries({ queryKey: ['googleAdsCampaigns'] })

      // Keep switching state true for a bit longer to ensure campaigns reload
      setTimeout(() => {
        setIsSwitchingAccount(false)
      }, 2000)
    },
    onError: (error) => {
      console.error('Switch account error:', error)
      setIsSwitchingAccount(false)
    },
  })

  const connect = () => {
    console.log('Initiating Google Ads connection...')
    window.location.href = `${API_BASE_URL}/impressions/google/redirect-url/`
  }

  const disconnect = async () => {
    await disconnectMutation.mutateAsync()
  }

  const checkConnection = async () => {
    console.log('Checking connection...')
    await queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] })
    await queryClient.refetchQueries({ queryKey: ['googleAdsStatus'] })
  }

  const fetchAccounts = async () => {
    console.log('🔄 Manually fetching accounts...')
    await queryClient.invalidateQueries({ queryKey: ['googleAdsAccounts'] })
    await queryClient.refetchQueries({ queryKey: ['googleAdsAccounts'] })
  }

  const switchAccount = async (customerId: string) => {
    await switchAccountMutation.mutateAsync(customerId)
  }

  // console.log('GoogleAdsContext state:', {
  //   isConnected: statusData?.is_connected,
  //   isLoading,
  //   error,
  //   statusData,
  //   accountsCount: accountsData?.accounts?.length,
  //   accountsCached: queryClient.getQueryState(['googleAdsAccounts'])?.dataUpdatedAt,
  //   isSwitchingAccount,
  // });

  return (
    <GoogleAdsContext.Provider
      value={{
        status: statusData || null,
        isLoading,
        accounts: accountsData?.accounts || [],
        accountsLoading,
        isSwitchingAccount,
        connect,
        disconnect,
        checkConnection,
        fetchAccounts,
        switchAccount,
      }}
    >
      {children}
    </GoogleAdsContext.Provider>
  )
}
