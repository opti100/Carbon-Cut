import { ApiKeysListResponse, CreateApiKeyResponse } from "@/types/api-key";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class ApiKeyService {
  private static baseUrl = `${API_BASE_URL}/keys`;

  static async getApiKeys(): Promise<ApiKeysListResponse> {
    const response = await fetch(`${this.baseUrl}/api-keys/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }

    return response.json();
  }

  static async createApiKey(name: string): Promise<CreateApiKeyResponse> {
    const response = await fetch(`${this.baseUrl}/api-keys/create/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create API key');
    }

    return response.json();
  }

  static async deleteApiKey(keyId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/api-keys/manage/${keyId}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }

    return response.json();
  }

  static async toggleApiKey(keyId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/api-keys/manage/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key_id: keyId }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle API key');
    }

    return response.json();
  }
}