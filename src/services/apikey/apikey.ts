import {
  ApiKeysListResponse,
  CreateApiKeyResponse,
  VerificationResult,
  InstallationGuideResponse,
  ConversionRulesResponse,
  CreateConversionRuleRequest,
  ConversionRule,
  WebsiteAnalyticsResponse,
} from '@/types/api-key'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; auth-token=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// Generic fetch wrapper with error handling
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  return response.json()
}

export class ApiKeyService {
  private static baseUrl = `${API_BASE_URL}/apikey`

  static async getApiKeys(sourceType?: 'web' | 'ads'): Promise<ApiKeysListResponse> {
    const params = sourceType ? `?source_type=${sourceType}` : ''
    return fetchWithAuth(`${this.baseUrl}/${params}`, {
      method: 'GET',
    })
  }

  static async createApiKey(
    name: string,
    domain?: string,
    product?: 'web' | 'ads' | 'lubricant',
    extras?: {
      website_url?: string
      description?: string
      industry_category?: 'internet' | 'oil_and_gas'
    }
  ): Promise<CreateApiKeyResponse> {
    return fetchWithAuth(`${this.baseUrl}/`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        domain: domain || '*',
        product: product || 'web',
        industry_category: extras?.industry_category || 'internet',
        ...extras,
      }),
    })
  }

  static async deleteApiKey(keyId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/`, {
      method: 'DELETE',
    })
  }

  static async toggleApiKey(keyId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/`, {
      method: 'PATCH',
    })
  }

  /**
   * Verify SDK installation on a URL
   */
  static async verifyInstallation(
    keyId: string,
    url: string
  ): Promise<VerificationResult> {
    console.log(`🔍 Verifying SDK installation for key ${keyId} on ${url}`)

    return fetchWithAuth(`${this.baseUrl}/${keyId}/verify/`, {
      method: 'POST',
      body: JSON.stringify({ url }),
    })
  }

  /**
   * Get installation guide for an API key
   */
  static async getInstallationGuide(keyId: string): Promise<InstallationGuideResponse> {
    console.log(`📖 Fetching installation guide for key ${keyId}`)

    return fetchWithAuth(`${this.baseUrl}/${keyId}/installation-guide/`, {
      method: 'GET',
    })
  }
  
  static async getConversionRules(keyId: string): Promise<ConversionRulesResponse> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/conversion-rules/`, {
      method: 'GET',
    })
  }

  /**
   * Create a new conversion rule
   */
  static async createConversionRule(
    keyId: string,
    ruleData: CreateConversionRuleRequest
  ): Promise<{ success: boolean; data: { rule: ConversionRule } }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/conversion-rules/`, {
      method: 'POST',
      body: JSON.stringify(ruleData),
    })
  }

  /**
   * Update a conversion rule
   */
  static async updateConversionRule(
    keyId: string,
    ruleId: string,
    updates: Partial<ConversionRule>
  ): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/conversion-rules/${ruleId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete a conversion rule
   */
  static async deleteConversionRule(
    keyId: string,
    ruleId: string
  ): Promise<{ success: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/${keyId}/conversion-rules/${ruleId}/`, {
      method: 'DELETE',
    })
  }

  static async toggleConversionRule(
    keyId: string,
    ruleId: string,
    isActive: boolean
  ): Promise<{ success: boolean }> {
    return this.updateConversionRule(keyId, ruleId, { is_active: isActive })
  }

  static async getWebsiteAnalytics(days: number = 30): Promise<WebsiteAnalyticsResponse> {
    console.log(` Fetching website analytics for last ${days} days`)

    return fetchWithAuth(`${this.baseUrl}/website-analytics?days=${days}`, {
      method: 'GET',
    })
  }

  /**
   * Verify if an API key is valid and active
   */
  static async verifyApiKey(apiKey: string): Promise<{ valid: boolean }> {
    return fetchWithAuth(`${this.baseUrl}/verify/`, {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey }),
    })
  }
}