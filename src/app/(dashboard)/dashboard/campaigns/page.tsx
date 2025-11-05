"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  AlertCircle,
  Link2,
  CheckCircle,
  ExternalLink,
  Copy
} from "lucide-react";
import { campaignApi } from '@/services/campaign/campaign';
import { CreateCampaignDialog } from '@/components/dashboard/campaign/CreateCampaignsDialog';
import { DashboardHeader } from '@/components/DashboardHeader';
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog';
// import { useToast } from '@/hooks/use-toast';

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  // const { toast } = useToast();
  const { status, isLoading: adsLoading, isSwitchingAccount } = useGoogleAds();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // toast({
      //   title: "Campaign Deleted",
      //   description: "Campaign has been deleted successfully.",
      // });
    },
    onError: () => {
      // toast({
      //   title: "Error",
      //   description: "Failed to delete campaign.",
      //   variant: "destructive",
      // });
    },
  });

  const handleCreateClick = () => {
    if (!status?.is_connected) {
      // toast({
      //   title: "Google Ads Not Connected",
      //   description: "Please connect your Google Ads account before creating campaigns.",
      //   variant: "destructive",
      // });
      return;
    }
    if (isSwitchingAccount) {
      // toast({
      //   title: "Please Wait",
      //   description: "We're switching your account. Please try again in a moment.",
      //   variant: "default",
      // });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const copyTrackingUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    // toast({
    //   title: "Copied!",
    //   description: "Tracking URL copied to clipboard.",
    // });
  };

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Campaigns" },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
              <p className="text-muted-foreground mt-2">
                Manage your advertising campaigns with UTM tracking
              </p>
            </div>
            <GoogleAdsConnectDialog
              open={connectDialogOpen}
              onOpenChange={setConnectDialogOpen}
            />
            <Button
              onClick={handleCreateClick}
              disabled={!status?.is_connected || adsLoading || isSwitchingAccount}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isSwitchingAccount ? 'Switching Account...' : 'Create Campaign'}
            </Button>
          </div>

          {!status?.is_connected && !adsLoading && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <span>
                    You need to connect your Google Ads account before creating campaigns.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => router.push('/dashboard/integrations')}
                  >
                    Connect Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status?.is_connected && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="flex items-center justify-between">
                  <span>Google Ads is connected. You can now create and track campaigns.</span>
                  {status.customer_name && (
                    <Badge variant="outline" className="bg-white">
                      {status.customer_name}
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active campaigns tracking
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total UTM Parameters</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns?.reduce((sum, c) => sum + (c.utm_params?.length || 0), 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Google Ads Campaigns</CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns?.filter(c => c.google_ads_campaign_id).length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Linked to Google Ads
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tracking URLs</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns?.filter(c => c.tracking_url_example).length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready to use
                </p>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load campaigns: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-2">{campaign.name}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        #{campaign.id}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      {campaign.google_ads_campaign_id && (
                        <Badge variant="outline" className="text-xs font-mono">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Google Ads
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Google Ads Info */}
                      {campaign.google_ads_campaign_id && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="font-medium">Campaign ID:</span>
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                              {campaign.google_ads_campaign_id}
                            </code>
                          </div>
                          {campaign.google_ads_customer_id && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium">Customer ID:</span>
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                {campaign.google_ads_customer_id}
                              </code>
                            </div>
                          )}
                        </div>
                      )}

                      {/* UTM Parameters */}
                      {campaign.utm_params && campaign.utm_params.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span>UTM Parameters ({campaign.utm_params.length})</span>
                          </div>
                          <div className="space-y-1">
                            {campaign.utm_params.slice(0, 3).map((utm, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 text-xs font-mono bg-gray-50 p-1.5 rounded"
                              >
                                <span className="text-blue-600 font-semibold">{utm.key}</span>
                                <span className="text-gray-500">=</span>
                                <span className="text-gray-700 truncate">{utm.value}</span>
                              </div>
                            ))}
                            {campaign.utm_params.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{campaign.utm_params.length - 3} more parameters
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tracking URL */}
                      {campaign.tracking_url_example && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span>Tracking URL</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-50 px-2 py-1 rounded flex-1 truncate">
                              {campaign.tracking_url_example}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={(e) => copyTrackingUrl(campaign.tracking_url_example!, e)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {(!campaign.utm_params || campaign.utm_params.length === 0) && (
                        <div className="text-sm text-muted-foreground italic">
                          No UTM parameters configured
                        </div>
                      )}

                      {campaign.created_at && (
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/campaigns/${campaign.id}/edit`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  {status?.is_connected
                    ? 'Create your first campaign with UTM parameters to start tracking your advertising performance'
                    : 'Connect your Google Ads account to start creating campaigns'}
                </p>
                {status?.is_connected ? (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/dashboard/integrations')}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect Google Ads
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <CreateCampaignDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        </div>
      </div>
    </>
  );
}