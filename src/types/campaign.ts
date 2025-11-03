export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum CredentialType {
  GOOGLE_ADS = 'google_ads',
  META_ADS = 'meta_ads',
  LINKEDIN_ADS = 'linkedin_ads'
}

export interface CredentialValue {
  client_id?: string;
  client_secret?: string;
  customer_id?: string;
  developer_token?: string;
  refresh_token?: string;
  access_token?: string;
}

export interface Credential {
  id: number;
  name: string;
  credential_type: CredentialType;
  credential_value: CredentialValue;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
export interface UTMParameter {
  key: string;
  value: string;
  selected?: boolean;
  description?: string;
}

export interface Campaign {
  id: number;
  name: string;
  user_id: number;
  google_ads_campaign_id: string;
  google_ads_customer_id: string;
  utm_params: UTMParameter[];
  utm_strings: string[];
  utm_query_string: string;
  tracking_template: string;
  tracking_url_example: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCampaignData {
  name: string;
  google_ads_campaign_id: string;
  google_ads_customer_id: string;
  google_ads_campaign_data?: any;
  utm_params?: UTMParameter[];
}
export interface CreateCredentialData {
  name: string;
  credential_type: CredentialType;
  credential_value: CredentialValue;
}
export interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  date_range: {
    start: string;
    end: string;
  };
  totals: {
    impressions: number;
    ad_clicks: number;
    sessions: number;
    page_views: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversion_rate: number;
    cost: number;
    cpc: number;
    cpa: number;
    total_emissions_kg: number;
    emissions_per_conversion_kg: number;
  };
  emissions_breakdown: {
    impressions_g: number;
    page_views_g: number;
    clicks_g: number;
    conversions_g: number;
    total_g: number;
  };
  by_region: Array<{
    country: string;
    impressions: number;
    sessions: number;
    conversions: number;
    emissions_kg: number;
    cost: number;
  }>;
  by_device: Array<{
    device_type: string;
    impressions: number;
    sessions: number;
    conversions: number;
    emissions_kg: number;
    cost: number;
  }>;
  time_series: Array<{
    date: string;
    hour: number | null;
    impressions: number;
    sessions: number;
    conversions: number;
    emissions_kg: number;
    cost: number;
  }>;
}

export interface SyncImpressionsData {
  start_date: string;
  end_date: string;
}