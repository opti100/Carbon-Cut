'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle,
  User,
  Building,
} from 'lucide-react'
import { toast } from 'sonner'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import 'react-phone-number-input/style.css'
import PhoneInput from '@/components/main/ui/PhoneInput'

interface SignupData {
  name: string
  email: string
  companyName: string
  phoneNumber: string
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

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validateOTP = (otp: string): boolean => /^\d{6}$/.test(otp)
const validatePhone = (phone: string | undefined): boolean => {
  if (!phone) return false
  return /^\+[1-9]\d{6,14}$/.test(phone)
}

const signupKeys = {
  all: ['signup'] as const,
  sendOTP: () => [...signupKeys.all, 'send-otp'] as const,
  verifyOTP: () => [...signupKeys.all, 'verify-otp'] as const,
}

const SignupPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard/website/'

  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    companyName: '',
    phoneNumber: '',
  })
  const [otp, setOtp] = useState('')

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!validatePhone(formData.phoneNumber)) {
      toast.error('Please enter a valid phone number with country code')
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
    verifyOTPMutation.mutate({ email: formData.email, otp })
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

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value || '' }))
  }

  const isLoading = sendOTPMutation.isPending || verifyOTPMutation.isPending
  const isFormValid =
    formData.name &&
    validateEmail(formData.email) &&
    formData.companyName &&
    validatePhone(formData.phoneNumber)
  const isOTPValid = validateOTP(otp)

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Side — Hero with brand overlay */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.02]"
          style={{ backgroundImage: "url('/login-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#080c04]/80 via-[#080c04]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c04]/80 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-white/90 text-[15px] font-semibold tracking-tight">
              CarbonCut
            </span>
          </div>

          <div className="max-w-md">
            <blockquote className="space-y-5">
              <p className="text-white/95 text-[22px] xl:text-[26px] font-normal leading-[1.35] tracking-[-0.01em]">
                Setting up took 10 minutes. Our first report was ready the same afternoon.
              </p>
              {/* <footer className="space-y-1">
                <p className="text-white/80 text-sm font-medium">James Whitfield</p>
                <p className="text-white/50 text-[13px]">
                  CTO, Greenfield Analytics
                </p>
              </footer> */}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-[45%] flex flex-col bg-background">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-foreground text-[15px] font-semibold tracking-tight">
              CarbonCut
            </span>
          </div>
          <Link
            href="/login"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Desktop top-right link */}
        <div className="hidden lg:flex justify-end px-8 pt-8">
          <Link
            href="/login"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Already have an account?{' '}
            <span className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
              Sign in
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[380px]">
            {step === 'form' ? (
              <div className="space-y-7">
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-[-0.02em] text-foreground">
                    Create your account
                  </h1>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    Start tracking your carbon footprint in minutes.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[13px] font-medium text-foreground/70">
                      Full name
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Jane Smith"
                        className="pl-9 h-11 text-[14px] bg-card border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/35"
                        disabled={isLoading}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[13px] font-medium text-foreground/70">
                      Work email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="jane@company.com"
                        className="pl-9 h-11 text-[14px] bg-card border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/35"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="text-[13px] font-medium text-foreground/70">
                      Company
                    </Label>
                    <div className="relative group">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        type="text"
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Acme Inc."
                        className="pl-9 h-11 text-[14px] bg-card border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/35"
                        disabled={isLoading}
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber" className="text-[13px] font-medium text-foreground/70">
                      Phone number
                    </Label>
                    <PhoneInput value={formData.phoneNumber} onChange={handlePhoneChange} disabled={isLoading} />
                  </div>

                  <div className="pt-0.5">
                    <Button
                      type="submit"
                      className="w-full h-11 text-[14px] font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
                      disabled={isLoading || !isFormValid}
                    >
                      {sendOTPMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending code…
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </div>
                </form>

                {/* Terms */}
                <p className="text-[11px] text-muted-foreground/50 leading-relaxed text-center">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="underline underline-offset-2 decoration-border hover:text-muted-foreground hover:decoration-muted-foreground transition-colors">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline underline-offset-2 decoration-border hover:text-muted-foreground hover:decoration-muted-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            ) : (
              /* OTP Step */
              <div className="space-y-7">
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 mb-3">
                    <Mail className="h-[18px] w-[18px] text-primary" />
                  </div>
                  <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-[-0.02em] text-foreground">
                    Check your email
                  </h1>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    We sent a 6-digit code to{' '}
                    <span className="text-foreground font-medium">{formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleOTPSubmit} className="space-y-7">
                  <div className="flex justify-center">
                    <InputOTP
                      id="otp"
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                    >
                      <InputOTPGroup className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-12 w-10 sm:h-[52px] sm:w-11 text-center text-lg font-semibold tracking-wider bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="space-y-2.5">
                    <Button
                      type="submit"
                      className="w-full h-11 text-[14px] font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
                      disabled={isLoading || !isOTPValid}
                    >
                      {verifyOTPMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating your account…
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify & create account
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={handleBackToForm}
                      className="w-full h-10 inline-flex items-center justify-center text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      Back to signup
                    </button>
                  </div>

                  {/* Resend */}
                  <div className="text-center pt-1">
                    <p className="text-[13px] text-muted-foreground">
                      Didn&apos;t get it?{' '}
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-foreground font-medium underline underline-offset-[3px] decoration-border hover:decoration-foreground hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {sendOTPMutation.isPending ? 'Sending…' : 'Resend code'}
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 sm:px-10 lg:px-14 xl:px-20 py-5">
          <p className="text-[11px] text-muted-foreground/40 tracking-wide">
            © {new Date().getFullYear()} CarbonCut
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage