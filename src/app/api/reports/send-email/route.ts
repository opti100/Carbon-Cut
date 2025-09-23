import { NextRequest, NextResponse } from 'next/server';
import { PdfReportService } from '@/services/pdf-report-service';
import { EmailService } from '@/services/email-service';

export async function POST(request: NextRequest) {
  try {
    const { reportId, email } = await request.json();

    if (!reportId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing reportId or email' },
        { status: 400 }
      );
    }

    // Get the report
    const report = await PdfReportService.getReportById(reportId);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if this is a certified report that hasn't been paid for
    if (report.isCertified && report.paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Certified report requires payment completion' },
        { status: 403 }
      );
    }

    // Send email
    const emailSent = await EmailService.sendPDFReport(email, report, report.isCertified);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'PDF sent to email successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}