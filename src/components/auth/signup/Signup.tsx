"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

const signupWithEmail = async ({ fullName, email, password }: { fullName: string; email: string; password: string }) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Signup failed')
    }

    return response.json()
}

const signupWithGoogle = async () => {
    const response = await fetch('/api/auth/google/signup', {
        method: 'POST',
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Google signup failed')
    }

    return response.json()
}

const Signup = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const router = useRouter()

    // Email signup mutation
    const emailSignupMutation = useMutation({
        mutationFn: signupWithEmail,
        onSuccess: (data) => {
            console.log('Signup successful:', data)
            router.push('/dashboard')
            router.refresh()
        },
        onError: (error: Error) => {
            console.error('Signup error:', error.message)
        }
    })

    // Google signup mutation
    const googleSignupMutation = useMutation({
        mutationFn: signupWithGoogle,
        onSuccess: (data) => {
            console.log('Google signup successful:', data)
            router.push('/dashboard')
            router.refresh()
        },
        onError: (error: Error) => {
            console.error('Google signup error:', error.message)
        }
    })

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }
        
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions')
            return
        }

        emailSignupMutation.mutate({ fullName, email, password })
    }

    const handleGoogleSignup = () => {
        googleSignupMutation.mutate()
    }

    const isLoading = emailSignupMutation.isPending || googleSignupMutation.isPending
    const error = emailSignupMutation.error || googleSignupMutation.error

    return (
        <div className="min-h-screen flex flex-col lg:flex-row dark">
            <div className="hidden lg:block w-1/2 relative min-h-screen">
                <Image
                    src="/auth-hero.jpg"
                    alt="Authentication"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col bg-background dark:bg-background min-h-screen">
                <div className="flex-1 flex items-center justify-center px-6 py-4 lg:p-8">
                    <div className="w-full max-w-sm lg:max-w-md">
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardContent className="space-y-4 lg:space-y-6 px-0">
                                <div className="text-center mb-6 lg:mb-8">
                                    <div className="flex items-center justify-start space-x-3 mb-2">
                                        <Image
                                            src="/logo.png"
                                            alt="Carbon Cut Logo"
                                            width={20}
                                            height={20}
                                            className="w-6 h-6 lg:w-8 lg:h-8"
                                        />
                                        <span className="text-xl lg:text-2xl font-bold text-foreground">
                                            Carbon Cut
                                        </span>
                                    </div>
                                    <p className="text-sm text-left lg:text-base text-muted-foreground">
                                        Measure & Offset Your Marketing Carbon Emissions
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {error.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleEmailSubmit} className="space-y-4 lg:space-y-6">
                                    <div className='text-2xl lg:text-3xl font-bold text-foreground text-center lg:text-left mb-4 lg:mb-6'>
                                        Sign up!
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                                            Full Name
                                        </Label>
                                        <Input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full h-11 lg:h-12"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Business Email
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full h-11 lg:h-12"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                            Password
                                        </Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            className="w-full h-11 lg:h-12"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                            className="w-full h-11 lg:h-12"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <Checkbox 
                                            id="terms" 
                                            required 
                                            className="mt-1 flex-shrink-0" 
                                            checked={agreedToTerms}
                                            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                            disabled={isLoading}
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="text-sm text-foreground cursor-pointer leading-relaxed"
                                        >
                                            I agree to the{' '}
                                            <Link
                                                href="/terms"
                                                className="text-primary hover:text-primary/80 transition-colors underline"
                                            >
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link
                                                href="/privacy"
                                                className="text-primary hover:text-primary/80 transition-colors underline"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 lg:h-12 text-base font-medium"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {emailSignupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </form>

                                <div className="text-center pt-4">
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

                                {/* Divider */}
                                <div className="flex items-center my-6">
                                    <div className="flex-1 border-t border-muted-foreground/30"></div>
                                    <span className="px-3 text-muted-foreground text-sm">or</span>
                                    <div className="flex-1 border-t border-muted-foreground/30"></div>
                                </div>

                                {/* Google Sign Up Button */}
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleSignup}
                                    disabled={isLoading}
                                    className="w-full h-11 lg:h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    {googleSignupMutation.isPending ? 'Signing Up...' : 'Sign up with Google'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup