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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SECR Compliance Report - ${formData.companyName}</title>
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
        }

        /* Print-specific styles */
        @page {
            size: A4;
            margin: 20mm;
        }

        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-break { page-break-before: always; }
            .no-break { page-break-inside: avoid; }
        }

        /* Layout containers */
        .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
        }

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
            <div class="company-name">${formData.companyName}</div>
            <div class="company-detail">Reporting Period: ${organization.period || '2024'}</div>
            <div class="company-detail">Report Date: ${reportDate}</div>
            <div class="company-detail">Prepared by: ${formData.name}</div>
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
                ${formData.companyName} presents this SECR compliance report detailing greenhouse gas emissions from marketing 
                activities for the reporting period ${organization.period || '2024'}. This disclosure fulfills our obligations under the Companies Act 2006 
                (Strategic Report and Directors' Report) Regulations 2013, specifically addressing Streamlined Energy and 
                Carbon Reporting requirements for large UK companies.
            </div>
            
            <div class="paragraph">
                Our comprehensive assessment of marketing-related emissions demonstrates our commitment to transparency 
                and environmental responsibility in accordance with UK government guidance and DEFRA conversion factors.
            </div>
        </div>

        <!-- MANDATORY SECR DISCLOSURES -->
        <div class="section-header">MANDATORY SECR DISCLOSURES</div>

        <div class="highlight-box">
            <div class="highlight-title">Total Marketing Emissions (Scope 1, 2 & 3)</div>
            <div>
                <span class="highlight-value">${totalEmissions.toFixed(2)}</span>
                <span class="highlight-unit">tCO₂e</span>
            </div>
            <div class="highlight-description">
                Marketing activities assessed: ${activities.length} campaigns and operations
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
                <tr><td><strong>Reporting Organisation</strong></td><td>${formData.companyName}</td></tr>
                <tr><td><strong>Financial Year End</strong></td><td>${organization.period || '2024'}</td></tr>
                <tr><td><strong>Report Prepared By</strong></td><td>${formData.name} (${formData.email})</td></tr>
                <tr><td><strong>Methodology Standard</strong></td><td>GHG Protocol + DEFRA Conversion Factors</td></tr>
                <tr><td><strong>Reporting Boundary</strong></td><td>Marketing Operations - All Scopes</td></tr>
                <tr><td><strong>Base Year</strong></td><td>${organization.period || '2024'}</td></tr>
                <tr><td><strong>Verification Status</strong></td><td>Internal Assessment - CarbonCut Framework</td></tr>
            </tbody>
        </table>

        <!-- SCOPE BREAKDOWN -->
        <div class="section-header">GREENHOUSE GAS EMISSIONS BY SCOPE</div>

        <div class="paragraph">
            The following breakdown presents marketing emissions by scope as required under SECR regulations, using 
            DEFRA's latest greenhouse gas conversion factors and methodologies consistent with the GHG Protocol 
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
                ${scopeData.map(scope => `
                <tr>
                    <td><strong>Scope ${scope.scope}</strong></td>
                    <td>${scope.description}</td>
                    <td>${scope.emissions.toFixed(2)}</td>
                    <td>${totalEmissions > 0 ? ((scope.emissions / totalEmissions) * 100).toFixed(1) : '0.0'}%</td>
                    <td>${scope.category}</td>
                </tr>
                `).join('')}
                <tr>
                    <td><strong>TOTAL</strong></td>
                    <td><strong>All Marketing Emissions</strong></td>
                    <td><strong>${totalEmissions.toFixed(2)}</strong></td>
                    <td><strong>100.0%</strong></td>
                    <td><strong>Combined Categories</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- ENERGY CONSUMPTION -->
        <div class="section-header">ENERGY CONSUMPTION AND EFFICIENCY MEASURES</div>

        <div class="paragraph">
            SECR requires disclosure of energy consumption and efficiency measures. Marketing activities consume energy through:
        </div>

        <div class="bullet-list">
            <div class="bullet-item">Digital infrastructure and cloud services for campaign delivery and management</div>
            <div class="bullet-item">Office energy allocation for marketing team operations and equipment</div>
            <div class="bullet-item">Travel-related energy consumption for events, meetings, and campaign activities</div>
            <div class="bullet-item">Production facilities energy for creating marketing materials and content</div>
        </div>

        <div class="paragraph font-bold">Energy efficiency measures implemented:</div>

        <div class="bullet-list">
            <div class="bullet-item">Migration to cloud-first marketing technologies with improved efficiency</div>
            <div class="bullet-item">Optimisation of digital campaign delivery to reduce data transfer requirements</div>
            <div class="bullet-item">Remote working policies reducing commuting and office energy consumption</div>
            <div class="bullet-item">Sustainable supplier selection for marketing materials and services</div>
        </div>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- METHODOLOGY -->
        <div class="section-header">METHODOLOGY AND CALCULATION FRAMEWORK</div>

        <div class="subsection-header">CarbonCut Master Equation</div>

        <div class="equation-box">
            CO₂e_marketing = Σ_c Σ_i (Q_c,i × EF_c,i) + Σ_a (A_a × EF_a)
        </div>

        <div class="subsection-header">DEFRA Compliance Framework:</div>

        <div class="bullet-list">
            <div class="bullet-item">Activity data (Q_c,i): Measured in standard units (kWh, km, kg, GB, hours)</div>
            <div class="bullet-item">Emission factors (EF_c,i): Latest DEFRA conversion factors (updated annually)</div>
            <div class="bullet-item">Scope classification: Aligned with GHG Protocol and DEFRA guidance</div>
            <div class="bullet-item">Geographic factors: UK-specific grid emission factors and regional variations</div>
            <div class="bullet-item">Uncertainty assessment: Conservative approach following DEFRA best practice</div>
            <div class="bullet-item">Data quality: Primary data prioritised, industry averages for secondary data</div>
        </div>

        ${topChannels.length > 0 ? `
        <!-- MARKETING CHANNELS -->
        <div class="section-header">MARKETING CHANNEL EMISSIONS BREAKDOWN</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Marketing Channel</th>
                    <th style="width: 18%;">Emissions (tCO₂e)</th>
                    <th style="width: 15%;">Percentage</th>
                    <th style="width: 17%;">Primary Scope</th>
                    <th style="width: 25%;">Key Activities</th>
                </tr>
            </thead>
            <tbody>
                ${topChannels.map(([channel, emissions]) => `
                <tr>
                    <td>${channel}</td>
                    <td>${emissions.toFixed(3)}</td>
                    <td>${((emissions / totalEmissions) * 100).toFixed(1)}%</td>
                    <td>Scope 3</td>
                    <td>Campaign Operations</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        ${sampleActivities.length > 0 ? `
        <!-- ACTIVITY LOG -->
        <div class="section-header">DETAILED ACTIVITY LOG (Sample)</div>

        <div class="paragraph">Representative sample of marketing activities and their carbon footprints:</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 12%;">Date</th>
                    <th style="width: 35%;">Activity Description</th>
                    <th style="width: 10%;">Scope</th>
                    <th style="width: 12%;">Quantity</th>
                    <th style="width: 13%;">Unit</th>
                    <th style="width: 18%;">tCO₂e</th>
                </tr>
            </thead>
            <tbody>
                ${sampleActivities.map(activity => `
                <tr>
                    <td>${activity.date || 'N/A'}</td>
                    <td>${activity.activityLabel.length > 40 ? 
                        activity.activityLabel.substring(0, 37) + '...' : 
                        activity.activityLabel}</td>
                    <td>Scope ${activity.scope}</td>
                    <td>${activity.qty}</td>
                    <td>${activity.unit || 'units'}</td>
                    <td>${(getDisplayCO2(activity) / 1000).toFixed(4)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <!-- ANNUAL COMPARISON -->
        <div class="section-header">ANNUAL COMPARISON AND TRENDS</div>

        <div class="paragraph font-bold">
            Current year (${organization.period || '2024'}) total marketing emissions: ${totalEmissions.toFixed(2)} tCO₂e
        </div>

        <div class="paragraph">
            This represents the baseline year for our marketing carbon accounting framework. 
            Future reports will include year-on-year comparisons and trend analysis as required by SECR.
        </div>

        <div class="paragraph font-bold">Key performance indicators established:</div>

        <div class="bullet-list">
            <div class="bullet-item">Total marketing emissions (tCO₂e)</div>
            <div class="bullet-item">Emissions per marketing spend (tCO₂e/£)</div>
            <div class="bullet-item">Emissions per campaign (tCO₂e/campaign)</div>
            <div class="bullet-item">Digital vs. traditional media emissions ratio</div>
        </div>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

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
                <tr><td><strong>Data Collection</strong></td><td>Marketing emissions data gathering</td><td>${formData.name}</td></tr>
                <tr><td><strong>Methodology Review</strong></td><td>Annual review of calculation methods</td><td>Technical Team</td></tr>
                <tr><td><strong>External Verification</strong></td><td>Third-party assurance (planned)</td><td>External Auditor</td></tr>
                <tr><td><strong>Reporting</strong></td><td>Annual SECR compliance reporting</td><td>Finance/Sustainability</td></tr>
            </tbody>
        </table>

        <!-- FUTURE COMMITMENTS -->
        <div class="section-header">FUTURE COMMITMENTS AND TARGETS</div>

        <div class="paragraph">
            ${formData.companyName} commits to continuous improvement in marketing carbon management:
        </div>

        <div class="bullet-list">
            <div class="bullet-item">Annual reduction targets for marketing emissions intensity</div>
            <div class="bullet-item">Investment in lower-carbon marketing technologies and practices</div>
            <div class="bullet-item">Supplier engagement programme for Scope 3 emission reductions</div>
            <div class="bullet-item">Enhanced data collection for improved accuracy and coverage</div>
            <div class="bullet-item">Integration with overall corporate net-zero commitments</div>
            <div class="bullet-item">Regular methodology updates aligned with latest DEFRA guidance</div>
        </div>

        <!-- COMPLIANCE DECLARATION -->
        <div class="section-header">SECR COMPLIANCE DECLARATION</div>

        <div class="declaration-box">
            <div class="declaration-title">DECLARATION</div>
            <div class="paragraph">
                This report has been prepared in accordance with the Companies Act 2006 (Strategic Report and Directors' Report) 
                Regulations 2013 and represents a true and fair view of ${formData.companyName}'s marketing-related greenhouse gas 
                emissions for the reporting period ${organization.period || '2024'}.
            </div>
            
            <div class="signature-section">
                <div class="signature-item">
                    <strong>Prepared by:</strong> ${formData.name}
                </div>
                <div class="signature-item">
                    <strong>Date:</strong> ${reportDate}
                </div>
            </div>
        </div>

    </div>

    <!-- Print Footer (appears on every page when printing) -->
    <div class="page-footer">
        <span>SECR Report - ${formData.companyName}</span>
        <span>Page</span>
    </div>

</body>
</html>
  `;
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