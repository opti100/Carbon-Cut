import { api } from "@/contexts/AuthContext"


export interface MonthlyReport {
  id: string
  month: number
  year: number
  total_kg_co2: number
  cloud_kg: number
  cdn_kg: number
  workforce_kg: number
  onprem_kg: number
  travel_kg: number
  website_sdk_kg: number
  source_breakdown: Record<string, any>
  metadata: Record<string, any>
  generated_at: string | null
  created_at: string | null
}

export interface MonthlyReportsResponse {
  success: boolean
  data: {
    reports: MonthlyReport[]
    total: number
  }
}

export const reportsApi = {
  getMonthlyReports: async (year?: number): Promise<MonthlyReportsResponse> => {
    const params = year ? `?year=${year}` : ''
    const res = await api.get(`/reports/monthly/${params}`)
    return res.data
  },

  getMonthlyReport: async (year: number, month: number) => {
    const res = await api.get(`/reports/monthly/${year}/${month}/`)
    return res.data
  },

  generateReport: async (month: number, year: number) => {
    const res = await api.post('/reports/monthly/generate/', { month, year })
    return res.data
  },
}