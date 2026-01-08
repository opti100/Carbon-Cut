import { ActivityData, OrganizationData } from '@/types/types'
import puppeteer from 'puppeteer'

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

const generateSECRHTMLTemplate = (data: PDFGenerationData): string => {
  const { organization, activities, getDisplayCO2, totals, formData } = data
  const totalEmissions = totals.total
  const now = new Date()
  const reportDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Calculate scope data
  const scopeData = [
    {
      scope: '1',
      description: 'Direct emissions from owned/controlled sources',
      emissions: totals.byScope['1'] || 0,
      category: 'Fuels',
    },
    {
      scope: '2',
      description: 'Indirect emissions from purchased energy',
      emissions: totals.byScope['2'] || 0,
      category: 'Electricity',
    },
    {
      scope: '3',
      description: 'Other indirect emissions in value chain',
      emissions: totals.byScope['3'] || 0,
      category: 'Business Travel/Materials',
    },
  ]

  // Top marketing channels
  const topChannels = Object.entries(totals.byChannel)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Sample activities
  const sampleActivities = activities
    .sort((a, b) => getDisplayCO2(b) - getDisplayCO2(a))
    .slice(0, 15)

  return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SECR Compliance Report - Example Company Ltd</title>
    <style>
        /* CSS Variables for consistent theming */
        :root {
            --primary-navy: #003366;
            --secondary-blue: #0066CC;
            --accent-blue: #E6F3FF;
            --white: #FFFFFF;
            --text-dark: #1A1A1A;
            --text-medium: #4A4A4A;
            --text-light: #666666;
            --border-light: #E0E0E0;
            --border-medium: #CCCCCC;
            --background-light: #F8F9FA;
            --background-accent: #F5F7FA;
        }

        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.6;
            color: var(--text-dark);
            background: var(--white);
            max-width: 210mm;
            margin: 0 auto;
            padding: 25mm;
        }

        /* Print-specific styles */
        @media print {
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                margin: 0;
                padding: 20mm;
                font-size: 10pt;
            }
            .page-break { 
                page-break-before: always; 
            }
            .no-break { 
                page-break-inside: avoid; 
            }
        }

        /* Document header */
        .document-header {
            text-align: center;
            border-bottom: 3px solid var(--primary-navy);
            padding-bottom: 30px;
            margin-bottom: 40px;
        }

        .gov-identifier {
            font-size: 10pt;
            color: var(--text-medium);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .main-title {
            font-size: 28pt;
            font-weight: bold;
            color: var(--primary-navy);
            margin-bottom: 8px;
        }

        .report-subtitle {
            font-size: 16pt;
            color: var(--text-medium);
            font-weight: normal;
        }

        /* Company information box */
        .company-info-box {
            background: var(--background-accent);
            border: 1px solid var(--border-medium);
            padding: 25px;
            margin: 30px 0;
        }

        .company-name {
            font-size: 18pt;
            font-weight: bold;
            color: var(--primary-navy);
            margin-bottom: 15px;
        }

        .report-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 10pt;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
        }

        .detail-label {
            font-weight: bold;
            color: var(--text-medium);
        }

        /* Section headers */
        .section-title {
            font-size: 16pt;
            font-weight: bold;
            color: var(--primary-navy);
            border-bottom: 2px solid var(--primary-navy);
            padding-bottom: 8px;
            margin: 35px 0 20px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            color: var(--text-dark);
            margin: 25px 0 12px 0;
        }

        /* Content styling */
        .paragraph {
            margin-bottom: 15px;
            text-align: justify;
            line-height: 1.7;
        }

        /* Key metrics highlight */
        .key-metrics {
            background: var(--white);
            border: 2px solid var(--primary-navy);
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }

        .metric-title {
            font-size: 12pt;
            color: var(--text-medium);
            margin-bottom: 10px;
        }

        .metric-value {
            font-size: 36pt;
            font-weight: bold;
            color: var(--primary-navy);
        }

        .metric-unit {
            font-size: 14pt;
            color: var(--text-medium);
            margin-left: 8px;
        }

        .metric-description {
            font-size: 10pt;
            color: var(--text-light);
            margin-top: 10px;
        }

        /* Professional tables */
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10pt;
            border: 1px solid var(--border-medium);
        }

        .report-table th {
            background: var(--primary-navy);
            color: var(--white);
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .report-table td {
            padding: 10px 8px;
            border-bottom: 1px solid var(--border-light);
            vertical-align: top;
        }

        .report-table tr:nth-child(even) {
            background: var(--background-light);
        }

        .report-table .total-row {
            background: var(--accent-blue);
            font-weight: bold;
            border-top: 2px solid var(--primary-navy);
        }

        .report-table .numeric {
            text-align: right;
            font-family: 'Courier New', monospace;
        }

        /* Lists */
        .compliance-list {
            margin: 15px 0;
            padding-left: 0;
            list-style: none;
        }

        .compliance-item {
            margin: 8px 0;
            padding-left: 25px;
            position: relative;
            line-height: 1.6;
        }

        .compliance-item::before {
            content: "▪";
            position: absolute;
            left: 8px;
            color: var(--primary-navy);
            font-weight: bold;
        }

        /* Methodology box */
        .methodology-box {
            background: var(--background-light);
            border-left: 4px solid var(--secondary-blue);
            padding: 20px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }

        /* Declaration section */
        .declaration-section {
            background: var(--accent-blue);
            border: 2px solid var(--primary-navy);
            padding: 30px;
            margin: 40px 0;
        }

        .declaration-title {
            font-size: 14pt;
            font-weight: bold;
            color: var(--primary-navy);
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .signature-area {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .signature-block {
            border-top: 1px solid var(--text-medium);
            padding-top: 10px;
        }

        .signature-label {
            font-size: 9pt;
            color: var(--text-medium);
            text-transform: uppercase;
        }

        .signature-name {
            font-weight: bold;
            margin-top: 5px;
        }

        /* Footer */
        .document-footer {
            position: fixed;
            bottom: 15mm;
            left: 20mm;
            right: 20mm;
            font-size: 8pt;
            color: var(--text-light);
            border-top: 1px solid var(--border-light);
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
        }

        /* Utility classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .no-break { page-break-inside: avoid; }
    </style>
</head>
<body>
    <div class="document">
        
        <!-- DOCUMENT HEADER -->
        <div class="document-header">
            <div class="gov-identifier">UK Government • Department for Business, Energy & Industrial Strategy</div>
            <div class="main-title">STREAMLINED ENERGY AND CARBON REPORTING</div>
            <div class="report-subtitle">Companies Act 2006 Compliance Report</div>
        </div>

        <!-- COMPANY INFORMATION -->
        <div class="company-info-box no-break">
            <div class="company-name">Example Company Ltd</div>
            <div class="report-details">
                <div class="detail-item">
                    <span class="detail-label">Company Registration:</span>
                    <span>12345678</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Reporting Period:</span>
                    <span>1 April 2023 - 31 March 2024</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Financial Year End:</span>
                    <span>31 March 2024</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Report Date:</span>
                    <span>30 June 2024</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prepared by:</span>
                    <span>Sustainability Department</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Methodology:</span>
                    <span>GHG Protocol + DEFRA 2023</span>
                </div>
            </div>
        </div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section-title">Executive Summary</div>
        
        <div class="paragraph">
            This report presents Example Company Ltd's energy consumption and associated greenhouse gas emissions for the financial year ending 31 March 2024, prepared in accordance with the Streamlined Energy and Carbon Reporting (SECR) requirements under the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013.
        </div>
        
        <div class="paragraph">
            The company has assessed its UK energy use and emissions using methodologies consistent with the GHG Protocol Corporate Standard and the latest DEFRA greenhouse gas conversion factors. This disclosure demonstrates our commitment to transparency and environmental stewardship in line with UK regulatory requirements.
        </div>

        <!-- KEY PERFORMANCE INDICATOR -->
        <div class="key-metrics no-break">
            <div class="metric-title">Total Gross Emissions (Scope 1 & 2)</div>
            <div>
                <span class="metric-value">1,245.6</span>
                <span class="metric-unit">tCO₂e</span>
            </div>
            <div class="metric-description">
                Mandatory SECR disclosure covering all UK operations
            </div>
        </div>

        <!-- MANDATORY DISCLOSURES -->
        <div class="section-title">Mandatory SECR Disclosures</div>

        <table class="report-table no-break">
            <thead>
                <tr>
                    <th style="width: 35%;">Disclosure Requirement</th>
                    <th style="width: 65%;">Company Response</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Reporting Organisation</td>
                    <td>Example Company Ltd (Company No. 12345678)</td>
                </tr>
                <tr>
                    <td>Reporting Boundary</td>
                    <td>UK operations - All facilities under operational control</td>
                </tr>
                <tr>
                    <td>Methodology Applied</td>
                    <td>GHG Protocol Corporate Standard with DEFRA 2023 conversion factors</td>
                </tr>
                <tr>
                    <td>Base Year Established</td>
                    <td>Financial Year 2019-2020</td>
                </tr>
                <tr>
                    <td>Organisational Boundary</td>
                    <td>Operational control approach</td>
                </tr>
                <tr>
                    <td>Data Quality Assessment</td>
                    <td>Internal verification with documented procedures</td>
                </tr>
                <tr>
                    <td>External Assurance</td>
                    <td>Limited assurance planned for FY 2024-25</td>
                </tr>
            </tbody>
        </table>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- ENERGY CONSUMPTION -->
        <div class="section-title">UK Energy Consumption</div>

        <div class="paragraph">
            The following table details energy consumption across our UK operations during the reporting period, categorised according to SECR requirements.
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Energy Type</th>
                    <th style="width: 20%;">Consumption</th>
                    <th style="width: 15%;">Units</th>
                    <th style="width: 20%;">SECR Category</th>
                    <th style="width: 20%;">GHG Protocol Scope</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Grid Electricity</td>
                    <td class="numeric">1,250,000</td>
                    <td>kWh</td>
                    <td>Purchased Electricity</td>
                    <td>Scope 2</td>
                </tr>
                <tr>
                    <td>Natural Gas</td>
                    <td class="numeric">850,000</td>
                    <td>kWh</td>
                    <td>Combustion</td>
                    <td>Scope 1</td>
                </tr>
                <tr>
                    <td>Transport Fuel - Diesel</td>
                    <td class="numeric">95,000</td>
                    <td>Litres</td>
                    <td>Transport</td>
                    <td>Scope 1</td>
                </tr>
                <tr>
                    <td>Transport Fuel - Petrol</td>
                    <td class="numeric">42,000</td>
                    <td>Litres</td>
                    <td>Transport</td>
                    <td>Scope 1</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Energy Use</strong></td>
                    <td class="numeric"><strong>2,237,000</strong></td>
                    <td><strong>kWh (equiv.)</strong></td>
                    <td><strong>All Categories</strong></td>
                    <td><strong>Scopes 1 & 2</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- GREENHOUSE GAS EMISSIONS -->
        <div class="section-title">Greenhouse Gas Emissions</div>

        <div class="paragraph">
            Emissions calculations follow the GHG Protocol Corporate Standard methodology, using DEFRA's 2023 greenhouse gas conversion factors. The table below presents our mandatory Scope 1 and Scope 2 emissions.
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 15%;">Scope</th>
                    <th style="width: 40%;">Emission Source Description</th>
                    <th style="width: 20%;">Emissions (tCO₂e)</th>
                    <th style="width: 15%;">Percentage</th>
                    <th style="width: 10%;">Methodology</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Scope 1</strong></td>
                    <td>Direct emissions from owned/controlled sources:<br>
                        • Natural gas combustion<br>
                        • Company vehicle fleet<br>
                        • Process emissions</td>
                    <td class="numeric">458.3</td>
                    <td class="numeric">36.8%</td>
                    <td>DEFRA factors</td>
                </tr>
                <tr>
                    <td><strong>Scope 2</strong></td>
                    <td>Indirect emissions from purchased electricity:<br>
                        • Grid electricity consumption<br>
                        • Location-based method</td>
                    <td class="numeric">787.3</td>
                    <td class="numeric">63.2%</td>
                    <td>DEFRA factors</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>SECR Mandatory Reporting Scope</strong></td>
                    <td class="numeric"><strong>1,245.6</strong></td>
                    <td class="numeric"><strong>100.0%</strong></td>
                    <td><strong>Combined</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- METHODOLOGY -->
        <div class="section-title">Calculation Methodology</div>

        <div class="subsection-title">Emission Calculation Formula</div>

        <div class="methodology-box">
            GHG Emissions (tCO₂e) = Activity Data × Emission Factor × (1/1000)
            
            Where:
            - Activity Data = Measured energy consumption
            - Emission Factor = DEFRA 2023 conversion factor
            - Result converted from kg to tonnes
        </div>

        <div class="subsection-title">Applied Emission Factors</div>

        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 30%;">Energy Source</th>
                    <th style="width: 25%;">Emission Factor</th>
                    <th style="width: 20%;">Units</th>
                    <th style="width: 25%;">Reference Source</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>UK Grid Electricity</td>
                    <td class="numeric">0.193</td>
                    <td>kgCO₂e/kWh</td>
                    <td>DEFRA 2023 - Location-based</td>
                </tr>
                <tr>
                    <td>Natural Gas</td>
                    <td class="numeric">0.184</td>
                    <td>kgCO₂e/kWh</td>
                    <td>DEFRA 2023 - Gross CV</td>
                </tr>
                <tr>
                    <td>Diesel (Average biofuel blend)</td>
                    <td class="numeric">2.517</td>
                    <td>kgCO₂e/litre</td>
                    <td>DEFRA 2023 - WTT included</td>
                </tr>
                <tr>
                    <td>Petrol (Average biofuel blend)</td>
                    <td class="numeric">2.195</td>
                    <td>kgCO₂e/litre</td>
                    <td>DEFRA 2023 - WTT included</td>
                </tr>
            </tbody>
        </table>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- INTENSITY RATIO -->
        <div class="section-title">Emissions Intensity Ratio</div>

        <div class="paragraph">
            SECR regulations require disclosure of at least one emissions intensity ratio to provide context for emissions performance relative to a quantifiable factor associated with the company's activities.
        </div>

        <div class="key-metrics">
            <div class="metric-title">Emissions Intensity Ratio</div>
            <div>
                <span class="metric-value">0.025</span>
                <span class="metric-unit">tCO₂e per £1,000 turnover</span>
            </div>
            <div class="metric-description">
                Total gross emissions (Scope 1 + 2) normalised by annual turnover
            </div>
        </div>

        <!-- YEAR-ON-YEAR COMPARISON -->
        <div class="section-title">Year-on-Year Performance</div>

        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Financial Year</th>
                    <th style="width: 15%;">Scope 1 (tCO₂e)</th>
                    <th style="width: 15%;">Scope 2 (tCO₂e)</th>
                    <th style="width: 15%;">Total (tCO₂e)</th>
                    <th style="width: 15%;">Annual Change</th>
                    <th style="width: 20%;">Intensity Ratio</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2022-23</td>
                    <td class="numeric">485.6</td>
                    <td class="numeric">825.4</td>
                    <td class="numeric">1,311.0</td>
                    <td class="numeric">-</td>
                    <td class="numeric">0.027</td>
                </tr>
                <tr>
                    <td>2023-24</td>
                    <td class="numeric">458.3</td>
                    <td class="numeric">787.3</td>
                    <td class="numeric">1,245.6</td>
                    <td class="numeric">-5.0%</td>
                    <td class="numeric">0.025</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Net Change</strong></td>
                    <td class="numeric"><strong>-27.3</strong></td>
                    <td class="numeric"><strong>-38.1</strong></td>
                    <td class="numeric"><strong>-65.4</strong></td>
                    <td class="numeric"><strong>-5.0%</strong></td>
                    <td class="numeric"><strong>-7.4%</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- ENERGY EFFICIENCY ACTIONS -->
        <div class="section-title">Energy Efficiency Actions</div>

        <div class="paragraph">
            During the reporting period, the company implemented the following energy efficiency measures:
        </div>

        <ul class="compliance-list">
            <li class="compliance-item">Comprehensive LED lighting retrofit across all UK facilities (completion: September 2023)</li>
            <li class="compliance-item">Installation of intelligent HVAC control systems with occupancy-based operation</li>
            <li class="compliance-item">Implementation of remote working policy reducing office energy demand by 12%</li>
            <li class="compliance-item">Fleet modernisation programme with 15% conversion to hybrid/electric vehicles</li>
            <li class="compliance-item">Employee engagement programme promoting energy conservation behaviours</li>
            <li class="compliance-item">Equipment upgrade programme targeting high-efficiency alternatives</li>
        </ul>

        <!-- FUTURE COMMITMENTS -->
        <div class="section-title">Future Energy Efficiency Commitments</div>

        <div class="paragraph">
            The company commits to the following actions to further reduce energy consumption and associated emissions:
        </div>

        <ul class="compliance-list">
            <li class="compliance-item">Installation of 500kW solar photovoltaic system at primary manufacturing facility (target: Q3 2025)</li>
            <li class="compliance-item">Transition to renewable electricity supply through certified Power Purchase Agreement</li>
            <li class="compliance-item">Implementation of ISO 50001 Energy Management System certification programme</li>
            <li class="compliance-item">Fleet electrification programme targeting 50% zero-emission vehicles by 2027</li>
            <li class="compliance-item">Building envelope improvements to reduce heating and cooling demand</li>
            <li class="compliance-item">Supply chain engagement programme to address indirect emissions</li>
        </ul>

        <!-- PAGE BREAK -->
        <div class="page-break"></div>

        <!-- GOVERNANCE AND OVERSIGHT -->
        <div class="section-title">Governance and Oversight</div>

        <table class="report-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Governance Level</th>
                    <th style="width: 45%;">Responsibility</th>
                    <th style="width: 30%;">Accountable Party</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Board Level</td>
                    <td>Strategic oversight of climate-related risks and opportunities</td>
                    <td>Board of Directors</td>
                </tr>
                <tr>
                    <td>Executive Level</td>
                    <td>Operational management of energy and carbon performance</td>
                    <td>Chief Executive Officer</td>
                </tr>
                <tr>
                    <td>Operational Level</td>
                    <td>Data collection, analysis and performance monitoring</td>
                    <td>Sustainability Manager</td>
                </tr>
                <tr>
                    <td>Technical Level</td>
                    <td>Methodology review and calculation verification</td>
                    <td>Environmental Consultant</td>
                </tr>
                <tr>
                    <td>Reporting Level</td>
                    <td>Compliance reporting and regulatory submissions</td>
                    <td>Company Secretary</td>
                </tr>
            </tbody>
        </table>

        <!-- DIRECTORS' STATEMENT -->
        <div class="section-title">Directors' Statement</div>

        <div class="declaration-section">
            <div class="declaration-title">Statement of Directors' Responsibility</div>
            
            <div class="paragraph">
                The Directors of Example Company Ltd acknowledge their responsibility for preparing this Streamlined Energy and Carbon Report in accordance with the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013. The Directors confirm that, to the best of their knowledge:
            </div>

            <ul class="compliance-list">
                <li class="compliance-item">The energy and emissions data presented in this report is accurate and complete</li>
                <li class="compliance-item">The methodology applied is consistent with recognised standards and government guidance</li>
                <li class="compliance-item">Appropriate internal controls and procedures have been established for data collection and verification</li>
                <li class="compliance-item">This report provides a true and fair view of the company's UK energy use and associated greenhouse gas emissions</li>
            </ul>

            <div class="paragraph">
                The Board is committed to continuous improvement in environmental performance and the enhancement of energy efficiency across all operations.
            </div>
            
            <div class="signature-area">
                <div class="signature-block">
                    <div class="signature-label">Approved by</div>
                    <div class="signature-name">Jane Smith<br>Chair of the Board</div>
                </div>
                <div class="signature-block">
                    <div class="signature-label">Date of Approval</div>
                    <div class="signature-name">30 June 2024</div>
                </div>
            </div>
        </div>

        <!-- REGULATORY COMPLIANCE STATEMENT -->
        <div class="section-title">Regulatory Compliance Statement</div>

        <div class="paragraph">
            This report has been prepared to satisfy the disclosure requirements of Streamlined Energy and Carbon Reporting under the Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013. The report covers the period from 1 April 2023 to 31 March 2024 and includes all UK energy consumption and associated greenhouse gas emissions within the company's operational control boundary.
        </div>

        <div class="paragraph">
            The information contained herein will be included in the company's Annual Report and Accounts filed with Companies House in accordance with statutory requirements.
        </div>

    </div>

    <!-- Document Footer -->
    <div class="document-footer">
        <span>SECR Compliance Report 2023-24 | Example Company Ltd</span>
        <span>Confidential - UK Regulatory Filing</span>
    </div>

</body>
</html>
 `
}

// Updated PDF generation function using Puppeteer with better error handling
const generatePDFFromHTML = async (data: PDFGenerationData): Promise<Uint8Array> => {
  let browser

  try {
    const htmlContent = generateSECRHTMLTemplate(data)

    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development'

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
        '--disable-features=VizDisplayCompositor',
      ],
    }

    // In production or if Chrome is not available, try to use system Chrome
    // if (!isDev || process.env.VERCEL) {
    //   launchOptions.executablePath =
    //                                '/usr/bin/chromium-browser' ||
    //                                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    // }

    console.log('Launching Puppeteer with options:', launchOptions)

    // Launch Puppeteer browser
    browser = await puppeteer.launch(launchOptions)

    const page = await browser.newPage()

    // Set viewport and content
    await page.setViewport({ width: 1200, height: 1600 })

    // Set content and wait for it to load
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000,
    })

    console.log('Content set, generating PDF...')

    // Generate PDF with proper options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
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
      timeout: 60000,
    })

    console.log('PDF generated successfully')
    return new Uint8Array(pdfBuffer)
  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error)

    // If Puppeteer fails, provide a fallback
    if (error instanceof Error && error.message.includes('Could not find Chrome')) {
      console.log('Chrome not found, using HTML fallback...')
      return generateHTMLFallback(data)
    }

    throw new Error(
      `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
  }
}

// Fallback function that returns HTML as PDF placeholder
const generateHTMLFallback = (data: PDFGenerationData): Uint8Array => {
  console.log('Using HTML fallback for PDF generation')

  const htmlContent = generateSECRHTMLTemplate(data)

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
  `

  const encoder = new TextEncoder()
  return encoder.encode(fallbackContent)
}

// Main export function for generating SECR report
export const generateSECRReport = async (
  data: PDFGenerationData
): Promise<Uint8Array> => {
  return await generatePDFFromHTML(data)
}

export { generateSECRHTMLTemplate, generatePDFFromHTML }
export default generateSECRReport
