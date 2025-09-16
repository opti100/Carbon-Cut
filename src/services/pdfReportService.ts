import { PrismaClient } from '@/generated/prisma';
import { CreatePdfReportInput, PdfReportData } from '@/types/database';

const prisma = new PrismaClient();

export class PdfReportService {
  static async createReport(data: CreatePdfReportInput): Promise<PdfReportData> {
    const { activities, ...reportData } = data;
    
    const formatPrefix = {
      'SECR': 'SECR',
      'CSRD': 'CSRD', 
      'SEC': 'SEC'
    };
    
    const certificationId = data.isCertified 
      ? `${formatPrefix[data.disclosureFormat]}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      : undefined;

    const report = await prisma.pdfReport.create({
      data: {
        ...reportData,
        certificationId,
        certificationDate: data.isCertified ? new Date() : undefined,
        paymentStatus: data.isCertified ? 'PENDING' : 'COMPLETED',
        activities: {
          create: activities
        }
      },
      include: {
        activities: true
      }
    });

    return report as PdfReportData;
  }

  // Get reports by disclosure format
  static async getReportsByFormat(format: 'SECR' | 'CSRD' | 'SEC'): Promise<PdfReportData[]> {
    const reports = await prisma.pdfReport.findMany({
      where: { disclosureFormat: format },
      include: {
        activities: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return reports as PdfReportData[];
  }

  // Update PDF URL with format-specific naming
  static async updatePdfUrl(
    reportId: string, 
    pdfUrl: string, 
    cloudinaryPublicId: string
  ): Promise<PdfReportData> {
    const report = await prisma.pdfReport.update({
      where: { id: reportId },
      data: {
        pdfUrl,
        cloudinaryPublicId
      },
      include: {
        activities: true
      }
    });

    return report as PdfReportData;
  }

  // Update payment status for certified reports
  static async updatePaymentStatus(
    reportId: string,
    paymentStatus: 'COMPLETED' | 'FAILED' | 'REFUNDED',
    stripePaymentId?: string
  ): Promise<PdfReportData> {
    const updateData: any = {
      paymentStatus,
      stripePaymentId
    };

    if (paymentStatus === 'COMPLETED') {
      updateData.paymentDate = new Date();
    }

    const report = await prisma.pdfReport.update({
      where: { id: reportId },
      data: updateData,
      include: {
        activities: true
      }
    });

    return report as PdfReportData;
  }

  // Get report by ID
  static async getReportById(reportId: string): Promise<PdfReportData | null> {
    const report = await prisma.pdfReport.findUnique({
      where: { id: reportId },
      include: {
        activities: true
      }
    });

    return report as PdfReportData | null;
  }

  // Get reports by company and format
  static async getReportsByCompanyAndFormat(
    companyName: string, 
    format?: 'SECR' | 'CSRD' | 'SEC'
  ): Promise<PdfReportData[]> {
    const whereClause: any = { companyName };
    if (format) {
      whereClause.disclosureFormat = format;
    }

    const reports = await prisma.pdfReport.findMany({
      where: whereClause,
      include: {
        activities: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return reports as PdfReportData[];
  }

  // Verify certification by ID and format
  static async verifyCertification(certificationId: string): Promise<PdfReportData | null> {
    const report = await prisma.pdfReport.findUnique({
      where: { 
        certificationId,
        isCertified: true,
        paymentStatus: 'COMPLETED'
      },
      include: {
        activities: true
      }
    });

    return report as PdfReportData | null;
  }

  // Get statistics by format
  static async getFormatStatistics(): Promise<{
    format: string;
    count: number;
    totalEmissions: number;
    certified: number;
  }[]> {
    const stats = await prisma.pdfReport.groupBy({
      by: ['disclosureFormat'],
      _count: {
        id: true
      },
      _sum: {
        totalEmissions: true
      }
    });

    const certified = await prisma.pdfReport.groupBy({
      by: ['disclosureFormat'],
      where: {
        isCertified: true,
        paymentStatus: 'COMPLETED'
      },
      _count: {
        id: true
      }
    });

    return stats.map(stat => ({
      format: stat.disclosureFormat,
      count: stat._count.id,
      totalEmissions: stat._sum.totalEmissions || 0,
      certified: certified.find(c => c.disclosureFormat === stat.disclosureFormat)?._count.id || 0
    }));
  }
}