import { GoogleAdsConnectionStatus } from "@/types/google-ads";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
  checkConnection: async (): Promise<GoogleAdsConnectionStatus> => {
    const response = await fetch(`${API_BASE_URL}/campaign/credentials/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check connection status');
    }

    const data = await response.json();
    const googleAdsCredential = data.data?.find(
      (cred: any) => cred.credential_type === 'GOOGLE_ADS'
    );

    return {
      is_connected: !!googleAdsCredential,
      email: googleAdsCredential?.client_id,
      customer_id: googleAdsCredential?.customer_id,
      connected_at: googleAdsCredential?.created_at,
    };
  },

  /**
   * Disconnect Google Ads account
   */
  disconnect: async (credentialId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/campaign/credentials/${credentialId}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect Google Ads');
    }
  },
};