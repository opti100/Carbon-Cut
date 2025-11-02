"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Link2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onOpenConnectDialog?: () => void;
}

export default function ConnectGoogleAds({ isActive, isCompleted, onComplete, onOpenConnectDialog }: Props) {
  const { status, isLoading: adsLoading } = useGoogleAds();
  
  // Check if already connected and auto-complete
  const isConnected = status?.is_connected === true;
  
  // Auto-complete if connected
  if (isConnected && !isCompleted && isActive) {
    setTimeout(() => onComplete(), 100);
  }

  const handleConnectClick = () => {
    if (onOpenConnectDialog) {
      onOpenConnectDialog();
    } else {
      // Fallback: trigger global dialog by dispatching a custom event
      window.dispatchEvent(new CustomEvent('openGoogleAdsDialog'));
    }
  };

  return (
    <Card
      className={`
        h-full flex flex-col relative transition-all duration-300 overflow-hidden
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}
        ${isCompleted || isConnected ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"}
        ${!isActive && !isCompleted && !isConnected ? "opacity-60" : ""}
      `}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Header - Compact */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-blue-600" />
            </div>
            {(isCompleted || isConnected) && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Connect Account</h3>
          <p className="text-xs text-gray-600">Link your Google Ads account</p>
        </div>

        {/* Content - Minimal */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {(isCompleted || isConnected) ? (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                <p className="text-xs text-gray-700">Connected</p>
              </div>
              <div className="text-xs text-gray-600 bg-white rounded px-2 py-1 border">
                <span className="font-medium">ID:</span> {status?.customer_id?.slice(-8) || 'N/A'}
              </div>
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">OAuth authentication</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">Read-only access</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isActive && !isCompleted && !isConnected && (
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-xs"
              onClick={handleConnectClick}
              disabled={adsLoading}
            >
              {adsLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Checking...
                </>
              ) : (
                <>
                  <Link2 className="h-3 w-3 mr-1" />
                  Connect
                </>
              )}
            </Button>
          )}

          {(isCompleted || isConnected) && (
            <Button variant="outline" size="sm" className="w-full text-green-700 border-green-200 text-xs" disabled>
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Button>
          )}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && !isCompleted && !isConnected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      )}
    </Card>
  );
}