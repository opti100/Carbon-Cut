import { 
  ApiKeysListResponse, 
  CreateApiKeyResponse,
  VerificationResult,
  InstallationGuideResponse 
} from "@/types/api-key";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper to get auth token from cookies
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

// Generic fetch wrapper with error handling
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

export class ApiKeyService {
  private static baseUrl = `${API_BASE_URL}/keys`;

  static async getApiKeys(): Promise<ApiKeysListResponse> {
    return fetchWithAuth(`${this.baseUrl}/`, {
      method: 'GET',
    });
  }

  static async createApiKey(name: string, domain?: string): Promise<CreateApiKeyResponse> {
    return fetchWithAuth(`${this.baseUrl}/`, {
      method: 'POST',
      body: JSON.stringify({ name, domain: domain || '*' }),
    });
  }

  static async deleteApiKey(keyId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/`, {
      method: 'DELETE',
    });
  }

  static async toggleApiKey(keyId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/`, {
      method: 'PATCH',
    });
  }

  /**
   * Verify SDK installation on a URL
   */
  static async verifyInstallation(keyId: string, url: string): Promise<VerificationResult> {
    console.log(`🔍 Verifying SDK installation for key ${keyId} on ${url}`);
    
    return fetchWithAuth(`${this.baseUrl}/${keyId}/verify/`, {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  /**
   * Get installation guide for an API key
   */
  static async getInstallationGuide(keyId: string): Promise<InstallationGuideResponse> {
    console.log(`📖 Fetching installation guide for key ${keyId}`);
    
    return fetchWithAuth(`${this.baseUrl}/${keyId}/installation-guide/`, {
      method: 'GET',
    });
  }
}