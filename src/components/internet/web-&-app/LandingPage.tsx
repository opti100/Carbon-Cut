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

      {/* Main */}
      <main
        className={cn(
          "max-w-6xl mx-auto",
          (!isAuthenticated || !user) && "blur-md pointer-events-none"
        )}
      >
        {/* Step 2 – SDK Installation */}
        <div className="max-w-5xl mx-auto px-8  bg-[#d1cebb] rounded-lg p-8   shadow-md">
         

         
            <div>
              <ApiKeyStep onNext={handleWebsiteComplete} sourceType="web" />
            </div>
         
        </div>
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
