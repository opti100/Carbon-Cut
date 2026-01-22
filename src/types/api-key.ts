export interface ApiKey {
  id: string
  name: string
  prefix: string
  key?: string
  domain: string
  is_active: boolean
  industry_category?: string
  product?: string
  last_used_at?: string
  created_at: string
  conversion_rules_count: number
}

export interface ApiKeysListResponse {
  success: boolean
  message: string
  data: {
    api_keys: ApiKey[]
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

export interface CreateApiKeyResponse {
  success: boolean
  message: string
  data: {
    api_key: {
      id: string
      name: string
      domain: string
      is_active: boolean
      created_at: string
      prefix: string
      full_key: string
    }
  }
}

export interface VerificationResult {
  installed: boolean
  script_found: boolean
  api_key_valid: boolean
  url_checked?: string
  status_code?: number
  errors?: string[]
  warnings?: string[]
  details?: {
    script_src_found: boolean
    data_token_found: boolean
    total_scripts_checked: number
  }
}

export interface InstallationGuideResponse {
  success: boolean
  message: string
  data: {
    api_key: string
    domain: string
    cdn_url: string
    api_url: string
    installation: {
      script_tag: string
      script_tag_async: string
      npm: string
      nextjs: string
      gtm: string
    }
    steps: Array<{
      step: number
      title: string
      description: string
    }>
    configuration: Record<string, string>
  }
}

export interface ConversionRule {
  id: string
  name: string
  rule_type: 'url' | 'click' | 'form_submit' | 'custom_event'
  priority: number
  is_active: boolean
  conversion_count: number
  last_triggered_at?: string
  created_at: string
  url_pattern?: string
  match_type?: string
  css_selector?: string
  element_text?: string
  form_id?: string
  custom_event_name?: string
  track_value?: boolean
}

export interface ConversionRulesResponse {
  success: boolean
  message: string
  data: {
    rules: ConversionRule[]
  }
}

export interface CreateConversionRuleRequest {
  name: string
  rule_type: 'url' | 'click' | 'form_submit' | 'custom_event'
  url_pattern?: string
  match_type?: 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'query_param'
  css_selector?: string
  element_text?: string
  form_id?: string
  custom_event_name?: string
  track_value?: boolean
  value_selector?: string
  default_value?: number
  priority?: number
}

export interface WebsiteAnalyticsResponse {
  success: boolean
  message: string
  data: {
    period_days: number
    total_sessions: number
    total_page_views: number
    total_emissions_g: number
    total_emissions_kg: number
    avg_emissions_per_session_g: number
    by_api_key: Array<{
      api_key_id: string
      name: string
      domain: string
      sessions: number
      events: number
      emissions_g: number
    }>
  }
}