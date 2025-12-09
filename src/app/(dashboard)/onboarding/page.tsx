"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import OnboardingGoogleAds from "@/components/live/onBoardingGoogleAds"
import ApiKeyStep from "@/components/live/onboardingSdk"
import CampaignCreationStep from "@/components/live/CampaignCreationStep"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
        content: (handleContinue: () => void) => <ApiKeyStep onNext={handleContinue} sourceType="web" />,
    },
]

const Page = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [onboardingType, setOnboardingType] = useState<"ads" | "website">("ads")

    const steps = onboardingType === "ads" ? adsSteps : websiteSteps

    const handleContinue = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1)
        }
    }

    const handleOnboardingTypeChange = (value: string) => {
        setOnboardingType(value as "ads" | "website")
        setCurrentStep(0)
    }

    const yOffset = 350

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

            {/* Title Section */}
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

            {/* Stepper Content */}
            <div className="w-full max-w-4xl h-[500px] relative mt-20">
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
        </div>
    )
}

export default Page