// import { jsPDF } from "jspdf";
// import { ActivityData, OrganizationData } from "@/types/types";

// export interface PDFFormData {
//   name: string;
//   email: string;
//   companyName: string;
//   phoneNumber: string;
//   disclosureFormat: 'SECR' | 'CSRD' | 'SEC';
// }

// export interface PDFGenerationData {
//   organization: OrganizationData;
//   activities: ActivityData[];
//   getDisplayCO2: (activity: ActivityData) => number;
//   totals: {
//     total: number;
//     byChannel: Record<string, number>;
//     byMarket: Record<string, number>;
//     byScope: Record<string, number>;
//   };
//   formData: PDFFormData;
// }

// // Base PDF generation function
// const generateBasePDF = (data: PDFGenerationData): jsPDF => {
//   const doc = new jsPDF();
//   const { organization, activities, getDisplayCO2, totals, formData } = data;
//   const totalEmissions = totals.total;
//   const now = new Date();
//   const reportDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

//   // Color scheme
//   const primaryColor: [number, number, number] = [31, 73, 96]; // #1F4960
//   const textColor: [number, number, number] = [3, 27, 39]; // #031B27
//   const accentColor: [number, number, number] = [51, 187, 207]; // #33BBCF

//   const margin = 20;
//   const pageWidth = doc.internal.pageSize.width;

//   return doc;
// };

// // SECR Format Generator
// const generateSECRReport = (data: PDFGenerationData): void => {
//   const { organization, activities, getDisplayCO2, totals, formData } = data;
//   const doc = new jsPDF();
//   const totalEmissions = totals.total;
//   const now = new Date();
//   const reportDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

//   const margin = 20;
//   const pageWidth = doc.internal.pageSize.width;

//   // SECR Header
//   doc.setFillColor(31, 73, 96);
//   doc.rect(0, 0, pageWidth, 45, 'F');

//   doc.setTextColor(255, 255, 255);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(26);
//   doc.text('SECR COMPLIANCE REPORT', margin, 25);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(12);
//   doc.text('Streamlined Energy & Carbon Reporting', margin, 35);
//   doc.text(reportDate, pageWidth - margin - 50, 35);

//   let yPos = 65;

//   // SECR Required Information
//   doc.setTextColor(3, 27, 39);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(16);
//   doc.text('SECR Mandatory Disclosure', margin, yPos);

//   yPos += 20;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(11);

//   // Organization Details
//   doc.setFont('helvetica', 'bold');
//   doc.text('Reporting Organisation:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(formData.companyName, margin + 60, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'bold');
//   doc.text('Report Prepared By:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(formData.name, margin + 55, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'bold');
//   doc.text('Contact Email:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(formData.email, margin + 40, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'bold');
//   doc.text('Reporting Period:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(organization.period || '2024', margin + 50, yPos);

//   // SECR Emissions Summary
//   yPos += 25;
//   doc.setFillColor(245, 245, 245);
//   doc.roundedRect(margin, yPos - 5, pageWidth - (2 * margin), 40, 3, 3, 'F');

//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   doc.text('SECR Emissions Summary (Scope 1, 2 & 3)', margin + 10, yPos + 10);

//   doc.setFontSize(24);
//   doc.text(`${totalEmissions.toFixed(2)} tCO₂e`, margin + 10, yPos + 25);

//   doc.setFontSize(10);
//   doc.text('Total Marketing Activities Emissions', margin + 10, yPos + 32);

//   // SECR Breakdown by Scope
//   yPos += 60;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   doc.text('SECR Scope Breakdown', margin, yPos);

//   yPos += 15;
//   Object.entries(totals.byScope).forEach(([scope, emissions]) => {
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(11);
//     doc.text(`Scope ${scope} Emissions:`, margin + 5, yPos);
//     doc.text(`${emissions.toFixed(2)} tCO₂e`, margin + 80, yPos);
//     yPos += 8;
//   });

//   // SECR Methodology Note
//   yPos += 20;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(12);
//   doc.text('SECR Methodology', margin, yPos);

//   yPos += 10;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   const methodology = `This report follows SECR requirements for carbon emissions reporting. Marketing activities have been categorized according to GHG Protocol scopes. Emission factors applied are consistent with UK Government guidance and international standards.`;
//   const splitText = doc.splitTextToSize(methodology, pageWidth - (2 * margin));
//   doc.text(splitText, margin, yPos);

//   // Activities Table
//   yPos += 30;
//   if (yPos > 250) {
//     doc.addPage();
//     yPos = 30;
//   }

//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   doc.text('Detailed Activity Log', margin, yPos);

//   yPos += 15;

//   // Table headers
//   doc.setFillColor(31, 73, 96);
//   doc.rect(margin, yPos - 3, pageWidth - (2 * margin), 12, 'F');

//   doc.setTextColor(255, 255, 255);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(9);
//   doc.text('Date', margin + 2, yPos + 5);
//   doc.text('Activity', margin + 25, yPos + 5);
//   doc.text('Scope', margin + 70, yPos + 5);
//   doc.text('Quantity', margin + 90, yPos + 5);
//   doc.text('tCO₂e', margin + 130, yPos + 5);

//   yPos += 15;

//   // Activity rows
//   doc.setTextColor(3, 27, 39);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(8);

//   activities.forEach((activity, index) => {
//     if (yPos > 270) {
//       doc.addPage();
//       yPos = 30;
//     }

//     if (index % 2 === 0) {
//       doc.setFillColor(250, 250, 250);
//       doc.rect(margin, yPos - 3, pageWidth - (2 * margin), 10, 'F');
//     }

//     doc.text(activity.date, margin + 2, yPos + 3);
//     doc.text(activity.activityLabel.substring(0, 15), margin + 25, yPos + 3);
//     doc.text(`Scope ${activity.scope}`, margin + 70, yPos + 3);
//     doc.text(activity.qty.toString(), margin + 90, yPos + 3);
//     doc.text((getDisplayCO2(activity) / 1000).toFixed(3), margin + 130, yPos + 3);

//     yPos += 10;
//   });

//   const fileName = `SECR_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
//   doc.save(fileName);
// };

// // CSRD Format Generator
// const generateCSRDReport = (data: PDFGenerationData): void => {
//   const { organization, activities, getDisplayCO2, totals, formData } = data;
//   const doc = new jsPDF();
//   const totalEmissions = totals.total;
//   const now = new Date();
//   const reportDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

//   const margin = 20;
//   const pageWidth = doc.internal.pageSize.width;

//   // CSRD Header
//   doc.setFillColor(51, 187, 207);
//   doc.rect(0, 0, pageWidth, 45, 'F');

//   doc.setTextColor(255, 255, 255);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(26);
//   doc.text('CSRD SUSTAINABILITY REPORT', margin, 25);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(12);
//   doc.text('Corporate Sustainability Reporting Directive', margin, 35);
//   doc.text(reportDate, pageWidth - margin - 50, 35);

//   let yPos = 65;

//   // CSRD Disclosure Requirements
//   doc.setTextColor(3, 27, 39);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(16);
//   doc.text('CSRD Environmental Disclosure', margin, yPos);

//   yPos += 20;

//   // Double Materiality Assessment
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(12);
//   doc.text('Double Materiality Assessment', margin, yPos);

//   yPos += 10;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   const materiality = `This report addresses climate-related impacts and dependencies of ${formData.companyName}'s marketing activities, fulfilling CSRD requirements for environmental sustainability disclosure.`;
//   const splitMateriality = doc.splitTextToSize(materiality, pageWidth - (2 * margin));
//   doc.text(splitMateriality, margin, yPos);

//   yPos += 25;

//   // CSRD Metrics Table
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   doc.text('CSRD Environmental Metrics', margin, yPos);

//   yPos += 15;

//   // Create metrics table
//   doc.setFillColor(245, 245, 245);
//   doc.rect(margin, yPos, pageWidth - (2 * margin), 60, 'F');
//   doc.setDrawColor(200, 200, 200);
//   doc.rect(margin, yPos, pageWidth - (2 * margin), 60);

//   // Table content
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(11);
//   doc.text('Environmental Indicator', margin + 5, yPos + 10);
//   doc.text('Value', pageWidth - margin - 40, yPos + 10);

//   yPos += 20;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(10);

//   doc.text('Total GHG Emissions (Scope 1+2+3)', margin + 5, yPos);
//   doc.text(`${totalEmissions.toFixed(2)} tCO₂e`, pageWidth - margin - 40, yPos);

//   yPos += 10;
//   doc.text('Marketing Activities Count', margin + 5, yPos);
//   doc.text(`${activities.length}`, pageWidth - margin - 40, yPos);

//   yPos += 10;
//   doc.text('Reporting Period', margin + 5, yPos);
//   doc.text(organization.period || '2024', pageWidth - margin - 40, yPos);

//   yPos += 10;
//   doc.text('Data Quality Assessment', margin + 5, yPos);
//   doc.text('High Confidence', pageWidth - margin - 40, yPos);

//   // ESRS Alignment
//   yPos += 30;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(12);
//   doc.text('ESRS E1 - Climate Change Alignment', margin, yPos);

//   yPos += 10;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   const esrs = `This disclosure aligns with ESRS E1 requirements for climate change reporting, providing quantitative information on GHG emissions from marketing activities as part of the organization's value chain assessment.`;
//   const splitESRS = doc.splitTextToSize(esrs, pageWidth - (2 * margin));
//   doc.text(splitESRS, margin, yPos);

//   const fileName = `CSRD_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
//   doc.save(fileName);
// };

// // SEC Format Generator
// const generateSECReport = (data: PDFGenerationData): void => {
//   const { organization, activities, getDisplayCO2, totals, formData } = data;
//   const doc = new jsPDF();
//   const totalEmissions = totals.total;
//   const now = new Date();
//   const reportDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

//   const margin = 20;
//   const pageWidth = doc.internal.pageSize.width;

//   // SEC Header
//   doc.setFillColor(0, 0, 0);
//   doc.rect(0, 0, pageWidth, 45, 'F');

//   doc.setTextColor(255, 255, 255);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(24);
//   doc.text('SEC CLIMATE DISCLOSURE', margin, 25);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(12);
//   doc.text('Securities and Exchange Commission - Climate Rule', margin, 35);
//   doc.text(reportDate, pageWidth - margin - 80, 35);

//   let yPos = 65;

//   // SEC Filing Information
//   doc.setTextColor(0, 0, 0);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(16);
//   doc.text('SEC Climate-Related Disclosure', margin, yPos);

//   yPos += 20;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(11);

//   // Filing Entity
//   doc.setFont('helvetica', 'bold');
//   doc.text('Filing Entity:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(formData.companyName, margin + 40, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'bold');
//   doc.text('Prepared By:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(`${formData.name} (${formData.email})`, margin + 35, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'bold');
//   doc.text('Fiscal Year:', margin, yPos);
//   doc.setFont('helvetica', 'normal');
//   doc.text(organization.period || '2024', margin + 35, yPos);

//   // SEC Scope 3 Disclosure
//   yPos += 25;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   doc.text('Scope 3 GHG Emissions Disclosure', margin, yPos);

//   yPos += 15;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(10);
//   const scope3Intro = `The following table presents Scope 3 greenhouse gas emissions from marketing activities as required under SEC climate disclosure rules:`;
//   const splitIntro = doc.splitTextToSize(scope3Intro, pageWidth - (2 * margin));
//   doc.text(splitIntro, margin, yPos);

//   yPos += 20;

//   // SEC Emissions Table
//   doc.setFillColor(240, 240, 240);
//   doc.rect(margin, yPos, pageWidth - (2 * margin), 50, 'F');
//   doc.setDrawColor(0, 0, 0);
//   doc.rect(margin, yPos, pageWidth - (2 * margin), 50);

//   // Table headers
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(11);
//   doc.text('Scope', margin + 5, yPos + 12);
//   doc.text('Category', margin + 30, yPos + 12);
//   doc.text('Metric Tons CO₂e', margin + 100, yPos + 12);
//   doc.text('% of Total', margin + 150, yPos + 12);

//   // Draw line under headers
//   doc.line(margin, yPos + 15, pageWidth - margin, yPos + 15);

//   yPos += 25;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(10);

//   Object.entries(totals.byScope).forEach(([scope, emissions]) => {
//     const percentage = ((emissions / totalEmissions) * 100).toFixed(1);
//     doc.text(`Scope ${scope}`, margin + 5, yPos);
//     doc.text('Marketing Activities', margin + 30, yPos);
//     doc.text(`${(emissions / 1000).toFixed(2)}`, margin + 100, yPos);
//     doc.text(`${percentage}%`, margin + 150, yPos);
//     yPos += 10;
//   });

//   // SEC Assurance Statement
//   yPos += 20;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(12);
//   doc.text('Assurance and Verification', margin, yPos);

//   yPos += 10;
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   const assurance = `These emissions calculations are based on recognized methodologies and emission factors. The data presented has been prepared in accordance with GHG Protocol standards and SEC climate disclosure requirements.`;
//   const splitAssurance = doc.splitTextToSize(assurance, pageWidth - (2 * margin));
//   doc.text(splitAssurance, margin, yPos);

//   // SEC Safe Harbor Statement
//   yPos += 25;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(10);
//   doc.text('Safe Harbor Statement', margin, yPos);

//   yPos += 8;
//   doc.setFont('helvetica', 'italic');
//   doc.setFontSize(8);
//   const safeHarbor = `This document contains forward-looking statements regarding climate-related metrics. Actual results may differ materially from those projected due to various factors including changes in methodology, data availability, and regulatory requirements.`;
//   const splitSafeHarbor = doc.splitTextToSize(safeHarbor, pageWidth - (2 * margin));
//   doc.text(splitSafeHarbor, margin, yPos);

//   const fileName = `SEC_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
//   doc.save(fileName);
// };

// export const generateCarbonEmissionsReport = async (data: PDFGenerationData): Promise<void> => {
//   const { formData } = data;

//   try {
//     switch (formData.disclosureFormat) {
//       case 'SECR':
//         generateSECRReport(data);
//         break;
//       case 'CSRD':
//         generateCSRDReport(data);
//         break;
//       case 'SEC':
//         generateSECReport(data);
//         break;
//       default:
//         generateSECRReport(data);
//     }
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw new Error('Error generating PDF report. Please try again.');
//   }
// };
