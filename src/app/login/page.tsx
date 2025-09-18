"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

const sendOTP = async ({ email }: { email: string }) => {
    const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
}

const loginWithOTP = async ({ email, otp }: { email: string; otp: string }) => {
    const response = await fetch('/api/auth/otp-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
    }

    return response.json()
}

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const router = useRouter()

    // Send OTP mutation
    const sendOTPMutation = useMutation({
        mutationFn: sendOTP,
        onSuccess: (data) => {
            console.log('OTP sent successfully:', data)
            setStep('otp')
        },
        onError: (error: Error) => {
            console.error('Send OTP error:', error.message)
        }
    })

    // OTP login mutation
    const otpLoginMutation = useMutation({
        mutationFn: loginWithOTP,
        onSuccess: (data) => {
            console.log('Login successful:', data)
            router.push('/dashboard')
            router.refresh()
        },
        onError: (error: Error) => {
            console.error('Login error:', error.message)
        }
    })

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        sendOTPMutation.mutate({ email })
    }

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        otpLoginMutation.mutate({ email, otp })
    }

    const handleBackToEmail = () => {
        setStep('email')
        setOtp('')
        sendOTPMutation.reset()
    }

    const handleResendOTP = () => {
        sendOTPMutation.mutate({ email })
    }

    const isLoading = sendOTPMutation.isPending || otpLoginMutation.isPending
    const error = sendOTPMutation.error || otpLoginMutation.error

    return (
        <div className="min-h-screen flex flex-col lg:flex-row dark">
            <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-screen">
                <Image
                    src="/auth-hero.jpg"
                    alt="Authentication"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20 lg:hidden" />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col bg-background dark:bg-background">
                {/* Logo Section */}
                <div className="flex items-center justify-center p-4 lg:p-8 pb-0">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo.png"
                            alt="Carbon Cut Logo"
                            width={40}
                            height={40}
                            className="w-8 h-8 lg:w-10 lg:h-10"
                        />
                        <span className="text-xl lg:text-2xl font-bold text-foreground">
                            Carbon Cut
                        </span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-4 lg:p-8 pt-4">
                    <div className="w-full max-w-md">
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardHeader className="text-center pb-6 lg:pb-8 px-0">
                                <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {step === 'email' ? 'Welcome Back' : 'Verify Your Email'}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                                    {step === 'email' 
                                        ? 'Enter your email to receive a login code'
                                        : `We've sent a 6-digit code to ${email}`
                                    }
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 lg:space-y-6 px-0">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {error.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {sendOTPMutation.isSuccess && step === 'otp' && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-700">
                                            OTP sent successfully! Please check your email.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {step === 'email' ? (
                                    <form onSubmit={handleEmailSubmit} className="space-y-4 lg:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    className="w-full h-10 lg:h-11 pl-10"
                                                    disabled={isLoading}
                                                />
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-10 lg:h-11"
                                            size="lg"
                                            disabled={isLoading}
                                        >
                                            {sendOTPMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending Code...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Login Code
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleOTPSubmit} className="space-y-4 lg:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                                                Verification Code
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    id="otp"
                                                    name="otp"
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="Enter 6-digit code"
                                                    className="w-full h-10 lg:h-11 pl-10 text-center text-lg font-mono tracking-widest"
                                                    disabled={isLoading}
                                                    maxLength={6}
                                                />
                                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleBackToEmail}
                                                className="flex-1 h-10 lg:h-11"
                                                disabled={isLoading}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 h-10 lg:h-11"
                                                disabled={isLoading || otp.length !== 6}
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

                                        <div className="text-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleResendOTP}
                                                disabled={isLoading}
                                                className="text-primary hover:text-primary/80"
                                            >
                                                {sendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <div className="text-center pt-2">
                                    <p className="text-xs lg:text-sm text-muted-foreground">
                                        Don&apos;t have an account?{' '}
                                        <Link
                                            href="/"
                                            className="font-medium text-primary hover:text-primary/80 transition-colors underline"
                                        >
                                            Create your first report
                                        </Link>
                                    </p>
                                </div>

                                {/* Security Notice */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                                Secure Login
                                            </h4>
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                We use OTP (One-Time Password) for secure, passwordless authentication. 
                                                The code expires in 10 minutes for your security.
                                            </p>
                                        </div>
                                    </div>
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