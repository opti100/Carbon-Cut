import { PrismaClient } from '@/generated/prisma'
import { CloudinaryService } from './cloudinary-service'
import { CreatePdfReportInput, PdfReportData } from '@/types/database'

const prisma = new PrismaClient()

export class PdfReportService {
  // Ensure user exists or create them
  static async ensureUserExists(
    email: string,
    userData?: {
      name?: string
      phoneNumber?: string
      companyName?: string
    }
  ) {
    try {
      // First try to find existing user
      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (user) {
        // Update existing user with new data if provided
        if (userData) {
          user = await prisma.user.update({
            where: { email },
            data: {
              ...userData,
              otpVerified: true, // Ensure they're verified
            },
          })
        }
        return user
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
          updatedAt: new Date(),
        },
      })

      return user
    } catch (error) {
      console.error('Error ensuring user exists:', error)
      throw new Error(
        `Failed to create/update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Create a new PDF report record linked to user
  static async createReport(
    data: CreatePdfReportInput & { userId?: string; userEmail?: string }
  ): Promise<PdfReportData> {
    try {
      const { activities, userId, userEmail, ...reportData } = data

      let finalUserId = userId
      let user

      // If no userId provided but we have email, find/create user
      if (!finalUserId && userEmail) {
        user = await this.ensureUserExists(userEmail, {
          name: reportData.userName,
          phoneNumber: reportData.phoneNumber,
          companyName: reportData.companyName,
        })
        finalUserId = user.id
      } else if (finalUserId) {
        // Verify user exists if userId is provided
        user = await prisma.user.findUnique({
          where: { id: finalUserId },
        })

        if (!user) {
          throw new Error(`User with ID ${finalUserId} not found`)
        }
      }

      if (!finalUserId) {
        throw new Error('Cannot create report without valid user ID or email')
      }

      // Generate format-specific certification ID
      const formatPrefix = {
        SECR: 'SECR',
        CSRD: 'CSRD',
        SEC: 'SEC',
      }

      const certificationId = data.isCertified
        ? `${formatPrefix[data.disclosureFormat]}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : undefined

      // Create the report with activities
      const report = await prisma.pdfReport.create({
        data: {
          ...reportData,
          userId: finalUserId,
          certificationId,
          certificationDate: data.isCertified ? new Date() : undefined,
          paymentStatus: data.isCertified ? 'PENDING' : 'COMPLETED',
          activities: {
            create: activities,
          },
        },
        include: {
          activities: true,
          user: true,
        },
      })

      console.log('Report created successfully with activities:', {
        reportId: report.id,
        activitiesCount: report.activities.length,
        userId: finalUserId,
      })

      return report as PdfReportData
    } catch (error) {
      console.error('Error creating report:', error)
      throw new Error(
        `Failed to create report: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Upload PDF to Cloudinary and update database
  static async uploadAndSavePDF(
    reportId: string,
    pdfBuffer: Buffer,
    fileName: string
  ): Promise<PdfReportData> {
    try {
      console.log('Starting PDF upload for report:', reportId)

      // Get report details first
      const report = await prisma.pdfReport.findUnique({
        where: { id: reportId },
        include: {
          user: true,
          activities: true,
        },
      })

      if (!report) {
        throw new Error('Report not found')
      }

      console.log('Report found, uploading to Cloudinary...')

      // Generate filename with company name and format
      const sanitizedCompanyName = report.companyName.replace(/[^a-zA-Z0-9]/g, '_')
      const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      const finalFileName = `${sanitizedCompanyName}_${report.disclosureFormat}_Report_${timestamp}.pdf`

      // Upload to Cloudinary
      const cloudinaryResult = await CloudinaryService.uploadPDF(
        pdfBuffer,
        finalFileName,
        {
          folder: 'carbon-cut/reports',
          reportId: report.id,
          userEmail: report.email,
          publicId: `${report.id}_${finalFileName.replace('.pdf', '')}`,
        }
      )

      console.log('PDF uploaded to Cloudinary successfully:', cloudinaryResult.secureUrl)

      // Update database with Cloudinary URLs
      const updatedReport = await prisma.pdfReport.update({
        where: { id: reportId },
        data: {
          pdfUrl: cloudinaryResult.secureUrl,
          cloudinaryPublicId: cloudinaryResult.publicId,
          updatedAt: new Date(),
        },
        include: {
          activities: true,
          user: true,
        },
      })

      console.log('Database updated with PDF URL:', {
        reportId: updatedReport.id,
        pdfUrl: updatedReport.pdfUrl,
        activitiesCount: updatedReport.activities.length,
      })

      return updatedReport as PdfReportData
    } catch (error) {
      console.error('Error uploading PDF and updating database:', error)
      throw error
    }
  }

  // Get user by email and create if not exists
  // static async ensureUserExists(email: string, userData?: {
  //   name?: string;
  //   phoneNumber?: string;
  //   companyName?: string;
  // }) {
  //   const user = await prisma.user.upsert({
  //     where: { email },
  //     update: userData || {},
  //     create: {
  //       email,
  //       ...userData,
  //       otpVerified: true // Since they completed OTP verification
  //     }
  //   });
  //   return user;
  // }

  // Get secure PDF URL
  static async getSecurePDFUrl(
    reportId: string,
    userId?: string
  ): Promise<string | null> {
    try {
      const report = await prisma.pdfReport.findUnique({
        where: { id: reportId },
        include: { user: true },
      })

      if (!report) {
        throw new Error('Report not found')
      }

      // Check if user has access to this report
      if (userId && report.userId !== userId) {
        throw new Error('Unauthorized access to report')
      }

      if (!report.cloudinaryPublicId) {
        return report.pdfUrl // Fallback to direct URL if no Cloudinary ID
      }

      // Generate signed URL with 24-hour expiry
      const signedUrl = CloudinaryService.getSignedPDFUrl(report.cloudinaryPublicId, {
        expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      })

      return signedUrl
    } catch (error) {
      console.error('Error getting secure PDF URL:', error)
      return null
    }
  }

  // Delete PDF from both Cloudinary and database
  static async deletePDFReport(reportId: string, userId?: string): Promise<boolean> {
    try {
      const report = await prisma.pdfReport.findUnique({
        where: { id: reportId },
        include: { user: true },
      })

      if (!report) {
        throw new Error('Report not found')
      }

      // Check if user has access to delete this report
      if (userId && report.userId !== userId) {
        throw new Error('Unauthorized access to report')
      }

      // Delete from Cloudinary if exists
      if (report.cloudinaryPublicId) {
        await CloudinaryService.deletePDF(report.cloudinaryPublicId)
      }

      // Delete from database (cascade will delete activities)
      await prisma.pdfReport.delete({
        where: { id: reportId },
      })

      return true
    } catch (error) {
      console.error('Error deleting PDF report:', error)
      return false
    }
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        reports: {
          include: {
            activities: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  // Update user information
  static async updateUser(
    email: string,
    data: {
      name?: string
      phoneNumber?: string
      companyName?: string
    }
  ) {
    return await prisma.user.upsert({
      where: { email },
      update: data,
      create: {
        email,
        ...data,
        otpVerified: true,
      },
    })
  }

  // Get reports by user ID with secure URLs
  static async getReportsByUserId(userId: string): Promise<PdfReportData[]> {
    const reports = await prisma.pdfReport.findMany({
      where: { userId },
      include: {
        activities: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reports as PdfReportData[]
  }

  // Update payment status for certified reports
  static async updatePaymentStatus(
    reportId: string,
    paymentStatus: 'COMPLETED' | 'FAILED' | 'REFUNDED',
    stripePaymentId?: string
  ): Promise<PdfReportData> {
    const report = await prisma.pdfReport.update({
      where: { id: reportId },
      data: {
        paymentStatus,
        paymentDate: paymentStatus === 'COMPLETED' ? new Date() : undefined,
        stripePaymentId,
        updatedAt: new Date(),
      },
      include: {
        activities: true,
        user: true,
      },
    })

    return report as PdfReportData
  }

  // Get report by ID
  static async getReportById(reportId: string): Promise<PdfReportData | null> {
    const report = await prisma.pdfReport.findUnique({
      where: { id: reportId },
      include: {
        activities: true,
        user: true,
      },
    })

    return report as PdfReportData | null
  }
}
