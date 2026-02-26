/**
 * Transform functions: FE form state ↔ API payload
 *
 * The frontend form state uses camelCase strings for everything.
 * The backend expects snake_case with proper numeric types.
 * These transforms bridge the gap cleanly.
 */

import type {
  CloudProviderData,
  CdnData,
  OnPremData,
  WorkforceEmissionsData,
  TravelData,
  CloudPayload,
  CdnPayload,
  OnPremPayload,
  WorkforcePayload,
  TravelPayload,
  EnergyData,
  AdsData,
  MachineryData,
  OilGasData,
  EnergyPayload,
  AdsPayload,
  MachineryPayload,
  OilGasPayload,
} from '@/types/onboarding'

// ----- To API payload -----

export function cloudToPayload(d: CloudProviderData): CloudPayload {
  return {
    provider: d.cloud.toLowerCase(),
    connection_type: d.tabType === 'Upload' ? 'csv_upload' : 'cost_estimate',
    regions: d.region ? [d.region] : [],
    monthly_cost_usd: d.actualCost ? parseFloat(d.actualCost) : null,
    monthly_hours_usage: d.monthlyHoursUsage ? parseFloat(d.monthlyHoursUsage) : null,
  }
}

export function cdnToPayload(d: CdnData): CdnPayload {
  return {
    provider: d.cdnProvider.toLowerCase(),
    monthly_gb_transferred: d.monthlyGBTransferred ? parseFloat(d.monthlyGBTransferred) : null,
    regions: d.regions ? d.regions.split(',').map((r) => r.trim()) : ['WORLD'],
  }
}

export function onpremToPayload(d: OnPremData): OnPremPayload {
  return {
    name: d.name || 'server-1',
    cpu_cores: parseInt(d.cpuCores) || 0,
    ram_gb: parseInt(d.ramGB) || 0,
    storage_tb: parseFloat(d.storageTB) || 0,
    avg_cpu_utilization: parseFloat(d.avgCpuUtilization) || 50,
    hours_per_day: parseFloat(d.hoursPerDay) || 24,
    location_country_code: 'US', // Will be set from UI later
    location_city: '',
    pue: 1.6,
  }
}

export function workforceToPayload(d: WorkforceEmissionsData): WorkforcePayload {
  return {
    workforce_locations: d.workforceLocations.map((loc) => ({
      country: loc.country,
      country_code: loc.country.slice(0, 2).toUpperCase(),
      state: loc.state,
      city: loc.city,
      square_meters: loc.squareMeters,
      workforce_type: loc.workforceType,
      work_arrangement_remote: loc.workArrangementRemote,
      employee_count: parseInt(loc.employeeCount || '0') || 0,
    })),
  }
}

export function travelToPayload(d: TravelData): TravelPayload {
  return {
    travels: d.travels
      .filter((t) => t.travel_type !== '')
      .map((t) => ({
        travel_type: t.travel_type,
        distance_km: parseFloat(String(t.distance_km || 0)),
        passenger_count: parseInt(String(t.passenger_count || 1)),
        ...(t.travel_type === 'flight'
          ? {
              flight_class: t.flight_class || 'economy',
              is_domestic: t.is_domestic === 'true' || t.is_domestic === true,
            }
          : {}),
      })),
  }
}

export function energyToPayload(d: EnergyData): EnergyPayload {
  return {
    energy_sources: d.energy_sources
      .filter((e) => e.source_type !== '')
      .map((e) => ({
        source_type: e.source_type,
        monthly_kwh: e.monthly_kwh ? parseFloat(e.monthly_kwh) : null,
        monthly_liters: e.monthly_liters ? parseFloat(e.monthly_liters) : null,
        country_code: e.country_code,
      })),
  }
}

export function adsToPayload(d: AdsData): AdsPayload {
  return {
    ad_campaigns: d.ad_campaigns
      .filter((a) => a.platform !== '')
      .map((a) => ({
        platform: a.platform,
        ad_format: a.ad_format,
        monthly_impressions: a.monthly_impressions ? parseFloat(a.monthly_impressions) : 0,
      })),
  }
}

export function machineryToPayload(d: MachineryData): MachineryPayload {
  return {
    machines: d.machines
      .filter((m) => m.machine_type !== '')
      .map((m) => ({
        machine_type: m.machine_type,
        fuel_type: m.fuel_type,
        monthly_hours: m.monthly_hours ? parseFloat(m.monthly_hours) : null,
        fuel_consumption_rate_l_per_hour: m.fuel_consumption_rate_l_per_hour ? parseFloat(m.fuel_consumption_rate_l_per_hour) : null,
        monthly_kwh: m.monthly_kwh ? parseFloat(m.monthly_kwh) : null,
      })),
  }
}

export function oilGasToPayload(d: OilGasData): OilGasPayload {
  return {
    consumptions: d.consumptions
      .filter((c) => c.product_type !== '')
      .map((c) => ({
        product_type: c.product_type,
        monthly_liters: c.monthly_liters ? parseFloat(c.monthly_liters) : 0,
      })),
  }
}

// ----- From API data back to FE state (for restoring saved progress) -----

export function cloudFromApi(apiData: any[]): Partial<CloudProviderData> {
  if (!apiData?.length) return {}
  const first = apiData[0]
  return {
    cloud: first.provider?.toUpperCase() || '',
    region: first.regions?.[0] || '',
    actualCost: first.monthly_cost_usd?.toString() || '',
    tabType: first.connection_type === 'csv_upload' ? 'Upload' : 'Manual',
  }
}

export function cdnFromApi(apiData: any[]): Partial<CdnData> {
  if (!apiData?.length) return {}
  const first = apiData[0]
  return {
    cdnProvider: first.provider || '',
    monthlyGBTransferred: first.monthly_gb_transferred?.toString() || '',
    regions: first.regions?.join(', ') || '',
  }
}

export function onpremFromApi(apiData: any[]): Partial<OnPremData> {
  if (!apiData?.length) return {}
  // On-prem data has nested server_count; individual specs come from config endpoint
  return {}
}

export function workforceFromApi(apiData: any): Partial<WorkforceEmissionsData> {
  if (!apiData) return {}
  return {}
}

export function travelFromApi(apiData: any[]): Partial<TravelData> {
  if (!apiData?.length) return {}
  return {
    travels: apiData.map((t) => ({
      travel_type: t.travel_type || '',
      distance_km: t.distance_km?.toString() || '',
      passenger_count: t.passenger_count?.toString() || '',
      isOpen: false,
    })),
  }
}