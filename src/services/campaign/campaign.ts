import {
  Campaign,
  CreateCampaignData,
  Credential,
  CreateCredentialData,
  CampaignAnalytics,
  SyncImpressionsData,
} from '@/types/campaign'

import { GoogleAdsCampaignError } from '@/types/errors'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  const token = getCookie('auth-token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw error
  }

  return response.json()
}

export const campaignApi = {
  list: async (): Promise<Campaign[]> => {
    const data = await fetchWithAuth(`${API_BASE_URL}/campaign/`)
    return data.data || []
  },

  get: async (id: number): Promise<Campaign> => {
    const data = await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`)
    return data.data
  },

  create: async (data: CreateCampaignData): Promise<Campaign> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/campaign/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  },

  update: async (id: number, data: Partial<CreateCampaignData>): Promise<Campaign> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`, {
      method: 'DELETE',
    })
  },

  googleAdsCampaign: async (customerId: string): Promise<any[]> => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/campaign/google/${customerId}/`)
      console.log('Fetched Google Ads campaigns:', data)
      return data.data.campaigns || []
    } catch (error: any) {
      const fetchError: GoogleAdsCampaignError = {
        success: false,
        message: error.message || 'Failed to fetch campaigns.',
        error_code: error.error_code,
        customer_id: error.customer_id,
        customer_name: error.customer_name,
      }
      throw fetchError
    }
  },

  // Analytics endpoints
  getAnalytics: async (
    campaignId: string,
    params: {
      start_date: string
      end_date: string
      group_by?: 'day' | 'hour'
    }
  ): Promise<CampaignAnalytics> => {
    const queryParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      ...(params.group_by && { group_by: params.group_by }),
    })

    const data = await fetchWithAuth(
      `${API_BASE_URL}/campaign/analytics/${campaignId}/?${queryParams}`
    )
    return data.data
  },

  syncImpressions: async (
    campaignId: string,
    data: SyncImpressionsData
  ): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/campaign/sync/${campaignId}/impressions/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export const impressionApi = {
  // list: async (campaignId?: number): Promise<Impression[]> => {
  //   const url = campaignId
  //     ? `${API_BASE_URL}/impressions/?campaign_id=${campaignId}`
  //     : `${API_BASE_URL}/impressions/`;
  //   const data = await fetchWithAuth(url);
  //   return data.data || [];
  // },

  // get: async (id: string): Promise<Impression> => {
  //   const data = await fetchWithAuth(`${API_BASE_URL}/impressions/${id}/`);
  //   return data.data;
  // },

  sync: async (campaignId: number): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/impressions/sync/`, {
      method: 'POST',
      body: JSON.stringify({ campaign_id: campaignId }),
    })
  },
}
