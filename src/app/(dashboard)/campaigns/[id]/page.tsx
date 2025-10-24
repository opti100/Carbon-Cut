"use client";

import React, { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Link2,
  User,
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";
import { campaignApi } from '@/services/campaign/campaign';

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignApi.get(Number(id)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => campaignApi.delete(Number(id)),
    onSuccess: () => {
      router.push('/campaigns');
    },
  });

  if (campaignLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load campaign details
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge variant="secondary">ID: {campaign.id}</Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Campaign tracking with UTM parameters
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/campaigns/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete this campaign?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User ID</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.user_id}</div>
            <p className="text-xs text-muted-foreground">Campaign owner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UTM Parameters</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.utm_params?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Tracking parameters</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
          <CardDescription>Basic details about this campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Campaign Name</label>
            <p className="text-lg font-semibold">{campaign.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Campaign ID</label>
            <p className="text-lg">{campaign.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="text-lg">{campaign.user_id}</p>
          </div>

          {campaign.created_at && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(campaign.created_at).toLocaleString()}
              </p>
            </div>
          )}

          {campaign.updated_at && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(campaign.updated_at).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UTM Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>UTM Parameters</CardTitle>
              <CardDescription>
                Track your campaign performance with these UTM parameters
              </CardDescription>
            </div>
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {campaign.utm_params && campaign.utm_params.length > 0 ? (
            <div className="space-y-3">
              {campaign.utm_params.map((utm, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono break-all">{utm}</code>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 How to use these UTM parameters:
                </p>
                <p className="text-xs text-blue-700">
                  Append these parameters to your campaign URLs to track traffic sources.
                  Example: <code className="bg-blue-100 px-1 py-0.5 rounded">
                    https://example.com?{campaign.utm_params[0]}
                  </code>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Link2 className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No UTM parameters configured</p>
              <p className="text-sm mb-4">Add UTM parameters to track this campaign</p>
              <Button
                variant="outline"
                onClick={() => router.push(`/campaigns/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}