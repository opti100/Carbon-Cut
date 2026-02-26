import { api } from '@/contexts/AuthContext'
import type {
  CloudPayload,
  CdnPayload,
  OnPremPayload,
  WorkforcePayload,
  TravelPayload,
  BulkOnboardingPayload,
  OnboardingStatusResponse,
  OnboardingStepResponse,
  EnergyPayload,
  AdsPayload,
  MachineryPayload,
  OilGasPayload,
} from '@/types/onboarding'

const BASE = '/onboarding'

export const onboardingApi = {
  getStatus: async (): Promise<OnboardingStatusResponse> => {
    const { data } = await api.get(`${BASE}/status/`)
    return data
  },
  saveCloud: async (payload: CloudPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/cloud/`, payload)
    return data
  },
  saveCdn: async (payload: CdnPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/cdn/`, payload)
    return data
  },
  saveOnprem: async (payload: OnPremPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/onprem/`, payload)
    return data
  },
  saveWorkforce: async (payload: WorkforcePayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/workforce/`, payload)
    return data
  },
  saveTravel: async (payload: TravelPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/travel/`, payload)
    return data
  },
  saveEnergy: async (payload: EnergyPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/energy/`, payload)
    return data
  },
  saveAds: async (payload: AdsPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/ads/`, payload)
    return data
  },
  saveMachinery: async (payload: MachineryPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/machinery/`, payload)
    return data
  },
  saveOilGas: async (payload: OilGasPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/oilgas/`, payload)
    return data
  },
  complete: async (): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/complete/`)
    return data
  },
  saveBulk: async (payload: BulkOnboardingPayload): Promise<OnboardingStepResponse> => {
    const { data } = await api.post(`${BASE}/bulk/`, payload)
    return data
  },
}