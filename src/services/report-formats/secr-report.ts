import { ActivityData, OrganizationData } from "@/types/types";
import puppeteer from 'puppeteer';

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

const generateSECRHTMLTemplate = (data: PDFGenerationData): string => {
  const { organization, activities, getDisplayCO2, totals, formData } = data;
  const totalEmissions = totals.total;
  const now = new Date();
  const reportDate = now.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  // Calculate scope data
  const scopeData = [
    {
      scope: '1',
      description: 'Direct emissions from owned/controlled sources',
      emissions: totals.byScope['1'] || 0,
      category: 'Fuels'
    },
    {
      scope: '2', 
      description: 'Indirect emissions from purchased energy',
      emissions: totals.byScope['2'] || 0,
      category: 'Electricity'
    },
    {
      scope: '3',
      description: 'Other indirect emissions in value chain',
      emissions: totals.byScope['3'] || 0,
      category: 'Business Travel/Materials'
    }
  ];

  // Top marketing channels
  const topChannels = Object.entries(totals.byChannel)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Sample activities
  const sampleActivities = activities
    .sort((a, b) => getDisplayCO2(b) - getDisplayCO2(a))
    .slice(0, 15);

 return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SECR Compliance Report - Example Company Ltd</title>
    <style>
        /* CSS Variables for consistent theming */
        :root {
            --primary-blue: #1F4960;
            --white: #FFFFFF;
            --dark-text: #031B27;
            --light-gray: #F8F8F8;
            --medium-gray: #C8C8C8;
            --light-blue: #F0F8FF;
            --subtitle-gray: #646464;
            --border-color: #E0E0E0;
        }

        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: var(--dark-text);
            background: white;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
        }

        /* Print-specific styles */
        @media print {
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                margin: 0;
                padding: 20mm;
            }
            .page-break { 
                page-break-before: always; 
            }
            .no-break { 
                page-break-inside: avoid; 
            }
        }

        /* Layout containers */
        .content-section {
            margin-bottom: 25px;
        }

        /* Header styles */
        .cover-header {
            background: var(--primary-blue);
            color: var(--white);
            padding: 30px 20px;
            position: relative;
            margin: -20px -20px 30px -20px;
        }

        .uk-gov-badge {
            position: absolute;
            top: 20px;
            right: 30px;
            width: 35px;
            height: 35px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            font-weight: bold;
            color: var(--primary-blue);
        }

        .main-title {
            font-size: 36pt;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .sub-title {
            font-size: 26pt;
            font-weight: bold;
        }

        /* Section headers */
        .section-header {
            background: var(--primary-blue);
            color: var(--white);
            padding: 12px 15px;
            font-size: 14pt;
            font-weight: bold;
            margin: 25px 0 15px 0;
        }

        .subsection-header {
            color: var(--primary-blue);
            font-size: 12pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }

        /* Highlight boxes */
        .highlight-box {
            background: var(--light-blue);
            border: 2px solid var(--primary-blue);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }

        .highlight-title {
            color: var(--primary-blue);
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .highlight-value {
            font-size: 24pt;
            font-weight: bold;
            color: var(--dark-text);
            display: inline;
        }

        .highlight-unit {
            font-size: 14pt;
            font-weight: normal;
            color: var(--dark-text);
            margin-left: 8px;
        }

        .highlight-description {
            font-size: 10pt;
            color: var(--dark-text);
            margin-top: 8px;
        }

        /* Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 9pt;
        }

        .data-table th {
            background: var(--primary-blue);
            color: var(--white);
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid var(--medium-gray);
        }

        .data-table td {
            padding: 10px 8px;
            border: 1px solid var(--medium-gray);
            text-align: center;
            vertical-align: middle;
        }

        .data-table tr:nth-child(even) {
            background: var(--light-gray);
        }

        .data-table tr:last-child td {
            font-weight: bold;
            background: #E8F4F8;
        }

        /* Text styles */
        .paragraph {
            margin-bottom: 12px;
            text-align: justify;
            line-height: 1.5;
        }

        .bullet-list {
            margin: 10px 0;
            padding-left: 0;
        }

        .bullet-item {
            margin: 5px 0;
            padding-left: 20px;
            position: relative;
        }

        .bullet-item::before {
            content: "•";
            position: absolute;
            left: 8px;
            font-weight: bold;
        }

        /* Info boxes */
        .info-section {
            background: #F5F5F5;
            border: 3px solid var(--primary-blue);
            padding: 20px;
            margin: 20px 0;
        }

        .info-title {
            color: var(--primary-blue);
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .company-info {
            background: var(--primary-blue);
            color: var(--white);
            padding: 25px;
            margin: 20px 0;
        }

        .company-name {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .company-detail {
            font-size: 12pt;
            margin-bottom: 8px;
        }

        /* Equation box */
        .equation-box {
            background: #F8F9FA;
            border: 1px solid var(--primary-blue);
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            font-size: 12pt;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
        }

        /* Declaration box */
        .declaration-box {
            background: var(--light-blue);
            border: 2px solid var(--primary-blue);
            padding: 25px;
            margin: 25px 0;
        }

        .declaration-title {
            color: var(--primary-blue);
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .signature-section {
            margin-top: 20px;
            display: flex;
            gap: 30px;
        }

        .signature-item {
            font-weight: bold;
        }

        /* Footer */
        .page-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            font-size: 8pt;
            color: var(--subtitle-gray);
            display: flex;
            justify-content: space-between;
            padding: 0 20mm;
        }

        /* Compliance footer */
        .compliance-footer {
            position: absolute;
            bottom: 30px;
            left: 20px;
            right: 20px;
            font-size: 9pt;
            color: var(--subtitle-gray);
        }

        /* Utility classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .mb-10 { margin-bottom: 10px; }
        .mb-15 { margin-bottom: 15px; }
        .mb-20 { margin-bottom: 20px; }
        .mt-20 { margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- COVER PAGE -->
        <div class="cover-header">
            <div class="uk-gov-badge">UK GOV</div>
            <div class="main-title">SECR</div>
            <div class="sub-title">COMPLIANCE REPORT</div>
        </div>

        <div class="info-section">
            <div class="info-title">STREAMLINED ENERGY & CARBON REPORTING</div>
            <div class="paragraph">
                Companies Act 2006 (Strategic Report and Directors' Report)<br>
                Regulations 2013 - Marketing Emissions Disclosure
            </div>
        </div>

        <div class="company-info">
            <div class="company-name">Example Company Ltd</div>
            <div class="company-detail">Reporting Period: 1 April 2023 - 31 March 2024</div>
            <div class="company-detail">Report Date: 30 June 2024</div>
            <div class="company-detail">Prepared by: Sustainability Department</div>
        </div>

        <div class="compliance-footer">
            <div>This report complies with UK SECR regulations for large companies</div>
            <div>Generated by CarbonCut Platform - Marketing Carbon Assessment</div>
        </div>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section-header">EXECUTIVE SUMMARY</div>
        
        <div class="content-section">
            <div class="paragraph">
                Example Company Ltd presents this SECR compliance report detailing our UK energy use and associated 
                greenhouse gas emissions for the reporting period 1 April 2023 to 31 March 2024. This disclosure 
                fulfills our obligations under the Companies Act 2006 (Strategic Report and Directors' Report) 
                Regulations 2013, specifically addressing Streamlined Energy and Carbon Reporting requirements.
            </div>
            
            <div class="paragraph">
                Our comprehensive assessment demonstrates our commitment to transparency and environmental 
                responsibility in accordance with UK government guidance and DEFRA conversion factors.
            </div>
        </div>

        <!-- MANDATORY SECR DISCLOSURES -->
        <div class="section-header">MANDATORY SECR DISCLOSURES</div>

        <div class="highlight-box">
            <div class="highlight-title">Total Gross Emissions (Scope 1 & 2)</div>
            <div>
                <span class="highlight-value">1,245.6</span>
                <span class="highlight-unit">tCO₂e</span>
            </div>
            <div class="highlight-description">
                Including electricity, gas, transport and other energy consumption
            </div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 40%;">SECR Requirement</th>
                    <th style="width: 60%;">Disclosure</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><strong>Reporting Organisation</strong></td><td>Example Company Ltd</td></tr>
                <tr><td><strong>Financial Year End</strong></td><td>31 March 2024</td></tr>
                <tr><td><strong>Report Prepared By</strong></td><td>Sustainability Department</td></tr>
                <tr><td><strong>Methodology Standard</strong></td><td>GHG Protocol + DEFRA Conversion Factors 2023</td></tr>
                <tr><td><strong>Reporting Boundary</strong></td><td>UK operations - All sites</td></tr>
                <tr><td><strong>Base Year</strong></td><td>2020</td></tr>
                <tr><td><strong>Verification Status</strong></td><td>Internal Assessment</td></tr>
            </tbody>
        </table>

        <!-- ENERGY CONSUMPTION -->
        <div class="section-header">ENERGY CONSUMPTION</div>

        <div class="paragraph">
            The following table details our UK energy consumption for the reporting period, as required by SECR regulations.
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 30%;">Energy Source</th>
                    <th style="width: 20%;">Consumption</th>
                    <th style="width: 15%;">Units</th>
                    <th style="width: 20%;">SECR Category</th>
                    <th style="width: 15%;">Scope</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Electricity (Grid)</td>
                    <td>1,250,000</td>
                    <td>kWh</td>
                    <td>Purchased Electricity</td>
                    <td>Scope 2</td>
                </tr>
                <tr>
                    <td>Natural Gas</td>
                    <td>850,000</td>
                    <td>kWh</td>
                    <td>Gas</td>
                    <td>Scope 1</td>
                </tr>
                <tr>
                    <td>Diesel (Fleet)</td>
                    <td>95,000</td>
                    <td>Litres</td>
                    <td>Transport</td>
                    <td>Scope 1</td>
                </tr>
                <tr>
                    <td>Petrol (Company Cars)</td>
                    <td>42,000</td>
                    <td>Litres</td>
                    <td>Transport</td>
                    <td>Scope 1</td>
                </tr>
                <tr>
                    <td><strong>Total Energy Consumption</strong></td>
                    <td><strong>2,237,000</strong></td>
                    <td><strong>kWh equivalent</strong></td>
                    <td><strong>All Sources</strong></td>
                    <td><strong>Scope 1 & 2</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- EMISSIONS BREAKDOWN -->
        <div class="section-header">GREENHOUSE GAS EMISSIONS</div>

        <div class="paragraph">
            The following breakdown presents our greenhouse gas emissions by scope as required under SECR regulations, using 
            DEFRA's 2023 greenhouse gas conversion factors and methodologies consistent with the GHG Protocol 
            Corporate Standard.
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 15%;">Emission Scope</th>
                    <th style="width: 35%;">Description</th>
                    <th style="width: 15%;">Emissions (tCO₂e)</th>
                    <th style="width: 12%;">Percentage</th>
                    <th style="width: 23%;">DEFRA Category</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Scope 1</strong></td>
                    <td>Direct emissions from owned or controlled sources</td>
                    <td>458.3</td>
                    <td>36.8%</td>
                    <td>Stationary Combustion, Transport</td>
                </tr>
                <tr>
                    <td><strong>Scope 2</strong></td>
                    <td>Indirect emissions from purchased electricity</td>
                    <td>787.3</td>
                    <td>63.2%</td>
                    <td>Purchased Electricity</td>
                </tr>
                <tr>
                    <td><strong>Scope 3*</strong></td>
                    <td>Other indirect emissions (voluntary disclosure)</td>
                    <td>2,150.7</td>
                    <td>N/A</td>
                    <td>Business Travel, Procurement</td>
                </tr>
                <tr>
                    <td><strong>TOTAL (Scope 1+2)</strong></td>
                    <td><strong>SECR Mandatory Reporting</strong></td>
                    <td><strong>1,245.6</strong></td>
                    <td><strong>100.0%</strong></td>
                    <td><strong>Combined Categories</strong></td>
                </tr>
            </tbody>
        </table>

        <div class="paragraph">
            * Scope 3 emissions are disclosed voluntarily and are not part of the mandatory SECR requirements.
        </div>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- METHODOLOGY -->
        <div class="section-header">METHODOLOGY AND EMISSION FACTORS</div>

        <div class="subsection-header">Calculation Methodology</div>

        <div class="equation-box">
            Emissions (tCO₂e) = Activity Data × Emission Factor × Global Warming Potential
        </div>

        <div class="paragraph">
            Our emissions calculations follow the GHG Protocol Corporate Standard and use the latest DEFRA conversion factors (2023).
        </div>

        <div class="subsection-header">Emission Factors Applied:</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 30%;">Energy Source</th>
                    <th style="width: 25%;">Emission Factor</th>
                    <th style="width: 25%;">Units</th>
                    <th style="width: 20%;">Source</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Grid Electricity</td>
                    <td>0.193</td>
                    <td>kgCO₂e/kWh</td>
                    <td>DEFRA 2023</td>
                </tr>
                <tr>
                    <td>Natural Gas</td>
                    <td>0.184</td>
                    <td>kgCO₂e/kWh</td>
                    <td>DEFRA 2023</td>
                </tr>
                <tr>
                    <td>Diesel</td>
                    <td>2.517</td>
                    <td>kgCO₂e/litre</td>
                    <td>DEFRA 2023</td>
                </tr>
                <tr>
                    <td>Petrol</td>
                    <td>2.195</td>
                    <td>kgCO₂e/litre</td>
                    <td>DEFRA 2023</td>
                </tr>
            </tbody>
        </table>

        <!-- INTENSITY RATIO -->
        <div class="section-header">EMISSIONS INTENSITY RATIO</div>

        <div class="paragraph">
            SECR requires disclosure of at least one intensity ratio to contextualise emissions performance.
        </div>

        <div class="highlight-box">
            <div class="highlight-title">Emissions Intensity Ratio</div>
            <div>
                <span class="highlight-value">0.025</span>
                <span class="highlight-unit">tCO₂e/£k turnover</span>
            </div>
            <div class="highlight-description">
                Total gross emissions (Scope 1+2) per thousand pounds of turnover
            </div>
        </div>

        <!-- YEAR-ON-YEAR COMPARISON -->
        <div class="section-header">YEAR-ON-YEAR COMPARISON</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Reporting Period</th>
                    <th style="width: 15%;">Scope 1 (tCO₂e)</th>
                    <th style="width: 15%;">Scope 2 (tCO₂e)</th>
                    <th style="width: 15%;">Total (tCO₂e)</th>
                    <th style="width: 15%;">Change</th>
                    <th style="width: 15%;">Intensity Ratio</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2022-2023</td>
                    <td>485.6</td>
                    <td>825.4</td>
                    <td>1,311.0</td>
                    <td>Baseline</td>
                    <td>0.027</td>
                </tr>
                <tr>
                    <td>2023-2024</td>
                    <td>458.3</td>
                    <td>787.3</td>
                    <td>1,245.6</td>
                    <td>-5.0%</td>
                    <td>0.025</td>
                </tr>
                <tr>
                    <td><strong>Change</strong></td>
                    <td><strong>-27.3</strong></td>
                    <td><strong>-38.1</strong></td>
                    <td><strong>-65.4</strong></td>
                    <td><strong>-5.0%</strong></td>
                    <td><strong>-7.4%</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- ENERGY EFFICIENCY MEASURES -->
        <div class="section-header">ENERGY EFFICIENCY MEASURES</div>

        <div class="paragraph">
            During the reporting period, we implemented several energy efficiency measures to reduce our consumption and emissions:
        </div>

        <div class="bullet-list">
            <div class="bullet-item">Installation of LED lighting across all office facilities (completed Q2 2023)</div>
            <div class="bullet-item">Upgrade of HVAC systems with smart controls at our main manufacturing site</div>
            <div class="bullet-item">Implementation of a teleconferencing policy to reduce business travel</div>
            <div class="bullet-item">Transition to hybrid and electric vehicles in our company fleet (15% conversion)</div>
            <div class="bullet-item">Employee engagement programme promoting energy-saving behaviours</div>
        </div>

        <div class="paragraph">
            These measures have contributed to our 5.0% reduction in gross emissions compared to the previous year.
        </div>

        <!-- FUTURE ACTIONS -->
        <div class="section-header">FUTURE ACTIONS TO REDUCE EMISSIONS</div>

        <div class="paragraph">
            We are committed to further reducing our environmental impact through the following planned actions:
        </div>

        <div class="bullet-list">
            <div class="bullet-item">Installation of solar panels at our headquarters (planned for 2025)</div>
            <div class="bullet-item">Transition to 100% renewable electricity through Power Purchase Agreements</div>
            <div class="bullet-item">Further electrification of company vehicle fleet (target: 40% by 2026)</div>
            <div class="bullet-item">Implementation of energy management system ISO 50001</div>
            <div class="bullet-item">Supplier engagement programme to address Scope 3 emissions</div>
        </div>

        <!-- GOVERNANCE -->
        <div class="section-header">GOVERNANCE AND ASSURANCE</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Governance Element</th>
                    <th style="width: 45%;">Description</th>
                    <th style="width: 30%;">Responsible Party</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><strong>Board Oversight</strong></td><td>Strategic oversight of climate-related risks</td><td>Board of Directors</td></tr>
                <tr><td><strong>Management Responsibility</strong></td><td>Operational climate risk management</td><td>Executive Team</td></tr>
                <tr><td><strong>Data Collection</strong></td><td>Energy and emissions data gathering</td><td>Sustainability Department</td></tr>
                <tr><td><strong>Methodology Review</strong></td><td>Annual review of calculation methods</td><td>Technical Team</td></tr>
                <tr><td><strong>External Verification</strong></td><td>Third-party assurance (planned)</td><td>External Auditor</td></tr>
                <tr><td><strong>Reporting</strong></td><td>Annual SECR compliance reporting</td><td>Finance/Sustainability</td></tr>
            </tbody>
        </table>

        <!-- DIRECTORS' STATEMENT -->
        <div class="section-header">DIRECTORS' STATEMENT</div>

        <div class="declaration-box">
            <div class="declaration-title">DIRECTORS' APPROVAL STATEMENT</div>
            <div class="paragraph">
                The Directors of Example Company Ltd confirm that the information contained in this Streamlined Energy 
                and Carbon Report (SECR) is accurate and complete to the best of their knowledge. This report has been 
                prepared in accordance with the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 
                2013 and represents a true and fair view of the company's UK energy use and associated greenhouse gas 
                emissions for the reporting period 1 April 2023 to 31 March 2024.
            </div>
            
            <div class="paragraph">
                The Directors acknowledge their responsibility for the company's energy and carbon performance and 
                are committed to continuous improvement in environmental management and reporting.
            </div>
            
            <div class="signature-section">
                <div class="signature-item">
                    <strong>Approved by the Board of Directors:</strong><br>
                    Jane Smith, Chair<br>
                    Example Company Ltd
                </div>
                <div class="signature-item">
                    <strong>Date:</strong> 30 June 2024
                </div>
            </div>
        </div>

    </div>

    <!-- Print Footer (appears on every page when printing) -->
    <div class="page-footer">
        <span>SECR Report - Example Company Ltd</span>
        <span>Page</span>
    </div>

</body>
</html>`;
};

// Updated PDF generation function using Puppeteer with better error handling
const generatePDFFromHTML = async (data: PDFGenerationData): Promise<Uint8Array> => {
  let browser;
  
  try {
    const htmlContent = generateSECRHTMLTemplate(data);
    
    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';
    
    // Configure Puppeteer launch options based on environment
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    };

    // In production or if Chrome is not available, try to use system Chrome
    // if (!isDev || process.env.VERCEL) {
    //   launchOptions.executablePath =  
    //                                '/usr/bin/chromium-browser' || 
    //                                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    // }

    console.log('Launching Puppeteer with options:', launchOptions);

    // Launch Puppeteer browser
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    // Set viewport and content
    await page.setViewport({ width: 1200, height: 1600 });
    
    // Set content and wait for it to load
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    console.log('Content set, generating PDF...');

    // Generate PDF with proper options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%;">
          <div style="text-align: center;">SECR Compliance Report - ${data.formData.companyName}</div>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%; display: flex; justify-content: space-between;">
          <span>Generated by CarbonCut Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      timeout: 60000
    });

    console.log('PDF generated successfully');
    return new Uint8Array(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    
    // If Puppeteer fails, provide a fallback
    if (error instanceof Error && error.message.includes('Could not find Chrome')) {
      console.log('Chrome not found, using HTML fallback...');
      return generateHTMLFallback(data);
    }
    
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
};

// Fallback function that returns HTML as PDF placeholder
const generateHTMLFallback = (data: PDFGenerationData): Uint8Array => {
  console.log('Using HTML fallback for PDF generation');
  
  const htmlContent = generateSECRHTMLTemplate(data);
  
  // Create a simple PDF-like document with HTML content
  const fallbackContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PDF Report - ${data.formData.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .error-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="error-notice">
        <h3>PDF Generation Notice</h3>
        <p>This is a fallback HTML version of your report. For the full PDF experience, please ensure Chrome is installed on the server.</p>
        <p>Company: ${data.formData.companyName}</p>
        <p>Total Emissions: ${data.totals.total.toFixed(2)} kg CO₂e</p>
        <p>Activities: ${data.activities.length} marketing activities</p>
    </div>
    ${htmlContent}
</body>
</html>
  `;
  
  const encoder = new TextEncoder();
  return encoder.encode(fallbackContent);
};

// Main export function for generating SECR report
export const generateSECRReport = async (data: PDFGenerationData): Promise<Uint8Array> => {
  return await generatePDFFromHTML(data);
};

export { generateSECRHTMLTemplate, generatePDFFromHTML };
export default generateSECRReport;