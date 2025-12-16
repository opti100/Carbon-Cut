"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import OnboardingGoogleAds from "@/components/live/onBoardingGoogleAds"
import ApiKeyStep from "@/components/live/onboardingSdk"
import CampaignCreationStep from "@/components/live/CampaignCreationStep"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Loader2, Lock } from "lucide-react"
import Link from "next/link"

const Page = () => {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const typeParam = searchParams.get('type') as "ads" | "website" | null
    
    const [currentStep, setCurrentStep] = useState(0)
    const [onboardingType, setOnboardingType] = useState<"ads" | "website">(typeParam || "ads")

    // Update onboarding type when URL param changes
    useEffect(() => {
        if (typeParam && (typeParam === "ads" || typeParam === "website")) {
            setOnboardingType(typeParam)
            setCurrentStep(0)
        }
    }, [typeParam])

    const handleContinue = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1)
        }
    }

    const handleWebsiteComplete = () => {
        router.push("/dashboard/website")
    }

    const adsSteps = [
        {
            id: 1,
            content: (handleContinue: () => void) => <OnboardingGoogleAds onNext={handleContinue} />,
        },
        {
            id: 2,
            content: (handleContinue: () => void) => <ApiKeyStep onNext={handleContinue} sourceType="ads" />,
        },
        {
            id: 3,
            content: (handleContinue: () => void) => <CampaignCreationStep onComplete={handleContinue} />,
        },
    ]

    const websiteSteps = [
        {
            id: 1,
            content: (handleContinue: () => void) => <ApiKeyStep onNext={handleWebsiteComplete} sourceType="web" />,
        },
    ]

    const steps = onboardingType === "ads" ? adsSteps : websiteSteps

    const handleOnboardingTypeChange = (value: string) => {
        const newType = value as "ads" | "website"
        setOnboardingType(newType)
        setCurrentStep(0)
        // Update URL param
        router.push(`/onboarding?type=${newType}`)
    }

    const yOffset = 350

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#f7f7f1]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center p-6 relative bg-[#f7f7f1] overflow-hidden">
            {/* Toggle at the top */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                <Tabs value={onboardingType} onValueChange={handleOnboardingTypeChange}>
                    <TabsList className="bg-white border shadow-sm">
                        <TabsTrigger 
                            value="ads" 
                            className="data-[state=active]:bg-[#adff00] data-[state=active]:text-black"
                        >
                            Ads Onboarding
                        </TabsTrigger>
                        <TabsTrigger 
                            value="website" 
                            className="data-[state=active]:bg-[#adff00] data-[state=active]:text-black"
                        >
                            Website/App Onboarding
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 text-center">
                {onboardingType === "ads" ? (
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Track Your Ad Campaigns</h1>
                        <p className="text-gray-600 text-sm max-w-md">
                            Connect your Google Ads account, install our SDK, and start tracking carbon emissions from your campaigns
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Track Your Website/App</h1>
                        <p className="text-gray-600 text-sm max-w-md">
                            Install our SDK to start tracking carbon emissions from your website or application
                        </p>
                    </div>
                )}
            </div>

            <div 
                className={`w-full max-w-4xl h-[500px] relative mt-20 ${
                    !isAuthenticated || !user ? 'blur-md pointer-events-none' : ''
                }`}
            >
                <motion.div
                    className="h-full"
                    key={onboardingType}
                    animate={{ y: -currentStep * yOffset }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="w-full h-full flex absolute"
                            style={{ top: index * yOffset }}
                        >
                            {/* Left Side: Step Indicator - Only show for Ads onboarding */}
                            {onboardingType === "ads" ? (
                                <div className="w-1/2 h-full flex items-center justify-center relative">
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-1/2 mt-8 h-full w-px bg-gray-200" />
                                    )}
                                    <div className="bg-white border border-dashed rounded-full h-16 w-16 flex items-center justify-center z-10">
                                        {step.id}
                                    </div>
                                </div>
                            ) : null}

                            {/* Right Side: Step Content */}
                            <motion.div
                                className={`${
                                    onboardingType === "ads" ? "w-1/2" : "w-full"
                                } h-full flex flex-col items-${
                                    onboardingType === "ads" ? "start" : "center"
                                } justify-center mt-8`}
                                initial={false}
                                animate={{
                                    filter: index === currentStep ? "blur(0px)" : "blur(4px)",
                                    opacity: index === currentStep ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    pointerEvents: index === currentStep ? "auto" : "none",
                                }}
                            >
                                {step.content(handleContinue)}
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {(!isAuthenticated || !user) && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/20 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4 shadow-2xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#adff00]/10">
                                <Lock className="h-6 w-6 text-[#adff00]" />
                            </div>
                            <CardTitle className="text-2xl">Authentication Required</CardTitle>
                            <CardDescription>
                                Please log in or sign up to access onboarding and start tracking your carbon emissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                asChild 
                                className="w-full bg-[#adff00] hover:bg-[#adff00]/90 text-black"
                                size="lg"
                            >
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Log In
                                </Link>
                            </Button>
                            <Button 
                                asChild 
                                variant="outline" 
                                className="w-full"
                                size="lg"
                            >
                                <Link href="/signup">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Sign Up
                                </Link>
                            </Button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                New to Carbon Cut? Create an account to get started
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Page