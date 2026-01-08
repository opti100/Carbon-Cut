'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useGoogleAds } from '@/contexts/GoogleAdsContext'
import { campaignApi } from '@/services/campaign/campaign'
import { CreateCampaignData, UTMParameter } from '@/types/campaign'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface OnboardingCampaignProps {
  onNext: () => void //
}

export default function OnboardingCampaign({ onNext }: OnboardingCampaignProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { status, isSwitchingAccount } = useGoogleAds()

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [formData, setFormData] = useState<Partial<CreateCampaignData>>({})

  // 1. Fetch available Google Ads campaigns
  const { data: googleAdsCampaigns, isLoading: googleAdsCampaignsLoading } = useQuery({
    queryKey: ['googleAdsCampaigns', status?.customer_id],
    queryFn: () => campaignApi.googleAdsCampaign(status?.customer_id || ''),
    enabled: !!status?.customer_id && !isSwitchingAccount,
    staleTime: 5 * 60 * 1000,
  })

  // 2. When a campaign is selected, prepare the form data
  useEffect(() => {
    if (selectedCampaignId && googleAdsCampaigns) {
      const selectedCampaign = googleAdsCampaigns.find(
        (c: any) => c.id === selectedCampaignId
      )
      if (selectedCampaign) {
        const campaignName = selectedCampaign.name
        const campaignId = selectedCampaign.id
        const slug = campaignName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '')

        const utmParams: UTMParameter[] = [
          { key: 'utm_source', value: 'google', selected: true },
          { key: 'utm_medium', value: 'cpc', selected: true },
          { key: 'utm_campaign', value: slug, selected: true },
          { key: 'utm_id', value: campaignId, selected: true },
        ]

        setFormData({
          name: campaignName,
          google_ads_campaign_id: campaignId,
          google_ads_customer_id: status?.customer_id,
          utm_params: utmParams,
          google_ads_campaign_data: selectedCampaign,
        })
      }
    }
  }, [selectedCampaignId, googleAdsCampaigns, status?.customer_id])

  // 3. Define the mutation for creating the campaign
  const createMutation = useMutation({
    mutationFn: (data: CreateCampaignData) => campaignApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success(`Campaign "${data.name}" created successfully!`)
      router.push('/dashboard') // Redirect to dashboard on success
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create campaign')
    },
  })

  const handleCreateCampaign = () => {
    if (formData.name && formData.google_ads_campaign_id) {
      createMutation.mutate(formData as CreateCampaignData)
    } else {
      toast.error('Please select a campaign first.')
    }
  }

  const isLoading = googleAdsCampaignsLoading || isSwitchingAccount

  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-xs">
      <Select
        onValueChange={setSelectedCampaignId}
        value={selectedCampaignId}
        disabled={isLoading || createMutation.isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={isLoading ? 'Loading campaigns...' : 'Select a campaign'}
          />
        </SelectTrigger>
        <SelectContent>
          {googleAdsCampaigns?.map((campaign: any) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleCreateCampaign}
        disabled={!selectedCampaignId || createMutation.isPending || isLoading}
        className="bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full"
      >
        {createMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Campaign & Finish
          </>
        )}
      </Button>
    </div>
  )
}
