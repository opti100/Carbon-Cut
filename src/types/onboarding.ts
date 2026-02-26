// ============================================================
// Onboarding Types
// Maps 1:1 with the backend onboarding API contract
// ============================================================

// ----- Step 1: Cloud Provider -----
export interface CloudProviderData {
  tabType: 'Manual' | 'Upload'
  actualCost: string
  monthlyHoursUsage: string
  region: string
  uploadedFile: File | null
  cloud: string
  isManualOpen: boolean
  isUploadOpen: boolean
}

// ----- Step 2: CDN -----
export interface CdnData {
  cdnProvider: string
  monthlyGBTransferred: string
  regions: string
}

// ----- Step 3: On-Prem -----
export interface OnPremData {
  name: string
  cpuCores: string
  ramGB: string
  storageTB: string
  avgCpuUtilization: string
  hoursPerDay: string
}

// ----- Step 4: Workforce -----
export interface WorkforceLocation {
  workforceType: string
  workArrangementRemote: string
  country: string
  state: string
  city: string
  squareMeters: string
  employeeCount?: string
}

export interface WorkforceEmissionsData {
  workforceLocations: WorkforceLocation[]
  workforceType: string
  workArrangementRemote: string
  country: string
  state: string
  city: string
  squareMeters: string
}

// ----- Step 5: Travel -----
export interface TravelItem {
  travel_type: string
  distance_km?: string | number
  passenger_count?: string | number
  flight_class?: string
  is_domestic?: string | boolean
  isOpen?: boolean
}

export interface TravelData {
  travels: TravelItem[]
}

export interface EnergySource {
  source_type: string
  monthly_kwh: string
  monthly_liters: string
  country_code: string
  label: string
  isOpen: boolean
}

export interface EnergyData {
  energy_sources: EnergySource[]
}

export interface EnergyPayload {
  energy_sources: {
    source_type: string
    monthly_kwh: number | null
    monthly_liters: number | null
    country_code: string
  }[]
}

// ----- Step 7: Ads -----
export interface AdCampaign {
  platform: string
  ad_format: string
  monthly_impressions: string
  label: string
  isOpen: boolean
}

export interface AdsData {
  ad_campaigns: AdCampaign[]
}

export interface AdsPayload {
  ad_campaigns: {
    platform: string
    ad_format: string
    monthly_impressions: number
  }[]
}

// ----- Step 8: Machinery -----
export interface Machine {
  machine_type: string
  fuel_type: string
  monthly_hours: string
  fuel_consumption_rate_l_per_hour: string
  monthly_kwh: string
  label: string
  isOpen: boolean
}

export interface MachineryData {
  machines: Machine[]
}

export interface MachineryPayload {
  machines: {
    machine_type: string
    fuel_type: string
    monthly_hours: number | null
    fuel_consumption_rate_l_per_hour: number | null
    monthly_kwh: number | null
  }[]
}

// ----- Step 9: Oil & Gas -----
export interface OilGasConsumption {
  product_type: string
  monthly_liters: string
  label: string
  isOpen: boolean
}

export interface OilGasData {
  consumptions: OilGasConsumption[]
}

export interface OilGasPayload {
  consumptions: {
    product_type: string
    monthly_liters: number
  }[]
}

// ----- API Response Types -----
export interface OnboardingStepResponse {
  success: boolean
  data: Record<string, any>
}

export interface OnboardingStepData {
  completed: boolean
  data: any
}

export interface OnboardingStatusResponse {
  success: boolean
  data: {
    user_id: string
    onboarding_completed: boolean
    steps: {
      cloud: OnboardingStepData
      cdn: OnboardingStepData
      onprem: OnboardingStepData
      workforce: OnboardingStepData
      travel: OnboardingStepData
    }
    completed_steps: number
    total_steps: number
    progress_pct: number
  }
}

// ----- API Payload Types (what we send to backend) -----
export interface CloudPayload {
  provider: string
  connection_type: string
  regions: string[]
  monthly_cost_usd: number | null
  monthly_hours_usage: number | null
}

export interface CdnPayload {
  provider: string
  monthly_gb_transferred: number | null
  regions: string[]
}

export interface OnPremPayload {
  name: string
  cpu_cores: number
  ram_gb: number
  storage_tb: number
  avg_cpu_utilization: number
  hours_per_day: number
  location_country_code: string
  location_city: string
  pue: number
}

export interface WorkforcePayload {
  workforce_locations: {
    country: string
    country_code: string
    state: string
    city: string
    square_meters: string
    workforce_type: string
    work_arrangement_remote: string
    employee_count: number
  }[]
}

export interface TravelPayload {
  travels: {
    travel_type: string
    distance_km: number
    passenger_count: number
    flight_class?: string
    is_domestic?: boolean
  }[]
}

export interface BulkOnboardingPayload {
  cloud?: CloudPayload
  cdn?: CdnPayload
  onprem?: OnPremPayload
  workforce?: WorkforcePayload
  travel?: TravelPayload
  energy?: EnergyPayload
  ads?: AdsPayload
  machinery?: MachineryPayload
  oilgas?: OilGasPayload
}