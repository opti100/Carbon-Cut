import puppeteer from 'puppeteer';
import { PDFFormData, PDFGenerationData } from './secr-report';

const generateCSRDHTMLTemplate = (data: PDFGenerationData): string => {
  const { organization, activities, getDisplayCO2, totals, formData } = data;
  const totalEmissions = totals.total;
  const now = new Date();
  const reportDate = now.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  const scopeData = [
    {
      scope: '1',
      description: 'Direct GHG emissions',
      emissions: totals.byScope['1'] || 0,
      category: 'Own operations'
    },
    {
      scope: '2', 
      description: 'Indirect GHG emissions from energy consumption',
      emissions: totals.byScope['2'] || 0,
      category: 'Energy consumption'
    },
    {
      scope: '3',
      description: 'Other indirect GHG emissions',
      emissions: totals.byScope['3'] || 0,
      category: 'Value chain'
    }
  ];

  const topChannels = Object.entries(totals.byChannel)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSRD Sustainability Report - ${formData.companyName}</title>
    <style>
        /* CSS Variables for CSRD theming - Gray White Green */
        :root {
            --primary-dark: #2d2d2d;
            --primary-green: #22c55e;
            --white: #FFFFFF;
            --dark-text: #1a1a1a;
            --light-gray: #F7F7F7;
            --medium-gray: #CCCCCC;
            --dark-gray: #666666;
            --light-green: #dcfce7;
            --subtitle-gray: #555555;
            --green: #22c55e;
            --dark-green: #16a34a;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            line-height: 1.5;
            color: var(--dark-text);
            background: white;
        }

        @page {
            size: A4;
            margin: 20mm;
        }

        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-break { page-break-before: always; }
            .no-break { page-break-inside: avoid; }
        }

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
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--dark-gray) 100%);
            color: var(--white);
            padding: 40px 30px;
            position: relative;
            margin: -20px -20px 30px -20px;
        }

        .eu-stars {
            position: absolute;
            top: 20px;
            right: 30px;
            width: 40px;
            height: 40px;
            background: var(--green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
            font-weight: bold;
            color: var(--white);
        }

        .main-title {
            font-size: 32pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .sub-title {
            font-size: 18pt;
            font-weight: normal;
            opacity: 0.9;
        }

        /* Section headers */
        .section-header {
            background: var(--primary-dark);
            color: var(--white);
            padding: 15px 20px;
            font-size: 14pt;
            font-weight: bold;
            margin: 25px 0 15px 0;
            position: relative;
        }

        .section-header::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -5px;
            width: 100%;
            height: 5px;
            background: var(--green);
        }

        .subsection-header {
            color: var(--primary-dark);
            font-size: 12pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            border-left: 4px solid var(--green);
            padding-left: 15px;
        }

        /* CSRD specific elements */
        .csrd-badge {
            background: var(--green);
            color: var(--white);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 9pt;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
        }

        .sustainability-metric {
            background: var(--light-green);
            border: 2px solid var(--green);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }

        .metric-title {
            color: var(--dark-green);
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .metric-value {
            font-size: 28pt;
            font-weight: bold;
            color: var(--dark-text);
        }

        .metric-unit {
            font-size: 14pt;
            color: var(--subtitle-gray);
            margin-left: 8px;
        }

        .metric-description {
            font-size: 9pt;
            color: var(--subtitle-gray);
            margin-top: 10px;
        }

        /* Tables */
        .csrd-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 9pt;
        }

        .csrd-table th {
            background: var(--primary-dark);
            color: var(--white);
            padding: 12px 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid var(--medium-gray);
        }

        .csrd-table td {
            padding: 10px;
            border: 1px solid var(--medium-gray);
            vertical-align: top;
        }

        .csrd-table tr:nth-child(even) {
            background: var(--light-gray);
        }

        .paragraph {
            margin-bottom: 15px;
            text-align: justify;
            line-height: 1.6;
        }

        .double-materiality-box {
            background: linear-gradient(90deg, var(--light-green) 0%, var(--light-gray) 100%);
            border: 3px solid var(--green);
            padding: 25px;
            margin: 25px 0;
            border-radius: 10px;
        }

        .materiality-title {
            color: var(--dark-green);
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .company-info-csrd {
            background: var(--primary-dark);
            color: var(--white);
            padding: 30px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .company-name-csrd {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .company-detail-csrd {
            font-size: 12pt;
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .esrs-reference {
            background: var(--light-gray);
            border-left: 5px solid var(--green);
            padding: 15px;
            margin: 15px 0;
            font-size: 9pt;
        }

        .esrs-title {
            font-weight: bold;
            color: var(--dark-green);
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- COVER PAGE -->
        <div class="cover-header">
            <div class="eu-stars">EU</div>
            <div class="main-title">CSRD SUSTAINABILITY REPORT</div>
            <div class="sub-title">Corporate Sustainability Reporting Directive</div>
            <div class="csrd-badge">ESRS E1 - Climate Change</div>
        </div>

        <div class="company-info-csrd">
            <div class="company-name-csrd">${formData.companyName}</div>
            <div class="company-detail-csrd">Reporting Period: ${organization.period || '2024'}</div>
            <div class="company-detail-csrd">Report Date: ${reportDate}</div>
            <div class="company-detail-csrd">Prepared by: ${formData.name}</div>
            <div class="company-detail-csrd">CSRD Article 19a & 29a Compliance</div>
        </div>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section-header">EXECUTIVE SUMMARY</div>
        
        <div class="content-section">
            <div class="paragraph">
                This report presents ${formData.companyName}'s sustainability disclosures for marketing activities 
                in accordance with the Corporate Sustainability Reporting Directive (CSRD) and European Sustainability 
                Reporting Standards (ESRS), specifically ESRS E1 on Climate Change.
            </div>
            
            <div class="paragraph">
                Our assessment demonstrates our commitment to the EU's sustainable finance framework and contributes 
                to the transition towards a more sustainable economy as outlined in the European Green Deal.
            </div>
        </div>

        <!-- DOUBLE MATERIALITY -->
        <div class="section-header">DOUBLE MATERIALITY ASSESSMENT</div>

        <div class="double-materiality-box">
            <div class="materiality-title">Climate Change - Marketing Operations</div>
            <div class="paragraph">
                <strong>Impact Materiality:</strong> Marketing activities contribute to climate change through 
                greenhouse gas emissions across the value chain, affecting global temperature rise and 
                environmental sustainability.
            </div>
            <div class="paragraph">
                <strong>Financial Materiality:</strong> Climate-related risks and opportunities affect our 
                business model, including transition risks from carbon pricing and physical risks from 
                climate change impacts.
            </div>
        </div>

        <!-- KEY METRICS -->
        <div class="section-header">KEY SUSTAINABILITY METRICS</div>

        <div class="sustainability-metric">
            <div class="metric-title">Total GHG Emissions from Marketing</div>
            <div>
                <span class="metric-value">${totalEmissions.toFixed(2)}</span>
                <span class="metric-unit">tCO₂e</span>
            </div>
            <div class="metric-description">
                Scope 1, 2 & 3 emissions from ${activities.length} marketing activities
            </div>
        </div>

        <!-- ESRS E1 DISCLOSURES -->
        <div class="section-header">ESRS E1 - CLIMATE CHANGE DISCLOSURES</div>

        <div class="esrs-reference">
            <div class="esrs-title">ESRS E1-1: Transition Plan for Climate Change Mitigation</div>
            Marketing operations transition plan includes decarbonization targets, sustainable 
            technology adoption, and value chain engagement strategies.
        </div>

        <table class="csrd-table">
            <thead>
                <tr>
                    <th style="width: 30%;">ESRS Disclosure Requirement</th>
                    <th style="width: 20%;">Reference</th>
                    <th style="width: 50%;">Marketing Context</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>E1-1 Transition Plan</strong></td>
                    <td>ESRS E1</td>
                    <td>Marketing decarbonization strategy and implementation roadmap</td>
                </tr>
                <tr>
                    <td><strong>E1-4 GHG Emissions Targets</strong></td>
                    <td>ESRS E1</td>
                    <td>Science-based targets for marketing emission reductions</td>
                </tr>
                <tr>
                    <td><strong>E1-6 GHG Emissions</strong></td>
                    <td>ESRS E1</td>
                    <td>Scope 1, 2 & 3 emissions from marketing activities: ${totalEmissions.toFixed(2)} tCO₂e</td>
                </tr>
                <tr>
                    <td><strong>E1-7 GHG Removals</strong></td>
                    <td>ESRS E1</td>
                    <td>Carbon removal initiatives and offset projects (planned)</td>
                </tr>
            </tbody>
        </table>

        <!-- SCOPE BREAKDOWN -->
        <div class="section-header">GREENHOUSE GAS EMISSIONS BY SCOPE</div>

        <table class="csrd-table">
            <thead>
                <tr>
                    <th style="width: 15%;">Scope</th>
                    <th style="width: 40%;">Description</th>
                    <th style="width: 20%;">Emissions (tCO₂e)</th>
                    <th style="width: 25%;">ESRS Category</th>
                </tr>
            </thead>
            <tbody>
                ${scopeData.map(scope => `
                <tr>
                    <td><strong>Scope ${scope.scope}</strong></td>
                    <td>${scope.description}</td>
                    <td>${scope.emissions.toFixed(2)}</td>
                    <td>${scope.category}</td>
                </tr>
                `).join('')}
                <tr style="background: var(--light-green); font-weight: bold;">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>All Marketing Emissions</strong></td>
                    <td><strong>${totalEmissions.toFixed(2)}</strong></td>
                    <td><strong>Combined</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- VALUE CHAIN ANALYSIS -->
        <div class="section-header">VALUE CHAIN IMPACT ANALYSIS</div>

        <div class="paragraph">
            As required by ESRS E1-6, we assess the impact of our marketing activities across the value chain:
        </div>

        ${topChannels.length > 0 ? `
        <table class="csrd-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Marketing Channel</th>
                    <th style="width: 20%;">Emissions (tCO₂e)</th>
                    <th style="width: 15%;">Value Chain Stage</th>
                    <th style="width: 40%;">Sustainability Impact</th>
                </tr>
            </thead>
            <tbody>
                ${topChannels.map(([channel, emissions]) => `
                <tr>
                    <td>${channel}</td>
                    <td>${emissions.toFixed(3)}</td>
                    <td>Downstream</td>
                    <td>Consumer engagement and behavioral influence</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <!-- GOVERNANCE -->
        <div class="section-header">SUSTAINABILITY GOVERNANCE</div>

        <div class="esrs-reference">
            <div class="esrs-title">ESRS 2-GOV-1: Role of Administrative, Management and Supervisory Bodies</div>
            Oversight of sustainability matters including climate-related risks and opportunities in marketing operations.
        </div>

        <table class="csrd-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Governance Level</th>
                    <th style="width: 45%;">Responsibility</th>
                    <th style="width: 30%;">ESRS Reference</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Board Level</strong></td>
                    <td>Strategic oversight of sustainability and climate risks</td>
                    <td>ESRS 2-GOV-1</td>
                </tr>
                <tr>
                    <td><strong>Executive Level</strong></td>
                    <td>Implementation of sustainability policies</td>
                    <td>ESRS 2-GOV-2</td>
                </tr>
                <tr>
                    <td><strong>Operational Level</strong></td>
                    <td>Day-to-day sustainability management</td>
                    <td>ESRS 2-GOV-3</td>
                </tr>
            </tbody>
        </table>

        <!-- TARGETS AND COMMITMENTS -->
        <div class="section-header">TARGETS AND COMMITMENTS</div>

        <div class="esrs-reference">
            <div class="esrs-title">ESRS E1-4: Targets Related to Climate Change Mitigation</div>
            Science-based targets for reducing marketing-related greenhouse gas emissions aligned with 1.5°C pathway.
        </div>

        <div class="paragraph">
            ${formData.companyName} commits to the following climate targets for marketing operations:
        </div>

        <ul style="margin: 15px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Achieve net-zero marketing emissions by 2050</li>
            <li style="margin: 8px 0;">Reduce Scope 1 & 2 emissions by 50% by 2030 (vs. 2024 baseline)</li>
            <li style="margin: 8px 0;">Reduce Scope 3 emissions by 30% by 2030 (vs. 2024 baseline)</li>
            <li style="margin: 8px 0;">100% renewable energy for marketing operations by 2028</li>
            <li style="margin: 8px 0;">Science-based targets validation by SBTi by 2025</li>
        </ul>

        <!-- FORWARD-LOOKING INFORMATION -->
        <div class="section-header">FORWARD-LOOKING INFORMATION</div>

        <div class="esrs-reference">
            <div class="esrs-title">ESRS 2-BP-1: General Basis for Preparation</div>
            Forward-looking information based on reasonable assumptions about future developments.
        </div>

        <div class="paragraph">
            Our projections for marketing sustainability improvements include:
        </div>

        <table class="csrd-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Time Horizon</th>
                    <th style="width: 40%;">Planned Actions</th>
                    <th style="width: 20%;">Expected Impact</th>
                    <th style="width: 20%;">Risk Factors</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>2025-2027</strong></td>
                    <td>Digital transformation and efficiency improvements</td>
                    <td>15% emission reduction</td>
                    <td>Technology availability</td>
                </tr>
                <tr>
                    <td><strong>2028-2030</strong></td>
                    <td>Renewable energy transition and supplier engagement</td>
                    <td>35% emission reduction</td>
                    <td>Supply chain cooperation</td>
                </tr>
                <tr>
                    <td><strong>2031-2050</strong></td>
                    <td>Carbon neutrality and regenerative practices</td>
                    <td>Net-zero achievement</td>
                    <td>Regulatory changes</td>
                </tr>
            </tbody>
        </table>

        <!-- COMPLIANCE STATEMENT -->
        <div class="section-header">CSRD COMPLIANCE STATEMENT</div>

        <div class="double-materiality-box">
            <div class="materiality-title">DECLARATION OF COMPLIANCE</div>
            <div class="paragraph">
                This sustainability report has been prepared in accordance with the Corporate Sustainability 
                Reporting Directive (EU) 2022/2464 and the European Sustainability Reporting Standards (ESRS). 
                The information presented provides a true and fair view of ${formData.companyName}'s sustainability 
                performance for marketing operations during the reporting period ${organization.period || '2024'}.
            </div>
            
            <div style="margin-top: 20px;">
                <div style="display: inline-block; margin-right: 50px;"><strong>Prepared by:</strong> ${formData.name}</div>
                <div style="display: inline-block;"><strong>Date:</strong> ${reportDate}</div>
            </div>
        </div>

    </div>
</body>
</html>`
};

// CSRD PDF generation function using Puppeteer
const generateCSRDPDFFromHTML = async (data: PDFGenerationData): Promise<Uint8Array> => {
  let browser;
  
  try {
    const htmlContent = generateCSRDHTMLTemplate(data);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%;">
          <div style="text-align: center;">CSRD Sustainability Report - ${data.formData.companyName}</div>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%; display: flex; justify-content: space-between;">
          <span>Generated by CarbonCut Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    });

    return new Uint8Array(pdfBuffer);

  } catch (error) {
    console.error('Error generating CSRD PDF with Puppeteer:', error);
    throw new Error(`CSRD PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const generateCSRDReport = async (data: PDFGenerationData): Promise<Uint8Array> => {
  return await generateCSRDPDFFromHTML(data);
};

export { generateCSRDHTMLTemplate, generateCSRDPDFFromHTML };
export default generateCSRDReport;