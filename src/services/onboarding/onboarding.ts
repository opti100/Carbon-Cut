import {
  CloudProviderData,
  CdnData,
  WorkforceEmissionsData,
  OnPremData,
  TravelData,
  EnergyData,
  AdsData,
  MachineryData,
  OilGasData,
} from '@/types/onboarding'
import { AnalyticsData } from '@/types/web-analytics'

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
    formData.append('provider', provider.toLowerCase())
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
      const error = await response.json().catch(() => ({
        success: false,
        error: 'Upload failed',
      }))
      throw error
    }

    return response.json()
  },

  submitCloudManual: async (data: CloudProviderData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        total_emissions_kg: number
        period: string
        providers: Array<{
          provider: string
          emissions_kg: number
          emission_id: string
          calculation_details: unknown
        }>
        note: string
      }
    }>('/web/cloud/manual/', {
      method: 'POST',
      body: JSON.stringify({
        cloud_providers: [
          {
            provider: data.cloud?.toLowerCase(),
            connection_method: 'cost_estimate',
            regions: [data.region],
            monthly_cost_usd: parseFloat(data.actualCost) || 0,
            monthly_hours_usage: parseFloat(data.monthlyHoursUsage) || 0,
          },
        ],
        month,
        year,
      }),
    })
  },

  // CDN Emissions
  // CDN Emissions
  submitCDN: async (data: CdnData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
        calculation_details: {
          total_emissions_kg: number
          breakdown?: Record<string, unknown>
          factors?: Record<string, unknown>
        }
      }
    }>('/web/cdn/', {
      method: 'POST',
      body: JSON.stringify({
        monthly_gb_transferred: parseFloat(data.monthlyGBTransferred) || 0,
        provider: data.cdnProvider.toLowerCase(),
        regions: Array.isArray(data.regions) ? data.regions : [data.regions],
        month,
        year,
      }),
    })
  },
  // Workforce Emissions
  // Workforce Emissions
  submitWorkforce: async (data: WorkforceEmissionsData) => {
    const { month, year } = getCurrentPeriod()

    // Calculate total employees from workforce ranges
    const calculateEmployeesFromRange = (range: string): number => {
      const ranges: Record<string, number> = {
        '0-50': 25,
        '50-100': 75,
        '100-500': 300,
        '500-1000': 750,
        '1000+': 1500,
      }
      return ranges[range] || 100
    }

    // Calculate remote percentage from range
    const calculateRemotePercentage = (range: string): number => {
      const ranges: Record<string, number> = {
        '0': 0,
        '0-25': 12.5,
        '25-50': 37.5,
        '50-75': 62.5,
        '75-100': 87.5,
      }
      return ranges[range] || 0
    }

    // Convert workforce locations to office locations
    const office_locations = data.workforceLocations.map((location) => ({
      name: `Office ${location.country}`,
      sqm: parseFloat(location.squareMeters || '0'),
      country_code: location.country || 'US',
    }))

    // Sum up total employees across all locations
    const total_employees = data.workforceLocations.reduce((sum, location) => {
      return sum + calculateEmployeesFromRange(location.workforceType || '0-50')
    }, 0)

    // Average remote percentage across all locations
    const avg_remote_percentage =
      data.workforceLocations.length > 0
        ? data.workforceLocations.reduce((sum, location) => {
            return sum + calculateRemotePercentage(location.workArrangementRemote || '0')
          }, 0) / data.workforceLocations.length
        : 0

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
        calculation_details: {
          total_emissions_kg: number
          breakdown?: Record<string, unknown>
          factors?: Record<string, unknown>
        }
      }
    }>('/web/workforce/', {
      method: 'POST',
      body: JSON.stringify({
        total_employees,
        remote_percentage: avg_remote_percentage,
        office_locations,
        calculation_period: 'monthly',
        month,
        year,
      }),
    })
  },

  // On-Prem Server Emissions
  submitOnPrem: async (data: OnPremData) => {
    const { month, year } = getCurrentPeriod()

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
        calculation_details: {
          total_emissions_kg: number
          breakdown?: Record<string, unknown>
          factors?: Record<string, unknown>
        }
      }
    }>('/web/onprem/', {
      method: 'POST',
      body: JSON.stringify({
        servers: [
          {
            name: data.name || 'server-01',
            cpu_cores: parseInt(data.cpuCores) || 0,
            ram_gb: parseInt(data.ramGB) || 0,
            storage_tb: parseFloat(data.storageTB) || 0,
            storage_type: 'ssd',
            avg_cpu_utilization: 0.35, // Default 35% utilization
            hours_per_day: 24,
            days_per_month: 30,
          },
        ],
        location_country_code: 'US', // Default to US, could be made configurable
        pue: 1.6, // Default PUE
        calculation_period: 'monthly',
        month,
        year,
      }),
    })
  },

  // Travel Emissions
  submitTravel: async (data: TravelData) => {
    const { month, year } = getCurrentPeriod()

    const trips = data.travels.map((t) => {
      const baseTrip: any = {
        travel_type: t.travel_type,
        distance_km: parseFloat(String(t.distance_km) || '0'),
        passenger_count: parseInt(String(t.passenger_count) || '1'),
      }

      // Add flight-specific fields
      if (t.travel_type === 'flight') {
        baseTrip.flight_class = t.flight_class || 'economy'
        baseTrip.is_domestic = t.is_domestic === 'domestic' // Convert string to boolean
      }

      // Add vehicle type for other travel types
      if (t.travel_type === 'car') {
        baseTrip.vehicle_type = 'car_petrol' // Default vehicle type
      } else if (t.travel_type === 'bus') {
        baseTrip.vehicle_type = 'bus'
      } else if (t.travel_type === 'train') {
        baseTrip.vehicle_type = 'train'
      }

      return baseTrip
    })

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
        trips: Array<{
          travel_type: string
          emissions_kg: number
          details: Record<string, unknown>
        }>
      }
    }>('/web/travel/', {
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
  // In services/onboarding/onboarding.ts
  submitEnergy: async (data: EnergyData) => {
    const { month, year } = getCurrentPeriod()

    if (data.energy_sources.length === 0) {
      return { success: true, data: { message: 'Skipped' } }
    }

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
      }
    }>('/web/energy/', {
      method: 'POST',
      body: JSON.stringify({
        energy_sources: data.energy_sources.map(source => ({
          source_type: source.source_type,
          monthly_kwh: parseFloat(source.monthly_kwh) || 0,
          monthly_liters: parseFloat(source.monthly_liters) || 0,
          country_code: source.country_code
        })),
        month,
        year,
      }),
    })
  },

  submitAds: async (data: AdsData) => {
    const { month, year } = getCurrentPeriod()

    if (data.ad_campaigns.length === 0) {
      return { success: true, data: { message: 'Skipped' } }
    }

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
      }
    }>('/web/ads/', {
      method: 'POST',
      body: JSON.stringify({
        ad_campaigns: data.ad_campaigns.map(campaign => ({
          platform: campaign.platform,
          ad_format: campaign.ad_format,
          monthly_impressions: parseInt(campaign.monthly_impressions) || 0
        })),
        month,
        year,
      }),
    })
  },

  submitMachinery: async (data: MachineryData) => {
    const { month, year } = getCurrentPeriod()

    if (data.machines.length === 0) {
      return { success: true, data: { message: 'Skipped' } }
    }

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
      }
    }>('/web/machinery/', {
      method: 'POST',
      body: JSON.stringify({
        machines: data.machines.map(machine => ({
          machine_type: machine.machine_type,
          fuel_type: machine.fuel_type,
          monthly_hours: parseFloat(machine.monthly_hours) || 0,
          fuel_consumption_rate_l_per_hour: parseFloat(machine.fuel_consumption_rate_l_per_hour) || 0,
          monthly_kwh: parseFloat(machine.monthly_kwh) || 0
        })),
        month,
        year,
      }),
    })
  },

  submitOilGas: async (data: OilGasData) => {
    const { month, year } = getCurrentPeriod()

    if (data.consumptions.length === 0) {
      return { success: true, data: { message: 'Skipped' } }
    }

    return fetchWithAuth<{
      success: boolean
      message?: string
      data: {
        emission_id: string
        total_emissions_kg: number
        period: string
      }
    }>('/web/oil-gas/', {
      method: 'POST',
      body: JSON.stringify({
        consumptions: data.consumptions.map(consumption => ({
          product_type: consumption.product_type,
          monthly_liters: parseFloat(consumption.monthly_liters) || 0
        })),
        month,
        year,
      }),
    })
  },
}
interface AnalyticsResponse{
  success:boolean,
  data:AnalyticsData,
  error:string
}
export async function fetchAnalytics(
  year?: number,
  month?: number
): Promise<any> {
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
