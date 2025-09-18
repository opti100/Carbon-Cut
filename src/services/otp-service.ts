import nodemailer from 'nodemailer';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export class OTPService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generate 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP email for login or registration
  static async sendOTP(email: string, name: string = '', isLogin: boolean = false): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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
      });

      const emailSubject = isLogin ? 'Your CarbonCut Login Code' : 'Your CarbonCut Verification Code';
      const emailTitle = isLogin ? 'Login Code' : 'Verification Code';
      const emailMessage = isLogin 
        ? 'Your login code for accessing your CarbonCut dashboard is:'
        : 'Your verification code for downloading the PDF report is:';

      // Send email
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@carboncut.com',
        to: email,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1F4960 0%, #33BBCF 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CarbonCut</h1>
              <p style="color: white; margin: 5px 0;">Carbon Emissions Calculator</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1F4960; margin-bottom: 20px;">${emailTitle}</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.5;">
                ${name ? `Hi ${name},` : 'Hello,'}
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.5;">
                ${emailMessage}
              </p>
              <div style="background: white; border: 2px solid #33BBCF; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #1F4960; letter-spacing: 3px;">${otp}</span>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
              ${isLogin ? `
                <div style="margin-top: 25px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="color: #1565c0; font-size: 14px; margin: 0;">
                    <strong>Security Tip:</strong> Never share this code with anyone. CarbonCut will never ask for your login code via phone or email.
                  </p>
                </div>
              ` : ''}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                  Powered by Optiminastic | CarbonCut<br>
                  For support, contact: akshae@optiminastic.com
                </p>
              </div>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: isLogin 
          ? 'Login code sent successfully to your email address.'
          : 'OTP sent successfully to your email address.',
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  // Verify OTP
  static async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: 'Email not found. Please request a new OTP.',
        };
      }

      if (!user.otpCode || !user.otpExpiry) {
        return {
          success: false,
          message: 'No OTP found for this email. Please request a new OTP.',
        };
      }

      if (new Date() > user.otpExpiry) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
        };
      }

      if (user.otpCode !== otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please check and try again.',
        };
      }

      // Mark OTP as verified
      await prisma.user.update({
        where: { email },
        data: {
          otpVerified: true,
          otpCode: null,
          otpExpiry: null,
        },
      });

      return {
        success: true,
        message: 'OTP verified successfully!',
        userId: user.id,
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  }

  // Check if email is verified
  static async isEmailVerified(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user?.otpVerified || false;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  }
}