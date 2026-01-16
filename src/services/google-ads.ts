import { GoogleAdsConnectionStatus } from '@/types/google-ads'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/auth'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const googleAdsApi = {
  /**
   * Get Google Ads OAuth authorization URL
   */
  getAuthUrl: async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/google/redirect-url`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get authorization URL')
    }
    return response.url
  },

  /**
   * Check if user has connected Google Ads
   */
  async checkConnection(): Promise<GoogleAdsConnectionStatus> {
    const response = await api.get(`http://localhost:8000/api/v1/auth/google-ads/status/`)
    console.log('✅ Connection status:', response.data)
    return response.data.data || response.data
  },

  /**
   * Disconnect Google Ads account
   */
  async disconnect() {
    const response = await api.post(`http://localhost:8000/api/v1/auth/google-ads/disconnect/`)
    console.log('✅ Disconnect response:', response.data)
    return response.data
  },

  /**
   * Get all accessible Google Ads accounts
   */
  async getAccounts() {
    const response = await api.get(`http://localhost:8000/api/v1/auth/google-ads/accounts/`)
    console.log('✅ Accounts response:', response.data)
    return response.data
  },

  /**
   * Switch to a different Google Ads account
   */
  async switchAccount(customerId: string) {
    const response = await api.post(`http://localhost:8000/api/v1/auth/google-ads/switch-account/`, {
      customer_id: customerId,
    })
    console.log('✅ Switch account response:', response.data)
    return response.data
  },
}

// utils/googleAds.ts
export interface TokenValidationResponse {
  success: boolean
  is_valid: boolean
  needs_reconnection: boolean
  reason?: string
  message: string
  refreshed?: boolean
}

export const validateGoogleAdsToken = async (): Promise<TokenValidationResponse> => {
  const response = await fetch(`${API_BASE_URL}/google/validate-token/`, {
    credentials: 'include',
  })
  return response.json()
}

// Hook for checking token status
export const useGoogleAdsTokenValidation = () => {
  return useQuery<TokenValidationResponse>({
    queryKey: ['google-ads-token-validation'],
    queryFn: validateGoogleAdsToken,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    retry: false,
  })
}
