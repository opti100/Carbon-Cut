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
import { GoogleAdsReconnectBanner } from "@/components/dashboard/google-ads/GoogleAdsReconnectBanner"

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
      <GoogleAdsReconnectBanner/>
      <div className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-[#fcfdf6]">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">Campaigns</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your advertising campaigns with UTM tracking</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <GoogleAdsConnectDialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen} />
              <Button
                onClick={handleCreateClick}
                disabled={!status?.is_connected || adsLoading || isSwitchingAccount}
                className="bg-[#b0ea1d] hover:bg-[#6c5f31] hover:text-white text-[#080c04] font-medium transition-all duration-200 rounded-lg shadow-sm flex-1 sm:flex-initial"
              >
                <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {isSwitchingAccount ? "Switching Account..." : "Create Campaign"}
              </Button>
            </div>
          </div>

          {!status?.is_connected && !adsLoading && (
            <Alert className="bg-[#fcfdf6] border-2 border-[#d1cebb] rounded-lg">
              <AlertCircle className="h-5 w-5 text-[#6c5f31] shrink-0" />
              <AlertDescription className="text-[#080c04] ml-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">Complete Your Onboarding to connect your Google Ads account</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto border-2 border-[#d1cebb] hover:border-[#F0db18] text-[#6c5f31] whitespace-nowrap bg-[#fcfdf6] transition-all duration-200"
                    onClick={() => router.push("/live")}
                  >
                    Connect Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status?.is_connected && (
            <Alert className="bg-[#fcfdf6] border-2 border-[#d1cebb] rounded-lg">
              <CheckCircle className="h-5 w-5 text-[#6c5f31] shrink-0" />
              <AlertDescription className="text-[#080c04] ml-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">Google Ads is connected. Ready to track campaigns.</span>
                  {status.customer_name && (
                    <Badge
                     
                      className="bg-[#fcfdf6]  text-[#6c5f31] font-mono text-xs shrink-0"
                    >
                      {status.customer_name}
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-[#d1cebb] bg-[#fcfdf6] hover:border-[#F0db18] transition-all duration-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-[#6c5f31]">Total Campaigns</CardTitle>
                  <div >
                    <TrendingUp className="h-4 w-4 text-[#6c5f31]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[#6c5f31]">{campaigns?.length || 0}</div>
                <p className="text-xs text-[#6c5f31]/70">Active campaigns tracking</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#d1cebb] bg-[#fcfdf6] hover:border-[#F0db18] transition-all duration-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-[#6c5f31]">UTM Parameters</CardTitle>
                  <div >
                    <Link2 className="h-4 w-4 text-[#6c5f31]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[#6c5f31]">
                  {campaigns?.reduce((sum, c) => sum + (c.utm_params?.length || 0), 0) || 0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Across all campaigns</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#d1cebb] bg-[#fcfdf6] hover:border-[#F0db18] transition-all duration-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-[#6c5f31]">Google Ads Linked</CardTitle>
                  <div >
                    <ExternalLink className="h-4 w-4 text-[#080c04]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[#6c5f31]">
                  {campaigns?.filter((c) => c.google_ads_campaign_id).length || 0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Synced campaigns</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#d1cebb] bg-[#fcfdf6] hover:border-[#F0db18] transition-all duration-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-[#6c5f31]">Tracking URLs</CardTitle>
                  <div >
                    <Link2 className="h-4 w-4 text-[#6c5f31]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[#6c5f31]">
                  {campaigns?.filter((c) => c.tracking_url_example).length || 0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Ready to use</p>
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
                <Card key={i} className="border-2 border-[#d1cebb] animate-pulse bg-[#fcfdf6] shadow-sm">
                  <CardHeader>
                    <div className="h-5 bg-[#d1cebb] rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-[#d1cebb] rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-[#d1cebb] rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            /* redesigned campaign cards with improved visual hierarchy and hover effects */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="border-2 border-[#d1cebb] hover:border-[#F0db18] transition-all duration-200 cursor-pointer bg-[#fcfdf6] shadow-sm"
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
                          className="shrink-0 bg-[#fcfdf6] text-[#6c5f31] border-2 border-[#d1cebb] font-mono text-xs"
                        >
                          #{campaign.id}
                        </Badge>
                        <Button
                          size="sm"
                          
                          className="h-7 w-7 p-0 text-[#6c5f31] bg-[#fcfdf6] border-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
                              deleteMutation.mutate(campaign.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 " />
                        </Button>
                      </div>
                    </div>
                    {campaign.google_ads_campaign_id && (
                      <Badge
                        variant="outline"
                        className="w-fit text-xs font-medium border-2 border-[#d1cebb] bg-[#fcfdf6] text-[#6c5f31] mt-2"
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
                          <span className="text-[#6c5f31]">Campaign ID</span>
                          <code className="bg-[#fcfdf6] border-2 border-[#d1cebb] px-2 py-1 rounded text-xs text-[#6c5f31] font-mono font-medium">
                            {campaign.google_ads_campaign_id}
                          </code>
                        </div>
                        {campaign.google_ads_customer_id && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#6c5f31]">Customer ID</span>
                            <code className="bg-[#fcfdf6] border-2 border-[#d1cebb] px-2 py-1 rounded text-xs text-[#6c5f31] font-mono font-medium">
                              {campaign.google_ads_customer_id}
                            </code>
                          </div>
                        )}
                      </div>
                    )}

                    {campaign.utm_params && campaign.utm_params.length > 0 && (
                      <div className="space-y-2 border-t border-[#d1cebb] pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#080c04]">
                          <Link2 className="h-4 w-4 text-[#b0ea1d]" />
                          <span>UTM Parameters ({campaign.utm_params.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {campaign.utm_params.slice(0, 3).map((utm, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs font-mono bg-[#fcfdf6] p-2 rounded border-2 border-[#d1cebb]"
                            >
                              <span className="text-[#b0ea1d] font-bold">{utm.key}</span>
                              <span className="text-[#6c5f31]">=</span>
                              <span className="text-[#080c04] truncate">{utm.value}</span>
                            </div>
                          ))}
                          {campaign.utm_params.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-[#fcfdf6] text-[#6c5f31] border-2 border-[#d1cebb]">
                              +{campaign.utm_params.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {campaign.tracking_url_example && (
                      <div className="space-y-2 border-t border-[#d1cebb] pt-4">
                        <div className="text-sm font-semibold flex items-center gap-2 text-[#080c04]">
                          <Link2 className="h-4 w-4 text-[#b0ea1d]" />
                          <span>Tracking URL</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#fcfdf6] p-2 rounded border-2 border-[#d1cebb]">
                          <code className="text-xs truncate flex-1 text-[#080c04]">
                            {campaign.tracking_url_example}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-[#fcfdf6] hover:text-[#6c5f31] shrink-0 transition-all duration-200"
                            onClick={(e) => copyTrackingUrl(campaign.tracking_url_example!, e)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {(!campaign.utm_params || campaign.utm_params.length === 0) && !campaign.tracking_url_example && (
                      <div className="text-sm text-[#6c5f31] italic p-3 bg-[#fcfdf6] rounded border-2 border-[#d1cebb]">
                        No UTM parameters configured yet
                      </div>
                    )}

                    {campaign.created_at && (
                      <div className="text-xs text-[#6c5f31]/70 pt-3 border-t border-[#d1cebb]">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* redesigned empty state with better visual hierarchy */
            <Card className="border-2 border-[#d1cebb] bg-[#fcfdf6] shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                <div className="p-3 sm:p-4 bg-[#fcfdf6] border-2 border-[#d1cebb] rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-[#6c5f31]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#080c04]">No campaigns yet</h3>
                <p className="text-sm sm:text-base text-[#6c5f31] text-center mb-6 max-w-md">
                  {status?.is_connected
                    ? "Create your first campaign with UTM parameters to start tracking your advertising performance"
                    : "Connect your Google Ads account to start creating campaigns"}
                </p>
                {status?.is_connected ? (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#b0ea1d] hover:bg-[#6c5f31] hover:text-white text-[#080c04] transition-all duration-200 rounded-lg shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/dashboard/integrations")}
                    className="bg-[#b0ea1d] hover:bg-[#6c5f31] hover:text-white text-[#080c04] transition-all duration-200 rounded-lg shadow-sm"
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
