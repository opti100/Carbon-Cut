import { NextRequest, NextResponse } from 'next/server';
import { PdfReportService } from '@/services/pdf-report-service';

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json();

    if (!reportData.userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const report = await PdfReportService.createReport(reportData);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create report' },
      { status: 500 }
    );
  }
}