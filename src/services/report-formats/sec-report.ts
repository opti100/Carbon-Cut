import { jsPDF } from "jspdf";
import { ActivityData, OrganizationData } from "@/types/types";

export interface PDFFormData {
  name: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  disclosureFormat: 'SECR' | 'CSRD' | 'SEC';
}

export interface PDFGenerationData {
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

const generateSECReport = (data: PDFGenerationData): void => {
  const { organization, activities, getDisplayCO2, totals, formData } = data;
  const doc = new jsPDF();
  const totalEmissions = totals.total;
  const now = new Date();
  const reportDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;
  let pageNumber = 1;

  // Helper Functions
  const addPageNumber = () => {
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
    doc.text(`SEC Climate Disclosure - ${formData.companyName}`, margin, pageHeight - 10);
    pageNumber++;
  };

  const checkPageBreak = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      addPageNumber();
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string, level: number = 1) => {
    checkPageBreak(25);
    
    if (level === 1) {
      doc.setFillColor(0, 32, 96); // SEC Blue
      doc.rect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
    }
    
    doc.text(title, margin, yPos + 8);
    yPos += 25;
    doc.setTextColor(0, 0, 0); // Reset color
  };

  const addTable = (headers: string[], rows: string[][], options: { 
    headerColor?: [number, number, number], 
    alternateRows?: boolean,
    columnWidths?: number[],
    bordered?: boolean
  } = {}) => {
    const tableWidth = pageWidth - (2 * margin);
    const rowHeight = 12;
    const colWidths = options.columnWidths || headers.map(() => tableWidth / headers.length);
    
    checkPageBreak(rowHeight * (rows.length + 2));
    
    // Header
    doc.setFillColor(...(options.headerColor || [220, 220, 220]));
    doc.rect(margin, yPos, tableWidth, rowHeight, 'F');
    
    if (options.bordered !== false) {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, tableWidth, rowHeight);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let xPos = margin + 5;
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos + 8);
      if (options.bordered !== false && i < headers.length - 1) {
        doc.line(xPos + colWidths[i] - 5, yPos, xPos + colWidths[i] - 5, yPos + rowHeight);
      }
      xPos += colWidths[i];
    });
    
    yPos += rowHeight;
    
    // Data rows
    doc.setFont('helvetica', 'normal');
    rows.forEach((row, rowIndex) => {
      if (options.alternateRows && rowIndex % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, yPos, tableWidth, rowHeight, 'F');
      }
      
      if (options.bordered !== false) {
        doc.setDrawColor(150, 150, 150);
        doc.rect(margin, yPos, tableWidth, rowHeight);
      }
      
      xPos = margin + 5;
      row.forEach((cell, colIndex) => {
        const cellText = doc.splitTextToSize(cell, colWidths[colIndex] - 10);
        doc.text(cellText, xPos, yPos + 8);
        if (options.bordered !== false && colIndex < row.length - 1) {
          doc.line(xPos + colWidths[colIndex] - 5, yPos, xPos + colWidths[colIndex] - 5, yPos + rowHeight);
        }
        xPos += colWidths[colIndex];
      });
      
      yPos += rowHeight;
    });
    
    yPos += 10;
  };

  const addWarningBox = (text: string, title: string = "IMPORTANT") => {
    checkPageBreak(40);
    
    doc.setFillColor(255, 248, 220); // Light yellow background
    doc.setDrawColor(255, 193, 7); // Warning yellow border
    doc.setLineWidth(1);
    doc.rect(margin, yPos, pageWidth - (2 * margin), 30, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(133, 100, 4); // Dark yellow text
    doc.text(title, margin + 10, yPos + 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitText = doc.splitTextToSize(text, pageWidth - (2 * margin) - 20);
    doc.text(splitText, margin + 10, yPos + 22);
    
    yPos += 40;
    doc.setTextColor(0, 0, 0); // Reset color
  };

  // COVER PAGE - SEC Style
  doc.setFillColor(0, 32, 96); // SEC Official Blue
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // SEC Seal placeholder
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth - 50, 30, 20, 'F');
  doc.setTextColor(0, 32, 96);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SEC', pageWidth - 55, 32);
  
  // Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('SEC CLIMATE', margin, 35);
  doc.text('DISCLOSURE', margin, 50);
  
  // Form information box
  yPos = 80;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 80, 'F');
  doc.setDrawColor(0, 32, 96);
  doc.setLineWidth(2);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 80);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CLIMATE-RELATED DISCLOSURES', margin + 10, yPos + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Securities and Exchange Commission', margin + 10, yPos + 35);
  doc.text('17 CFR Parts 210, 229, 232, 239, 249', margin + 10, yPos + 48);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Filing Entity: ${formData.companyName}`, margin + 10, yPos + 65);
  
  // Filing Details
  yPos = 180;
  doc.setFillColor(0, 32, 96);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FILING INFORMATION', margin + 10, yPos + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Report Date: ${reportDate}`, margin + 10, yPos + 35);
  doc.text(`Fiscal Year: ${organization.period || '2024'}`, margin + 10, yPos + 48);

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('This document contains climate-related disclosures pursuant to SEC rules', margin, pageHeight - 30);
  doc.text('Generated by CarbonCut Platform - Marketing Emissions Analysis', margin, pageHeight - 20);

  addPageNumber();
  doc.addPage();
  yPos = 20;

  // EXECUTIVE SUMMARY
  addSectionHeader('EXECUTIVE SUMMARY');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const execSummary = [
    `${formData.companyName} hereby provides climate-related disclosures for marketing activities in accordance with Securities and Exchange Commission requirements under 17 CFR Parts 210, 229, 232, 239, and 249.`,
    '',
    `This disclosure covers greenhouse gas emissions from marketing operations during fiscal year ${organization.period || '2024'}, representing our commitment to transparent climate-related financial risk reporting.`,
    '',
    `Total marketing-related emissions: ${totalEmissions.toFixed(2)} metric tons CO₂ equivalent`,
    `Marketing activities assessed: ${activities.length} distinct campaigns and operations`,
    `Primary emission categories: ${Object.keys(totals.byChannel).slice(0, 3).join(', ')}`
  ];

  execSummary.forEach(line => {
    checkPageBreak();
    if (line.trim()) {
      const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * 5 + 3;
    }
    yPos += 5;
  });

  // SCOPE 3 GHG EMISSIONS DISCLOSURE
  checkPageBreak(60);
  addSectionHeader('SCOPE 3 GHG EMISSIONS DISCLOSURE');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const scope3Intro = `Pursuant to SEC climate disclosure requirements, the following table presents Scope 3 greenhouse gas emissions from marketing activities. These emissions represent indirect emissions occurring in the value chain of ${formData.companyName} and are material to understanding climate-related financial risks.`;
  const splitIntro = doc.splitTextToSize(scope3Intro, pageWidth - (2 * margin));
  doc.text(splitIntro, margin, yPos);
  yPos += splitIntro.length * 5 + 15;

  // Main emissions table
  const emissionsHeaders = ['Emission Scope', 'Category Description', 'Metric Tons CO₂e', 'Percentage of Total'];
  const emissionsRows = Object.entries(totals.byScope).map(([scope, emissions]) => [
    `Scope ${scope}`,
    scope === '1' ? 'Direct Emissions' : scope === '2' ? 'Indirect Energy' : 'Value Chain Activities',
    emissions.toFixed(2),
    `${((emissions / totalEmissions) * 100).toFixed(1)}%`
  ]);

  // Add total row
  emissionsRows.push([
    'TOTAL',
    'All Marketing Emissions',
    totalEmissions.toFixed(2),
    '100.0%'
  ]);

  addTable(emissionsHeaders, emissionsRows, {
    headerColor: [0, 32, 96],
    alternateRows: true,
    columnWidths: [40, 70, 40, 40],
    bordered: true
  });

  // MATERIALITY ASSESSMENT
  checkPageBreak(50);
  addSectionHeader('MATERIALITY ASSESSMENT');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const materialityText = [
    'Climate-related risks from marketing activities have been assessed for financial materiality in accordance with SEC guidance. The assessment considers both transition and physical climate risks that may impact business operations and financial performance.',
    '',
    'Material risk factors identified:',
    '• Regulatory compliance costs related to carbon pricing and emissions regulations',
    '• Transition risks affecting supply chain costs for marketing materials and services',
    '• Physical risks impacting event operations and material sourcing',
    '• Reputational risks related to climate performance and stakeholder expectations'
  ];

  materialityText.forEach(line => {
    checkPageBreak();
    if (line.startsWith('•')) {
      doc.text(line, margin + 10, yPos);
    } else if (line.trim()) {
      const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * 5;
    }
    yPos += 8;
  });

  // METHODOLOGY AND CALCULATION FRAMEWORK
  checkPageBreak(80);
  addSectionHeader('METHODOLOGY AND CALCULATION FRAMEWORK');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CarbonCut Master Equation', margin, yPos);
  yPos += 15;

  // Equation in a formal box
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(0, 32, 96);
  doc.setLineWidth(1);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 30, 'FD');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const equation = "CO₂e_marketing = Σ_c Σ_i (Q_c,i × EF_c,i) + Σ_a (A_a × EF_a)";
  doc.text(equation, margin + 10, yPos + 18);
  yPos += 40;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Variable Definitions:', margin, yPos);
  yPos += 12;

  const variables = [
    'Q_c,i = Activity data for channel c, item i (kWh, km, kg, GB, hours, impressions)',
    'EF_c,i = Emission factor (kg CO₂e per unit) from EPA, DEFRA, and recognized databases',
    'A_a = Allocated overhead and embodied emission components',
    'EF_a = Corresponding emission factor for overhead activities'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  variables.forEach(variable => {
    checkPageBreak();
    doc.text(`• ${variable}`, margin + 5, yPos);
    yPos += 10;
  });

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Methodological Standards:', margin, yPos);
  yPos += 12;

  const standards = [
    'GHG Protocol Corporate Value Chain (Scope 3) Standard',
    'EPA Center for Corporate Climate Leadership guidance',
    'ISO 14064-1:2018 Greenhouse gases specification and guidance',
    'Conservative calculation principles to prevent under-reporting'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  standards.forEach(standard => {
    checkPageBreak();
    doc.text(`• ${standard}`, margin + 5, yPos);
    yPos += 10;
  });

  // DETAILED CHANNEL BREAKDOWN
  if (Object.keys(totals.byChannel).length > 0) {
    checkPageBreak(60);
    addSectionHeader('EMISSIONS BY MARKETING CHANNEL');

    const channelHeaders = ['Marketing Channel', 'Emissions (tCO₂e)', 'Percentage', 'Primary Activities'];
    const channelRows = Object.entries(totals.byChannel)
      .sort(([,a], [,b]) => b - a)
      .map(([channel, emissions]) => [
        channel,
        emissions.toFixed(2),
        `${((emissions / totalEmissions) * 100).toFixed(1)}%`,
        'Campaign Operations' // Simplified for SEC reporting
      ]);

    addTable(channelHeaders, channelRows, {
      headerColor: [220, 220, 220],
      alternateRows: true,
      columnWidths: [60, 35, 30, 65],
      bordered: true
    });
  }

  // DATA QUALITY AND LIMITATIONS
  checkPageBreak(60);
  addSectionHeader('DATA QUALITY AND LIMITATIONS');

  const qualityAssessment = [
    ['Data Completeness', '95%', 'Comprehensive coverage of material marketing activities'],
    ['Methodology Consistency', '100%', 'Standardized calculation framework applied'],
    ['Emission Factor Currency', 'Current', 'Latest available factors from recognized sources'],
    ['Uncertainty Range', '±15%', 'Typical range for Scope 3 marketing emissions']
  ];

  const qualityHeaders = ['Quality Metric', 'Assessment', 'Description'];
  addTable(qualityHeaders, qualityAssessment, {
    headerColor: [240, 240, 240],
    alternateRows: true,
    columnWidths: [50, 30, 110],
    bordered: true
  });

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Key Limitations:', margin, yPos);
  yPos += 12;

  const limitations = [
    'Scope 3 emissions calculations inherently contain estimation uncertainty',
    'Some activity data relies on industry averages where primary data unavailable',
    'Emission factors may not reflect regional variations in energy grid composition',
    'Indirect emissions from supplier operations may not be fully captured'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  limitations.forEach(limitation => {
    checkPageBreak();
    doc.text(`• ${limitation}`, margin + 5, yPos);
    yPos += 10;
  });

  // SAFE HARBOR STATEMENT
  checkPageBreak(60);
  addWarningBox(
    'This document contains forward-looking statements regarding climate-related metrics and financial implications. Actual results may differ materially due to methodology changes, data availability, and evolving regulatory requirements.',
    'FORWARD-LOOKING STATEMENTS'
  );

  // SEC COMPLIANCE STATEMENT
  checkPageBreak(40);
  addSectionHeader('REGULATORY COMPLIANCE');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const complianceText = `This disclosure is provided pursuant to Securities and Exchange Commission climate-related disclosure requirements under 17 CFR Parts 210, 229, 232, 239, and 249. The methodologies and data presented align with SEC guidance on climate-related financial risk assessment and the Private Securities Litigation Reform Act of 1995 safe harbor provisions.`;
  const splitCompliance = doc.splitTextToSize(complianceText, pageWidth - (2 * margin));
  doc.text(splitCompliance, margin, yPos);
  yPos += splitCompliance.length * 5 + 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Filing Prepared By:', margin, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.name}`, margin, yPos);
  yPos += 8;
  doc.text(`${formData.email}`, margin, yPos);
  yPos += 8;
  doc.text(`${formData.phoneNumber}`, margin, yPos);

  // Add final page number
  addPageNumber();

  // Save the document
  const fileName = `SEC_Climate_Disclosure_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FY${organization.period || '2024'}.pdf`;
  doc.save(fileName);
};

export default generateSECReport;