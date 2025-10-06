import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { OTPService } from '@/services/otp-service'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

const verifyOTPSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  companyName: z.string().min(2),
  phoneNumber: z.string().min(10),
  otp: z.string().length(6, 'OTP must be 6 digits')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received OTP verification:', body)
    
    const validatedData = verifyOTPSchema.parse(body)
    const { name, email, companyName, phoneNumber, otp } = validatedData
    const verificationResult = await OTPService.verifyOTP(email, otp)
    
    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: verificationResult.message 
        },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    let userData

    if (existingUser) {
      userData = await prisma.user.update({
        where: { email },
        data: {
          name,
          companyName,
          phoneNumber,
          otpVerified: true,
          updatedAt: new Date()
        }
      })
    } else {
      userData = await prisma.user.create({
        data: {
          name,
          email,
          companyName,
          phoneNumber,
          otpVerified: true
        }
      })
    }

    console.log('User profile completed successfully:', email)

    const token = jwt.sign(
      { 
        userId: userData.id, 
        email: userData.email,
        name: userData.name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        companyName: userData.companyName,
        phoneNumber: userData.phoneNumber,
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Verify OTP error:', error)
    
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
        message: 'Failed to create account',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}