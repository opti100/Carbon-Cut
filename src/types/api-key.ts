export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
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
  data?: {
    api_keys: ApiKey[];
  };
}