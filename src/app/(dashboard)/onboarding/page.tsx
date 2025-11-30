"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import OnboardingGoogleAds from "@/components/live/onBoardingGoogleAds"
// import ApiKeyStep from "@/components/live/onboardingSdk"
import OnboardingCampaign from "@/components/live/OnboardingCampaign"
import ApiKeyStep from "@/components/live/onboardingSdk"
import CampaignCreationStep from "@/components/live/CampaignCreationStep"


const steps = [
	{
		id: 1,
        content: (handleContinue: () => void) => <OnboardingGoogleAds onNext={handleContinue} />,
	},
	{
		id: 2,
        content: (handleContinue: () => void) => <ApiKeyStep onNext={handleContinue} />,
	},
	{
		id: 3,
		content: (handleContinue:() => void) => <CampaignCreationStep onComplete={handleContinue} />,  
	},
]

const Page = () => {
	const [currentStep, setCurrentStep] = useState(0)

	const handleContinue = () => {
		// Ensure the current step increments correctly
		if (currentStep < steps.length - 1) {
			setCurrentStep((prevStep) => prevStep + 1)
		}
	}

	const yOffset = 350 // Vertical distance between steps

	return (
		<div className="h-screen flex items-center justify-center p-6 relative bg-[#f7f7f1] overflow-hidden">
			<div className="w-full max-w-4xl h-[500px] relative">
				{/* Animated Container for all steps */}
				<motion.div
					className="h-full"
					animate={{ y: -currentStep * yOffset }}
					transition={{ type: "spring", stiffness: 200, damping: 25 }}
				>
					{steps.map((step, index) => (
						<div
							key={step.id}
							className="w-full h-full flex absolute"
							style={{ top: index * yOffset }}
						>
							{/* Left Side: Step Indicator */}
							<div className="w-1/2 h-full flex items-center justify-center relative">
								{/* Connecting Line */}
								{index < steps.length - 1 && (
									<div className="absolute top-1/2 mt-8 h-full w-px bg-gray-200" />
								)}
								<div className="bg-white border border-dashed rounded-full h-16 w-16 flex items-center justify-center z-10">
									{step.id}
								</div>
							</div>

							{/* Right Side: Step Content */}
							<motion.div
								className="w-1/2 h-full flex flex-col items-start justify-center"
								initial={false}
								animate={{
									filter: index === currentStep ? "blur(0px)" : "blur(4px)",
									opacity: index === currentStep ? 1 : 0.5,
								}}
								transition={{ duration: 0.4 }}
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