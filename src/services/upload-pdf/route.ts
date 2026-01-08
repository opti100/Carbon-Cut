// import { NextRequest, NextResponse } from 'next/server';
// import { PdfReportService } from '@/services/pdf-report-service';

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { reportId: string } }
// ) {
//   try {
//     const { reportId } = params;

//     // Get the form data
//     const formData = await request.formData();
//     const file = formData.get('pdf') as File;

//     if (!file) {
//       return NextResponse.json(
//         { error: 'No PDF file provided' },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Upload to Cloudinary and update database
//     const updatedReport = await PdfReportService.uploadAndSavePDF(
//       reportId,
//       buffer,
//       file.name
//     );

//     return NextResponse.json({
//       success: true,
//       report: updatedReport,
//       pdfUrl: updatedReport.pdfUrl,
//       message: 'PDF uploaded successfully'
//     });

//   } catch (error) {
//     console.error('Error uploading PDF:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
