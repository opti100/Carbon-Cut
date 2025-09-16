import generateSECRReport, { PDFGenerationData } from './secr-report';
import generateCSRDReport from './csrd-report';
import generateSECReport from './sec-report';


export const generateCarbonEmissionsReport = async (data: PDFGenerationData): Promise<void> => {
  const { formData } = data;

  try {
    switch (formData.disclosureFormat) {
      case 'SECR':
        generateSECRReport(data);
        break;
      case 'CSRD':
        generateCSRDReport(data);
        break;
      case 'SEC':
        generateSECReport(data);
        break;
      default:
        generateSECRReport(data); 
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error generating PDF report. Please try again.');
  }
};

export { generateSECRReport, generateCSRDReport, generateSECReport };