// src/app/api/reports/website-emissions/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { user, dailyBreakdown, stats, periodDays } = await request.json()

    if (!user || !stats || !dailyBreakdown || dailyBreakdown.length === 0) {
      return NextResponse.json(
        { error: 'Missing required data for report generation' },
        { status: 400 }
      )
    }

    // Generate simple HTML report
    const html = generateWebsiteEmissionsHTML({
      user,
      stats,
      dailyBreakdown,
      periodDays,
    })

    // Convert HTML to PDF using a simple approach
    const pdfArrayBuffer = await generateSimplePDF(html, user.companyName)

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${user.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Website_Emissions_Report.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating website emissions PDF:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateWebsiteEmissionsHTML(data: any): string {
  const { user, stats, dailyBreakdown, periodDays } = data
  const certificationId = `WEB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const formatEmissions = (grams: number) => {
    if (grams < 0.001) {
      return `${grams.toExponential(2)} g`
    }
    if (grams < 1) {
      return `${grams.toFixed(8)} g`
    }
    return `${grams.toFixed(6)} g`
  }

  const formatEmissionsKg = (kg: number) => {
    if (kg < 0.000001) {
      return `${kg.toExponential(2)} kg`
    }
    if (kg < 0.001) {
      return `${kg.toFixed(9)} kg`
    }
    return `${kg.toFixed(6)} kg`
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Carbon Emissions Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1A1A1A;
            background: white;
            padding: 40px;
        }

        .header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #adff00;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 32pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
        }

        .certified-badge {
            display: inline-block;
            background: #adff00;
            color: #000;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 10px;
        }

        h1 {
            font-size: 24pt;
            color: #000;
            margin: 20px 0;
        }

        h2 {
            font-size: 16pt;
            color: #000;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #adff00;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }

        .info-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #adff00;
        }

        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 9pt;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 12pt;
            color: #000;
        }

        .emissions-summary {
            background: linear-gradient(135deg, #adff00 0%, #d4ff66 100%);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }

        .emissions-value {
            font-size: 36pt;
            font-weight: bold;
            color: #000;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }

        .emissions-label {
            font-size: 14pt;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #adff00;
        }

        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }

        .certification-box {
            background: #f8f9fa;
            border: 2px solid #adff00;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
        }

        .cert-id {
            font-family: monospace;
            background: white;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 10pt;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }

        .stat-box {
            background: white;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }

        .stat-value {
            font-size: 24pt;
            font-weight: bold;
            color: #000;
        }

        .stat-label {
            font-size: 9pt;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CarbonCut</div>
        <div class="certified-badge">✓ CERTIFIED REPORT</div>
        <h1>Website Carbon Emissions Report</h1>
        <p>Generated on ${reportDate}</p>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <div class="info-label">Company Name</div>
            <div class="info-value">${user.companyName || 'N/A'}</div>
        </div>
        <div class="info-box">
            <div class="info-label">Report Period</div>
            <div class="info-value">Last ${periodDays} Days</div>
        </div>
        <div class="info-box">
            <div class="info-label">Contact Person</div>
            <div class="info-value">${user.name || 'N/A'}</div>
        </div>
        <div class="info-box">
            <div class="info-label">Email</div>
            <div class="info-value">${user.email}</div>
        </div>
    </div>

    <div class="emissions-summary">
        <div class="emissions-label">Total Carbon Footprint</div>
        <div class="emissions-value">${formatEmissions(stats.total_emissions_g)}</div>
        <div class="emissions-label">CO₂ Equivalent from Website Traffic</div>
    </div>

    <div class="stats-grid">
        <div class="stat-box">
            <div class="stat-value">${stats.total_sessions || 0}</div>
            <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${stats.total_visitors || 0}</div>
            <div class="stat-label">Unique Visitors</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${stats.total_page_views || 0}</div>
            <div class="stat-label">Page Views</div>
        </div>
    </div>

    <h2>Daily Emissions Breakdown</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th style="text-align: right;">Sessions</th>
                <th style="text-align: right;">Emissions (g)</th>
                <th style="text-align: right;">Emissions (kg)</th>
            </tr>
        </thead>
        <tbody>
            ${dailyBreakdown
              .map(
                (day: any) => `
                <tr>
                    <td>${new Date(day.date).toLocaleDateString('en-GB')}</td>
                    <td style="text-align: right;">${day.sessions}</td>
                    <td style="text-align: right;">${formatEmissions(day.emissions_g)}</td>
                    <td style="text-align: right;">${formatEmissionsKg(day.emissions_g / 1000)}</td>
                </tr>
            `
              )
              .join('')}
        </tbody>
    </table>

    <div class="certification-box">
        <h2 style="border: none; margin-top: 0;">Certification Details</h2>
        <p>This report has been certified by CarbonCut as an accurate representation of website carbon emissions for the specified period.</p>
        <div class="cert-id">
            <strong>Certification ID:</strong> ${certificationId}
        </div>
        <p style="margin-top: 15px; font-size: 9pt; color: #666;">
            This certification confirms that the emissions data has been calculated using industry-standard methodologies 
            and verified against our tracking systems.
        </p>
    </div>

    <h2>Methodology</h2>
    <p>
        This report calculates carbon emissions from website traffic using the Sustainable Web Design model. 
        Emissions are estimated based on data transfer, energy consumption, and the carbon intensity of 
        electricity grids serving your website visitors.
    </p>

    <div class="footer">
        <p><strong>CarbonCut</strong> - Carbon Emissions Tracking Platform</p>
        <p>Report generated on ${reportDate}</p>
        <p>Certification ID: ${certificationId}</p>
    </div>
</body>
</html>
  `
}

async function generateSimplePDF(
  html: string,
  companyName: string
): Promise<ArrayBuffer> {
  const puppeteer = require('puppeteer')

  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    })

    await browser.close()
    return pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    )
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    throw error
  }
}
