// Onboarding form data types

export interface CloudProviderData {
  cloud?: string;
  tabType: "Manual" | "Upload";
  actualCost: string;
  monthlyHoursUsage: string;
  region: string;
  uploadedFile: File | null;
  isManualOpen?:boolean;
  isUploadOpen?:boolean;
  
}

export interface CdnData {
  cdnProvider: string;
  monthlyGBTransferred: string;
  regions: string;
}

export interface WorkforceItem {
  workforceType?: string;
  workArrangementRemote?: string;
  country?: string;
  squareMeters?: string;
  isOpen?: boolean;
}

export interface WorkforceEmissionsData {
  workforceLocations: WorkforceItem[];
  workforceType: string;
  workArrangementRemote: string;
  country: string;
  state: string;
  city: string;
  squareMeters: string;
}

export interface OnPremData {
  name: string;
  cpuCores: string;
  ramGB: string;
  storageTB: string;
  avgCpuUtilization: string;
  hoursPerDay: string;
}

export interface TravelItem {
  travel_type: string;
  distance_km?: string;
  flight_class?: string;
  is_domestic?: string;
  passenger_count?: string;
  travel_date?: string;
  isOpen: boolean;
}

export interface TravelData {
  travels: TravelItem[];
}

// Combined onboarding data type
export interface OnboardingData {
  cloudProvider: CloudProviderData;
  cdn: CdnData;
  workforceEmissions: WorkforceEmissionsData;
  onPrem: OnPremData;
  travel: TravelData;
}
