import {
  CloudProviderData,
  CdnData,
  WorkforceEmissionsData,
  OnPremData,
  TravelData,
} from '@/types/onboarding'
import { AnalyticsResponse } from '@/types/web-analytics'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; auth-token=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}


async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw error
  }

  return response.json()
}

// Get current month and year
const getCurrentPeriod = () => ({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
})

export const onboardingApi = {
  getConfig: async () => {
    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/config/')
  },

  saveConfig: async (config: Record<string, unknown>) => {
    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/configure/', {
      method: 'POST',
      body: JSON.stringify(config),
    })
  },

  uploadCloudCSV: async (file: File, provider: string) => {
    const token = getAuthToken()
    const { month, year } = getCurrentPeriod()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('provider', provider)
    formData.append('month', String(month))
    formData.append('year', String(year))

    const response = await fetch(`${API_BASE_URL}/web/cloud/upload-csv/`, {
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

    return response.json()
  },


  submitCloudManual: async (data: CloudProviderData, provider = 'aws') => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/cloud/manual/', {
      method: 'POST',
      body: JSON.stringify({
        cloud_providers: [
          {
            provider,
            connection_method: 'cost_estimate',
            regions: [data.region],
            monthly_hours_usage: parseFloat(data.monthlyHoursUsage) || 0,
          },
        ],
        month,
        year,
      }),
    })
  },

  // CDN Emissions
  submitCDN: async (data: CdnData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/cdn/', {
      method: 'POST',
      body: JSON.stringify({
        monthly_gb_transferred: parseFloat(data.monthlyGBTransferred) || 0,
        provider: data.cdnProvider.toLowerCase(),
        regions: data.regions.split(',').map((r) => r.trim()),
        month,
        year,
      }),
    })
  },

  // Workforce Emissions
  submitWorkforce: async (data: WorkforceEmissionsData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/workforce/', {
      method: 'POST',
      body: JSON.stringify({
        total_employees: 1, // Default, adjust as needed
        remote_percentage: parseInt(data.workArrangementRemote) || 0,
        office_locations: [
          {
            name: data.city,
            sqm: parseFloat(data.squareMeters) || 0,
            country_code: data.country,
          },
        ],
        calculation_period: 'monthly',
        month,
        year,
      }),
    })
  },

  // On-Prem Server Emissions
  submitOnPrem: async (data: OnPremData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/onprem/', {
      method: 'POST',
      body: JSON.stringify({
        servers: [
          {
            name: data.name,
            cpu_cores: parseInt(data.cpuCores) || 0,
            ram_gb: parseInt(data.ramGB) || 0,
            storage_tb: parseFloat(data.storageTB) || 0,
            storage_type: 'ssd',
            avg_cpu_utilization: parseFloat(data.avgCpuUtilization) / 100 || 0.35,
            hours_per_day: parseInt(data.hoursPerDay) || 24,
            days_per_month: 30,
          },
        ],
        location_country_code: 'US',
        pue: 1.6,
        calculation_period: 'monthly',
        month,
        year,
      }),
    })
  },

  // Travel Emissions
  submitTravel: async (data: TravelData) => {
    const { month, year } = getCurrentPeriod()

    const trips = data.travels.map((t) => ({
      travel_type: t.travel_type,
      distance_km: parseFloat(t.distance_km || '0'),
      flight_class: t.flight_class || 'economy',
      is_domestic: t.is_domestic === 'true',
      passenger_count: parseInt(t.passenger_count || '1'),
    }))

    return fetchWithAuth<{ success: boolean; data: unknown }>('/web/travel/', {
      method: 'POST',
      body: JSON.stringify({ trips, month, year }),
    })
  },

  // Summary & Reports
  getSummary: async (month?: number, year?: number) => {
    const period = getCurrentPeriod()
    const m = month || period.month
    const y = year || period.year

    return fetchWithAuth<{ success: boolean; data: unknown }>(
      `/web/summary/?month=${m}&year=${y}`
    )
  },

  getEmissionsBySource: async (month?: number, year?: number) => {
    const period = getCurrentPeriod()
    const m = month || period.month
    const y = year || period.year

    return fetchWithAuth<{ success: boolean; data: unknown }>(
      `/web/emissions/by-source/?month=${m}&year=${y}`
    )
  },

  exportCSRD: async (year?: number, format: 'json' | 'csv' | 'pdf' = 'json') => {
    const y = year || getCurrentPeriod().year

    return fetchWithAuth<{ success: boolean; data: unknown }>(
      `/web/export/csrd/?year=${y}&format=${format}`
    )
  },
}
export async function fetchAnalytics(year?: number, month?: number): Promise<AnalyticsResponse> {
  const token = getAuthToken()
  const currentYear = new Date().getFullYear()
  const y = year || currentYear
  
  let url = `${API_BASE_URL}/web/analytics/?year=${y}`
  if (month) {
    url += `&month=${month}`
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw error
  }

  return response.json()
}