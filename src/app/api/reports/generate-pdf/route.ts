import { NextRequest, NextResponse } from 'next/server';
import { PdfReportService } from '@/services/pdf-report-service';
import { generateSECRReport } from '@/services/report-formats/secr-report';
import { generateCSRDReport } from '@/services/report-formats/csrd-report';
import jwt from 'jsonwebtoken';
import generateSECReport from '@/services/report-formats/sec-report';

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    const {
      organization,
      activities,
      totals,
      formData,
      displayCO2Data
    } = await request.json();

    console.log('Creating report for user:', userId, 'email:', formData.email);

    // Create report in database with better error handling
    const reportData = {
      userName: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      phoneNumber: formData.phoneNumber,
      disclosureFormat: formData.disclosureFormat,
      isCertified: formData.wantsCertification || false,
      totalEmissions: totals.total,
      activityCount: activities.length,
      reportPeriod: organization.period || new Date().getFullYear().toString(),
      paymentAmount: formData.wantsCertification ? 89.99 : undefined,
      activities: activities.map((activity: any) => ({
        date: activity.date,
        market: activity.market,
        channel: activity.channel,
        activityLabel: activity.activityLabel,
        quantity: activity.qty,
        co2Emissions: displayCO2Data[activity.id] || 0,
        scope: activity.scope,
        campaign: activity.campaign,
        notes: activity.notes,
      })),
      userId,
      userEmail: formData.email // Provide email as fallback
    };

    const report = await PdfReportService.createReport(reportData);

    console.log('Report created successfully:', report.id);

    // Generate PDF based on format
    let pdfBytes: Uint8Array;
    let fileName: string;

    const generateOptions = {
      organization,
      activities,
      getDisplayCO2: (activity: any) => displayCO2Data[activity.id] || 0,
      totals,
      formData
    };

    console.log('Generating PDF with format:', formData.disclosureFormat);

    switch (formData.disclosureFormat) {
      case 'SECR':
        pdfBytes = await generateSECRReport(generateOptions);
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SECR_Report.pdf`;
        break;
      case 'CSRD':
        pdfBytes = await generateCSRDReport(generateOptions);
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_CSRD_Report.pdf`;
        break;
      case 'SEC':
        pdfBytes = await generateSECReport(generateOptions);
        fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_SEC_Report.pdf`;
        break;
      default:
        throw new Error('Unsupported disclosure format');
    }

    console.log('PDF generated successfully, size:', pdfBytes.length);

    // Try to upload to Cloudinary, but don't fail if it doesn't work
    try {
      const buffer = Buffer.from(pdfBytes);
      const updatedReport = await PdfReportService.uploadAndSavePDF(
        report.id,
        buffer,
        fileName
      );

      console.log('PDF uploaded to Cloudinary successfully');

      return NextResponse.json({
        success: true,
        report: updatedReport,
        pdfUrl: updatedReport.pdfUrl,
        message: 'PDF generated and uploaded successfully'
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, but report was created:', cloudinaryError);
      
      // Return success but note that PDF wasn't uploaded to Cloudinary
      return NextResponse.json({
        success: true,
        report,
        pdfUrl: null,
        pdfSize: pdfBytes.length,
        message: 'PDF generated successfully but cloud upload failed. You can download it directly.',
        cloudinaryError: true
      });
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}