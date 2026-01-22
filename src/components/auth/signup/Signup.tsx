'use client'
import React, { useState } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  Shield,
  Loader2,
  ArrowLeft,
  CheckCircle,
  User,
  Building,
  Phone,
} from 'lucide-react'
import { toast } from 'sonner'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

interface SignupData {
  name: string
  email: string
  companyName: string
  phoneNumber: string
}

interface SignupOTPRequest extends SignupData {
  otp: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
    name: string
    companyName: string
    phoneNumber: string
    onboarded: boolean
    auth_token?: string
  }
}

type Step = 'form' | 'otp'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const signupAPI = {
  // Step 1: Send signup request and get OTP
  sendOTP: async (data: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
  },

  // Step 2: Verify OTP and get auth token immediately
  verifyOTP: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup/verify-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify OTP')
    }

    return response.json()
  },
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

const validatePhone = (phone: string): boolean => {
  return phone.length >= 10
}

// TanStack Query keys
const signupKeys = {
  all: ['signup'] as const,
  sendOTP: () => [...signupKeys.all, 'send-otp'] as const,
  verifyOTP: () => [...signupKeys.all, 'verify-otp'] as const,
}

const SignupPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    companyName: '',
    phoneNumber: '',
  })
  const [otp, setOtp] = useState('')

  // Mutations with proper typing
  const sendOTPMutation = useMutation({
    mutationKey: signupKeys.sendOTP(),
    mutationFn: signupAPI.sendOTP,
    onSuccess: (data: AuthResponse) => {
      setStep('otp')
      toast.success(data.message || 'Verification code sent to your email')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const verifyOTPMutation = useMutation({
    mutationKey: signupKeys.verifyOTP(),
    mutationFn: signupAPI.verifyOTP,
    onSuccess: (data: AuthResponse) => {
      if (data.success && data.data?.auth_token) {
        toast.success(data.message || 'Account created successfully! Welcome to CarbonCut.')
        
        // Token is automatically set via cookie from backend
        // Redirect after a short delay to ensure cookie is set
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 500)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Event handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validatePhone(formData.phoneNumber)) {
      toast.error('Please enter a valid phone number')
      return
    }

    sendOTPMutation.mutate(formData)
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateOTP(otp)) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    // Only send email and OTP for verification
    verifyOTPMutation.mutate({ 
      email: formData.email, 
      otp 
    })
  }

  const handleBackToForm = () => {
    setStep('form')
    setOtp('')
    sendOTPMutation.reset()
  }

  const handleResendOTP = () => {
    if (validateEmail(formData.email)) {
      sendOTPMutation.mutate(formData)
    }
  }

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Derived state
  const isLoading = sendOTPMutation.isPending || verifyOTPMutation.isPending
  const error = sendOTPMutation.error || verifyOTPMutation.error
  const isFormValid =
    formData.name &&
    validateEmail(formData.email) &&
    formData.companyName &&
    validatePhone(formData.phoneNumber)
  const isOTPValid = validateOTP(otp)

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Hero Image */}
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="w-full max-w-sm sm:max-w-md">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="text-center pb-4 sm:pb-6 lg:pb-8 px-0">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {step === 'form' ? 'Create Your Account' : 'Verify Your Email'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {step === 'form'
                    ? 'Sign up to get started with CarbonCut'
                    : `We've sent a 6-digit code to ${formData.email}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Form Step */}
                {step === 'form' ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-9 text-sm sm:text-base"
                          disabled={isLoading}
                          autoComplete="name"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 text-sm sm:text-base"
                          disabled={isLoading}
                          autoComplete="email"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Company Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          id="companyName"
                          required
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange('companyName', e.target.value)
                          }
                          placeholder="Acme Inc."
                          className="w-full pl-9 text-sm sm:text-base"
                          disabled={isLoading}
                          autoComplete="organization"
                        />
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          type="tel"
                          id="phoneNumber"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange('phoneNumber', e.target.value)
                          }
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 text-sm sm:text-base"
                          disabled={isLoading}
                          autoComplete="tel"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full hover:bg-tertiary/ text-sm sm:text-base font-medium"
                      disabled={isLoading || !isFormValid}
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
                  </form>
                ) : (
                  /* OTP Step */
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

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:w-full gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToForm}
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
                        {verifyOTPMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Account & Sign In
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Resend Button */}
                    <div className="text-center pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-primary hover:text-primary/80 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        {sendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Login Link */}
                <div className="text-center pt-2 sm:pt-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-primary hover:text-primary/80 transition-colors underline break-words"
                    >
                      Sign in
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

export default SignupPage