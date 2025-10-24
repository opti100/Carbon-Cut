import { Campaign, CreateCampaignData, Credential, CreateCredentialData, Impression } from '@/types/campaign';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const credentialApi = {
  list: async (type?: string): Promise<Credential[]> => {
    const url = type 
      ? `${API_BASE_URL}/campaign/credentials/?type=${type}`
      : `${API_BASE_URL}/campaign/credentials/`;
    const data = await fetchWithAuth(url);
    return data.data || [];
  },

  create: async (data: CreateCredentialData): Promise<Credential> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/campaign/credentials/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/campaign/credentials/${id}/`, {
      method: 'DELETE',
    });
  },
};

export const campaignApi = {
  list: async (): Promise<Campaign[]> => {
    const data = await fetchWithAuth(`${API_BASE_URL}/campaign/`);
    return data.data || [];
  },

  get: async (id: number): Promise<Campaign> => {
    const data = await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`);
    return data.data;
  },

  create: async (data: CreateCampaignData): Promise<Campaign> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/campaign/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCampaignData>): Promise<Campaign> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/campaign/${id}/`, {
      method: 'DELETE',
    });
  },
};

export const impressionApi = {
  list: async (campaignId?: number): Promise<Impression[]> => {
    const url = campaignId
      ? `${API_BASE_URL}/impressions/?campaign_id=${campaignId}`
      : `${API_BASE_URL}/impressions/`;
    const data = await fetchWithAuth(url);
    return data.data || [];
  },

  get: async (id: string): Promise<Impression> => {
    const data = await fetchWithAuth(`${API_BASE_URL}/impressions/${id}/`);
    return data.data;
  },

  sync: async (campaignId: number): Promise<void> => {
    await fetchWithAuth(`${API_BASE_URL}/impressions/sync/`, {
      method: 'POST',
      body: JSON.stringify({ campaign_id: campaignId }),
    });
  },
};