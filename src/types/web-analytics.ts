// Update for /web/analytics/ response from EmissionAnalyticsView

export interface AnalyticsOverview {
  total_emissions_kg: number
  total_emissions_tonnes: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
}

export interface SourceBreakdown {
  source: string
  label: string
  emissions_kg: number
  emissions_tonnes: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  month_name: string
  month_number: number
  total_kg: number
  emissions: number
}

export interface CDNMonthlyTrend {
  month: string
  month_name: string
  month_number: number
  cdn_kg: number
  emissions: number
}

export interface WorkforceMonthlyTrend {
  month: string
  month_name: string
  month_number: number
  workforce_kg: number
  emissions: number
}

export interface ComparisonMetric {
  current: number
  previous: number
  change_percent: number
}

export interface AnalyticsComparison {
  total_emissions: ComparisonMetric
  scope_1: ComparisonMetric
  scope_2: ComparisonMetric
}

export interface RecentActivity {
  id: string
  source: string
  label: string
  emissions_kg: number
  emissions_tonnes: number
  scope: string
  created_at: string
  period: string
  status: string
  is_automated: boolean
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  monthly_trend: MonthlyTrend[]
  cdn_monthly_trend: CDNMonthlyTrend[]
  workforce_monthly_trend: WorkforceMonthlyTrend[]
  source_breakdown: SourceBreakdown[]
  comparison: AnalyticsComparison
  recent_activity: RecentActivity[]
}