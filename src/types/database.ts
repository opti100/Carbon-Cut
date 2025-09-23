export interface PdfReportData {
  id: string;
  userName: string;
  userId:string
  email: string;
  companyName: string;
  phoneNumber: string;
  disclosureFormat: 'SECR' | 'CSRD' | 'SEC';
  isCertified: boolean;
  certificationId?: string;
  certificationDate?: Date;
  pdfUrl?: string;
  cloudinaryPublicId?: string;
  totalEmissions: number;
  activityCount: number;
  reportPeriod?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentAmount?: number;
  paymentDate?: Date;
  stripePaymentId?: string;
  activities?: ReportActivityData[];
}

export interface ReportActivityData {
  id: string;
  pdfReportId: string;
  date: string;
  market: string;
  channel: string;
  activityLabel: string;
  quantity: number;
  co2Emissions: number;
  scope: number;
  campaign?: string;
  notes?: string;
  createdAt: Date;
}

export interface CreatePdfReportInput {
  userName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  disclosureFormat: 'SECR' | 'CSRD' | 'SEC';
  isCertified: boolean;
  totalEmissions: number;
  activityCount: number;
  reportPeriod?: string;
  paymentAmount?: number;
  activities: {
    date: string;
    market: string;
    channel: string;
    activityLabel: string;
    quantity: number;
    co2Emissions: number;
    scope: number;
    campaign?: string;
    notes?: string;
  }[];
}