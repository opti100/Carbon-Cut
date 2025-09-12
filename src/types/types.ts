export interface ActivityData {
  id: number;
  date: string;
  market: string;
  channel: string;
  unit: string;
  activityLabel: string;
  qty: number;
  scope: number;
  campaign?: string;
  notes?: string;
}

export interface OrganizationData {
  name: string;
  period: string;
  offsets: string;
}

export interface ChannelUnits {
  [key: string]: Array<[string, string]>;
}

export interface CountryData {
  code: string;
  name: string;
  gridIntensity?: number;
}