export interface ActivityData {
  id: number
  date: string
  market: string
  channel: string
  unit: string
  activityLabel: string
  qty: number
  scope: number
  campaign?: string
  notes?: string
  quantities?: Record<string, { label: string; value: number }>
}

export interface OrganizationData {
  name: string
  period: string
  offsets: string
}

export interface ChannelUnits {
  [key: string]: Array<[string, string]>
}

export interface CountryData {
  code: string
  name: string
  gridIntensity?: number
}

export interface ReportData {
  organization: OrganizationData
  activities: ActivityData[]
  totals: {
    total: number
    byChannel: Record<string, number>
    byMarket: Record<string, number>
    byScope: Record<string, number>
  }
  formData: {
    name: string
    email: string
    companyName: string
    phoneNumber: string
    disclosureFormat: 'SECR' | 'CSRD' | 'SEC'
    wantsCertification: boolean
  }
  displayCO2Data: Record<number, number>
}
