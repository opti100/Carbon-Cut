'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import OnboardingGoogleAds from '@/components/live/onBoardingGoogleAds'
import ApiKeyStep from '@/components/live/onboardingSdk'
import CampaignCreationStep from '@/components/live/CampaignCreationStep'
import { VerticalTimeline, TimelineStep } from '@/components/VerticleTimeline'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import CardNav from '@/components/CardNav'
import { navData } from '@/components/NavData'

export default function InternetAds() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => setCurrentStep((s) => s + 1)

  const steps: TimelineStep[] = [
    {
      number: '01',
      title: 'Connect Google Ads',
      description: 'Securely connect your Google Ads account',
      side: 'left',
      render: () => <OnboardingGoogleAds onNext={next} />,
    },
    {
      number: '02',
      title: 'Install CarbonCut SDK',
      description: 'Enable real-time ad emission tracking',
      side: 'right',
      render: () => <ApiKeyStep onNext={next} sourceType="ads" />,
    },
    {
      number: '03',
      title: 'Create Campaign',
      description: 'Start tracking carbon emissions per campaign',
      side: 'left',
      render: () => <CampaignCreationStep onComplete={next} />,
    },
  ]

  if (isLoading) return null

  return (
    <>
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

      <VerticalTimeline
        title="Track Internet Ad Emissions"
        subtitle="Interactive onboarding for campaign-level carbon tracking"
        steps={steps}
        activeStep={currentStep}
      />

      {/* AUTH OVERLAY */}
      {/* {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="max-w-8xl w-full shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#b0ea1d]/20">
                <Lock className="h-6 w-6 text-[#6c5f31]" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Log in or sign up to continue onboarding</CardDescription>
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
      )} */}
    </>
  )
}
