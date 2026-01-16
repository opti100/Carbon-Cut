export interface AnalyticsOverview {
  total_emissions_kg: number
  total_emissions_tonnes: number
  record_count: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
  previous_period_kg: number
  change_kg: number
  change_percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface ScopeBreakdown {
  scope: string
  label: string
  value_kg: number
  value_tonnes: number
  percentage: number
  color: string
}

export interface SourceBreakdown {
  source: string
  label: string
  value_kg: number
  value_tonnes: number
  percentage: number
  record_count: number
  color: string
}


export interface MonthlyTrend {
  month: number
  month_name: string
  total_kg: number
  total_tonnes: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
}

export interface TopContributor {
  rank: number
  source: string
  label: string
  scope: string
  total_kg: number
  total_tonnes: number
  percentage: number
  record_count: number
  accuracy: string
  latest_date: string | null
}

export interface AccuracyDistribution {
  accuracy: string
  label: string
  value_kg: number
  percentage: number
  record_count: number
  color: string
}

export interface YoYComparison {
  current_year: number
  previous_year: number
  current_kg: number
  previous_kg: number
  change_kg: number
  change_percentage: number
  trend: 'increase' | 'decrease' | 'stable'
  has_previous_data: boolean
}

export interface MonthlyBreakdownRow {
  month: number
  month_name: string
  total_kg: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
  sources: Record<string, number>
}

export interface IntensityMetrics {
  per_employee_kg: number
  per_employee_tonnes: number
  employee_count: number
  daily_average_kg: number
  monthly_average_kg: number
}

export interface AnalyticsData {
  period: {
    year: number
    month: number | null
    display: string
  }
  overview: AnalyticsOverview
  scope_breakdown: ScopeBreakdown[]
  source_breakdown: SourceBreakdown[]
  monthly_trend: MonthlyTrend[]
  source_scope_matrix: Array<{
    source: string
    scope_1: number
    scope_2: number
    scope_3: number
    total: number
  }>
  top_contributors: TopContributor[]
  accuracy_distribution: AccuracyDistribution[]
  yoy_comparison: YoYComparison
  monthly_breakdown_table: MonthlyBreakdownRow[]
  intensity_metrics: IntensityMetrics
  generated_at: string
}

export interface AnalyticsResponse {
  success: boolean
  data: AnalyticsData
  error?: string
}