import { NextRequest, NextResponse } from 'next/server'
import { PdfReportService } from '@/services/pdf-report-service'
import { EmailService } from '@/services/email-service'
import { generateSECRReport } from '@/services/report-formats/secr-report'
import { generateCSRDReport } from '@/services/report-formats/csrd-report'
import { generateSECReport } from '@/services/report-formats/sec-report'

export async function POST(request: NextRequest) {
  try {
    const { organization, activities, totals, formData, displayCO2Data } =
      await request.json()

    console.log('Creating report for email:', formData.email)

    if (!formData.email || !formData.name || !formData.companyName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and companyName are required' },
        { status: 400 }
      )
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { error: 'No activities provided for report generation' },
        { status: 400 }
      )
    }

    // Create report data - using email instead of userId
    const reportData = {
      userName: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      phoneNumber: formData.phoneNumber,
      disclosureFormat: formData.disclosureFormat as 'SECR' | 'CSRD' | 'SEC',
      isCertified: formData.wantsCertification || false,
      totalEmissions: totals.total,
      activityCount: activities.length,
      reportPeriod: organization.period || new Date().getFullYear().toString(),
      paymentAmount: formData.wantsCertification ? 199 : undefined,
      activities: activities.map((activity: any) => ({
        date: activity.date,
        market: activity.market,
        channel: activity.channel,
        activityLabel: activity.activityLabel,
        quantity: activity.qty,
        co2Emissions: displayCO2Data[activity.id] || 0,
        scope: activity.scope,
        campaign: activity.campaign || '',
        notes: activity.notes || '',
      })),
      userEmail: formData.email,
    }

    console.log('Creating report with data:', {
      email: reportData.email,
      activitiesCount: reportData.activities.length,
      isCertified: reportData.isCertified,
    })

    // Create report in database (this will also create/find user)
    const report = await PdfReportService.createReport(reportData)

    console.log('Report created successfully:', {
      reportId: report.id,
      userId: report.userId,
      activitiesCount: report.activities?.length || 0,
    })

    // Generate PDF based on format - FIX: Using functions, not classes
    let pdfBytes: Uint8Array
    let fileName: string

    const generateOptions = {
      organization,
      activities,
      totals,
      formData,
      displayCO2Data,
      userId: report.userId,
      reportId: report.id,
      getDisplayCO2: (activity: any) => displayCO2Data[activity.id] || 0,
    }

    console.log('Generating PDF with format:', formData.disclosureFormat)

    // FIX: Call functions directly instead of using new keyword
    switch (formData.disclosureFormat) {
      case 'SECR':
        pdfBytes = await generateSECRReport(generateOptions)
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SECR_Report.pdf`
        break
      case 'CSRD':
        pdfBytes = await generateCSRDReport(generateOptions)
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_CSRD_Report.pdf`
        break
      case 'SEC':
        pdfBytes = await generateSECReport(generateOptions)
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SEC_Report.pdf`
        break
      default:
        console.log('Using default SECR format')
        pdfBytes = await generateSECRReport(generateOptions)
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SECR_Report.pdf`
    }

    console.log('PDF generated successfully, size:', pdfBytes.length)

    try {
      const buffer = Buffer.from(pdfBytes)
      const updatedReport = await PdfReportService.uploadAndSavePDF(
        report.id,
        buffer,
        fileName
      )

      console.log('PDF uploaded to Cloudinary and database updated successfully')

      if (!updatedReport.isCertified) {
        try {
          console.log('Sending regular PDF email to:', formData.email)
          await EmailService.sendRegularPDF(formData.email, updatedReport)
          console.log('Email sent successfully')
        } catch (emailError) {
          console.error('Failed to send email (non-blocking):', emailError)
        }
      } else {
        console.log(
          'Certified report created, email will be sent after payment completion'
        )
      }

      return NextResponse.json({
        success: true,
        report: {
          id: updatedReport.id,
          userId: updatedReport.userId,
          companyName: updatedReport.companyName,
          disclosureFormat: updatedReport.disclosureFormat,
          totalEmissions: updatedReport.totalEmissions,
          activityCount: updatedReport.activityCount,
          isCertified: updatedReport.isCertified,
          certificationId: updatedReport.certificationId,
          paymentStatus: updatedReport.paymentStatus,
          createdAt: updatedReport.createdAt,
          pdfUrl: updatedReport.pdfUrl,
        },
        pdfUrl: updatedReport.pdfUrl,
        message: updatedReport.isCertified
          ? 'PDF generated and saved. Complete payment to receive certified report via email.'
          : 'PDF generated, uploaded to cloud, and sent to your email successfully',
      })
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, but report was created:', cloudinaryError)

      // Return success but note that PDF wasn't uploaded to Cloudinary
      return NextResponse.json({
        success: true,
        report: {
          id: report.id,
          userId: report.userId,
          companyName: report.companyName,
          disclosureFormat: report.disclosureFormat,
          totalEmissions: report.totalEmissions,
          activityCount: report.activityCount,
          isCertified: report.isCertified,
          certificationId: report.certificationId,
          paymentStatus: report.paymentStatus,
          createdAt: report.createdAt,
          pdfUrl: null,
        },
        pdfUrl: null,
        pdfSize: pdfBytes.length,
        message:
          'PDF generated successfully but cloud upload failed. You can download it directly.',
        cloudinaryError: true,
      })
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
