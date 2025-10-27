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
  CheckCircle
} from "lucide-react";
import { campaignApi } from '@/services/campaign/campaign';
import { CreateCampaignDialog } from '@/components/dashboard/campaign/CreateCampaignsDialog';

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { status, isLoading: adsLoading } = useGoogleAds();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  const handleCreateClick = () => {
    if (!status?.is_connected) {
      alert('Please connect your Google Ads account before creating campaigns.');
      return;
    }
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage your advertising campaigns with UTM tracking
          </p>
        </div>
        <Button 
          onClick={handleCreateClick}
          disabled={!status?.is_connected || adsLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {!status?.is_connected && !adsLoading && (
        <Alert className="mb-6 bg-orange-50 border-orange-200">
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
                onClick={() => router.push('/integrations')}
              >
                Connect Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {status?.is_connected && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Google Ads is connected. You can now create and track campaigns.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 mb-8">
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
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
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
              onClick={() => router.push(`/campaigns/${campaign.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge variant="secondary">
                    ID: {campaign.id}
                  </Badge>
                </div>
                <CardDescription>
                  Campaign for user #{campaign.user_id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.utm_params && campaign.utm_params.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span>UTM Parameters ({campaign.utm_params.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {campaign.utm_params.slice(0, 3).map((utm, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs font-mono"
                          >
                            {utm.length > 25 ? utm.substring(0, 25) + '...' : utm}
                          </Badge>
                        ))}
                        {campaign.utm_params.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{campaign.utm_params.length - 3} more
                          </Badge>
                        )}
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
                      router.push(`/campaigns/${campaign.id}/edit`);
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
                      if (confirm('Are you sure you want to delete this campaign?')) {
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
              <Button onClick={() => router.push('/integrations')}>
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
  );
}