"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, Loader2, ArrowLeft, CheckCircle, User, Building, Phone } from "lucide-react"
import { toast } from 'sonner'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

// Types
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
  message: string
  data?: any
}

type Step = 'form' | 'otp'

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// API functions with proper typing
const signupAPI = {
  sendOTP: async (data: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
  },

  verifyOTP: async (data: SignupOTPRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify OTP')
    }

    return response.json()
  }
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
  const redirectTo = searchParams.get('redirectTo') || '/live'

  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    companyName: '',
    phoneNumber: ''
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
      toast.success(data.message || 'Signup successful!')
      router.push(redirectTo)
      router.refresh()
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

    verifyOTPMutation.mutate({ ...formData, otp })
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, '').slice(0, 6))
  }

  // Derived state
  const isLoading = sendOTPMutation.isPending || verifyOTPMutation.isPending
  const error = sendOTPMutation.error || verifyOTPMutation.error
  const isFormValid = formData.name && validateEmail(formData.email) && formData.companyName && validatePhone(formData.phoneNumber)
  const isOTPValid = validateOTP(otp)

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Hero Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/login-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 xl:p-12">
          <div className="text-white">
            <h1 className="text-xl lg:text-2xl xl:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
              CarbonCut has made it simple to track and offset our carbon Emissions.
            </h1>
            <p className="text-base xl:text-lg opacity-90">
              Driving real-world sustainability outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background overflow-auto">
        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 lg:px-8 pb-6">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="text-center pb-4 lg:pb-6 px-0 space-y-1">
                <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
                  {step === 'form' ? 'Create Your Account' : 'Verify Your Email'}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {step === 'form'
                    ? 'Enter your details to get started with CarbonCut'
                    : `We've sent a 6-digit code to ${formData.email}`
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-0">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="text-sm py-2">
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {sendOTPMutation.isSuccess && step === 'otp' && (
                  <Alert className="border-green-200 bg-green-50 py-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 text-sm">
                      OTP sent successfully! Please check your email.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Form Step */}
                {step === 'form' ? (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    {/* Name Field */}
                    <div className="space-y-1.5">
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
                          placeholder="Enter your full name"
                          className="w-full h-10 pl-9"
                          disabled={isLoading}
                          autoComplete="name"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full h-10 pl-9"
                          disabled={isLoading}
                          autoComplete="email"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Company Name Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          id="companyName"
                          required
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="Enter your company name"
                          className="w-full h-10 pl-9"
                          disabled={isLoading}
                          autoComplete="organization"
                        />
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          type="tel"
                          id="phoneNumber"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full h-10 pl-9"
                          disabled={isLoading}
                          autoComplete="tel"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-medium mt-4"
                      disabled={isLoading || !isFormValid}
                    >
                      {sendOTPMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  /* OTP Step */
                  <form onSubmit={handleOTPSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      {/* <Label htmlFor="otp" className="text-sm font-medium">
                        Verification Code
                      </Label> */}
                      <div className="relative flex justify-center">
                        <InputOTP
                          id="otp"
                          value={otp}
                          onChange={setOtp}
                          maxLength={6}
                          disabled={isLoading}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold' />
                            <InputOTPSlot index={1} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold'/>
                            <InputOTPSlot index={2} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold'/>
                            <InputOTPSlot index={3} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold'/>
                            <InputOTPSlot index={4} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold' />
                            <InputOTPSlot index={5} className='w-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold'/>
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex  gap-2 sm:gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToForm}
                        className="flex-1 h-10"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-10 bg-tertiary hover:bg-tertiary/90 text-white font-medium"
                        disabled={isLoading || !isOTPValid}
                      >
                        {verifyOTPMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Resend Button */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-primary hover:text-primary/80 h-8"
                      >
                        {sendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-primary hover:text-primary/80 transition-colors underline"
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