const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; auth-token=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  return response.json()
}

// Types
export interface DataSource {
  source: string
  label: string
  entry_type: string
  scope: string
  requires_monthly_input: boolean
  status: 'pending' | 'submitted' | 'calculated' | 'auto_calculated' | 'auto_tracked'
  kg_co2: number | null
  accuracy: 'high' | 'medium' | 'estimated'
  last_updated?: string
  config?: Record<string, any>
  server_count?: number
}

export interface MonthlyReportStatus {
  year: number
  month: number
  month_name: string
  report_exists: boolean
  report_id: string | null
  total_emissions_kg: number | null
  scope_breakdown: {
    scope_1: number
    scope_2: number
    scope_3: number
  } | null
  data_sources: DataSource[]
  pending_entries: number
  is_complete: boolean
  generated_at: string | null
}

export interface MonthlyReportResponse {
  success: boolean
  message: string
  data: MonthlyReportStatus
}

export interface MonthSummary {
  month: number
  month_name: string
  total_kg: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
  source_breakdown: Record<string, number>
}

export interface YearlySummary {
  year: number
  months_reported: number
  months: MonthSummary[]
  totals: {
    total_kg: number
    scope_1_kg: number
    scope_2_kg: number
    scope_3_kg: number
  }
  totals_tonnes: {
    total: number
    scope_1: number
    scope_2: number
    scope_3: number
  }
}

export interface YearlySummaryResponse {
  success: boolean
  message: string
  data: YearlySummary
}

export interface CloudEntryRequest {
  provider: string
  entry_type: 'cloud_cost' | 'cloud_csv'
  monthly_cost_usd?: number
  csv_data?: any[]
}

export interface CDNEntryRequest {
  gb_transferred: number
}

export interface TravelTrip {
  type: 'flight' | 'rail' | 'road'
  distance_km: number
  origin?: string
  destination?: string
  cabin_class?: 'economy' | 'business' | 'first'
  vehicle_type?: string
  passengers?: number
}

export interface TravelEntryRequest {
  trips: TravelTrip[]
}

export interface EntryResponse {
  success: boolean
  message: string
  data: {
    entry_id: string
    kg_co2_calculated: number
    status: string
    calculation_details?: Record<string, any>
    trip_count?: number
  }
}

export interface RecalculateResponse {
  success: boolean
  message: string
  data: {
    total_kg: number
    by_scope: Record<string, number>
    by_source: Record<string, number>
  }
}

// Reports Service
export class ReportsService {
  private static baseUrl = `${API_BASE_URL}/reports`

  /**
   * Get monthly report status with all data sources
   */
  static async getMonthlyReport(year: number, month: number): Promise<MonthlyReportResponse> {
    return fetchWithAuth<MonthlyReportResponse>(`${this.baseUrl}/monthly/${year}/${month}/`)
  }

  /**
   * Get yearly summary
   */
  static async getYearlySummary(year: number): Promise<YearlySummaryResponse> {
    return fetchWithAuth<YearlySummaryResponse>(`${this.baseUrl}/yearly/${year}/`)
  }

  /**
   * Submit cloud data (cost or CSV)
   */
  static async submitCloudEntry(
    year: number,
    month: number,
    data: CloudEntryRequest
  ): Promise<EntryResponse> {
    return fetchWithAuth<EntryResponse>(`${this.baseUrl}/monthly/${year}/${month}/cloud/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Submit CDN data transfer
   */
  static async submitCDNEntry(
    year: number,
    month: number,
    data: CDNEntryRequest
  ): Promise<EntryResponse> {
    return fetchWithAuth<EntryResponse>(`${this.baseUrl}/monthly/${year}/${month}/cdn/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Submit travel data
   */
  static async submitTravelEntry(
    year: number,
    month: number,
    data: TravelEntryRequest
  ): Promise<EntryResponse> {
    return fetchWithAuth<EntryResponse>(`${this.baseUrl}/monthly/${year}/${month}/travel/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Trigger recalculation of monthly report
   */
  static async recalculateReport(year: number, month: number): Promise<RecalculateResponse> {
    return fetchWithAuth<RecalculateResponse>(
      `${this.baseUrl}/monthly/${year}/${month}/recalculate/`,
      { method: 'POST' }
    )
  }

  /**
   * Get list of months for a year with their status
   */
  static async getYearMonthsStatus(year: number): Promise<MonthlyReportStatus[]> {
    const months: MonthlyReportStatus[] = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    // Only fetch up to current month if it's the current year
    const maxMonth = year === currentYear ? currentMonth : 12

    for (let month = 1; month <= maxMonth; month++) {
      try {
        const response = await this.getMonthlyReport(year, month)
        if (response.success) {
          months.push(response.data)
        }
      } catch (error) {
        // Skip failed months
        console.error(`Failed to fetch ${year}-${month}:`, error)
      }
    }

    return months
  }
}

// Utility functions
export const formatKgCO2 = (kg: number | null | undefined): string => {
  if (kg === null || kg === undefined) return '—'
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`
  }
  return `${kg.toFixed(2)} kg`
}

export const getStatusBadgeVariant = (
  status: DataSource['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'calculated':
    case 'submitted':
      return 'default'
    case 'auto_calculated':
    case 'auto_tracked':
      return 'secondary'
    case 'pending':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const getStatusLabel = (status: DataSource['status']): string => {
  switch (status) {
    case 'calculated':
    case 'submitted':
      return 'Submitted'
    case 'auto_calculated':
      return 'Auto-calculated'
    case 'auto_tracked':
      return 'Tracked'
    case 'pending':
      return 'Pending'
    default:
      return status
  }
}

export const getScopeLabel = (scope: string): string => {
  switch (scope) {
    case 'scope_1':
      return 'Scope 1'
    case 'scope_2':
      return 'Scope 2'
    case 'scope_3':
      return 'Scope 3'
    default:
      return scope
  }
}

export const getScopeColor = (scope: string): string => {
  switch (scope) {
    case 'scope_1':
      return 'text-red-600 bg-red-50'
    case 'scope_2':
      return 'text-amber-600 bg-amber-50'
    case 'scope_3':
      return 'text-blue-600 bg-blue-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getMonthName = (month: number): string => {
  return new Date(2000, month - 1).toLocaleString('default', { month: 'long' })
}