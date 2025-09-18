import { PrismaClient } from '@/generated/prisma';
import { CloudinaryService } from './cloudinary-service';
import { CreatePdfReportInput, PdfReportData } from '@/types/database';

const prisma = new PrismaClient();

export class PdfReportService {
  // Ensure user exists or create them
  static async ensureUserExists(email: string, userData?: {
    name?: string;
    phoneNumber?: string;
    companyName?: string;
  }) {
    try {
      // First try to find existing user
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        // Update existing user with new data if provided
        if (userData) {
          user = await prisma.user.update({
            where: { email },
            data: {
              ...userData,
              otpVerified: true // Ensure they're verified
            }
          });
        }
        return user;
      }

      // Create new user if not found
      user = await prisma.user.create({
        data: {
          email,
          name: userData?.name || '',
          phoneNumber: userData?.phoneNumber || '',
          companyName: userData?.companyName || '',
          otpVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      return user;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      throw new Error(`Failed to create/update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create a new PDF report record linked to user
  static async createReport(data: CreatePdfReportInput & { userId?: string; userEmail?: string }): Promise<PdfReportData> {
    const { activities, userId, userEmail, ...reportData } = data;
    
    let finalUserId = userId;

    // If no userId provided but we have email, find/create user
    if (!finalUserId && userEmail) {
      const user = await this.ensureUserExists(userEmail, {
        name: reportData.userName,
        phoneNumber: reportData.phoneNumber,
        companyName: reportData.companyName
      });
      finalUserId = user.id;
    }

    if (!finalUserId) {
      throw new Error('Cannot create report without valid user ID or email');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: finalUserId }
    });

    if (!user) {
      throw new Error(`User with ID ${finalUserId} not found`);
    }

    // Generate format-specific certification ID
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
        userId: finalUserId,
        certificationId,
        certificationDate: data.isCertified ? new Date() : undefined,
        paymentStatus: data.isCertified ? 'PENDING' : 'COMPLETED',
        activities: {
          create: activities
        }
      },
      include: {
        activities: true,
        user: true
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

  static async uploadAndSavePDF(
    reportId: string,
    pdfBuffer: Buffer,
    fileName: string
  ): Promise<PdfReportData> {
    try {
      // Get report details first
      const report = await prisma.pdfReport.findUnique({
        where: { id: reportId },
        include: {
          user: true,
          activities: true
        }
      });

      if (!report) {
        throw new Error('Report not found');
      }

      // Generate filename with company name and format
      const sanitizedCompanyName = report.companyName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const finalFileName = `${sanitizedCompanyName}_${report.disclosureFormat}_Report_${timestamp}.pdf`;

      // Upload to Cloudinary
      const cloudinaryResult = await CloudinaryService.uploadPDF(pdfBuffer, finalFileName, {
        folder: 'carbon-cut/reports',
        reportId: report.id,
        userEmail: report.email,
        publicId: `${report.id}_${finalFileName.replace('.pdf', '')}`
      });

      // Update database with Cloudinary URLs
      const updatedReport = await prisma.pdfReport.update({
        where: { id: reportId },
        data: {
          pdfUrl: cloudinaryResult.secureUrl,
          cloudinaryPublicId: cloudinaryResult.publicId,
          updatedAt: new Date()
        },
        include: {
          activities: true,
          user: true
        }
      });

      return updatedReport as PdfReportData;
    } catch (error) {
      console.error('Error uploading PDF and updating database:', error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        reports: {
          include: {
            activities: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  // Update user information
  static async updateUser(email: string, data: {
    name?: string;
    phoneNumber?: string;
    companyName?: string;
  }) {
    return await prisma.user.upsert({
      where: { email },
      update: data,
      create: {
        email,
        ...data,
        otpVerified: true
      }
    });
  }

  // Other methods remain the same...
}