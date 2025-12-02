"use client"

import * as React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link, Code, Tag, Info, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import GoogleAdsStep from "@/components/live/GoogleAdsStep"
import ApiKeyStep from "@/components/live/ApiKeyStep"
import CampaignCreationStep from "@/components/live/CampaignCreationStep"
import VerticalStepper from "@/components/live/Stepper"
import { toast } from "sonner"
import Image from "next/image"
import { makeRequest } from "@/contexts/AuthContext"
import Navbar from "@/components/NewLanding/Navbar"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1"

export default function Page() {
  const router = useRouter()
  const [activeStep, setActiveStep] = React.useState(0)

  const steps = [
    {
      title: "Connect Google Ads Account",
      description:
        "Connect your Google Ads account to start tracking campaigns. After connection, select one of your customer accounts from Google Ads.",
      icon: <Link className="w-5 h-5" />,
    },
    {
      title: "API Key & Script Installation",
      description:
        "Create an API key to authenticate your integration. Copy the script tag with your API key and install it on your website to enable tracking.",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "Campaign Creation",
      description:
        "Select a campaign from your Google Ads account. We'll automatically generate UTM parameters and campaign name based on your selection.",
      icon: <Tag className="w-5 h-5" />,
    },
  ]
  
  // const { data: onboardingStatus, isLoading: isLoadingStatus } = useQuery({
  //   queryKey: ["onboardingStatus"],
  //   queryFn: async () => {
  //     const result = await makeRequest(`${API_BASE}/auth/onboarding-status/`, {
  //       method: "GET",
  //     })
  //     return result.data
  //   },
  //   staleTime: 0,
  //   retry: 1,
  // })

  // // Check if onboarding is completed and redirect
  // useEffect(() => {
  //   if (onboardingStatus?.completed) {
  //     toast.success("Onboarding already completed!")
  //     router.push("/dashboard/campaigns")
  //   } else if (onboardingStatus?.current_step) {
  //     // Set the active step to the last completed step
  //     setActiveStep(onboardingStatus.current_step)
  //   }
  // }, [onboardingStatus, router])

  const handleStepComplete = async () => {
    // Update backend with completed step
    const stepKeys = ["google_ads_connected", "api_key_verified", "campaign_created"]
    // if (activeStep < stepKeys.length) {
    //   try {
    //     await makeRequest(`${API_BASE}/auth/onboarding-status/`, {
    //       method: "POST",
    //       body: JSON.stringify({
    //         step_key: stepKeys[activeStep],
    //         completed: true,
    //       }),
    //     })
    //   } catch (error) {
    //     console.error("Failed to update onboarding progress:", error)
    //   }
    // }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <GoogleAdsStep onComplete={handleStepComplete} />

      case 1:
        return <ApiKeyStep onComplete={handleStepComplete} />

      case 2:
        return <CampaignCreationStep onComplete={handleStepComplete} />

      default:
        return null
    }
  }

  // if (isLoadingStatus) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-4">
  //         <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
  //         <p className="text-sm text-gray-600">Loading onboarding status...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
     <Navbar />
        

      {/* Main Layout */}
      <div className="flex-1 flex items-stretch p-4 sm:p-6 lg:p-8 mt-10">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 lg:gap-8 h-full mx-auto">
          {/* Left Sidebar - Stepper */}
          <div className="lg:w-[45%] bg-white rounded-lg p-8 shadow-sm border border-gray-200 h-screen px-6 sm:px-8 lg:px-12 py-8 lg:py-10 relative min-h-[500px] lg:min-h-0 overflow-y-auto">
            <div className="flex items-start gap-3 mb-8">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-gray-700 text-sm">
                Get started by connecting your Google Ads account and setting up campaign tracking.
              </p>
            </div>
            <VerticalStepper steps={steps} activeStep={activeStep} isConnected={false} />
            <Image
              src={"/background-star.svg"}
              alt="Background Star"
              className="absolute bottom-0 right-0 opacity-20"
              width={50}
              height={50}
            />
          </div>

          {/* Right Content Area */}
          <div className="lg:w-[55%] p-6 sm:p-8 lg:p-12 overflow-y-auto">{renderStepContent()}</div>
        </div>
      </div>
    </div>
  )
}