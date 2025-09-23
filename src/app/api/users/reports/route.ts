import { NextRequest, NextResponse } from 'next/server';
import { PdfReportService } from '@/services/pdf-report-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get user and their reports
    const user = await PdfReportService.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data with reports
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
        createdAt: user.createdAt
      },
      reports: user.reports.map(report => ({
        id: report.id,
        companyName: report.companyName,
        disclosureFormat: report.disclosureFormat,
        totalEmissions: report.totalEmissions,
        activityCount: report.activityCount,
        isCertified: report.isCertified,
        certificationId: report.certificationId,
        paymentStatus: report.paymentStatus,
        createdAt: report.createdAt,
        pdfUrl: report.pdfUrl,
        activitiesCount: report.activities.length
      }))
    });

  } catch (error) {
    console.error('Error fetching user reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user reports' },
      { status: 500 }
    );
  }
}