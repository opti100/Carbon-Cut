import { ActivityData, OrganizationData } from '@/types/types';
import generateSECRReport, { PDFFormData } from './secr-report';
import generateCSRDReport from './csrd-report';
import generateSECReport from './sec-report';

interface GenerateReportOptions {
  organization: OrganizationData;
  activities: ActivityData[];
  getDisplayCO2: (activity: ActivityData) => number;
  totals: {
    total: number;
    byChannel: Record<string, number>;
    byMarket: Record<string, number>;
    byScope: Record<string, number>;
  };
  formData: PDFFormData;
}

// Server-side PDF generation (used in API routes)
export async function generateCarbonEmissionsReportServer(options: GenerateReportOptions): Promise<{
  pdfBytes: Uint8Array;
  fileName: string;
}> {
  const { formData } = options;
  
  let pdfBytes: Uint8Array;
  let fileName: string;

  // Generate PDF based on format
  switch (formData.disclosureFormat) {
    case 'SECR':
      pdfBytes = await generateSECRReport(options);
      fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SECR_Report.pdf`;
      break;
    case 'CSRD':
      pdfBytes = await generateCSRDReport(options);
      fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_CSRD_Report.pdf`;
      break;
    case 'SEC':
      pdfBytes = await generateSECReport(options);
      fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SEC_Report.pdf`;
      break;
    default:
      throw new Error('Unsupported disclosure format');
  }

  return { pdfBytes, fileName };
}

// Client-side PDF generation (for direct download)
export async function generateCarbonEmissionsReportClient(options: GenerateReportOptions): Promise<void> {
  const { pdfBytes, fileName } = await generateCarbonEmissionsReportServer(options);
  
  // Direct download
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}