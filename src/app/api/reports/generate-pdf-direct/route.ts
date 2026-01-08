import generateCSRDReport from '@/services/report-formats/csrd-report'
import generateSECReport from '@/services/report-formats/sec-report'
import generateSECRReport from '@/services/report-formats/secr-report'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { organization, activities, totals, formData, displayCO2Data } =
      await request.json()

    // Generate PDF based on format
    let pdfBytes: Uint8Array

    const generateOptions = {
      organization,
      activities,
      getDisplayCO2: (activity: any) => displayCO2Data[activity.id] || 0,
      totals,
      formData,
    }

    switch (formData.disclosureFormat) {
      case 'SECR':
        pdfBytes = await generateSECRReport(generateOptions)
        break
      case 'CSRD':
        pdfBytes = await generateCSRDReport(generateOptions)
        break
      case 'SEC':
        pdfBytes = await generateSECReport(generateOptions)
        break
      default:
        throw new Error('Unsupported disclosure format')
    }

    // Return PDF as blob
    const pdfStream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdfBytes)
        controller.close()
      },
    })

    return new NextResponse(pdfStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.disclosureFormat}_Report.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating direct PDF:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
