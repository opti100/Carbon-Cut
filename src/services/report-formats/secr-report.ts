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

const generateSECRReport = (data: PDFGenerationData): void => {
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
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
    doc.text(`SECR Report - ${formData.companyName}`, margin, pageHeight - 10);
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
      doc.setFillColor(31, 73, 96); // SECR Blue
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
    columnWidths?: number[],
    fontSize?: number
  } = {}) => {
    const tableWidth = pageWidth - (2 * margin);
    const rowHeight = 12;
    const colWidths = options.columnWidths || headers.map(() => tableWidth / headers.length);
    
    checkPageBreak(rowHeight * (rows.length + 2));
    
    // Header
    doc.setFillColor(...(options.headerColor || [31, 73, 96]));
    doc.rect(margin, yPos, tableWidth, rowHeight, 'F');
    doc.setDrawColor(100, 100, 100);
    doc.rect(margin, yPos, tableWidth, rowHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(options.fontSize || 10);
    doc.setTextColor(255, 255, 255);
    
    let xPos = margin + 5;
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos + 8);
      xPos += colWidths[i];
    });
    
    yPos += rowHeight;
    
    // Data rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(3, 27, 39);
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

  const addHighlightBox = (title: string, value: string, unit: string, description: string) => {
    checkPageBreak(50);
    
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.setDrawColor(31, 73, 96);
    doc.setLineWidth(2);
    doc.roundedRect(margin, yPos, pageWidth - (2 * margin), 45, 5, 5, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 73, 96);
    doc.text(title, margin + 10, yPos + 15);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(value, margin + 10, yPos + 28);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(unit, margin + 10 + doc.getTextWidth(value) + 5, yPos + 28);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(description, margin + 10, yPos + 38);
    
    yPos += 55;
    doc.setTextColor(3, 27, 39); // Reset color
  };

  // COVER PAGE - UK Government Style
  doc.setFillColor(31, 73, 96); // Government blue
  doc.rect(0, 0, pageWidth, 70, 'F');
  
  // UK Government Crown placeholder
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth - 40, 35, 15, 'F');
  doc.setTextColor(31, 73, 96);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('UK GOV', pageWidth - 50, 37);
  
  // Main title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text('SECR', margin, 35);
  doc.setFontSize(24);
  doc.text('COMPLIANCE REPORT', margin, 55);
  
  // Subtitle section
  yPos = 90;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 60, 'F');
  doc.setDrawColor(31, 73, 96);
  doc.setLineWidth(3);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 60);
  
  doc.setTextColor(31, 73, 96);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('STREAMLINED ENERGY & CARBON REPORTING', margin + 10, yPos + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Companies Act 2006 (Strategic Report and Directors\' Report)', margin + 10, yPos + 35);
  doc.text('Regulations 2013 - Marketing Emissions Disclosure', margin + 10, yPos + 48);
  
  // Company information box
  yPos = 170;
  doc.setFillColor(31, 73, 96);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 70, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(formData.companyName, margin + 10, yPos + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Reporting Period: ${organization.period || '2024'}`, margin + 10, yPos + 35);
  doc.text(`Report Date: ${reportDate}`, margin + 10, yPos + 48);
  doc.text(`Prepared by: ${formData.name}`, margin + 10, yPos + 61);

  // SECR compliance statement
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('This report complies with UK SECR regulations for large companies', margin, pageHeight - 30);
  doc.text('Generated by CarbonCut Platform - Marketing Carbon Assessment', margin, pageHeight - 20);

  addPageNumber();
  doc.addPage();
  yPos = 20;

  // EXECUTIVE SUMMARY
  addSectionHeader('EXECUTIVE SUMMARY');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const execSummary = [
    `${formData.companyName} presents this SECR compliance report detailing greenhouse gas emissions from marketing activities for the reporting period ${organization.period || '2024'}.`,
    '',
    `This disclosure fulfills our obligations under the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013, specifically addressing Streamlined Energy and Carbon Reporting requirements for large UK companies.`,
    '',
    `Our comprehensive assessment of marketing-related emissions demonstrates our commitment to transparency and environmental responsibility in accordance with UK government guidance and DEFRA conversion factors.`
  ];

  execSummary.forEach(line => {
    checkPageBreak();
    if (line.trim()) {
      const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * 5 + 3;
    }
    yPos += 8;
  });

  // MANDATORY SECR DISCLOSURES
  checkPageBreak(60);
  addSectionHeader('MANDATORY SECR DISCLOSURES');

  // Main emissions highlight
  addHighlightBox(
    'Total Marketing Emissions (Scope 1, 2 & 3)',
    totalEmissions.toFixed(2),
    'tCO₂e',
    `Marketing activities assessed: ${activities.length} campaigns and operations`
  );

  // SECR Required Information Table
  const secrInfo = [
    ['Reporting Organisation', formData.companyName],
    ['Financial Year End', organization.period || '2024'],
    ['Report Prepared By', `${formData.name} (${formData.email})`],
    ['Methodology Standard', 'GHG Protocol + DEFRA Conversion Factors'],
    ['Reporting Boundary', 'Marketing Operations - All Scopes'],
    ['Base Year', organization.period || '2024'],
    ['Verification Status', 'Internal Assessment - CarbonCut Framework']
  ];

  const secrHeaders = ['SECR Requirement', 'Disclosure'];
  addTable(secrHeaders, secrInfo, {
    headerColor: [31, 73, 96],
    alternateRows: true,
    columnWidths: [80, 110]
  });

  // SCOPE BREAKDOWN
  checkPageBreak(60);
  addSectionHeader('GREENHOUSE GAS EMISSIONS BY SCOPE');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const scopeIntro = `The following breakdown presents marketing emissions by scope as required under SECR regulations, using DEFRA's latest greenhouse gas conversion factors and methodologies consistent with the GHG Protocol Corporate Standard.`;
  const splitScopeIntro = doc.splitTextToSize(scopeIntro, pageWidth - (2 * margin));
  doc.text(splitScopeIntro, margin, yPos);
  yPos += splitScopeIntro.length * 5 + 15;

  // Scope emissions table
  const scopeHeaders = ['Emission Scope', 'Description', 'Emissions (tCO₂e)', 'Percentage', 'DEFRA Category'];
  const scopeRows = Object.entries(totals.byScope).map(([scope, emissions]) => [
    `Scope ${scope}`,
    scope === '1' ? 'Direct emissions from owned/controlled sources' :
    scope === '2' ? 'Indirect emissions from purchased energy' :
    'Other indirect emissions in value chain',
    emissions.toFixed(2),
    `${((emissions / totalEmissions) * 100).toFixed(1)}%`,
    scope === '1' ? 'Fuels' : scope === '2' ? 'Electricity' : 'Business Travel/Materials'
  ]);

  // Add total row
  scopeRows.push([
    'TOTAL',
    'All Marketing Emissions',
    totalEmissions.toFixed(2),
    '100.0%',
    'Combined Categories'
  ]);

  addTable(scopeHeaders, scopeRows, {
    headerColor: [31, 73, 96],
    alternateRows: true,
    columnWidths: [30, 60, 30, 25, 45],
    fontSize: 9
  });

  // ENERGY CONSUMPTION AND EFFICIENCY
  checkPageBreak(50);
  addSectionHeader('ENERGY CONSUMPTION AND EFFICIENCY MEASURES');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const energyText = [
    'SECR requires disclosure of energy consumption and efficiency measures. Marketing activities consume energy through:',
    '',
    '• Digital infrastructure and cloud services for campaign delivery and management',
    '• Office energy allocation for marketing team operations and equipment',
    '• Travel-related energy consumption for events, meetings, and campaign activities',
    '• Production facilities energy for creating marketing materials and content',
    '',
    'Energy efficiency measures implemented:',
    '• Migration to cloud-first marketing technologies with improved efficiency',
    '• Optimisation of digital campaign delivery to reduce data transfer requirements',
    '• Remote working policies reducing commuting and office energy consumption',
    '• Sustainable supplier selection for marketing materials and services'
  ];

  energyText.forEach(line => {
    checkPageBreak();
    if (line.startsWith('•')) {
      doc.text(line, margin + 10, yPos);
    } else if (line.trim()) {
      if (line.includes('measures implemented:')) {
        doc.setFont('helvetica', 'bold');
        doc.text(line, margin, yPos);
        doc.setFont('helvetica', 'normal');
      } else {
        const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5;
      }
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

  // Equation box with DEFRA styling
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(31, 73, 96);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPos, pageWidth - (2 * margin), 25, 3, 3, 'FD');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const equation = "CO₂e_marketing = Σ_c Σ_i (Q_c,i × EF_c,i) + Σ_a (A_a × EF_a)";
  doc.text(equation, margin + 10, yPos + 15);
  yPos += 35;

  doc.setTextColor(3, 27, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DEFRA Compliance Framework:', margin, yPos);
  yPos += 12;

  const defraCompliance = [
    '• Activity data (Q_c,i): Measured in standard units (kWh, km, kg, GB, hours)',
    '• Emission factors (EF_c,i): Latest DEFRA conversion factors (updated annually)',
    '• Scope classification: Aligned with GHG Protocol and DEFRA guidance',
    '• Geographic factors: UK-specific grid emission factors and regional variations',
    '• Uncertainty assessment: Conservative approach following DEFRA best practice',
    '• Data quality: Primary data prioritised, industry averages for secondary data'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  defraCompliance.forEach(point => {
    checkPageBreak();
    doc.text(point, margin + 5, yPos);
    yPos += 10;
  });

  // DETAILED MARKETING CHANNEL BREAKDOWN
  if (Object.keys(totals.byChannel).length > 0) {
    checkPageBreak(60);
    addSectionHeader('MARKETING CHANNEL EMISSIONS BREAKDOWN');

    const channelHeaders = ['Marketing Channel', 'Emissions (tCO₂e)', 'Percentage', 'Primary Scope', 'Key Activities'];
    const channelRows = Object.entries(totals.byChannel)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Top 10 channels for space
      .map(([channel, emissions]) => [
        channel,
        emissions.toFixed(3),
        `${((emissions / totalEmissions) * 100).toFixed(1)}%`,
        'Scope 3', // Most marketing activities are Scope 3
        'Campaign Operations'
      ]);

    addTable(channelHeaders, channelRows, {
      headerColor: [31, 73, 96],
      alternateRows: true,
      columnWidths: [50, 30, 25, 25, 60],
      fontSize: 9
    });
  }

  // ACTIVITY LOG (Sample)
  checkPageBreak(80);
  addSectionHeader('DETAILED ACTIVITY LOG (Sample)');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Representative sample of marketing activities and their carbon footprints:', margin, yPos);
  yPos += 15;

  const activityHeaders = ['Date', 'Activity Description', 'Scope', 'Quantity', 'Unit', 'tCO₂e'];
  const sampleActivities = activities
    .sort((a, b) => getDisplayCO2(b) - getDisplayCO2(a))
    .slice(0, 15) // Top 15 activities
    .map(activity => [
      activity.date,
      activity.activityLabel.length > 25 ? 
        activity.activityLabel.substring(0, 22) + '...' : 
        activity.activityLabel,
      `Scope ${activity.scope}`,
      activity.qty.toString(),
      activity.unit || 'units',
      (getDisplayCO2(activity) / 1000).toFixed(4)
    ]);

  addTable(activityHeaders, sampleActivities, {
    headerColor: [31, 73, 96],
    alternateRows: true,
    columnWidths: [25, 60, 20, 20, 20, 25],
    fontSize: 8
  });

  // COMPARISON WITH PREVIOUS YEARS (if applicable)
  checkPageBreak(50);
  addSectionHeader('ANNUAL COMPARISON AND TRENDS');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const comparisonText = [
    `Current year (${organization.period || '2024'}) total marketing emissions: ${totalEmissions.toFixed(2)} tCO₂e`,
    '',
    'This represents the baseline year for our marketing carbon accounting framework.',
    'Future reports will include year-on-year comparisons and trend analysis as required by SECR.',
    '',
    'Key performance indicators established:',
    '• Total marketing emissions (tCO₂e)',
    '• Emissions per marketing spend (tCO₂e/£)',
    '• Emissions per campaign (tCO₂e/campaign)',
    '• Digital vs. traditional media emissions ratio'
  ];

  comparisonText.forEach(line => {
    checkPageBreak();
    if (line.startsWith('•')) {
      doc.text(line, margin + 10, yPos);
    } else if (line.trim()) {
      if (line.includes('indicators established:')) {
        doc.setFont('helvetica', 'bold');
        doc.text(line, margin, yPos);
        doc.setFont('helvetica', 'normal');
      } else {
        const splitText = doc.splitTextToSize(line, pageWidth - (2 * margin));
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5;
      }
    }
    yPos += 8;
  });

  // GOVERNANCE AND ASSURANCE
  checkPageBreak(50);
  addSectionHeader('GOVERNANCE AND ASSURANCE');

  const governanceHeaders = ['Governance Element', 'Description', 'Responsible Party'];
  const governanceRows = [
    ['Board Oversight', 'Strategic oversight of climate-related risks', 'Board of Directors'],
    ['Management Responsibility', 'Operational climate risk management', 'Executive Team'],
    ['Data Collection', 'Marketing emissions data gathering', formData.name],
    ['Methodology Review', 'Annual review of calculation methods', 'Technical Team'],
    ['External Verification', 'Third-party assurance (planned)', 'External Auditor'],
    ['Reporting', 'Annual SECR compliance reporting', 'Finance/Sustainability']
  ];

  addTable(governanceHeaders, governanceRows, {
    headerColor: [31, 73, 96],
    alternateRows: true,
    columnWidths: [50, 90, 50]
  });

  // FUTURE COMMITMENTS
  checkPageBreak(40);
  addSectionHeader('FUTURE COMMITMENTS AND TARGETS');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const commitments = [
    `${formData.companyName} commits to continuous improvement in marketing carbon management:`,
    '',
    '• Annual reduction targets for marketing emissions intensity',
    '• Investment in lower-carbon marketing technologies and practices',
    '• Supplier engagement programme for Scope 3 emission reductions',
    '• Enhanced data collection for improved accuracy and coverage',
    '• Integration with overall corporate net-zero commitments',
    '• Regular methodology updates aligned with latest DEFRA guidance'
  ];

  commitments.forEach(line => {
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

  // SECR COMPLIANCE DECLARATION
  checkPageBreak(60);
  addSectionHeader('SECR COMPLIANCE DECLARATION');

  doc.setFillColor(240, 248, 255);
  doc.setDrawColor(31, 73, 96);
  doc.rect(margin, yPos, pageWidth - (2 * margin), 50, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DECLARATION', margin + 10, yPos + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const declaration = `This report has been prepared in accordance with the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013 and represents a true and fair view of ${formData.companyName}'s marketing-related greenhouse gas emissions for the reporting period ${organization.period || '2024'}.`;
  const splitDeclaration = doc.splitTextToSize(declaration, pageWidth - (2 * margin) - 20);
  doc.text(splitDeclaration, margin + 10, yPos + 25);

  yPos += 60;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Prepared by:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.name, margin + 40, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(reportDate, margin + 25, yPos);

  // Add final page number
  addPageNumber();

  // Save the document
  const fileName = `SECR_Compliance_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${organization.period || '2024'}.pdf`;
  doc.save(fileName);
};

export default generateSECRReport;