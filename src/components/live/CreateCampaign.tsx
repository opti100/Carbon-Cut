"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";
import { campaignApi } from "@/services/campaign/campaign";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function CreateCampaign({ isActive, isCompleted, onComplete }: Props) {
  const { status, isLoading: adsLoading } = useGoogleAds();
  
  // Check if user has any campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.list,
    staleTime: 30 * 1000,
  });

  const hasCampaigns = campaigns && campaigns.length > 0;
  const latestCampaign = hasCampaigns ? campaigns[0] : null;

  // Auto-complete if user has campaigns and this step is active
  useEffect(() => {
    if (hasCampaigns && !isCompleted && isActive) {
      setTimeout(() => onComplete(), 100);
    }
  }, [hasCampaigns, isCompleted, isActive, onComplete]);

  const handleCreateCampaign = () => {
    if (!status?.is_connected) {
      alert('Please connect your Google Ads account before creating campaigns.');
      return;
    }
    window.dispatchEvent(new CustomEvent('openCreateCampaignDialog'));
  };

  const isCompleteState = isCompleted || hasCampaigns;
  const isConnected = status?.is_connected === true;

  return (
    <Card
      className={`
        h-full flex flex-col relative transition-all duration-300 overflow-hidden
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}
        ${isCompleteState ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"}
        ${!isActive && !isCompleteState ? "opacity-60" : ""}
      `}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Header - Compact */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Rocket className="h-4 w-4 text-orange-600" />
            </div>
            {isCompleteState && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Create Campaign</h3>
          <p className="text-xs text-gray-600">Set up tracking campaign</p>
        </div>

        {/* Content - Minimal */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {isCompleteState ? (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                <p className="text-xs text-gray-700">Campaign created</p>
              </div>
              {latestCampaign && (
                <div className="bg-white rounded px-2 py-1 border text-xs text-gray-600">
                  <span className="font-medium">Name:</span> {latestCampaign.name.slice(0, 15)}...
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">Campaign name</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">UTM parameters</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isActive && !isCompleteState && (
            <Button 
              size="sm"
              onClick={handleCreateCampaign}
              disabled={!isConnected || adsLoading || isLoading}
              className="w-full text-white bg-orange-600 hover:bg-orange-700 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {isLoading ? 'Checking...' : !isConnected ? 'Connect First' : 'Create'}
            </Button>
          )}

          {isCompleteState && (
            <Button variant="outline" size="sm" className="w-full text-green-700 border-green-200 text-xs" disabled>
              <CheckCircle className="h-3 w-3 mr-1" />
              Created
            </Button>
          )}
        </div>
      </div>

   
    </Card>
  );
}