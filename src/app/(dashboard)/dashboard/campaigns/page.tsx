'use client'

import type React from 'react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useGoogleAds } from '@/contexts/GoogleAdsContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  AlertCircle,
  Link2,
  CheckCircle,
  ExternalLink,
  Copy,
  Info,
  Search,
  MoreVertical,
  ArrowUp,
} from 'lucide-react'
import { campaignApi } from '@/services/campaign/campaign'
import { CreateCampaignDialog } from '@/components/dashboard/campaign/CreateCampaignsDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { status, isLoading: adsLoading, isSwitchingAccount } = useGoogleAds()

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.list,
  })

  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
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
    <div className="flex-1 overflow-auto ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 ">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Campaigns
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Tabs defaultValue="google" className="w-full sm:w-auto">
                <TabsList className="bg-muted/50 rounded-lg p-1">
                  <TabsTrigger
                    value="google"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Google
                  </TabsTrigger>
                  <TabsTrigger
                    value="meta"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Meta
                  </TabsTrigger>
                  <TabsTrigger
                    value="linkedin"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    LinkedIn
                  </TabsTrigger>
                  <TabsTrigger
                    value="snapchat"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Snapchat
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Input
                    type="text"
                    placeholder="Search campaigns..."
                    className="border-border bg-background focus:ring-ring pl-10"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                </div>

                <Button
                  onClick={handleCreateClick}
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-1 h-4 w-4" /> New Campaign
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border  rounded-sm h-24 bg-white text-card-foreground">
              <CardContent>
                <div className="text-3xl font-bold">{campaigns?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active and draft campaigns
                </p>
              </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns?.reduce((sum, c) => sum + (c.utm_params?.length || 0), 0) ||
                    0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Across all campaigns</p>
              </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns?.filter((c) => c.google_ads_campaign_id).length || 0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Synced campaigns</p>
              </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns?.filter((c) => c.tracking_url_example).length || 0}
                </div>
                <p className="text-xs text-[#6c5f31]/70">Ready to use</p>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive" className="border-0 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Failed to load campaigns: {error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="pb-8">
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="hover:shadow-lg bg-white rounded-md hover:border-[#ff8904]/20 transition-all duration-200 cursor-pointer border"
                    onClick={() => router.push(`/dashboard/campaigns/${campaign?.external_id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1 font-semibold text-foreground">
                            {campaign.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {campaign.utm_params?.length || 0} UTM parameters
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/dashboard/campaigns/${campaign.id}`)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${campaign.name}"?`
                                  )
                                ) {
                                  deleteMutation.mutate(campaign.id)
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Campaign ID</span>
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground border-0 font-mono text-xs"
                        >
                          #{campaign.id}
                        </Badge>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="font-semibold text-sm text-foreground flex items-center justify-center gap-2">
                              {new Intl.NumberFormat().format(
                                campaign.total_impressions || 0
                              )}
                              {campaign.today_impressions > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-600 font-medium"
                                >
                                  +
                                  {new Intl.NumberFormat().format(
                                    campaign.today_impressions
                                  )}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">Impressions</p>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground flex items-center justify-center gap-2">
                              {campaign.total_clicks}
                              {campaign.last_24h_clicks > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-600 font-medium"
                                >
                                  +
                                  {new Intl.NumberFormat().format(
                                    campaign.last_24h_clicks
                                  )}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">Clicks</p>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground flex items-center justify-center gap-2">
                              {parseFloat(campaign.total_emissions_kg || '0').toFixed(2)}{' '}
                              kg
                              {campaign.today_emissions_kg > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-600 font-medium"
                                >
                                  {/* +{(campaign.today_emissions_kg).toFixed(3)} kg */}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">Emissions</p>
                          </div>
                        </div>
                      </div>

                      {campaign.google_ads_campaign_id && (
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/dsp/google-ads.svg"
                              alt="Google Ads"
                              width={20}
                              height={20}
                            />
                            <span className="text-sm text-muted-foreground">
                              Google Ads
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-medium border-border bg-muted/50 text-muted-foreground"
                          >
                            Synced
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card rounded-md">
                <CardContent className="flex flex-col items-center  justify-center py-16">
                  <div className="p-4 bg-muted rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No campaigns yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    {status?.is_connected
                      ? 'Create your first campaign with UTM parameters to start tracking your advertising performance'
                      : 'Connect your Google Ads account to start creating campaigns'}
                  </p>
                  {status?.is_connected ? (
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Campaign
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push('/dashboard/integrations')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Connect Google Ads
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}
