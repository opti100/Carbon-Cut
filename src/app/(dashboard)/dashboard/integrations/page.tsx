"use client";

import React, { useState } from 'react';
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog';

// A simple component for the integration icons
const IntegrationIcon = ({ platform }: { platform: 'google' | 'meta' | 'snapchat' | 'linkedin' }) => {
  const icons = {
    google: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff8904" fillOpacity="0.3" />
        <path d="M2 17L12 22L22 17" stroke="#ff8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="#ff8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    meta: (
      <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    snapchat: (
        <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.41 0 4.655-.713 6.5-1.944.224.6.66 1.534 1.5 2.5.5.6 1.2.8 1.8.3.6-.5.7-1.3.3-1.8-.8-1-1.9-2.3-2.5-3.5.8-1.6 1.4-3.4 1.4-5.556C24 5.373 18.627 0 12 0zm0 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/>
        </svg>
    ),
    linkedin: (
      <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  };
  return <div className="w-10 h-10 p-1">{icons[platform]}</div>;
};

export default function IntegrationsPage() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const { status, isLoading, checkConnection } = useGoogleAds();

  const handleConnectionSuccess = () => {
    checkConnection();
  };

  const isConnected = status?.is_connected === true;

  const integrations = [
    {
      name: 'Google Ads',
      description: 'Connect your Google Ads account',
      icon: <IntegrationIcon platform="google" />,
      action: () => setConnectDialogOpen(true),
      status: isConnected ? 'Manage' : 'Connect',
      isLoading: isLoading,
    },
    {
      name: 'Meta Ads',
      description: 'Track Facebook & Instagram campaigns',
      icon: <IntegrationIcon platform="meta" />,
      status: 'Coming Soon',
    },
    {
      name: 'Snapchat Ads',
      description: 'Track Snapchat campaigns',
      icon: <IntegrationIcon platform="snapchat" />,
      status: 'Coming Soon',
    },
    {
      name: 'LinkedIn Ads',
      description: 'Track B2B campaigns',
      icon: <IntegrationIcon platform="linkedin" />,
      status: 'Coming Soon',
    },
  ];

  return (
    <>
      <div className="flex-1 overflow-auto bg-background">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-8">
            {/* Header */}
            <div className='space-y-3'>
               <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Integrations</h1>
              {/* <p className="text-muted-foreground mt-2">
                Make CarbonCut even more powerful by using these tools.
              </p> */}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex gap-4 items-start bg-white rounded-md border border-border p-4">
                  <div className="flex-shrink-0">{integration.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    <div className="mt-2">
                      {integration.status === 'Coming Soon' ? (
                        <span className="text-sm text-muted-foreground italic">Coming Soon</span>
                      ) : (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                          onClick={integration.action}
                          disabled={integration.isLoading}
                        >
                          {integration.isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            integration.status
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={isConnected}
        onSuccess={handleConnectionSuccess}
      />
    </>
  );
}

