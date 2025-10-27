export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  prefix: string;
  domain?: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
  installation_verified?: boolean;
  last_verified_at?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  domain: string;
}

export interface CreateApiKeyResponse {
  success: boolean;
  message: string;
  data?: {
    api_key: ApiKey;
    full_key: string;
  };
}

export interface ApiKeysListResponse {
  success: boolean;
  message: string;
  data: {
    api_keys: ApiKey[];
  };
}

export interface VerificationDetails {
  sdk_script_found: boolean;
  token_found: boolean;
  correct_token: boolean;
  script_details?: {
    src: string;
    token?: string;
    api_url?: string;
    debug?: string;
    domain?: string;
  };
  inline_initialization?: {
    found: boolean;
    has_init?: boolean;
    has_correct_token?: boolean;
    snippet?: string;
  };
}

export interface VerificationResult {
  success: boolean;
  message?: string;
  data: {
    installed: boolean;
    domain?: string;
    url_checked?: string;
    status: 'verified' | 'warning' | 'not_found';
    warnings?: string[];
    details: VerificationDetails;
    installation_guide?: InstallationGuide;
  };
}

export interface InstallationGuide {
  script_tag: string;
  placement: string;
  next_steps: string[];
}

export interface InstallationGuideResponse {
  success: boolean;
  message: string;
  data: {
    api_key: {
      id: string;
      name: string;
      domain: string;
      prefix: string;
    };
    installation: InstallationGuide;
  };
}