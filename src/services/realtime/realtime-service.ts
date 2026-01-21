import { ApiKeyService } from '@/services/apikey/apikey'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Types
export interface RealtimeEvent {
  id: string
  event_type: string
  emissions_g: number
  timestamp: string
  source: string
}

export interface RealtimeSummary {
  total_emissions_kg: number
  total_emissions_g: number
  event_count: number
  avg_emission_per_event_g: number
  emissions_per_hour_kg: number
  events_per_hour: number
  time_window: string
}

export interface EventTypeStats {
  event_type: string
  total_kg: number
  total_g: number
  count: number
  percentage: number
}

export interface RecentEvent {
  event_type: string
  emissions_kg: number
  emissions_g: number
  timestamp: string
  source: string
}

export interface SessionStats {
  active_count: number
  total_in_window: number
  total_emissions_g: number
  total_events: number
}

export interface RealtimeData {
  summary: RealtimeSummary
  by_event_type: EventTypeStats[]
  recent_events: RecentEvent[]
  sessions: SessionStats
}

export interface StreamData {
  new_events: RealtimeEvent[]
  today_total: {
    emissions_kg: number
    emissions_g: number
    event_count: number
  }
  has_new_data: boolean
}

export interface RealtimeEmissionsResponse {
  success: boolean
  data: RealtimeData
  error?: string
}

export interface StreamResponse {
  success: boolean
  data: StreamData
  error?: string
}

// Helper to build query params
const buildQueryString = (params: Record<string, string>): string => {
  const query = new URLSearchParams(params).toString()
  return query ? `?${query}` : ''
}

// Fetch with error handling
const fetchRealtime = async <T>(
  endpoint: string,
  apiKey: string,
  params: Record<string, string> = {}
): Promise<T> => {
  const queryString = buildQueryString({ api_key: apiKey, ...params })
  const url = `${API_BASE_URL}${endpoint}${queryString}`

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || 'Request failed')
  }

  return result
}

// Service class
export class RealtimeEmissionsService {
  /**
   * Get realtime emissions data for a specific time window
   * @param apiKey - The API key for authentication
   * @param window - Time window (e.g., '1h', '24h', '7d')
   * @returns Realtime emissions data
   */
  static async getEmissions(
    apiKey: string,
    window: string = '1h'
  ): Promise<RealtimeEmissionsResponse> {
    return fetchRealtime<RealtimeEmissionsResponse>('/realtime/emissions', apiKey, { window })
  }

  /**
   * Poll for new events since a specific timestamp
   * @param apiKey - The API key for authentication
   * @param since - ISO timestamp to get events since
   * @returns Stream data with new events
   */
  static async pollStream(apiKey: string, since: string): Promise<StreamResponse> {
    return fetchRealtime<StreamResponse>('/realtime/stream', apiKey, { since })
  }

  /**
   * Get the first available API key prefix
   * @returns API key prefix or null
   */
  static async getApiKey(): Promise<string | null> {
    try {
      const response = await ApiKeyService.getApiKeys()
      return response?.data?.api_keys?.[0]?.prefix || null
    } catch (error) {
      console.error('Failed to fetch API key:', error)
      return null
    }
  }

  /**
   * Verify if an API key is valid and active
   * @param apiKey - The API key to verify
   * @returns Boolean indicating if key is valid
   */
  static async verifyApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await ApiKeyService.verifyApiKey(apiKey)
      return response?.valid || false
    } catch (error) {
      console.error('Failed to verify API key:', error)
      return false
    }
  }
}

// Utility functions
export const formatEmissions = (grams: number): string => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`
  }
  return `${grams.toFixed(2)} g`
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

export const getEventTypeColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    page_view: 'blue',
    button_click: 'green',
    form_submit: 'purple',
    api_call: 'orange',
    default: 'gray',
  }
  return colors[eventType] || colors.default
}