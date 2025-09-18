import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - this will only run on server
if (typeof window === 'undefined') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export class CloudinaryService {
  
  // Upload PDF buffer to Cloudinary
  static async uploadPDF(
    pdfBuffer: Buffer,
    fileName: string,
    options: {
      folder?: string;
      publicId?: string;
      reportId?: string;
      userEmail?: string;
    } = {}
  ): Promise<{ url: string; publicId: string; secureUrl: string }> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    try {
      const {
        folder = 'carbon-cut/reports',
        publicId,
        reportId,
        userEmail
      } = options;

      // Create a unique public ID if not provided
      const finalPublicId = publicId || `${reportId || Date.now()}_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // For non-image files like PDFs
            folder,
            public_id: finalPublicId,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
            context: {
              report_id: reportId || '',
              user_email: userEmail || '',
              uploaded_at: new Date().toISOString(),
            },
            tags: ['carbon-report', 'pdf', reportId || 'unknown'].filter(Boolean),
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(pdfBuffer);
      });

      const uploadResult = result as any;

      return {
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    } catch (error) {
      console.error('Error uploading PDF to Cloudinary:', error);
      throw new Error(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete PDF from Cloudinary
  static async deletePDF(publicId: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
      
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting PDF from Cloudinary:', error);
      return false;
    }
  }

  // Get PDF URL by public ID
  static getPDFUrl(publicId: string, options: { secure?: boolean } = {}): string {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    const { secure = true } = options;
    
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure,
      flags: 'attachment' // Forces download instead of inline display
    });
  }

  // Generate a signed URL for secure access
  static getSignedPDFUrl(
    publicId: string, 
    options: {
      expiresAt?: number;
      secure?: boolean;
    } = {}
  ): string {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    const { expiresAt = Math.floor(Date.now() / 1000) + 3600, secure = true } = options; // Default 1 hour expiry

    return cloudinary.utils.private_download_url(publicId, 'raw', {
      expires_at: expiresAt,
    //   secure,
    });
  }

  // List all PDFs for a user
  static async listUserPDFs(userEmail: string): Promise<any[]> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    try {
      const result = await cloudinary.search
        .expression(`context.user_email:"${userEmail}" AND tags:carbon-report`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();

      return result.resources || [];
    } catch (error) {
      console.error('Error listing user PDFs from Cloudinary:', error);
      return [];
    }
  }

  // Get PDF metadata
  static async getPDFMetadata(publicId: string): Promise<any> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side');
    }

    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'raw'
      });
      
      return result;
    } catch (error) {
      console.error('Error getting PDF metadata from Cloudinary:', error);
      return null;
    }
  }
}