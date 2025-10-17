"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "./create-campaign-form"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface EmissionsData {
  campaign_id: string
  total_impressions: number
  total_emissions_kg: number
  impressions_today: number
  emissions_today_kg: number
  breakdown: {
    impression_emissions_kg: number
    session_emissions_kg: number
  }
  hourly_data: Array<{
    hour: string
    emissions: number
    impressions: number
  }>
  device_breakdown: Record<string, number>
  last_updated: string
}

interface CampaignEmissionsProps {
  campaignId: string
}

export function CampaignEmissions({ campaignId }: CampaignEmissionsProps) {
  const { toast } = useToast()
  const [data, setData] = useState<EmissionsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmissions()
    const interval = setInterval(fetchEmissions, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [campaignId])

  const fetchEmissions = async () => {
    try {

      const response = await fetch(`http://127.0.0.1:8000/api/v1/campaign/emissions/${campaignId}/`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch emissions data")
      }

      const emissionsData = await response.json()
      setData(emissionsData)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch emissions data",
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
          <p className="text-center text-muted-foreground">Loading emissions data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No emissions data available</p>
        </CardContent>
      </Card>
    )
  }

  const deviceData = Object.entries(data.device_breakdown).map(([device, emissions]) => ({
    device,
    emissions,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.total_impressions.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.total_emissions_kg.toFixed(2)} kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.impressions_today.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.emissions_today_kg.toFixed(2)} kg</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>Emissions by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Impression Emissions</p>
              <p className="text-xl font-bold">{data.breakdown.impression_emissions_kg.toFixed(2)} kg CO₂</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Emissions</p>
              <p className="text-xl font-bold">{data.breakdown.session_emissions_kg.toFixed(2)} kg CO₂</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.hourly_data && data.hourly_data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hourly Emissions Trend</CardTitle>
            <CardDescription>Emissions over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.hourly_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="emissions" stroke="#ef4444" name="Emissions (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {deviceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Device</CardTitle>
            <CardDescription>Device breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="emissions" fill="#3b82f6" name="Emissions (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{new Date(data.last_updated).toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
