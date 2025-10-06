import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { OTPService } from '@/services/otp-service'

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received signup data:', body)
    
    const validatedData = signupSchema.parse(body)
    const { name, email, companyName, phoneNumber } = validatedData

    const result = await OTPService.sendOTP(email, name, false) 
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 500 }
      )
    }

    console.log(`OTP sent successfully to ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email address',
      email 
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.issues[0].message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send verification code',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}