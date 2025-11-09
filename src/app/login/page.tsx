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
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const sendOTP = async ({ email }: { email: string }) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/auth/send-otp/', {
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

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const router = useRouter()
    const { login } = useAuth()

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
        mutationFn: () => login(email, otp),
        onSuccess: (data) => {
            console.log('Login successful:', data)
            toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
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
        otpLoginMutation.mutate()
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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Hero Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center" style={{
                backgroundImage: "url('/login-hero.jpg')"
            }}>
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 lg:p-8 xl:p-12">
                    <div className="text-white">
                        <h1 className="text-xl lg:text-2xl xl:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
                            CarbonCut has made it simple to track and
                            offset our carbon Emissions.
                        </h1>
                        <p className="text-sm lg:text-base xl:text-lg opacity-90">
                            Driving real-world sustainability outcomes.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col bg-background">
                {/* Logo Section */}
                {/* <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 pb-2 sm:pb-4">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo.png"
                            alt="Carbon Cut Logo"
                            width={40}
                            height={40}
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-20 xl:h-20"
                        />
                    </div>
                </div> */}

                {/* Main Form Container */}
                <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    <div className="w-full max-w-sm sm:max-w-md">
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardHeader className="text-center pb-4 sm:pb-6 lg:pb-8 px-0">
                                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                                    {step === 'email' ? 'Welcome Back' : 'Verify Your Email'}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed px-2 sm:px-0">
                                    {step === 'email'
                                        ? 'Enter your email to receive a login code'
                                        : (
                                            <>
                                                We&apos;ve sent a 6-digit code to{' '}
                                                <span className="font-medium break-all">{email}</span>
                                            </>
                                        )
                                    }
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 px-0">
                                {/* Error Alert */}
                                {error && (
                                    <Alert variant="destructive" className="text-xs sm:text-sm">
                                        <AlertDescription>
                                            {error.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Success Alert */}
                                {sendOTPMutation.isSuccess && step === 'otp' && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-700 text-xs sm:text-sm">
                                            OTP sent successfully! Please check your email.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Email Step */}
                                {step === 'email' ? (
                                    <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
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
                                                    className="w-full h-10 sm:h-11 lg:h-12 pl-9 sm:pl-10 text-sm sm:text-base"
                                                    disabled={isLoading}
                                                />
                                                <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-10 sm:h-11 lg:h-12 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-medium"
                                            disabled={isLoading}
                                        >
                                            {sendOTPMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                                    <span className="text-xs sm:text-sm">Sending Code...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm">Send Login Code</span>
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    /* OTP Step */
                                    <form onSubmit={handleOTPSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="text-xs sm:text-sm font-medium text-foreground">
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
                                                    className="w-full h-10 sm:h-11 lg:h-12 pl-9 sm:pl-10 text-center text-base sm:text-lg lg:text-xl font-mono tracking-wider sm:tracking-widest"
                                                    disabled={isLoading}
                                                    maxLength={6}
                                                />
                                                <Shield className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleBackToEmail}
                                                    className="w-full sm:flex-1 h-10 sm:h-11 lg:h-12 text-xs sm:text-sm"
                                                    disabled={isLoading}
                                                >
                                                    <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="w-full sm:flex-1 h-10 sm:h-11 lg:h-12 bg-tertiary hover:bg-tertiary/90 text-white text-xs sm:text-sm font-medium"
                                                    disabled={isLoading || otp.length !== 6}
                                                >
                                                    {otpLoginMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                            Sign In
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Resend Button */}
                                        <div className="text-center pt-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleResendOTP}
                                                disabled={isLoading}
                                                className="text-primary hover:text-primary/80 text-xs sm:text-sm h-auto p-2"
                                            >
                                                {sendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Sign Up Link */}
                                <div className="text-center pt-2 sm:pt-4">
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Don&apos;t have an account?{' '}
                                        <Link
                                            href="/calculator"
                                            className="font-medium text-primary hover:text-primary/80 transition-colors underline break-words"
                                        >
                                            Create your first report
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