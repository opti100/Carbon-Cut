import { NextRequest, NextResponse } from 'next/server';
import { PdfReportService } from '@/services/pdf-report-service';
import { CloudinaryService } from '@/services/cloudinary-service';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    // Await params before accessing properties (Next.js 15 requirement)
    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Try to get user from auth token (optional)
    let userId: string | undefined;
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        userId = decoded.userId;
      }
    } catch (error) {
      console.log('No valid auth token found');
    }

    const report = await PdfReportService.getReportById(reportId);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    if (userId && report.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to this report' },
        { status: 403 }
      );
    }

    // If we have a Cloudinary public ID, fetch and serve the PDF directly
    if (report.cloudinaryPublicId) {
      try {
        const pdfBuffer = await CloudinaryService.downloadPDFBuffer(report.cloudinaryPublicId);
        
        // Generate proper filename
        const sanitizedCompanyName = report.companyName.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = new Date(report.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD format
        const filename = `${sanitizedCompanyName}_${report.disclosureFormat}_Report_${timestamp}.pdf`;

        // @ts-expect-error - will fix this later
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length.toString(),
            'Cache-Control': 'private, max-age=0'
          }
        });
      } catch (cloudinaryError) {
        console.error('Error downloading from Cloudinary:', cloudinaryError);
        // Fall back to URL-based download
      }
    }

    // Fallback: Return the URL for download
    if (report.pdfUrl) {
      return NextResponse.json({
        success: true,
        pdfUrl: report.pdfUrl,
        report: {
          id: report.id,
          companyName: report.companyName,
          disclosureFormat: report.disclosureFormat,
          createdAt: report.createdAt
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'PDF not available for download' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download report' },
      { status: 500 }
    );
  }
}