// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { useAuth } from "@/contexts/AuthContext"
// import { useRouter } from "next/navigation"
// import OnboardingGoogleAds from "@/components/live/onBoardingGoogleAds"
// import ApiKeyStep from "@/components/live/onboardingSdk"
// import CampaignCreationStep from "@/components/live/CampaignCreationStep"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { LogIn, UserPlus, Loader2, Lock } from "lucide-react"
// import Link from "next/link"

// const InternetAds = () => {
//   const { user, isLoading, isAuthenticated } = useAuth()
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(0)

//   const handleContinue = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }

//   const steps = [
//     {
//       id: 1,
//       title: "Connect Google Ads",
//       description: "Connect your Google Ads account to start tracking",
//       content: (next: () => void) => <OnboardingGoogleAds onNext={next} />,
//     },
//     {
//       id: 2,
//       title: "Install SDK",
//       description: "Set up our SDK for data collection",
//       content: (next: () => void) => (
//         <ApiKeyStep onNext={next} sourceType="ads" />
//       ),
//     },
//     {
//       id: 3,
//       title: "Create Campaign",
//       description: "Set up your first carbon tracking campaign",
//       content: (next: () => void) => (
//         <CampaignCreationStep onComplete={next} />
//       ),
//     },
//   ]

//   const yOffset = 350

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f7f1]">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen grid grid-rows-[auto_auto_1fr] bg-[#f7f7f1] px-6">
//       {/* ================= HEADER ================= */}
//       <header className="pt-10 pb-4 text-center">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Track Your Ad Campaigns
//         </h1>
//         <p className="mt-2 text-gray-600 max-w-md mx-auto">
//           Connect your Google Ads account, install our SDK, and start tracking
//           carbon emissions from your campaigns
//         </p>
//       </header>

//       {/* ================= PROGRESS ================= */}
//       <div className="pb-6">
//         <div className="flex justify-center gap-8">
//           {steps.map((step, index) => (
//             <div key={step.id} className="flex flex-col items-center">
//               <div
//                 className={`
//                   w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold
//                   ${
//                     index === currentStep
//                       ? "bg-[#adff00] border-[#adff00] text-black"
//                       : index < currentStep
//                       ? "bg-green-500 border-green-500 text-white"
//                       : "bg-white border-gray-300 text-gray-400"
//                   }
//                 `}
//               >
//                 {index < currentStep ? "✓" : step.id}
//               </div>
//               <span
//                 className={`text-sm mt-2 ${
//                   index === currentStep
//                     ? "font-semibold text-black"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {step.title}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= MAIN CONTENT ================= */}
//       <main
//         className={`flex items-center justify-center ${
//           !isAuthenticated || !user
//             ? "blur-md pointer-events-none"
//             : ""
//         }`}
//       >
//         <div className="w-full max-w-4xl h-[500px] relative">
//           <motion.div
//             className="h-full"
//             animate={{ y: -currentStep * yOffset }}
//             transition={{ type: "spring", stiffness: 200, damping: 25 }}
//           >
//             {steps.map((step, index) => (
//               <div
//                 key={step.id}
//                 className="absolute w-full h-full flex"
//                 style={{ top: index * yOffset }}
//               >
//                 <motion.div
//                   className="w-full h-full flex items-center justify-center"
//                   animate={{
//                     filter:
//                       index === currentStep ? "blur(0px)" : "blur(4px)",
//                     opacity: index === currentStep ? 1 : 0.5,
//                   }}
//                   transition={{ duration: 0.4 }}
//                   style={{
//                     pointerEvents:
//                       index === currentStep ? "auto" : "none",
//                   }}
//                 >
//                   <div className="w-full max-w-2xl">
//                     <div className="text-center mb-8">
//                       <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                         {step.title}
//                       </h2>
//                       <p className="text-gray-600">
//                         {step.description}
//                       </p>
//                     </div>
//                     {step.content(handleContinue)}
//                   </div>
//                 </motion.div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </main>

//       {/* ================= AUTH OVERLAY ================= */}
//       {(!isAuthenticated || !user) && (
//         <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
//           <Card className="w-full max-w-md shadow-2xl">
//             <CardHeader className="text-center">
//               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#adff00]/10">
//                 <Lock className="h-6 w-6 text-[#adff00]" />
//               </div>
//               <CardTitle className="text-2xl">
//                 Authentication Required
//               </CardTitle>
//               <CardDescription>
//                 Please log in or sign up to access onboarding
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <Button
//                 asChild
//                 size="lg"
//                 className="w-full bg-[#adff00] hover:bg-[#adff00]/90 text-black"
//               >
//                 <Link href="/login">
//                   <LogIn className="mr-2 h-4 w-4" />
//                   Log In
//                 </Link>
//               </Button>

//               <Button
//                 asChild
//                 size="lg"
//                 variant="outline"
//                 className="w-full"
//               >
//                 <Link href="/signup">
//                   <UserPlus className="mr-2 h-4 w-4" />
//                   Sign Up
//                 </Link>
//               </Button>

//               <p className="text-center text-sm text-gray-500">
//                 New to Carbon Cut? Create an account to get started
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

// export default InternetAds




"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingGoogleAds from "@/components/live/onBoardingGoogleAds";
import ApiKeyStep from "@/components/live/onboardingSdk";
import CampaignCreationStep from "@/components/live/CampaignCreationStep";
import { VerticalTimeline, TimelineStep } from "@/components/VerticleTimeline";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function InternetAds() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => setCurrentStep((s) => s + 1);

  const steps: TimelineStep[] = [
    {
      number: "01",
      title: "Connect Google Ads",
      description: "Securely connect your Google Ads account",
      side: "left",
      render: () => <OnboardingGoogleAds onNext={next} />,
    },
    {
      number: "02",
      title: "Install CarbonCut SDK",
      description: "Enable real-time ad emission tracking",
      side: "right",
      render: () => <ApiKeyStep onNext={next} sourceType="ads" />,
    },
    {
      number: "03",
      title: "Create Campaign",
      description: "Start tracking carbon emissions per campaign",
      side: "left",
      render: () => <CampaignCreationStep onComplete={next} />,
    },
  ];

  if (isLoading) return null;

  return (
    <>
      <VerticalTimeline
        title="Track Internet Ad Emissions"
        subtitle="Interactive onboarding for campaign-level carbon tracking"
        steps={steps}
        activeStep={currentStep}
      />

      {/* AUTH OVERLAY */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="max-w-8xl w-full shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b0ea1d]/20">
                <Lock className="h-6 w-6 text-[#6c5f31]" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Log in or sign up to continue onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-[#b0ea1d] text-black">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}



