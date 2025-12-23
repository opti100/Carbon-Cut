"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import ApiKeyStep from "@/components/live/onboardingSdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Loader2, Lock, Globe, Smartphone } from "lucide-react"
import Link from "next/link"
import CardNav from "@/components/CardNav"
import { cn } from "@/lib/utils"
import { navData } from "@/components/NavData"

const WebAndApps = () => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [onboardingTarget, setOnboardingTarget] = useState<"website" | "app">("website")

  const handleWebsiteComplete = () => {
    router.push("/internet/internet-ads")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfdf6]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfdf6] relative overflow-hidden px-6">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>

      {/* Header */}
      <header className="mt-32 mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Track Your Digital Product
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto mt-3">
          Install our SDK to start tracking carbon emissions from your website or application
        </p>
      </header>

      {/* Main */}
      <main
        className={cn(
          "max-w-6xl mx-auto",
          (!isAuthenticated || !user) && "blur-md pointer-events-none"
        )}
      >
        {/* Step 1 – Target Selection */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Select your platform</CardTitle>
            <CardDescription>
              Choose where you want to measure emissions
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Website */}
            <button
              onClick={() => setOnboardingTarget("website")}
              className={cn(
                "rounded-xl border p-6 text-left transition-all",
                onboardingTarget === "website"
                  ? "border-[#adff00] bg-[#adff00]/10 shadow-sm"
                  : "hover:border-gray-300"
              )}
            >
              <Globe className="h-8 w-8 mb-4 text-gray-800" />
              <div className="font-semibold text-lg">Website</div>
              <div className="text-sm text-gray-600">
                Track web applications
              </div>
            </button>

            {/* App */}
            <button
              onClick={() => setOnboardingTarget("app")}
              className={cn(
                "rounded-xl border p-6 text-left transition-all",
                onboardingTarget === "app"
                  ? "border-[#adff00] bg-[#adff00]/10 shadow-sm"
                  : "hover:border-gray-300"
              )}
            >
              <Smartphone className="h-8 w-8 mb-4 text-gray-800" />
              <div className="font-semibold text-lg">Mobile App</div>
              <div className="text-sm text-gray-600">
                Track iOS / Android apps
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Step 2 – SDK Installation */}
        <Card>
          <CardHeader>
            <CardTitle>
              Install SDK for {onboardingTarget === "website" ? "Website" : "Mobile App"}
            </CardTitle>
            <CardDescription>
              Follow these steps to integrate our tracking SDK into your{" "}
              {onboardingTarget === "website" ? "website" : "application"}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* SDK Step */}
            <div>
              <ApiKeyStep onNext={handleWebsiteComplete} sourceType="web" />
            </div>

            {/* Instructions */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {onboardingTarget === "website" ? "Website" : "Mobile App"} Specific Instructions
              </h3>

              <ul className="text-gray-600 space-y-2 text-sm leading-relaxed">
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
          </CardContent>
        </Card>
      </main>

      {/* Auth Overlay */}
      {(!isAuthenticated || !user) && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
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
