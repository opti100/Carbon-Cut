"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReduxProvider } from './ReduxProvider'
import { QueryProvider } from './QueryProvider'
import { GoogleAdsProvider } from '@/contexts/GoogleAdsContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
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
      <ReduxProvider>
        <AuthProvider>
          <QueryProvider>
            <GoogleAdsProvider>
              {children}
            </GoogleAdsProvider>
          </QueryProvider>
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

export default Providers