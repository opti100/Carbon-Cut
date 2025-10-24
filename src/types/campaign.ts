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

export interface Campaign {
  id: number;
  name: string;
  user_id: number;
  utm_params: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Impression {
  id: string;
  campaign: Campaign;
  impression_count: number;
  impression_date: string;
  source: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateCampaignData {
  name: string;
  utm_params: string[];
  account_id: string;
}

export interface CreateCredentialData {
  name: string;
  credential_type: CredentialType;
  credential_value: CredentialValue;
}