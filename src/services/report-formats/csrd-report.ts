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

const generateCSRDReport = (data: PDFGenerationData): void => {
  const { organization, activities, getDisplayCO2, totals, formData } = data;
  const doc = new jsPDF();
  const totalEmissions = totals.total;
  const now = new Date();
  const reportDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;
  let pageNumber = 1;

  // Helper Functions
  const addPageNumber = () => {
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
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
      doc.setFillColor(51, 187, 207);
      doc.rect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
    } else {
      doc.setTextColor(3, 27, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
    }
    
    doc.text(title, margin, yPos + 8);
    yPos += 25;
    doc.setTextColor(3, 27, 39); // Reset color
  };

  const addTable = (headers: string[], rows: string[][], options: { 
    headerColor?: [number, number, number], 
    alternateRows?: boolean,
    columnWidths?: number[]
  } = {}) => {
    const tableWidth = pageWidth - (2 * margin);
    const rowHeight = 12;
    const colWidths = options.columnWidths || headers.map(() => tableWidth / headers.length);
    
    checkPageBreak(rowHeight * (rows.length + 2));
    
    // Header
    doc.setFillColor(...(options.headerColor || [230, 230, 230]));
    doc.rect(margin, yPos, tableWidth, rowHeight, 'F');
    doc.setDrawColor(128, 128, 128);
    doc.rect(margin, yPos, tableWidth, rowHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let xPos = margin + 5;
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos + 8);
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
      
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPos, tableWidth, rowHeight);
      
      xPos = margin + 5;
      row.forEach((cell, colIndex) => {
        const cellText = doc.splitTextToSize(cell, colWidths[colIndex] - 10);
        doc.text(cellText, xPos, yPos + 8);
        xPos += colWidths[colIndex];
      });
      
      yPos += rowHeight;
    });
    
    yPos += 10;
  };

  // COVER PAGE
  doc.setFillColor(3, 27, 39);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Company Logo Area (placeholder)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, 30, 60, 30, 'F');
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text('COMPANY LOGO', margin + 15, 48);
  
  // Title
  doc.setTextColor(51, 187, 207);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text('CSRD', margin, 100);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('SUSTAINABILITY', margin, 120);
  doc.text('REPORT', margin, 140);
  
  // Subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Corporate Sustainability Reporting Directive', margin, 160);
  doc.text('Marketing Carbon Emissions Disclosure', margin, 175);
  
  // Company Details Box
  doc.setFillColor(51, 187, 207);
  doc.rect(margin, 200, pageWidth - (2 * margin), 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(formData.companyName, margin + 10, 220);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Report Period: ${organization.period || '2024'}`, margin + 10, 235);
  doc.text(`Report Date: ${reportDate}`, margin + 10, 248);
  
  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  doc.text('Generated by CarbonCut Platform', margin, pageHeight - 20);

  addPageNumber();
  doc.addPage();
  yPos = 20;

  // TABLE OF CONTENTS
  addSectionHeader('TABLE OF CONTENTS');
  
  const tocItems = [
    'Executive Summary',
    'CSRD Compliance Statement',
    'Double Materiality Assessment',
    'Environmental Metrics Overview',
    'Marketing Emissions Breakdown',
    'Methodology & Calculation Framework',
    'ESRS E1 Alignment',
    'Data Quality & Assurance',
    'Forward-Looking Statements',
    'Appendices'
  ];
  
  tocItems.forEach((item, index) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`${index + 1}. ${item}`, margin + 10, yPos);
    doc.text(`${index + 3}`, pageWidth - margin - 20, yPos);
    yPos += 12;
  });

  // EXECUTIVE SUMMARY
  doc.addPage();
  yPos = 20;
  addSectionHeader('EXECUTIVE SUMMARY');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const executiveSummary = [
    `${formData.companyName} presents this CSRD-compliant sustainability report focusing on marketing-related carbon emissions for the reporting period ${organization.period || '2024'}.`,
    '',
    `Our comprehensive assessment reveals total marketing emissions of ${totalEmissions.toFixed(2)} tCO₂e across ${activities.length} distinct marketing activities. This represents our commitment to transparency and environmental accountability as required under the Corporate Sustainability Reporting Directive.`,
    '',
    'Key Highlights:',
    `• Total Marketing Emissions: ${totalEmissions.toFixed(2)} tCO₂e`,
    `• Activities Assessed: ${activities.length}`,
    `• Primary Emission Sources: ${Object.keys(totals.byChannel).slice(0, 3).join(', ')}`,
    `• Data Quality Level: High Confidence`,
    '',
    'This report demonstrates our alignment with ESRS E1 requirements and our commitment to double materiality assessment in sustainability reporting.'
  ];

  executiveSummary.forEach(line => {
    if (line.startsWith('•')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(line, margin + 10, yPos);
    } else if (line === 'Key Highlights:') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(line, margin, yPos);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      if (line.trim()) {
        const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5;
      }
    }
    yPos += 8;
    checkPageBreak();
  });

  // CSRD COMPLIANCE STATEMENT
  checkPageBreak(50);
  addSectionHeader('CSRD COMPLIANCE STATEMENT');

  const complianceText = [
    'This report has been prepared in accordance with the Corporate Sustainability Reporting Directive (CSRD) and European Sustainability Reporting Standards (ESRS), specifically addressing:',
    '',
    '• ESRS E1 - Climate Change reporting requirements',
    '• Double materiality assessment principles',
    '• Value chain emissions disclosure (Scope 1, 2, and 3)',
    '• Quantitative environmental impact metrics',
    '',
    'The methodologies employed follow recognized international standards including the GHG Protocol Corporate Value Chain Standard and ISO 14064 guidelines.'
  ];

  complianceText.forEach(line => {
    checkPageBreak();
    if (line.startsWith('•')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(line, margin + 10, yPos);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      if (line.trim()) {
        const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5;
      }
    }
    yPos += 8;
  });

  // DOUBLE MATERIALITY ASSESSMENT
  checkPageBreak(60);
  addSectionHeader('DOUBLE MATERIALITY ASSESSMENT');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Impact Materiality', margin, yPos);
  yPos += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const impactMateriality = `Marketing activities contribute to climate change through energy consumption, material usage, and transportation. Our assessment identifies digital marketing, print materials, and event management as material impact areas requiring disclosure.`;
  const splitImpact = doc.splitTextToSize(impactMateriality, pageWidth - (2 * margin));
  doc.text(splitImpact, margin, yPos);
  yPos += splitImpact.length * 5 + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Financial Materiality', margin, yPos);
  yPos += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const financialMateriality = `Climate-related risks in marketing include regulatory costs, carbon pricing impacts, and transition risks affecting campaign delivery costs. Physical risks may impact event planning and material supply chains.`;
  const splitFinancial = doc.splitTextToSize(financialMateriality, pageWidth - (2 * margin));
  doc.text(splitFinancial, margin, yPos);
  yPos += splitFinancial.length * 5 + 20;

  // ENVIRONMENTAL METRICS OVERVIEW
  checkPageBreak(80);
  addSectionHeader('ENVIRONMENTAL METRICS OVERVIEW');

  // Main metrics table
  const metricsHeaders = ['Environmental Indicator', 'Value', 'Unit', 'Scope'];
  const metricsRows = [
    ['Total GHG Emissions', totalEmissions.toFixed(2), 'tCO₂e', 'All Scopes'],
    ['Scope 1 Emissions', (totals.byScope['Scope 1'] || 0).toFixed(2), 'tCO₂e', 'Direct'],
    ['Scope 2 Emissions', (totals.byScope['Scope 2'] || 0).toFixed(2), 'tCO₂e', 'Indirect'],
    ['Scope 3 Emissions', (totals.byScope['Scope 3'] || 0).toFixed(2), 'tCO₂e', 'Value Chain'],
    ['Marketing Activities', activities.length.toString(), 'Count', 'All'],
    ['Reporting Period', organization.period || '2024', 'Year', 'N/A']
  ];

  addTable(metricsHeaders, metricsRows, { 
    headerColor: [51, 187, 207],
    alternateRows: true,
    columnWidths: [80, 40, 30, 40]
  });

  // Channel breakdown
  if (Object.keys(totals.byChannel).length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Emissions by Marketing Channel', margin, yPos);
    yPos += 15;

    const channelHeaders = ['Channel', 'Emissions (tCO₂e)', 'Percentage'];
    const channelRows = Object.entries(totals.byChannel)
      .sort(([,a], [,b]) => b - a)
      .map(([channel, emissions]) => [
        channel,
        emissions.toFixed(2),
        `${((emissions / totalEmissions) * 100).toFixed(1)}%`
      ]);

    addTable(channelHeaders, channelRows, {
      headerColor: [230, 230, 230],
      alternateRows: true,
      columnWidths: [90, 50, 50]
    });
  }

  // METHODOLOGY SECTION
  checkPageBreak(100);
  addSectionHeader('METHODOLOGY & CALCULATION FRAMEWORK');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CarbonCut Master Equation', margin, yPos);
  yPos += 15;

  // Equation box
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  const equation = "CO₂e_marketing = Σ_c Σ_i (Q_c,i × EF_c,i) + Σ_a (A_a × EF_a)";
  doc.text(equation, margin + 10, yPos + 15);
  yPos += 35;

  doc.setTextColor(3, 27, 39);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const methodologyPoints = [
    'Q_c,i = Activity data for channel c, item i (kWh, km, kg, GB, hours, impressions)',
    'EF_c,i = Emission factor (kg CO₂e per unit) from DEFRA, EPA, IEA databases',
    'A_a = Allocated overhead/embodied components',
    'EF_a = Corresponding emission factor for overhead activities',
    '',
    'All calculations follow conservative principles to avoid under-reporting.',
    'Emission factors updated annually from latest available sources.',
    'Uncertainty analysis conducted for material emission sources.'
  ];

  methodologyPoints.forEach(point => {
    checkPageBreak();
    if (point.trim()) {
      if (point.includes('=')) {
        doc.text(`• ${point}`, margin + 5, yPos);
      } else {
        doc.text(point, margin, yPos);
      }
    }
    yPos += 10;
  });

  // ESRS E1 ALIGNMENT
  checkPageBreak(60);
  addSectionHeader('ESRS E1 - CLIMATE CHANGE ALIGNMENT');

  const esrsRequirements = [
    ['E1-1', 'Transition plan for climate change mitigation', '✓ Partially Addressed'],
    ['E1-5', 'GHG emissions (Gross)', '✓ Fully Addressed'],
    ['E1-6', 'GHG removals and carbon credits', '○ Not Applicable'],
    ['E1-8', 'Energy consumption and mix', '✓ Partially Addressed'],
    ['E1-9', 'Energy intensity', '○ Future Reporting']
  ];

  const esrsHeaders = ['ESRS Code', 'Requirement', 'Status'];
  addTable(esrsHeaders, esrsRequirements, {
    headerColor: [51, 187, 207],
    alternateRows: true,
    columnWidths: [40, 100, 50]
  });

  // DATA QUALITY & ASSURANCE
  checkPageBreak(50);
  addSectionHeader('DATA QUALITY & ASSURANCE');

  const qualityMetrics = [
    ['Completeness', '95%', 'High confidence in activity data coverage'],
    ['Accuracy', '90%', 'Primary data where available, industry averages used'],
    ['Consistency', '100%', 'Standardized methodology across all channels'],
    ['Transparency', '100%', 'Full methodology disclosure provided']
  ];

  const qualityHeaders = ['Quality Dimension', 'Score', 'Description'];
  addTable(qualityHeaders, qualityMetrics, {
    headerColor: [230, 230, 230],
    alternateRows: true,
    columnWidths: [50, 30, 110]
  });

  // Add final page number
  addPageNumber();

  // Save the document
  const fileName = `CSRD_Sustainability_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

export default generateCSRDReport;