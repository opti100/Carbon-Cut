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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

const loginWithEmail = async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
    }

    return response.json()
}

const loginWithGoogle = async () => {
    const response = await fetch('/api/auth/google', {
        method: 'POST',
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Google login failed')
    }

    return response.json()
}

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter()

    // Email login mutation
    const emailLoginMutation = useMutation({
        mutationFn: loginWithEmail,
        onSuccess: (data) => {
            console.log('Login successful:', data)
            router.push('/dashboard')
            router.refresh()
        },
        onError: (error: Error) => {
            console.error('Login error:', error.message)
        }
    })

    // Google login mutation
    const googleLoginMutation = useMutation({
        mutationFn: loginWithGoogle,
        onSuccess: (data) => {
            console.log('Google login successful:', data)
            router.push('/dashboard')
            router.refresh()
        },
        onError: (error: Error) => {
            console.error('Google login error:', error.message)
        }
    })

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        emailLoginMutation.mutate({ email, password })
    }

    const handleGoogleSignIn = () => {
        googleLoginMutation.mutate()
    }

    const isLoading = emailLoginMutation.isPending || googleLoginMutation.isPending
    const error = emailLoginMutation.error || googleLoginMutation.error

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
                                    Welcome Back
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                                    Sign in to your account
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

                                <form onSubmit={handleEmailSubmit} className="space-y-4 lg:space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email Address
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full h-10 lg:h-11"
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
                                            placeholder="Enter your password"
                                            className="w-full h-10 lg:h-11"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox 
                                                id="remember-me" 
                                                checked={rememberMe}
                                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                                disabled={isLoading}
                                            />
                                            <Label
                                                htmlFor="remember-me"
                                                className="text-xs lg:text-sm text-foreground cursor-pointer"
                                            >
                                                Remember me
                                            </Label>
                                        </div>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs lg:text-sm text-primary hover:text-primary/80 transition-colors underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-10 lg:h-11"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {emailLoginMutation.isPending ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>

                                <div className="text-center pt-2">
                                    <p className="text-xs lg:text-sm text-muted-foreground">
                                        Don&apos;t have an account?{' '}
                                        <Link
                                            href="/signup"
                                            className="font-medium text-primary hover:text-primary/80 transition-colors underline"
                                        >
                                            Sign up
                                        </Link>
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center my-6">
                                    <div className="flex-1 border-t border-muted-foreground/30"></div>
                                    <span className="px-3 text-muted-foreground text-sm">or</span>
                                    <div className="flex-1 border-t border-muted-foreground/30"></div>
                                </div>

                                {/* Google Sign In Button */}
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full h-10 lg:h-11 text-base font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    {googleLoginMutation.isPending ? 'Signing In...' : 'Sign in with Google'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage