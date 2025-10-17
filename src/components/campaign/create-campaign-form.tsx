"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function useToast() {
  const toast = ({
    title,
    description,
    variant,
  }: {
    title?: string
    description?: string
    variant?: "destructive" | string
  } = {}) => {
    if (typeof window !== "undefined") {
      if (variant === "destructive") {
        // simple blocking fallback for destructive toasts
        alert(`${title ? title + ": " : ""}${description ?? ""}`)
      } else {
        // non-blocking fallback
        // eslint-disable-next-line no-console
        console.log(title ?? "", description ?? "")
      }
    }
    // no-op on server
  }

  return { toast }
}

interface CreateCampaignFormProps {
  onSuccess?: () => void
}

export function CreateCampaignForm({ onSuccess }: CreateCampaignFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    platform: "google",
    platform_campaign_ids: [] as string[],
    track_impressions: true,
    track_sessions: true,
    real_time_updates: true,
    update_interval_minutes: 15,
    oauth_credentials: {},
  })

  const [campaignIdInput, setCampaignIdInput] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "update_interval_minutes" ? Number.parseInt(value) : value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      platform: value,
    }))
  }

  const addCampaignId = () => {
    if (campaignIdInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        platform_campaign_ids: [...prev.platform_campaign_ids, campaignIdInput.trim()],
      }))
      setCampaignIdInput("")
    }
  }

  const removeCampaignId = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      platform_campaign_ids: prev.platform_campaign_ids.filter((cid) => cid !== id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      //   const token = localStorage.getItem("auth_token")
      //   if (!token) {
      //     toast({
      //       title: "Error",
      //       description: "Authentication token not found. Please log in.",
      //       variant: "destructive",
      //     })
      //     setLoading(false)
      //     return
      //   }

      const response = await fetch("http://127.0.0.1:8000/api/v1/campaign/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create campaign")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: `Campaign "${formData.name}" created successfully!`,
      })

      // Reset form
      setFormData({
        name: "",
        platform: "google",
        platform_campaign_ids: [],
        track_impressions: true,
        track_sessions: true,
        real_time_updates: true,
        update_interval_minutes: 15,
        oauth_credentials: {},
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Summer Product Launch"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform *</Label>
        <Select value={formData.platform} onValueChange={handlePlatformChange}>
          <SelectTrigger id="platform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="facebook">Facebook Ads</SelectItem>
            <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
            <SelectItem value="twitter">Twitter Ads</SelectItem>
            <SelectItem value="tiktok">TikTok Ads</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-id">Platform Campaign IDs</Label>
        <div className="flex gap-2">
          <Input
            id="campaign-id"
            placeholder="Enter campaign ID"
            value={campaignIdInput}
            onChange={(e) => setCampaignIdInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCampaignId())}
          />
          <Button type="button" onClick={addCampaignId} variant="outline">
            Add
          </Button>
        </div>
        {formData.platform_campaign_ids.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.platform_campaign_ids.map((id) => (
              <div
                key={id}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {id}
                <button type="button" onClick={() => removeCampaignId(id)} className="hover:opacity-70">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Tracking Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="track_impressions"
              checked={formData.track_impressions}
              onCheckedChange={(checked) => handleCheckboxChange("track_impressions", checked as boolean)}
            />
            <Label htmlFor="track_impressions" className="font-normal cursor-pointer">
              Track Impressions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="track_sessions"
              checked={formData.track_sessions}
              onCheckedChange={(checked) => handleCheckboxChange("track_sessions", checked as boolean)}
            />
            <Label htmlFor="track_sessions" className="font-normal cursor-pointer">
              Track Sessions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="real_time_updates"
              checked={formData.real_time_updates}
              onCheckedChange={(checked) => handleCheckboxChange("real_time_updates", checked as boolean)}
            />
            <Label htmlFor="real_time_updates" className="font-normal cursor-pointer">
              Real-time Updates
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="update_interval">Update Interval (minutes)</Label>
        <Input
          id="update_interval"
          name="update_interval_minutes"
          type="number"
          min="1"
          max="1440"
          value={formData.update_interval_minutes}
          onChange={handleInputChange}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Campaign..." : "Create Campaign"}
      </Button>
    </form>
  )
}
