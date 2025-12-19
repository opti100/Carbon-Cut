"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import ApiKeyStep from "@/components/live/onboardingSdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Loader2, Lock, Globe, Smartphone } from "lucide-react"
import Link from "next/link"

const WebAndApps = () => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [onboardingTarget, setOnboardingTarget] = useState<"website" | "app">("website")

  const handleWebsiteComplete = () => {
    router.push("/internet/internet-ads")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f1]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-[#f7f7f1] relative overflow-hidden px-6">
      
      {/* Header */}
      <header className="pt-10 pb-6 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Track Your Digital Product
        </h1>
        <p className="text-gray-600 max-w-md mt-2">
          Install our SDK to start tracking carbon emissions from your website or application
        </p>
      </header>

      {/* Main Content */}
      <main
        className={`flex items-center justify-center ${
          !isAuthenticated || !user ? "blur-md pointer-events-none" : ""
        }`}
      >
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* Target Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What are you tracking?
              </h2>
{/* 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={onboardingTarget === "website" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col items-center gap-3 ${
                    onboardingTarget === "website"
                      ? "bg-[#adff00] hover:bg-[#adff00]/90 text-black"
                      : ""
                  }`}
                  onClick={() => setOnboardingTarget("website")}
                >
                  <Globe className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Website</div>
                    <div className="text-sm opacity-80">Track web applications</div>
                  </div>
                </Button>

                <Button
                  variant={onboardingTarget === "app" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col items-center gap-3 ${
                    onboardingTarget === "app"
                      ? "bg-[#adff00] hover:bg-[#adff00]/90 text-black"
                      : ""
                  }`}
                  onClick={() => setOnboardingTarget("app")}
                >
                  <Smartphone className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Mobile App</div>
                    <div className="text-sm opacity-80">Track iOS/Android apps</div>
                  </div>
                </Button>
              </div> */}
            </div>

            {/* SDK Installation */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Install SDK for {onboardingTarget === "website" ? "Website" : "Mobile App"}
                </h2>
                <p className="text-gray-600">
                  Follow these steps to integrate our tracking SDK into your{" "}
                  {onboardingTarget === "website" ? "website" : "application"}
                </p>
              </div>

              <ApiKeyStep onNext={handleWebsiteComplete} sourceType="web" />

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {onboardingTarget === "website" ? "Website" : "Mobile App"} Specific Instructions
                </h3>

                <ul className="text-gray-600 space-y-2 text-sm">
                  {onboardingTarget === "website" ? (
                    <>
                      <li>• Add the SDK script to your website's head tag</li>
                      <li>• Test the integration in development first</li>
                      <li>• Monitor real-time emissions in your dashboard</li>
                    </>
                  ) : (
                    <>
                      <li>• Install the SDK via npm or CocoaPods</li>
                      <li>• Initialize the SDK in your app's entry point</li>
                      <li>• Configure tracking for different app states</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Authentication Overlay */}
      {(!isAuthenticated || !user) && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/20 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl">
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
              <Button asChild size="lg" className="w-full bg-[#adff00] hover:bg-[#adff00]/90 text-black">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>

              <p className="text-center text-sm text-gray-500">
                New to Carbon Cut? Create an account to get started
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default WebAndApps
