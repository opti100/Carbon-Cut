export interface ApiKey {
  id: string
  name: string
  key?: string
  prefix: string
  domain?: string
  source_type?: 'web' | 'ads'
  created_at: string
  last_used_at: string | null
  is_active: boolean
  installation_verified?: boolean
  last_verified_at?: string
}

export interface CreateApiKeyRequest {
  name: string
  domain: string
  source_type?: 'web' | 'ads'
  extras?: {
    website_url?: string
    description?: string
  }
}

export interface CreateApiKeyResponse {
  success: boolean
  message: string
  data?: {
    api_key: ApiKey
    full_key: string
  }
}

export interface ApiKeysListResponse {
  success: boolean
  message: string
  data: {
    api_keys: ApiKey[]
  }
}

export interface VerificationDetails {
  sdk_script_found: boolean
  token_found: boolean
  correct_token: boolean
  script_details?: {
    src: string
    token?: string
    api_url?: string
    debug?: string
    domain?: string
  }
  inline_initialization?: {
    found: boolean
    has_init?: boolean
    has_correct_token?: boolean
    snippet?: string
  }
}

export interface VerificationResult {
  success: boolean
  message?: string
  data: {
    installed: boolean
    domain?: string
    url_checked?: string
    status: 'verified' | 'warning' | 'not_found'
    warnings?: string[]
    details: VerificationDetails
    installation_guide?: InstallationGuide
  }
}

export interface InstallationGuide {
  script_tag: string
  placement: string
  next_steps: string[]
}

export interface InstallationGuideResponse {
  success: boolean
  message: string
  data: {
    api_key: {
      id: string
      name: string
      domain: string
      prefix: string
    }
    installation: InstallationGuide
  }
}
export type ConversionRuleType = 'url' | 'click' | 'form_submit' | 'custom_event'
export type MatchType =
  | 'exact'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'regex'
  | 'query_param'

export interface ConversionRule {
  id: string
  name: string
  rule_type: ConversionRuleType
  priority: number
  is_active: boolean
  conversion_count: number
  last_triggered_at: string | null
  created_at: string

  // URL rules
  url_pattern?: string
  match_type?: MatchType

  // Click rules
  css_selector?: string
  element_text?: string

  // Form rules
  form_id?: string

  // Custom event rules
  custom_event_name?: string

  // Value tracking
  track_value?: boolean
  value_selector?: string
  default_value?: number
}

export interface CreateConversionRuleRequest {
  name: string
  rule_type: ConversionRuleType
  url_pattern?: string
  match_type?: MatchType
  css_selector?: string
  element_text?: string
  form_id?: string
  custom_event_name?: string
  track_value?: boolean
  value_selector?: string
  default_value?: number
  priority?: number
}

export interface ConversionRulesResponse {
  success: boolean
  message: string
  data: {
    rules: ConversionRule[]
    total_count: number
  }
}
// Add to your /services/apikey/apikey.ts file

export interface WebsiteAnalyticsResponse {
  success: boolean
  data: {
    has_data: boolean
    period_days: number
    message?: string
    stats: {
      total_visitors: number
      total_page_views: number
      total_emissions_kg: number
      total_emissions_g: number
      avg_emissions_per_visit_g: number
      total_sessions: number
      api_keys_count: number
    }
    daily_breakdown: Array<{
      date: string
      sessions: number
      emissions_g: number
      emissions_kg: number
    }>
    device_breakdown: Array<{
      device: string
      count: number
      percentage: number
    }>
    country_breakdown: Array<{
      country: string
      count: number
      percentage: number
    }>
    top_pages: Array<{
      url: string
      views: number
    }>
  }
}
