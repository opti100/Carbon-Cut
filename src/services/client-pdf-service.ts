import { ActivityData, OrganizationData } from '@/types/types'
import { PDFFormData } from '@/services/report-formats/secr-report'

interface GenerateReportOptions {
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

export class ClientPdfService {
  // Generate and upload PDF through API
  static async generateAndUploadPDF(options: GenerateReportOptions): Promise<{
    success: boolean
    report?: any
    pdfUrl?: string
    error?: string
  }> {
    try {
      // Prepare display CO2 data
      const displayCO2Data: Record<number, number> = {}
      options.activities.forEach((activity) => {
        displayCO2Data[activity.id] = options.getDisplayCO2(activity)
      })

      const response = await fetch('/api/reports/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization: options.organization,
          activities: options.activities,
          totals: options.totals,
          formData: options.formData,
          displayCO2Data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate PDF')
      }

      return {
        success: true,
        report: result.report,
        pdfUrl: result.pdfUrl,
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Download PDF directly (fallback)
  static async downloadPDFDirectly(options: GenerateReportOptions): Promise<void> {
    try {
      const response = await fetch('/api/reports/generate-pdf-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization: options.organization,
          activities: options.activities,
          totals: options.totals,
          formData: options.formData,
          getDisplayCO2: options.getDisplayCO2,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Get the PDF blob
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      // Create download link
      const a = document.createElement('a')
      a.href = url
      a.download = `${options.formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${options.formData.disclosureFormat}_Report.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw error
    }
  }
}
