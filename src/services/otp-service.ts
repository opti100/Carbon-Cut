import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export class OTPService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Generate 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Render email template
  private static async renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'services',
      'templates',
      'emails',
      `${templateName}.ejs`
    )
    return await ejs.renderFile(templatePath, data)
  }

  // Send welcome email (only for new users)
  private static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const html = await this.renderTemplate('welcome', {
        name: name || 'there',
        email,
      })

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@carboncut.com',
        to: email,
        subject: 'Welcome to CarbonCut - Start Your Carbon Journey!',
        html,
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error sending welcome email:', error)
      // Don't throw error for welcome email failure
    }
  }

  // Send OTP email for login or registration
  static async sendOTP(
    email: string,
    name: string = '',
    isLogin: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP()
      const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      const isNewUser = !existingUser

      // Create or update user with OTP
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          otpCode: otp,
          otpExpiry: expiry,
          otpVerified: false,
          name: name || undefined,
        },
        create: {
          email,
          name: name || undefined,
          otpCode: otp,
          otpExpiry: expiry,
          otpVerified: false,
        },
      })

      // // Send welcome email for new users
      // if (isNewUser && name) {
      //   await this.sendWelcomeEmail(email, name);
      //   // Mark welcome email as sent
      //   await prisma.user.update({
      //     where: { email },
      //     data: { welcomeEmailSent: true },
      //   });
      // }

      const html = await this.renderTemplate('otp', {
        name: name || 'there',
        otp,
        isLogin,
        email,
      })

      const emailSubject = isLogin
        ? 'Your CarbonCut Login Code'
        : 'Your CarbonCut Verification Code'

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@carboncut.com',
        to: email,
        subject: emailSubject,
        html,
      }

      await this.transporter.sendMail(mailOptions)

      return {
        success: true,
        message: isLogin
          ? 'Login code sent successfully to your email address.'
          : 'OTP sent successfully to your email address.',
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      }
    }
  }

  static async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return {
          success: false,
          message: 'Email not found. Please request a new OTP.',
        }
      }

      if (!user.otpCode || !user.otpExpiry) {
        return {
          success: false,
          message: 'No OTP found for this email. Please request a new OTP.',
        }
      }

      if (new Date() > user.otpExpiry) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
        }
      }

      if (user.otpCode !== otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please check and try again.',
        }
      }

      // Mark OTP as verified
      await prisma.user.update({
        where: { email },
        data: {
          otpVerified: true,
          otpCode: null,
          otpExpiry: null,
        },
      })

      return {
        success: true,
        message: 'OTP verified successfully!',
        userId: user.id,
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      }
    }
  }

  // Check if email is verified
  static async isEmailVerified(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      return user?.otpVerified || false
    } catch (error) {
      console.error('Error checking email verification:', error)
      return false
    }
  }
}
