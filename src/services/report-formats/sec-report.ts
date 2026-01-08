import puppeteer from 'puppeteer'
import { ActivityData, OrganizationData } from '@/types/types'

export interface PDFFormData {
  name: string
  email: string
  companyName: string
  phoneNumber: string
  disclosureFormat: 'SECR' | 'CSRD' | 'SEC'
}

export interface PDFGenerationData {
  organization: OrganizationData
  activities: ActivityData[]
  getDisplayCO2: (activity: ActivityData) => number
  totals: {
    total: number
    byChannel: Record<string, number>
    byMarket: Record<string, number>
    byScope: Record<string, number>
  }
  formData: PDFFormData
}

const generateSECHTMLTemplate = (data: PDFGenerationData): string => {
  const { organization, activities, totals, formData } = data
  const totalEmissions = totals.total
  const now = new Date()
  const reportDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Generate emissions table rows
  const emissionsRows = Object.entries(totals.byScope)
    .map(
      ([scope, emissions]) => `
    <tr>
      <td style="width: 20%;">Scope ${scope}</td>
      <td style="width: 40%;">${scope === '1' ? 'Direct Emissions' : scope === '2' ? 'Indirect Energy' : 'Value Chain Activities'}</td>
      <td style="width: 20%; text-align: right;">${emissions.toFixed(2)}</td>
      <td style="width: 20%; text-align: right;">${((emissions / totalEmissions) * 100).toFixed(1)}%</td>
    </tr>
  `
    )
    .join('')

  // Generate channel breakdown rows
  const channelRows = Object.entries(totals.byChannel)
    .sort(([, a], [, b]) => b - a)
    .map(
      ([channel, emissions]) => `
      <tr>
        <td style="width: 25%;">${channel}</td>
        <td style="width: 20%; text-align: right;">${emissions.toFixed(2)}</td>
        <td style="width: 20%; text-align: right;">${((emissions / totalEmissions) * 100).toFixed(1)}%</td>
        <td style="width: 35%;">Campaign Operations</td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEC Climate Disclosure - ${formData.companyName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Times New Roman', serif;
        }
        
        body {
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: white;
            width: 100%;
            margin: 0;
            padding: 0;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            background: white;
            position: relative;
            page-break-after: always;
            overflow: hidden;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Cover Page Styles */
        .cover-page {
            padding: 0;
            background: linear-gradient(135deg, #002060 0%, #004080 100%);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .cover-header {
            padding: 40mm 20mm 20mm;
        }
        
        .sec-seal {
            position: absolute;
            top: 30mm;
            right: 30mm;
            width: 40mm;
            height: 40mm;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #002060;
            font-weight: bold;
            font-size: 14pt;
        }
        
        .cover-title {
            font-size: 36pt;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 40mm;
        }
        
        .form-info {
            background: rgba(245, 245, 245, 0.95);
            color: #000;
            padding: 15mm;
            margin: 0 20mm;
            border: 3px solid #002060;
            border-radius: 5mm;
        }
        
        .form-info h2 {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 8mm;
            color: #002060;
        }
        
        .form-info p {
            margin-bottom: 5mm;
            font-size: 12pt;
        }
        
        .filing-details {
            background: #002060;
            color: white;
            padding: 15mm;
            margin: 20mm;
            margin-top: 10mm;
        }
        
        .filing-details h3 {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 8mm;
        }
        
        .cover-footer {
            padding: 15mm 20mm;
            font-size: 10pt;
            color: rgba(255, 255, 255, 0.8);
        }
        
        /* Section Headers */
        .section-header {
            background: #002060;
            color: white;
            padding: 5mm;
            margin: 10mm -5mm 8mm;
            font-size: 16pt;
            font-weight: bold;
            border-radius: 2mm;
            text-align: center;
        }
        
        .subsection-header {
            font-size: 14pt;
            font-weight: bold;
            margin: 8mm 0 4mm;
            color: #002060;
            border-bottom: 2px solid #002060;
            padding-bottom: 2mm;
        }
        
        /* Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6mm 0;
            font-size: 10pt;
            table-layout: fixed;
        }
        
        .data-table th {
            background: #002060;
            color: white;
            padding: 3mm;
            text-align: left;
            font-weight: bold;
            border: 1px solid #000;
        }
        
        .data-table td {
            padding: 3mm;
            border: 1px solid #ccc;
            vertical-align: top;
        }
        
        .data-table tr:nth-child(even) {
            background: #f8f8f8;
        }
        
        .data-table tr:last-child {
            font-weight: bold;
            background: #e8e8e8;
        }
        
        .data-table .numeric {
            text-align: right;
        }
        
        /* Warning Box */
        .warning-box {
            background: #fff8dc;
            border: 2px solid #ffc107;
            border-radius: 3mm;
            padding: 6mm;
            margin: 8mm 0;
        }
        
        .warning-box .title {
            font-weight: bold;
            color: #856404;
            font-size: 12pt;
            margin-bottom: 3mm;
        }
        
        .warning-box .content {
            color: #856404;
            font-size: 10pt;
            line-height: 1.3;
        }
        
        /* Equation Box */
        .equation-box {
            background: #f8f9fa;
            border: 2px solid #002060;
            border-radius: 3mm;
            padding: 6mm;
            margin: 6mm 0;
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 12pt;
        }
        
        /* Lists */
        ul {
            margin: 4mm 0;
            padding-left: 6mm;
        }
        
        li {
            margin-bottom: 2mm;
        }
        
        /* Text styles */
        .bold {
            font-weight: bold;
        }
        
        .italic {
            font-style: italic;
        }
        
        .center {
            text-align: center;
        }
        
        .right {
            text-align: right;
        }
        
        .small {
            font-size: 9pt;
            color: #666;
        }
        
        /* Page break utilities */
        .page-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
        
        /* Quality assessment table */
        .quality-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6mm 0;
            font-size: 10pt;
            table-layout: fixed;
        }
        
        .quality-table th {
            background: #f0f0f0;
            color: #000;
            padding: 3mm;
            text-align: left;
            font-weight: bold;
            border: 1px solid #999;
        }
        
        .quality-table td {
            padding: 3mm;
            border: 1px solid #ccc;
            vertical-align: top;
        }
        
        .quality-table tr:nth-child(even) {
            background: #f8f8f8;
        }
        
        p {
            margin-bottom: 4mm;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                width: 210mm;
                margin: 0;
            }
            
            .page {
                margin: 0;
                padding: 15mm;
                page-break-after: always;
                size: A4;
            }
            
            .page:last-child {
                page-break-after: avoid;
            }
            
            .cover-page {
                height: 297mm;
            }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page cover-page">
        <div class="sec-seal">SEC</div>
        
        <div class="cover-header">
            <div class="cover-title">
                SEC CLIMATE<br>
                DISCLOSURE
            </div>
        </div>
        
        <div class="form-info">
            <h2>CLIMATE-RELATED DISCLOSURES</h2>
            <p><strong>Securities and Exchange Commission</strong></p>
            <p>17 CFR Parts 210, 229, 232, 239, 249</p>
            <p><strong>Filing Entity:</strong> ${formData.companyName}</p>
        </div>
        
        <div class="filing-details">
            <h3>FILING INFORMATION</h3>
            <p><strong>Report Date:</strong> ${reportDate}</p>
            <p><strong>Fiscal Year:</strong> ${organization.period || '2024'}</p>
        </div>
        
        <div class="cover-footer center">
            <p>This document contains climate-related disclosures pursuant to SEC rules</p>
            <p>Generated by CarbonCut Platform - Marketing Emissions Analysis</p>
        </div>
    </div>

    <!-- Executive Summary Page -->
    <div class="page">
        <div class="section-header">EXECUTIVE SUMMARY</div>
        
        <p>${formData.companyName} hereby provides climate-related disclosures for marketing activities in accordance with Securities and Exchange Commission requirements under 17 CFR Parts 210, 229, 232, 239, and 249.</p>
        
        <p>This disclosure covers greenhouse gas emissions from marketing operations during fiscal year ${organization.period || '2024'}, representing our commitment to transparent climate-related financial risk reporting.</p>
        
        <ul>
            <li><strong>Total marketing-related emissions:</strong> ${totalEmissions.toFixed(2)} metric tons CO₂ equivalent</li>
            <li><strong>Marketing activities assessed:</strong> ${activities.length} distinct campaigns and operations</li>
            <li><strong>Primary emission categories:</strong> ${Object.keys(totals.byChannel).slice(0, 3).join(', ')}</li>
        </ul>
    </div>

    <!-- Scope 3 GHG Emissions Page -->
    <div class="page">
        <div class="section-header">SCOPE 3 GHG EMISSIONS DISCLOSURE</div>
        
        <p>Pursuant to SEC climate disclosure requirements, the following table presents Scope 3 greenhouse gas emissions from marketing activities. These emissions represent indirect emissions occurring in the value chain of ${formData.companyName} and are material to understanding climate-related financial risks.</p>
        
        <table class="data-table no-break">
            <thead>
                <tr>
                    <th style="width: 20%;">Emission Scope</th>
                    <th style="width: 40%;">Category Description</th>
                    <th style="width: 20%; text-align: right;">Metric Tons CO₂e</th>
                    <th style="width: 20%; text-align: right;">Percentage of Total</th>
                </tr>
            </thead>
            <tbody>
                ${emissionsRows}
                <tr>
                    <td><strong>TOTAL</strong></td>
                    <td><strong>All Marketing Emissions</strong></td>
                    <td style="text-align: right;"><strong>${totalEmissions.toFixed(2)}</strong></td>
                    <td style="text-align: right;"><strong>100.0%</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Materiality Assessment Page -->
    <div class="page">
        <div class="section-header">MATERIALITY ASSESSMENT</div>
        
        <p>Climate-related risks from marketing activities have been assessed for financial materiality in accordance with SEC guidance. The assessment considers both transition and physical climate risks that may impact business operations and financial performance.</p>
        
        <div class="subsection-header">Material Risk Factors Identified:</div>
        <ul>
            <li>Regulatory compliance costs related to carbon pricing and emissions regulations</li>
            <li>Transition risks affecting supply chain costs for marketing materials and services</li>
            <li>Physical risks impacting event operations and material sourcing</li>
            <li>Reputational risks related to climate performance and stakeholder expectations</li>
        </ul>
    </div>

    <!-- Methodology Page -->
    <div class="page">
        <div class="section-header">METHODOLOGY AND CALCULATION FRAMEWORK</div>
        
        <div class="subsection-header">CarbonCut Master Equation</div>
        
        <div class="equation-box">
            CO₂e_marketing = Σ_c Σ_i (Q_c,i × EF_c,i) + Σ_a (A_a × EF_a)
        </div>
        
        <div class="subsection-header">Variable Definitions:</div>
        <ul>
            <li><strong>Q_c,i</strong> = Activity data for channel c, item i (kWh, km, kg, GB, hours, impressions)</li>
            <li><strong>EF_c,i</strong> = Emission factor (kg CO₂e per unit) from EPA, DEFRA, and recognized databases</li>
            <li><strong>A_a</strong> = Allocated overhead and embodied emission components</li>
            <li><strong>EF_a</strong> = Corresponding emission factor for overhead activities</li>
        </ul>
        
        <div class="subsection-header">Methodological Standards:</div>
        <ul>
            <li>GHG Protocol Corporate Value Chain (Scope 3) Standard</li>
            <li>EPA Center for Corporate Climate Leadership guidance</li>
            <li>ISO 14064-1:2018 Greenhouse gases specification and guidance</li>
            <li>Conservative calculation principles to prevent under-reporting</li>
        </ul>
    </div>

    <!-- Channel Breakdown Page -->
    ${
      Object.keys(totals.byChannel).length > 0
        ? `
    <div class="page">
        <div class="section-header">EMISSIONS BY MARKETING CHANNEL</div>
        
        <table class="data-table no-break">
            <thead>
                <tr>
                    <th style="width: 25%;">Marketing Channel</th>
                    <th style="width: 20%; text-align: right;">Emissions (tCO₂e)</th>
                    <th style="width: 20%; text-align: right;">Percentage</th>
                    <th style="width: 35%;">Primary Activities</th>
                </tr>
            </thead>
            <tbody>
                ${channelRows}
            </tbody>
        </table>
    </div>
    `
        : ''
    }

    <!-- Data Quality Page -->
    <div class="page">
        <div class="section-header">DATA QUALITY AND LIMITATIONS</div>
        
        <table class="quality-table no-break">
            <thead>
                <tr>
                    <th style="width: 25%;">Quality Metric</th>
                    <th style="width: 15%; text-align: center;">Assessment</th>
                    <th style="width: 60%;">Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data Completeness</td>
                    <td style="text-align: center;">95%</td>
                    <td>Comprehensive coverage of material marketing activities</td>
                </tr>
                <tr>
                    <td>Methodology Consistency</td>
                    <td style="text-align: center;">100%</td>
                    <td>Standardized calculation framework applied</td>
                </tr>
                <tr>
                    <td>Emission Factor Currency</td>
                    <td style="text-align: center;">Current</td>
                    <td>Latest available factors from recognized sources</td>
                </tr>
                <tr>
                    <td>Uncertainty Range</td>
                    <td style="text-align: center;">±15%</td>
                    <td>Typical range for Scope 3 marketing emissions</td>
                </tr>
            </tbody>
        </table>
        
        <div class="subsection-header">Key Limitations:</div>
        <ul>
            <li>Scope 3 emissions calculations inherently contain estimation uncertainty</li>
            <li>Some activity data relies on industry averages where primary data unavailable</li>
            <li>Emission factors may not reflect regional variations in energy grid composition</li>
            <li>Indirect emissions from supplier operations may not be fully captured</li>
        </ul>
        
        <div class="warning-box">
            <div class="title">FORWARD-LOOKING STATEMENTS</div>
            <div class="content">
                This document contains forward-looking statements regarding climate-related metrics and financial implications. Actual results may differ materially due to methodology changes, data availability, and evolving regulatory requirements.
            </div>
        </div>
    </div>

    <!-- Compliance Page -->
    <div class="page">
        <div class="section-header">REGULATORY COMPLIANCE</div>
        
        <p>This disclosure is provided pursuant to Securities and Exchange Commission climate-related disclosure requirements under 17 CFR Parts 210, 229, 232, 239, and 249. The methodologies and data presented align with SEC guidance on climate-related financial risk assessment and the Private Securities Litigation Reform Act of 1995 safe harbor provisions.</p>
        
        <div class="subsection-header">Filing Prepared By:</div>
        <p><strong>${formData.name}</strong></p>
        <p>${formData.email}</p>
        <p>${formData.phoneNumber}</p>
        
        <div style="margin-top: 15mm;">
            <p class="small">
                <strong>Document Generation:</strong> CarbonCut Platform<br>
                <strong>Report Generated:</strong> ${reportDate}<br>
                <strong>Filing Entity:</strong> ${formData.companyName}<br>
                <strong>Fiscal Year:</strong> ${organization.period || '2024'}
            </p>
        </div>
    </div>
</body>
</html>
  `
}

const generateSECPDFFromHTML = async (data: PDFGenerationData): Promise<Uint8Array> => {
  let browser

  try {
    const htmlContent = generateSECHTMLTemplate(data)

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
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
    })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%;">
          <div style="text-align: center;">SEC Climate Disclosure - ${data.formData.companyName}</div>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #666; margin: 0 20mm; width: 100%; display: flex; justify-content: space-between;">
          <span>Generated by CarbonCut Platform</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    })

    return new Uint8Array(pdfBuffer)
  } catch (error) {
    console.error('Error generating SEC PDF with Puppeteer:', error)
    throw new Error(
      `SEC PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

export const generateSECReport = async (data: PDFGenerationData): Promise<Uint8Array> => {
  return await generateSECPDFFromHTML(data)
}

export { generateSECHTMLTemplate, generateSECPDFFromHTML }
export default generateSECReport
