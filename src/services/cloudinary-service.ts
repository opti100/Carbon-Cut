import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary only on server side
if (typeof window === 'undefined') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export class CloudinaryService {
  // Upload PDF buffer to Cloudinary
  static async uploadPDF(
    pdfBuffer: Buffer,
    fileName: string,
    options: {
      folder?: string
      publicId?: string
      reportId?: string
      userEmail?: string
    } = {}
  ): Promise<{ url: string; publicId: string; secureUrl: string }> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    try {
      const { folder = 'carbon-cut/reports', publicId, reportId, userEmail } = options

      // Create a unique public ID if not provided
      const finalPublicId =
        publicId || `${reportId || Date.now()}_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`

      // Upload to Cloudinary with explicit PDF format
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'raw',
              public_id: finalPublicId,
              folder: folder,
              overwrite: true,
              // Don't set format here, let Cloudinary detect it
              tags: ['pdf-report', reportId, userEmail].filter(Boolean),
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error)
                reject(error)
              } else {
                resolve(result)
              }
            }
          )
          .end(pdfBuffer)
      })

      const uploadResult = result as any

      return {
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      }
    } catch (error) {
      console.error('Error uploading PDF to Cloudinary:', error)
      throw new Error(
        `Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Download PDF as Buffer from Cloudinary
  static async downloadPDFBuffer(publicId: string): Promise<Buffer> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    try {
      // Generate the direct URL for the raw PDF - don't add .pdf extension
      const pdfUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true,
        // Don't set format, let Cloudinary handle it
        sign_url: false,
      })

      console.log('Downloading PDF from Cloudinary URL:', pdfUrl)

      // Fetch the PDF content
      const response = await fetch(pdfUrl)

      if (!response.ok) {
        // Try alternative URL format if first attempt fails
        const alternativeUrl = cloudinary.url(publicId + '.pdf', {
          resource_type: 'raw',
          secure: true,
          sign_url: false,
        })

        console.log('Trying alternative URL:', alternativeUrl)
        const altResponse = await fetch(alternativeUrl)

        if (!altResponse.ok) {
          throw new Error(
            `Failed to fetch PDF: ${response.status} ${response.statusText}`
          )
        }

        const arrayBuffer = await altResponse.arrayBuffer()
        return Buffer.from(arrayBuffer)
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error('Error downloading PDF from Cloudinary:', error)
      throw new Error(
        `Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Delete PDF from Cloudinary
  static async deletePDF(publicId: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      })

      return result.result === 'ok'
    } catch (error) {
      console.error('Error deleting PDF from Cloudinary:', error)
      return false
    }
  }

  // Get PDF URL by public ID
  static getPDFUrl(publicId: string, options: { secure?: boolean } = {}): string {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    const { secure = true } = options

    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure,
      flags: 'attachment',
    })
  }

  // Generate a signed URL for secure access
  static getSignedPDFUrl(
    publicId: string,
    options: {
      expiresAt?: number
      secure?: boolean
    } = {}
  ): string {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    const { expiresAt = Math.floor(Date.now() / 1000) + 3600, secure = true } = options // Default 1 hour expiry

    return cloudinary.utils.private_download_url(publicId, 'raw', {
      expires_at: expiresAt,
    })
  }

  // List all PDFs for a user
  static async listUserPDFs(userEmail: string): Promise<any[]> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    try {
      const result = await cloudinary.search
        .expression(`resource_type:raw AND tags:${userEmail}`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute()

      return result.resources
    } catch (error) {
      console.error('Error listing user PDFs:', error)
      return []
    }
  }

  // Get PDF metadata
  static async getPDFMetadata(publicId: string): Promise<any> {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'raw',
      })

      return result
    } catch (error) {
      console.error('Error getting PDF metadata:', error)
      return null
    }
  }

  // Get direct download URL for a PDF
  static getDirectDownloadUrl(publicId: string): string {
    if (typeof window !== 'undefined') {
      throw new Error('CloudinaryService can only be used on the server side')
    }

    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      flags: 'attachment',
    })
  }
}
