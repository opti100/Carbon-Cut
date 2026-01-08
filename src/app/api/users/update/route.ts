import { NextRequest, NextResponse } from 'next/server'
import { PdfReportService } from '@/services/pdf-report-service'

export async function POST(request: NextRequest) {
  try {
    const { email, name, phoneNumber, companyName } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await PdfReportService.updateUser(email, {
      name,
      phoneNumber,
      companyName,
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}
