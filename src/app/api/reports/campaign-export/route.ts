import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { campaign, analytics, dateRange } = await request.json();

    if (!campaign || !analytics) {
      return NextResponse.json(
        { error: 'Missing required data for report generation' },
        { status: 400 }
      );
    }

    const html = generateCampaignReportHTML({ campaign, analytics, dateRange });

    const pdfArrayBuffer = await generateCampaignPDF(html, campaign.name);

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${campaign.name.replace(/[^a-zA-Z0-9]/g, '_')}_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating campaign report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCampaignReportHTML(data: any): string {
  const { campaign, analytics, dateRange } = data;
  const certificationId = `CAMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Safely extract and convert values
  const totals = analytics.totals || {};
  const impressions = Number(totals.impressions) || 0;
  const clicks = Number(totals.clicks) || 0;
  const sessions = Number(totals.sessions) || 0;
  const pageViews = Number(totals.page_views) || 0;
  const conversions = Number(totals.conversions) || 0;
  const cost = Number(totals.cost) || 0;
  const ctr = Number(totals.ctr) || 0;
  const cpc = Number(totals.cpc) || 0;
  const cpa = Number(totals.cpa) || 0;
  const conversionRate = Number(totals.conversion_rate) || 0;
  const totalEmissionsKg = Number(totals.total_emissions_kg) || 0;
  const emissionsPerConversion = Number(totals.emissions_per_conversion_kg) || 0;

  const totalEmissionsG = totalEmissionsKg * 1000;

  // Emissions breakdown
  const emissionsBreakdown = analytics.emissions_breakdown || {};
  const impressionsEmissionsG = Number(emissionsBreakdown.impressions_g) || 0;
  const clicksEmissionsG = Number(emissionsBreakdown.clicks_g) || 0;
  const pageViewsEmissionsG = Number(emissionsBreakdown.page_views_g) || 0;
  const conversionsEmissionsG = Number(emissionsBreakdown.conversions_g) || 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campaign Analytics Report - ${campaign.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 15mm;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #1f2937;
            background: white;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #b0ea1d;
            margin-bottom: 25px;
        }

        .logo {
            font-size: 24pt;
            font-weight: 700;
            color: #000;
            letter-spacing: -0.5px;
            margin-bottom: 6px;
        }

        .certified-badge {
            display: inline-block;
            background: #b0ea1d;
            color: #080c04;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 8pt;
            margin-top: 6px;
            letter-spacing: 0.5px;
        }

        h1 {
            font-size: 18pt;
            color: #111827;
            margin: 12px 0 6px 0;
            font-weight: 700;
        }

        h2 {
            font-size: 12pt;
            color: #111827;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
            font-weight: 600;
            page-break-after: avoid;
        }

        .campaign-name {
            font-size: 16pt;
            font-weight: 700;
            color: #111827;
            margin: 15px 0 12px 0;
            padding: 12px;
            background: #f9fafb;
            border-left: 4px solid #b0ea1d;
            border-radius: 4px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 15px 0;
        }

        .info-box {
            background: #f9fafb;
            padding: 10px 12px;
            border-radius: 5px;
            border-left: 3px solid #b0ea1d;
        }

        .info-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .info-value {
            font-size: 10pt;
            color: #111827;
            font-weight: 600;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 15px 0;
            page-break-inside: avoid;
        }

        .metric-box {
            background: #ffffff;
            padding: 14px 10px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .metric-value {
            font-size: 16pt;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }

        .metric-label {
            font-size: 7pt;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .emissions-highlight {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        .emissions-value {
            font-size: 32pt;
            font-weight: 700;
            color: #047857;
            margin: 8px 0;
            letter-spacing: -1px;
        }

        .emissions-label {
            font-size: 11pt;
            color: #065f46;
            font-weight: 600;
        }

        .emissions-sublabel {
            font-size: 8pt;
            color: #059669;
            margin-top: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 8pt;
            page-break-inside: auto;
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        th {
            background: #f9fafb;
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #b0ea1d;
            color: #374151;
            font-size: 8pt;
        }

        td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
        }

        .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 15px 0;
            page-break-inside: avoid;
        }

        .breakdown-item {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 5px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .breakdown-label {
            font-size: 7pt;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 4px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .breakdown-value {
            font-size: 14pt;
            font-weight: 700;
            color: #111827;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 7pt;
            color: #6b7280;
            line-height: 1.5;
            page-break-inside: avoid;
        }

        .certification-box {
            background: #fffbeb;
            border: 2px solid #fbbf24;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        .cert-id {
            font-family: 'Courier New', monospace;
            background: white;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
            font-size: 8pt;
            color: #111827;
            border: 1px solid #e5e7eb;
        }

        .page-break {
            page-break-before: always;
        }

        ul {
            margin: 10px 0 10px 18px;
            line-height: 1.6;
        }

        li {
            margin-bottom: 5px;
        }

        .summary-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin: 12px 0;
            page-break-inside: avoid;
        }

        .summary-stat {
            display: flex;
            justify-content: space-between;
            padding: 7px 10px;
            background: #f9fafb;
            border-radius: 4px;
        }

        .summary-stat-label {
            color: #6b7280;
            font-size: 8pt;
        }

        .summary-stat-value {
            color: #111827;
            font-weight: 600;
            font-size: 8pt;
        }

        .section {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CarbonCut</div>
        <div class="certified-badge">✓ CERTIFIED REPORT</div>
        <h1>Campaign Analytics Report</h1>
        <p style="color: #6b7280; margin-top: 4px; font-size: 8pt;">Generated on ${reportDate}</p>
    </div>

    <div class="campaign-name">${campaign.name}</div>

    <div class="info-grid">
        <div class="info-box">
            <div class="info-label">Campaign ID</div>
            <div class="info-value">${campaign.google_ads_campaign_id || 'N/A'}</div>
        </div>
        <div class="info-box">
            <div class="info-label">Report Period</div>
            <div class="info-value">${dateRange?.start || 'N/A'} - ${dateRange?.end || 'N/A'}</div>
        </div>
        <div class="info-box">
            <div class="info-label">Campaign Status</div>
            <div class="info-value">${campaign.status || 'Active'}</div>
        </div>
        <div class="info-box">
            <div class="info-label">Platform</div>
            <div class="info-value">Google Ads</div>
        </div>
    </div>

    <div class="emissions-highlight">
        <div class="emissions-label">Total Carbon Footprint</div>
        <div class="emissions-value">${totalEmissionsKg >= 1 ? totalEmissionsKg.toFixed(3) + ' kg' : totalEmissionsG.toFixed(2) + ' g'}</div>
        <div class="emissions-sublabel">CO₂e Equivalent Emissions</div>
        ${conversions > 0 ? `<div class="emissions-sublabel" style="margin-top: 6px; font-weight: 600;">${emissionsPerConversion.toFixed(4)} kg per conversion</div>` : ''}
    </div>

    <div class="section">
        <h2>Performance Overview</h2>
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-value">${impressions.toLocaleString()}</div>
                <div class="metric-label">Impressions</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${clicks.toLocaleString()}</div>
                <div class="metric-label">Clicks</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${conversions.toLocaleString()}</div>
                <div class="metric-label">Conversions</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${ctr.toFixed(2)}%</div>
                <div class="metric-label">CTR</div>
            </div>
        </div>

        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-value">${sessions.toLocaleString()}</div>
                <div class="metric-label">Sessions</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${pageViews.toLocaleString()}</div>
                <div class="metric-label">Page Views</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-label">Total Cost</div>
            </div>
            <div class="metric-box">
                <div class="metric-value">${conversionRate.toFixed(2)}%</div>
                <div class="metric-label">Conv. Rate</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Cost Analysis</h2>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="summary-stat-label">Cost Per Click (CPC)</span>
                <span class="summary-stat-value">$${cpc.toFixed(2)}</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-label">Cost Per Acquisition (CPA)</span>
                <span class="summary-stat-value">$${cpa > 0 ? cpa.toFixed(2) : '0.00'}</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-label">Pages per Session</span>
                <span class="summary-stat-value">${sessions > 0 ? (pageViews / sessions).toFixed(2) : '0.00'}</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-label">Engagement Rate</span>
                <span class="summary-stat-value">${impressions > 0 ? ((sessions / impressions) * 100).toFixed(2) : '0.00'}%</span>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Carbon Emissions Breakdown</h2>
        <div class="breakdown-grid">
            <div class="breakdown-item">
                <div class="breakdown-label">Impressions</div>
                <div class="breakdown-value">${(impressionsEmissionsG / 1000).toFixed(4)} kg</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-label">Clicks</div>
                <div class="breakdown-value">${(clicksEmissionsG / 1000).toFixed(4)} kg</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-label">Page Views</div>
                <div class="breakdown-value">${(pageViewsEmissionsG / 1000).toFixed(4)} kg</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-label">Conversions</div>
                <div class="breakdown-value">${(conversionsEmissionsG / 1000).toFixed(4)} kg</div>
            </div>
        </div>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2>Device Performance</h2>
        <table>
            <thead>
                <tr>
                    <th>Device Type</th>
                    <th style="text-align: right;">Sessions</th>
                    <th style="text-align: right;">Conversions</th>
                    <th style="text-align: right;">Emissions (kg)</th>
                </tr>
            </thead>
            <tbody>
                ${(analytics.by_device || []).map((device: any) => `
                    <tr>
                        <td style="text-transform: capitalize; font-weight: 500;">${device.device_type}</td>
                        <td style="text-align: right;">${Number(device.sessions).toLocaleString()}</td>
                        <td style="text-align: right;">${Number(device.conversions).toLocaleString()}</td>
                        <td style="text-align: right;">${Number(device.emissions_kg).toFixed(4)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Top 10 Countries by Performance</h2>
        <table>
            <thead>
                <tr>
                    <th>Country</th>
                    <th style="text-align: right;">Sessions</th>
                    <th style="text-align: right;">Conversions</th>
                    <th style="text-align: right;">Emissions (kg)</th>
                </tr>
            </thead>
            <tbody>
                ${(analytics.by_region || []).slice(0, 10).map((region: any) => `
                    <tr>
                        <td style="font-weight: 500;">${region.country}</td>
                        <td style="text-align: right;">${Number(region.sessions).toLocaleString()}</td>
                        <td style="text-align: right;">${Number(region.conversions).toLocaleString()}</td>
                        <td style="text-align: right;">${Number(region.emissions_kg).toFixed(4)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="certification-box">
        <h2 style="border: none; margin-top: 0; font-size: 11pt;">Report Certification</h2>
        <p style="margin: 10px 0; font-size: 8pt; color: #78350f;">
            This report has been generated and certified by CarbonCut as an accurate representation of campaign performance 
            and associated carbon emissions for the specified period.
        </p>
        <div class="cert-id">
            <strong>Certification ID:</strong> ${certificationId}
        </div>
    </div>

    <div class="section">
        <h2>Methodology</h2>
        <p style="margin-bottom: 8px; font-size: 8pt;">
            Carbon emissions are calculated using the Sustainable Web Design model:
        </p>
        <ul style="font-size: 8pt;">
            <li><strong>Data Transfer:</strong> Estimated data volumes for all advertising activities</li>
            <li><strong>Energy Consumption:</strong> Network, data center, and device energy usage</li>
            <li><strong>Carbon Intensity:</strong> Regional electricity grid carbon intensity factors</li>
            <li><strong>Device Profiles:</strong> Device-specific energy consumption patterns</li>
        </ul>
    </div>

    <div class="footer">
        <p style="font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 8pt;">CarbonCut - Carbon Emissions Analytics Platform</p>
        <p>Report Generated: ${reportDate}</p>
        <p>Certification ID: ${certificationId}</p>
        <p style="margin-top: 8px;">For support or questions, contact: support@carboncut.com</p>
    </div>
</body>
</html>
  `;
}

async function generateCampaignPDF(html: string, campaignName: string): Promise<ArrayBuffer> {
  const puppeteer = require('puppeteer');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm',
      },
      preferCSSPageSize: true,
      timeout: 30000
    });
    
    await browser.close();
    
    return pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    );
    
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}