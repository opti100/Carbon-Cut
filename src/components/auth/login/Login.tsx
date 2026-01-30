'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, Shield, Loader2, ArrowLeft, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import PhoneInput from '@/components/main/ui/PhoneInput'

interface SendOTPRequest {
  email: string
  isLogin?: boolean
}

interface SendOTPByPhoneRequest {
  phoneNumber: string
}

interface VerifyOTPRequest {
  email: string
  otp: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: any
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const authAPI = {
  sendOTP: async ({ email, isLogin = true }: SendOTPRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, isLogin }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
  },

  sendOTPByPhone: async ({ phoneNumber }: SendOTPByPhoneRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp-by-phone/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ phoneNumber }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
  },

  verifyOTP: async ({ email, otp }: VerifyOTPRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid OTP')
    }

    return response.json()
  },
}


const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

const validatePhone = (phone: string | undefined): boolean => {
  if (!phone) return false
  return /^\+[1-9]\d{6,14}$/.test(phone)
}

const authKeys = {
  all: ['auth'] as const,
  sendOTP: () => [...authKeys.all, 'send-otp'] as const,
  sendOTPByPhone: () => [...authKeys.all, 'send-otp-by-phone'] as const,
  verifyOTP: () => [...authKeys.all, 'verify-otp'] as const,
}

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl =
    searchParams.get('redirectTo') ||
    searchParams.get('redirect') ||
    '/dashboard/campaigns'

  const [step, setStep] = useState<'email' | 'phone' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('')
  const [otp, setOtp] = useState('')
  const [forgotEmail, setForgotEmail] = useState(false)

  const sendOTPMutation = useMutation({
    mutationKey: authKeys.sendOTP(),
    mutationFn: authAPI.sendOTP,
    onSuccess: (data: AuthResponse) => {
      setStep('otp')
      toast.success(data.message || 'Verification code sent to your email')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const sendOTPByPhoneMutation = useMutation({
    mutationKey: authKeys.sendOTPByPhone(),
    mutationFn: authAPI.sendOTPByPhone,
    onSuccess: (data: AuthResponse) => {
      if (data.data?.email) {
        setEmail(data.data.email)
      }
      setStep('otp')
      toast.success(data.message || 'Verification code sent to your registered email')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const otpLoginMutation = useMutation({
    mutationKey: authKeys.verifyOTP(),
    mutationFn: authAPI.verifyOTP,
    onSuccess: (data: AuthResponse) => {
      toast.success(data.message || 'Login successful!')
      router.push(redirectUrl)
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    sendOTPMutation.mutate({ email, isLogin: true })
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePhone(phoneNumber)) {
      toast.error('Please enter a valid phone number with country code')
      return
    }
    sendOTPByPhoneMutation.mutate({ phoneNumber: phoneNumber! })
  }

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateOTP(otp)) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    otpLoginMutation.mutate({ email, otp })
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtp('')
    setForgotEmail(false)
    sendOTPMutation.reset()
    sendOTPByPhoneMutation.reset()
    otpLoginMutation.reset()
  }

  const handleForgotEmail = () => {
    setForgotEmail(true)
    setStep('phone')
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp('')
    otpLoginMutation.reset()
  }

  const handleResendOTP = () => {
    if (forgotEmail && phoneNumber) {
      sendOTPByPhoneMutation.mutate({ phoneNumber })
    } else if (email) {
      sendOTPMutation.mutate({ email, isLogin: true })
    }
  }

  const isLoading = 
    sendOTPMutation.isPending || 
    sendOTPByPhoneMutation.isPending || 
    otpLoginMutation.isPending
  const isOTPValid = validateOTP(otp)

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Hero Image Section */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/login-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 lg:p-8 xl:p-12">
          <div className="text-white">
            <h1 className="text-xl lg:text-2xl xl:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
              CarbonCut has made it simple to track and offset our carbon Emissions.
            </h1>
            <p className="text-sm lg:text-base xl:text-lg opacity-90">
              Driving real-world sustainability outcomes.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="w-full max-w-sm sm:max-w-md">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="text-center pb-4 sm:pb-6 lg:pb-8 px-0">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {step === 'email' 
                    ? 'Welcome Back' 
                    : step === 'phone'
                    ? 'Find Your Account'
                    : 'Verify Your Email'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {step === 'email'
                    ? 'Sign in to your account to continue'
                    : step === 'phone'
                    ? 'Enter your phone number to receive a verification code'
                    : `We've sent a 6-digit code to ${email}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {step === 'email' ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 text-sm sm:text-base"
                          disabled={isLoading}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full hover:bg-tertiary/ text-sm sm:text-base font-medium"
                      disabled={isLoading || !email}
                    >
                      {sendOTPMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending code...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Continue with Email
                        </>
                      )}
                    </Button>

                    {/* Forgot Email Button */}
                    <div className="text-center pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleForgotEmail}
                        className="text-primary hover:text-primary/ hover:bg-background text-sm font-medium"
                      >
                        Forgot your email?
                      </Button>
                    </div>
                  </form>
                ) : step === 'phone' ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <PhoneInput
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the phone number associated with your account. We'll send a verification code to your registered email.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        className="w-full hover:bg-tertiary/ text-sm sm:text-base font-medium"
                        disabled={isLoading || !validatePhone(phoneNumber)}
                      >
                        {sendOTPByPhoneMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending code...
                          </>
                        ) : (
                          <>
                            <Phone className="mr-2 h-4 w-4" />
                            Send Verification Code
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToEmail}
                        className="w-full text-sm font-medium"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Email Login
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleOTPSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative flex justify-center">
                        <InputOTP
                          id="otp"
                          value={otp}
                          onChange={setOtp}
                          maxLength={6}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          <InputOTPGroup className="flex gap-2">
                            <InputOTPSlot
                              index={0}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <InputOTPSlot
                              index={1}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <InputOTPSlot
                              index={2}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <InputOTPSlot
                              index={3}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <InputOTPSlot
                              index={4}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <InputOTPSlot
                              index={5}
                              className="h-12 w-12 text-center text-lg font-semibold border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:w-full gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={forgotEmail ? handleBackToPhone : handleBackToEmail}
                        className="w-full sm:w-auto text-sm font-medium border border-border rounded-md hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading || !isOTPValid}
                      >
                        {otpLoginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-center pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-primary hover:text-primary/80 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        {(sendOTPMutation.isPending || sendOTPByPhoneMutation.isPending) 
                          ? 'Sending...' 
                          : 'Resend Code'}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="text-center pt-2 sm:pt-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Don&apos;t have an account?{' '}
                    <Link
                      href={`/signup${redirectUrl !== '/dashboard/campaigns' ? `?redirectTo=${encodeURIComponent(redirectUrl)}` : ''}`}
                      className="font-medium text-primary hover:text-primary/80 transition-colors underline wrap-break-words"
                    >
                      Create your account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
