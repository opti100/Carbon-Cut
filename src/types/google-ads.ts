export interface GoogleAdsAuthUrlResponse {
  success: boolean;
  message: string;
  auth_url?: string;
  state?: string;
  expires_at?: string;
}

export interface GoogleAdsCallbackResponse {
  success: boolean;
  message: string;
  user_email?: string;
  project_id?: string;
  has_refresh_token?: boolean;
}

export interface GoogleAdsConnectionStatus {
  is_connected: boolean;
  email?: string;
  customer_id?: string;
  connected_at?: string;
}