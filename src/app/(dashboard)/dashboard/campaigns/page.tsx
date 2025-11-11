"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useGoogleAds } from "@/contexts/GoogleAdsContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Edit, TrendingUp, AlertCircle, Link2, CheckCircle, ExternalLink, Copy } from "lucide-react"
import { campaignApi } from "@/services/campaign/campaign"
import { CreateCampaignDialog } from "@/components/dashboard/campaign/CreateCampaignsDialog"
import { DashboardHeader } from "@/components/DashboardHeader"
import { GoogleAdsConnectDialog } from "@/components/dashboard/google-ads/GoogleAdsConnectDialog"

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const { status, isLoading: adsLoading, isSwitchingAccount } = useGoogleAds()

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignApi.list,
  })

  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    },
  })

  const handleCreateClick = () => {
    if (!status?.is_connected) {
      return
    }
    if (isSwitchingAccount) {
      return
    }
    setIsCreateDialogOpen(true)
  }

  const copyTrackingUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(url)
  }

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Campaigns" }]} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex justify-between items-start gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-balance">Campaigns</h1>
              <p className="text-base text-muted-foreground">Manage your advertising campaigns with UTM tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <GoogleAdsConnectDialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen} />
              <Button
                onClick={handleCreateClick}
                disabled={!status?.is_connected || adsLoading || isSwitchingAccount}
                className="bg-[#ff8904] hover:bg-[#ff8904]/90 text-white font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isSwitchingAccount ? "Switching Account..." : "Create Campaign"}
              </Button>
            </div>
          </div>

          {!status?.is_connected && !adsLoading && (
            <Alert className="bg-[#ff8904]/10 border-[#ff8904]/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-[#ff8904] flex-shrink-0" />
              <AlertDescription className="text-foreground ml-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">Complete Your Onboarding to connect your Google Ads account</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto border-[#ff8904]/30 hover:bg-[#ff8904]/10 text-[#ff8904] whitespace-nowrap bg-transparent"
                    onClick={() => router.push("/live")}
                  >
                    Connect Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status?.is_connected && (
            <Alert className="bg-green-500/10 border-green-500/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <AlertDescription className="text-foreground ml-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">Google Ads is connected. Ready to track campaigns.</span>
                  {status.customer_name && (
                    <Badge
                      variant="outline"
                      className="bg-background border-green-500/30 text-green-700 font-mono text-xs shrink-0"
                    >
                      {status.customer_name}
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-gradient-to-br from-[#ff8904]/10 to-[#ff8904]/5 hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
                  <div className="p-2 bg-[#ff8904]/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-[#ff8904]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[#ff8904]">{campaigns?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active campaigns tracking</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">UTM Parameters</CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Link2 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-blue-600">
                  {campaigns?.reduce((sum, c) => sum + (c.utm_params?.length || 0), 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Across all campaigns</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Google Ads Linked</CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-purple-600">
                  {campaigns?.filter((c) => c.google_ads_campaign_id).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Synced campaigns</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tracking URLs</CardTitle>
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Link2 className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-emerald-600">
                  {campaigns?.filter((c) => c.tracking_url_example).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive" className="border-0 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">Failed to load campaigns: {error.message}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 animate-pulse bg-muted/30">
                  <CardHeader>
                    <div className="h-5 bg-muted-foreground/20 rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            /* redesigned campaign cards with improved visual hierarchy and hover effects */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="border-0 hover:shadow-lg hover:border-[#ff8904]/20 transition-all duration-200 cursor-pointer bg-card"
                  onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 font-semibold">{campaign.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-[#ff8904]/10 text-[#ff8904] border-0 font-mono text-xs"
                        >
                          #{campaign.id}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
                              deleteMutation.mutate(campaign.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {campaign.google_ads_campaign_id && (
                      <Badge
                        variant="outline"
                        className="w-fit text-xs font-medium border-0 bg-purple-500/10 text-purple-700 mt-2"
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        Google Ads
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {campaign.google_ads_campaign_id && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Campaign ID</span>
                          <code className="bg-[#ff8904]/10 px-2 py-1 rounded text-xs text-[#ff8904] font-mono font-medium">
                            {campaign.google_ads_campaign_id}
                          </code>
                        </div>
                        {campaign.google_ads_customer_id && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Customer ID</span>
                            <code className="bg-blue-500/10 px-2 py-1 rounded text-xs text-blue-700 font-mono font-medium">
                              {campaign.google_ads_customer_id}
                            </code>
                          </div>
                        )}
                      </div>
                    )}

                    {campaign.utm_params && campaign.utm_params.length > 0 && (
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Link2 className="h-4 w-4 text-[#ff8904]" />
                          <span>UTM Parameters ({campaign.utm_params.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {campaign.utm_params.slice(0, 3).map((utm, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs font-mono bg-muted/50 p-2 rounded border border-border"
                            >
                              <span className="text-[#ff8904] font-bold">{utm.key}</span>
                              <span className="text-muted-foreground">=</span>
                              <span className="text-foreground truncate">{utm.value}</span>
                            </div>
                          ))}
                          {campaign.utm_params.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-[#ff8904]/10 text-[#ff8904] border-0">
                              +{campaign.utm_params.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {campaign.tracking_url_example && (
                      <div className="space-y-2 border-t pt-4">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-blue-600" />
                          <span>Tracking URL</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border">
                          <code className="text-xs truncate flex-1 text-foreground">
                            {campaign.tracking_url_example}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-[#ff8904]/10 hover:text-[#ff8904] flex-shrink-0"
                            onClick={(e) => copyTrackingUrl(campaign.tracking_url_example!, e)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {(!campaign.utm_params || campaign.utm_params.length === 0) && !campaign.tracking_url_example && (
                      <div className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded">
                        No UTM parameters configured yet
                      </div>
                    )}

                    {campaign.created_at && (
                      <div className="text-xs text-muted-foreground pt-3 border-t">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* redesigned empty state with better visual hierarchy */
            <Card className="border-0 bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-[#ff8904]/10 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-[#ff8904]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {status?.is_connected
                    ? "Create your first campaign with UTM parameters to start tracking your advertising performance"
                    : "Connect your Google Ads account to start creating campaigns"}
                </p>
                {status?.is_connected ? (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#ff8904] hover:bg-[#ff8904]/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/dashboard/integrations")}
                    className="bg-[#ff8904] hover:bg-[#ff8904]/90 text-white"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect Google Ads
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <CreateCampaignDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </div>
      </div>
    </>
  )
}
