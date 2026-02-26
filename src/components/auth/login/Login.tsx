'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, ArrowLeft, Phone, CheckCircle } from 'lucide-react'
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

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validateOTP = (otp: string): boolean => /^\d{6}$/.test(otp)
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
    '/dashboard/website'

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
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Side — Hero with brand overlay */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.02]"
          style={{ backgroundImage: "url('/login-hero.jpg')" }}
        />
        {/* Double gradient: brand tint + bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080c04]/80 via-[#080c04]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c04]/80 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-white/90 text-[15px] font-semibold tracking-tight">
              CarbonCut
            </span>
          </div>

          {/* Bottom testimonial */}
          <div className="max-w-md">
            <blockquote className="space-y-5">
              <p className="text-white/95 text-[22px] xl:text-[26px] font-normal leading-[1.35] tracking-[-0.01em]">
                &ldquo;We reduced our digital carbon footprint by 34% in the first quarter using CarbonCut.&rdquo;
              </p>
              <footer className="space-y-1">
                <p className="text-white/80 text-sm font-medium">Sarah Chen</p>
                <p className="text-white/50 text-[13px]">
                  Head of Sustainability, Meridian Digital
                </p>
              </footer>
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
            href={`/signup${redirectUrl !== '/dashboard/website' ? `?redirectTo=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Create account
          </Link>
        </div>

        {/* Desktop top-right link */}
        <div className="hidden lg:flex justify-end px-8 pt-8">
          <Link
            href={`/signup${redirectUrl !== '/dashboard/website' ? `?redirectTo=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            New here?{' '}
            <span className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
              Create an account
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[380px]">
            {/* Email Step */}
            {step === 'email' && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-[-0.02em] text-foreground">
                    Welcome back
                  </h1>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    Sign in with your email to continue.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-[13px] font-medium text-foreground/70"
                    >
                      Email address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="pl-9 h-11 text-[14px] bg-card border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/35"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-[14px] font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
                    disabled={isLoading || !email}
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
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-[11px] uppercase tracking-widest text-muted-foreground/40 font-medium">
                      or
                    </span>
                  </div>
                </div>

                {/* Phone sign-in */}
                <button
                  type="button"
                  onClick={handleForgotEmail}
                  className="w-full h-11 inline-flex items-center justify-center text-[14px] font-medium rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:border-border transition-all duration-150 active:scale-[0.98]"
                >
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Sign in with phone number
                </button>
              </div>
            )}

            {/* Phone Step */}
            {step === 'phone' && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-[-0.02em] text-foreground">
                    Find your account
                  </h1>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    Enter your phone number and we&apos;ll send a verification code to your registered email.
                  </p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-[13px] font-medium text-foreground/70"
                    >
                      Phone number
                    </Label>
                    <PhoneInput
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2.5 pt-0.5">
                    <Button
                      type="submit"
                      className="w-full h-11 text-[14px] font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
                      disabled={isLoading || !validatePhone(phoneNumber)}
                    >
                      {sendOTPByPhoneMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending code…
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="w-full h-10 inline-flex items-center justify-center text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      Back to email
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
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
                    <span className="text-foreground font-medium">{email}</span>
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
                      {otpLoginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in…
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify & sign in
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={forgotEmail ? handleBackToPhone : handleBackToEmail}
                      className="w-full h-10 inline-flex items-center justify-center text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      {forgotEmail ? 'Back to phone' : 'Try a different email'}
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
                        {(sendOTPMutation.isPending || sendOTPByPhoneMutation.isPending)
                          ? 'Sending…'
                          : 'Resend code'}
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

export default LoginPage