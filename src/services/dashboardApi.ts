import { api } from '@/contexts/AuthContext'


export const dashboardApi = {
  getConfig: () => api.get('/web/config/').then((r) => r.data),
  getOnboardingStatus: () => api.get('/onboarding/status/').then((r) => r.data),

  getAnalytics: (year: number, month?: number) =>
    api
      .get('/web/analytics/', { params: { year, ...(month ? { month } : {}) } })
      .then((r) => r.data),

  getSummary: (year: number, month: number, recalculate?: boolean) =>
    api
      .get('/web/summary/', {
        params: { year, month, ...(recalculate ? { recalculate: 'true' } : {}) },
      })
      .then((r) => r.data),

  getBySource: (year: number, month: number) =>
    api.get('/web/emissions/by-source/', { params: { year, month } }).then((r) => r.data),

  getMonthlyReport: (year: number, month: number) =>
    api.get(`/reports/monthly/${year}/${month}/`).then((r) => r.data),

  getYearlySummary: (year: number) =>
    api.get(`/reports/yearly/${year}/`).then((r) => r.data),

  recalculateMonth: (year: number, month: number) =>
    api.post(`/reports/monthly/${year}/${month}/recalculate/`).then((r) => r.data),

  submitCloudEntry: (year: number, month: number, data: any) =>
    api.post(`/reports/monthly/${year}/${month}/cloud/`, data).then((r) => r.data),

  submitCDNEntry: (year: number, month: number, data: any) =>
    api.post(`/reports/monthly/${year}/${month}/cdn/`, data).then((r) => r.data),

  submitTravelEntry: (year: number, month: number, data: any) =>
    api.post(`/reports/monthly/${year}/${month}/travel/`, data).then((r) => r.data),

  calculateCloudManual: (data: any) => api.post('/web/cloud/manual/', data).then((r) => r.data),
  uploadCloudCSV: (formData: FormData) =>
    api
      .post('/web/cloud/upload-csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
  calculateCDN: (data: any) => api.post('/web/cdn/', data).then((r) => r.data),
  calculateWorkforce: (data: any) => api.post('/web/workforce/', data).then((r) => r.data),
  calculateOnprem: (data: any) => api.post('/web/onprem/', data).then((r) => r.data),
  calculateTravel: (data: any) => api.post('/web/travel/', data).then((r) => r.data),


  exportCSRD: (year: number, format: 'json' | 'csv' | 'pdf' = 'json') =>
    api.get('/web/export/csrd/', { params: { year, format } }).then((r) => r.data),
}