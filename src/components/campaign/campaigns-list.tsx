"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "./create-campaign-form"
import { CampaignEmissions } from "./campaign-emissions"


interface Campaign {
  id: string
  name: string
  platform: string
  total_impressions: number
  total_emissions_kg: number
  created_at: string
}

interface CampaignsListProps {
  refreshTrigger: number
}

export function CampaignsList({ refreshTrigger }: CampaignsListProps) {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [refreshTrigger])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {

      // Note: You may need to add a GET endpoint to your Django backend to list campaigns
      // For now, this is a placeholder. Update the endpoint as needed.
      const response = await fetch("http://127.0.0.1:8000/api/v1/campaign/", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }

      const data = await response.json()
      setCampaigns(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch campaigns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading campaigns...</p>
        </CardContent>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No campaigns yet. Create one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  if (selectedCampaignId) {
    return (
      <div>
        <Button onClick={() => setSelectedCampaignId(null)} variant="outline" className="mb-4">
          ← Back to Campaigns
        </Button>
        <CampaignEmissions campaignId={selectedCampaignId} />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.platform}</CardDescription>
              </div>
              <Button onClick={() => setSelectedCampaignId(campaign.id)} variant="outline">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">{campaign.total_impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="text-2xl font-bold">{campaign.total_emissions_kg.toFixed(2)} kg CO₂</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Created: {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
