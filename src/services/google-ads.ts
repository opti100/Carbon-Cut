import { GoogleAdsConnectionStatus } from "@/types/google-ads";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authtoken' || name === 'auth-token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const token = getAuthToken();
  if (token) {
    // @ts-expect-error will fix it later
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response.json();
};

export const googleAdsApi = {
  /**
   * Get Google Ads OAuth authorization URL
   */
  getAuthUrl: async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/impressions/google/redirect-url`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get authorization URL');
    }

    // Backend redirects, so we get the URL from the response
    return response.url;
  },

  /**
   * Check if user has connected Google Ads
   */
  async checkConnection() {
    const response = await fetchWithAuth(`${API_BASE_URL}/impressions/google-ads/status/`);
    // console.log('✅ Google Ads status response:', response);
    
    // Backend returns data directly at root level
    return {
      is_connected: response.is_connected || false,
      credential_id: response.credential_id,
      customer_id: response.customer_id,
      customer_name: response.customer_name,
      email: response.email,
      currency: response.currency,
      timezone: response.timezone,
      connected_at: response.connected_at,
      last_updated: response.last_updated,
      total_accounts: response.total_accounts,
    };
  },

  /**
   * Disconnect Google Ads account
   */
  async disconnect() {
    const response = await fetchWithAuth(`${API_BASE_URL}/impressions/google-ads/disconnect/`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    console.log('✅ Disconnect response:', response);
    return response;
  },

  /**
   * Get all accessible Google Ads accounts
   */
  async getAccounts() {
    const response = await fetchWithAuth(`${API_BASE_URL}/impressions/google-ads/accounts/`);
    // console.log('✅ Accounts response:', response);
    return response;
  },

  /**
   * Switch to a different Google Ads account
   */
  async switchAccount(customerId: string) {
    const response = await fetchWithAuth(`${API_BASE_URL}/impressions/google-ads/switch-account/`, {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId }),
    });
    console.log('✅ Switch account response:', response);
    return response;
  },
};