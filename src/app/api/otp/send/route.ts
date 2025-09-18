import { NextRequest, NextResponse } from 'next/server';
import { OTPService } from '@/services/otp-service';

export async function POST(request: NextRequest) {
  try {
    const { email, name, isLogin } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await OTPService.sendOTP(email, name || '', isLogin || false);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });
  } catch (error) {
    console.error('Error in send OTP API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}