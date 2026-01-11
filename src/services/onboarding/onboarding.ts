import {
  CloudProviderData,
  CdnData,
  WorkforceEmissionsData,
  OnPremData,
  TravelData,
  OnboardingData,
} from '@/types/onboarding'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v2'

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

export const onboardingApi = {
  // Submit complete onboarding data
  submit: async (data: OnboardingData): Promise<{ success: boolean; message?: string }> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/onboarding/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data || response
  },

  // Save onboarding progress (for draft/save as you go)
  saveProgress: async (step: number, data: Partial<OnboardingData>): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/onboarding/progress/`, {
      method: 'POST',
      body: JSON.stringify({ step, data }),
    })
  },

  // Get saved onboarding progress
  getProgress: async (): Promise<Partial<OnboardingData> | null> => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/onboarding/progress/`)
      return data.data || null
    } catch (error) {
      return null
    }
  },

  // Upload cloud provider file
  uploadCloudProviderFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const token = getCookie('auth-token')

    const response = await fetch(`${API_BASE_URL}/onboarding/upload/cloud-provider/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw error
    }

    const data = await response.json()
    return data.data || data
  },
}
