import nodemailer from 'nodemailer';
import { PdfReportData } from '@/types/database';
import { CloudinaryService } from '@/services/cloudinary-service';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send PDF report via email
  static async sendPDFReport(
    email: string, 
    report: PdfReportData, 
    isCertified: boolean = false
  ): Promise<boolean> {
    try {
      console.log(`Sending ${isCertified ? 'certified' : 'regular'} PDF to ${email}`);

      // Download PDF from Cloudinary if available
      let pdfBuffer: Buffer | null = null;
      if (report.cloudinaryPublicId) {
        try {
          pdfBuffer = await CloudinaryService.downloadPDFBuffer(report.cloudinaryPublicId);
        } catch (error) {
          console.error('Failed to download PDF from Cloudinary:', error);
        }
      }

      if (!pdfBuffer) {
        console.error('No PDF buffer available for email');
        return false;
      }

      // Generate filename
      const sanitizedCompanyName = report.companyName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date(report.createdAt).toISOString().split('T')[0];
      const filename = `${sanitizedCompanyName}_${report.disclosureFormat}_Report_${timestamp}.pdf`;

      // Email content
      const subject = isCertified 
        ? `✅ Your Certified Carbon Offset Report - ${report.companyName}`
        : `📊 Your Carbon Footprint Report - ${report.companyName}`;

      const htmlContent = this.generateEmailHTML(report, isCertified);
      const textContent = this.generateEmailText(report, isCertified);

      // Send email
      const mailOptions = {
        from: `"Carbon Cut" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
        attachments: [
          {
            filename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${email}:`, result.messageId);
      return true;

    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send certified PDF specifically
  static async sendCertifiedPDF(email: string, report: PdfReportData): Promise<boolean> {
    return this.sendPDFReport(email, report, true);
  }

  // Send regular PDF
  static async sendRegularPDF(email: string, report: PdfReportData): Promise<boolean> {
    return this.sendPDFReport(email, report, false);
  }

  // Generate HTML email content
  private static generateEmailHTML(report: PdfReportData, isCertified: boolean): string {
    const certificationBadge = isCertified ? `
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 12px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; font-size: 18px;">🏆 CERTIFIED REPORT</h3>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Certificate ID: ${report.certificationId}</p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Carbon Footprint Report</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🌱 Carbon Cut</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Measure & Offset Your Carbon Footprints</p>
        </div>

        ${certificationBadge}

        <h2 style="color: #1f2937;">Your Carbon Footprint Report is Ready!</h2>
        
        <p>Dear <strong>${report.userName}</strong>,</p>
        
        <p>Thank you for using Carbon Cut to measure your marketing carbon footprint. Your ${isCertified ? 'certified' : ''} report has been generated and is attached to this email.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Report Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;"><strong>Company:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;">${report.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;"><strong>Format:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;">${report.disclosureFormat}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;"><strong>Total Emissions:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;">${report.totalEmissions.toFixed(2)} kg CO₂e</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;"><strong>Activities:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1d5db;">${report.activityCount} activities</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Generated:</strong></td>
              <td style="padding: 8px 0;">${new Date(report.createdAt).toLocaleDateString()}</td>
            </tr>
          </table>
        </div>

        ${isCertified ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">✅ Certification Details</h4>
            <p style="margin: 0; color: #92400e;">
              This report has been verified and certified by Optiminastic. 
              Your certification ID is <strong>${report.certificationId}</strong> and can be used for compliance reporting.
            </p>
          </div>
        ` : ''}

        <div style="margin: 30px 0;">
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Review your carbon footprint data</li>
            <li>Identify reduction opportunities</li>
            <li>Consider carbon offsetting options</li>
            <li>Track progress over time</li>
          </ul>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;">
            <strong>💡 Need Help?</strong><br>
            Visit your <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?email=${encodeURIComponent(report.email)}" style="color: #059669;">dashboard</a> 
            to access all your reports or contact our support team.
          </p>
        </div>

        <div style="text-align: center; border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280;">
          <p>Best regards,<br><strong>The Carbon Cut Team</strong></p>
          <p style="font-size: 12px;">
            This email was sent to ${report.email}. 
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #059669;">Visit Carbon Cut</a>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate plain text email content
  private static generateEmailText(report: PdfReportData, isCertified: boolean): string {
    const certificationText = isCertified ? `
CERTIFIED REPORT
Certificate ID: ${report.certificationId}
This report has been verified and certified by Optiminastic.

` : '';

    return `
Carbon Cut - Your ${isCertified ? 'Certified ' : ''}Carbon Footprint Report

${certificationText}Dear ${report.userName},

Thank you for using Carbon Cut to measure your marketing carbon footprint. Your ${isCertified ? 'certified ' : ''}report has been generated and is attached to this email.

REPORT SUMMARY:
Company: ${report.companyName}
Format: ${report.disclosureFormat}
Total Emissions: ${report.totalEmissions.toFixed(2)} kg CO₂e
Activities: ${report.activityCount} activities
Generated: ${new Date(report.createdAt).toLocaleDateString()}

What's Next?
- Review your carbon footprint data
- Identify reduction opportunities
- Consider carbon offsetting options
- Track progress over time

Need Help?
Visit your dashboard: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?email=${encodeURIComponent(report.email)}

Best regards,
The Carbon Cut Team

This email was sent to ${report.email}.
Visit Carbon Cut: ${process.env.NEXT_PUBLIC_BASE_URL}
    `;
  }

  // Test email configuration
  static async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}