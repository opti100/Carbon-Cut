export interface EmissionOverview {
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

export interface ScopeBreakdownItem {
  scope: string
  label: string
  value_kg: number
  value_tonnes: number
  percentage: number
  color: string
}

export interface SourceBreakdownItem {
  source: string
  label: string
  value_kg: number
  value_tonnes: number
  percentage: number
  record_count: number
  color: string
}

export interface MonthlyTrendItem {
  month: number
  month_name: string
  total_kg: number
  total_tonnes: number
  scope_1_kg: number
  scope_2_kg: number
  scope_3_kg: number
}

export interface AnalyticsData {
  period: { year: number; month: number | null; display: string }
  overview: EmissionOverview
  scope_breakdown: ScopeBreakdownItem[]
  source_breakdown: SourceBreakdownItem[]
  monthly_trend: MonthlyTrendItem[]
  source_scope_matrix: any[]
  top_contributors: any[]
  accuracy_distribution: any[]
  yoy_comparison: any
  monthly_breakdown_table: any[]
  intensity_metrics: any
  generated_at: string
}

export interface DataSourceStatus {
  source: string
  label: string
  entry_type: string
  scope: string
  requires_monthly_input: boolean
  status: 'pending' | 'submitted' | 'calculated' | 'auto_calculated' | 'auto_tracked'
  kg_co2: number | null
  accuracy: string
  last_updated?: string | null
  config?: any
  server_count?: number
}

export interface MonthlyReportStatus {
  year: number
  month: number
  month_name: string
  report_exists: boolean
  report_id: string | null
  total_emissions_kg: number | null
  scope_breakdown: { scope_1: number; scope_2: number; scope_3: number } | null
  data_sources: DataSourceStatus[]
  pending_entries: number
  is_complete: boolean
  generated_at: string | null
}

export interface ConfigData {
  cloud_providers: any[]
  cdn_configs: any[]
  workforce_config: any | null
  onprem_configs: any[]
  travel_configs: any[]
  onboarding_completed: boolean
}

export type EmissionSourceType =
  | 'cloud_aws'
  | 'cloud_gcp'
  | 'cloud_azure'
  | 'cdn'
  | 'onprem_server'
  | 'workforce_office'
  | 'workforce_remote'
  | 'travel_flight'
  | 'travel_rail'
  | 'travel_road'
  | 'website_sdk'