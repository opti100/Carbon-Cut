'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReduxProvider } from './ReduxProvider'
import { QueryProvider } from './QueryProvider'
import { GoogleAdsProvider } from '@/contexts/GoogleAdsContext'
import { PostHogProvider } from './PosthogProviders'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes in cache
      retry: 1,
      refetchOnWindowFocus: false, // Disable global refetch on focus
      refetchOnMount: false, // Disable global refetch on mount
      refetchOnReconnect: true, // Only refetch on reconnect
    },
    mutations: {
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <PostHogProvider> */}
        <ReduxProvider>
          <AuthProvider>
            <QueryProvider>
              <GoogleAdsProvider>{children}</GoogleAdsProvider>
            </QueryProvider>
          </AuthProvider>
        </ReduxProvider>
      {/* </PostHogProvider> */}
    </QueryClientProvider>
  )
}

export default Providers
