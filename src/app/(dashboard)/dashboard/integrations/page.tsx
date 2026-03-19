'use client'

import React, { useState } from 'react'
import { useGoogleAds } from '@/contexts/GoogleAdsContext'
import { Button } from '@/components/ui/button'
import { Loader2, Cloud, Globe, Users, Server, Zap, Car, UserCheck, Building2 } from 'lucide-react'
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog'

type IntegrationPlatform =
  | 'google'
  | 'meta'
  | 'snapchat'
  | 'linkedin'
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'cloudflare'
  | 'fastly'
  | 'akamai'
  | 'hr_platform'
  | 'building_energy'
  | 'commute_survey'
  | 'prometheus'
  | 'ipmi'
  | 'pdu'

const IntegrationIcon = ({
  platform,
}: {
  platform: IntegrationPlatform
}) => {
  const svgMap: Partial<Record<IntegrationPlatform, string>> = {
    aws: '/integrations/aws.svg',
    gcp: '/integrations/gcp.svg',
    azure: '/integrations/azure.svg',
    cloudflare: '/integrations/cloudflare.svg',
    fastly: '/integrations/fastly.svg',
    akamai: '/integrations/akamai.svg',
  }

  const svgSrc = svgMap[platform]
  if (svgSrc) {
    return (
      <img
        src={svgSrc}
        alt={platform}
        className="w-10 h-10 p-1 object-contain"
      />
    )
  }

  const icons: Partial<Record<IntegrationPlatform, React.ReactNode>> = {
    google: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff8904" fillOpacity="0.3" />
        <path d="M2 17L12 22L22 17" stroke="#ff8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="#ff8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    meta: (
      <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    snapchat: (
      <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.41 0 4.655-.713 6.5-1.944.224.6.66 1.534 1.5 2.5.5.6 1.2.8 1.8.3.6-.5.7-1.3.3-1.8-.8-1-1.9-2.3-2.5-3.5.8-1.6 1.4-3.4 1.4-5.556C24 5.373 18.627 0 12 0zm0 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    hr_platform: (
      <div className="w-full h-full flex items-center justify-center">
        <UserCheck className="w-6 h-6 text-violet-600" />
      </div>
    ),
    building_energy: (
      <div className="w-full h-full flex items-center justify-center">
        <Zap className="w-6 h-6 text-amber-600" />
      </div>
    ),
    commute_survey: (
      <div className="w-full h-full flex items-center justify-center">
        <Car className="w-6 h-6 text-blue-600" />
      </div>
    ),
    prometheus: (
      <div className="w-full h-full flex items-center justify-center">
        <Server className="w-6 h-6 text-orange-600" />
      </div>
    ),
    ipmi: (
      <div className="w-full h-full flex items-center justify-center">
        <Server className="w-6 h-6 text-emerald-600" />
      </div>
    ),
    pdu: (
      <div className="w-full h-full flex items-center justify-center">
        <Zap className="w-6 h-6 text-red-600" />
      </div>
    ),
  }

  return <div className="w-10 h-10 p-1">{icons[platform] ?? null}</div>
}

export default function IntegrationsPage() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const { status, isLoading, checkConnection } = useGoogleAds()

  const handleConnectionSuccess = () => {
    checkConnection()
  }

  const isConnected = status?.is_connected === true

  const adIntegrations = [
    {
      name: 'Google Ads',
      description: 'Connect your Google Ads account',
      icon: <IntegrationIcon platform="google" />,
      action: () => setConnectDialogOpen(true),
      status: isConnected ? 'Manage' : 'Connect',
      isLoading: isLoading,
    },
    {
      name: 'Meta Ads',
      description: 'Track Facebook & Instagram campaigns',
      icon: <IntegrationIcon platform="meta" />,
      status: 'Coming Soon',
    },
    {
      name: 'Snapchat Ads',
      description: 'Track Snapchat campaigns',
      icon: <IntegrationIcon platform="snapchat" />,
      status: 'Coming Soon',
    },
    {
      name: 'LinkedIn Ads',
      description: 'Track B2B campaigns',
      icon: <IntegrationIcon platform="linkedin" />,
      status: 'Coming Soon',
    },
  ]

  const cloudIntegrations = [
    {
      name: 'Amazon Web Services',
      description: 'Track AWS infrastructure emissions',
      icon: <IntegrationIcon platform="aws" />,
      status: 'Coming Soon',
    },
    {
      name: 'Google Cloud Platform',
      description: 'Monitor GCP carbon footprint',
      icon: <IntegrationIcon platform="gcp" />,
      status: 'Coming Soon',
    },
    {
      name: 'Microsoft Azure',
      description: 'Track Azure cloud emissions',
      icon: <IntegrationIcon platform="azure" />,
      status: 'Coming Soon',
    },
  ]

  const cdnIntegrations = [
    {
      name: 'Cloudflare',
      description: 'Monitor CDN & edge network emissions',
      icon: <IntegrationIcon platform="cloudflare" />,
      status: 'Coming Soon',
    },
    {
      name: 'Fastly',
      description: 'Track edge delivery carbon impact',
      icon: <IntegrationIcon platform="fastly" />,
      status: 'Coming Soon',
    },
    {
      name: 'Akamai',
      description: 'Measure CDN carbon footprint',
      icon: <IntegrationIcon platform="akamai" />,
      status: 'Coming Soon',
    },
  ]

  const workforceIntegrations = [
    {
      name: 'HR Platform',
      description: 'Auto-sync headcount & remote split from BambooHR, Personio, or custom API',
      icon: <IntegrationIcon platform="hr_platform" />,
      status: 'Configure in Workforce',
      link: '/dashboard/workforce',
    },
    {
      name: 'Building Energy',
      description: 'Real kWh readings from smart meters, BMS, or manual entry',
      icon: <IntegrationIcon platform="building_energy" />,
      status: 'Configure in Workforce',
      link: '/dashboard/workforce',
    },
    {
      name: 'Commute Survey',
      description: 'Employee commute mode & distance for transport emissions',
      icon: <IntegrationIcon platform="commute_survey" />,
      status: 'Configure in Workforce',
      link: '/dashboard/workforce',
    },
  ]

  const onPremIntegrations = [
    {
      name: 'Prometheus',
      description: 'Monitor server power consumption and resource utilization',
      icon: <IntegrationIcon platform="prometheus" />,
      status: 'Configure in On-Prem',
      link: '/dashboard/on-prem',
    },
    {
      name: 'IPMI',
      description: 'Direct hardware monitoring for power and temperature metrics',
      icon: <IntegrationIcon platform="ipmi" />,
      status: 'Configure in On-Prem',
      link: '/dashboard/on-prem',
    },
    {
      name: 'PDU',
      description: 'Power Distribution Unit monitoring for accurate power readings',
      icon: <IntegrationIcon platform="pdu" />,
      status: 'Configure in On-Prem',
      link: '/dashboard/on-prem',
    },
  ]

  return (
    <>
      <div className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Integrations
              </h1>
              <p className="text-muted-foreground">
                Connect your tools to automatically track carbon emissions
              </p>
            </div>

            {/* Advertising Platforms */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Advertising Platforms</h2>
                  <p className="text-sm text-muted-foreground">Track emissions from your digital marketing campaigns</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {adIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex gap-4 items-start bg-white rounded-md border border-border p-4"
                  >
                    <div className="shrink-0">{integration.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2">
                        {integration.status === 'Coming Soon' ? (
                          <span className="text-sm text-muted-foreground italic">
                            Coming Soon
                          </span>
                        ) : (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                            onClick={integration.action}
                            disabled={integration.isLoading}
                          >
                            {integration.isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              integration.status
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workforce Integrations Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Workforce & Office</h2>
                  <p className="text-sm text-muted-foreground">Track Scope 3 emissions from employee activities and office energy</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {workforceIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex gap-4 items-start bg-white rounded-md border border-border p-4"
                  >
                    <div className="shrink-0">{integration.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                          onClick={() => window.location.href = integration.link}
                        >
                          {integration.status}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* On-Prem Infrastructure Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">On-Premise Infrastructure</h2>
                  <p className="text-sm text-muted-foreground">Monitor on-premise servers and data center emissions</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {onPremIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex gap-4 items-start bg-white rounded-md border border-border p-4"
                  >
                    <div className="shrink-0">{integration.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                          onClick={() => window.location.href = integration.link}
                        >
                          {integration.status}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud Providers Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Cloud Providers</h2>
                  <p className="text-sm text-muted-foreground">Monitor infrastructure and compute emissions</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {cloudIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex gap-4 items-start bg-white rounded-md border border-border p-4"
                  >
                    <div className="shrink-0">{integration.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground italic">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CDN Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Content Delivery Networks</h2>
                  <p className="text-sm text-muted-foreground">Track emissions from edge networks and CDN usage</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {cdnIntegrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex gap-4 items-start bg-white rounded-md border border-border p-4"
                  >
                    <div className="shrink-0">{integration.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground italic">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={isConnected}
        onSuccess={handleConnectionSuccess}
      />
    </>
  )
}