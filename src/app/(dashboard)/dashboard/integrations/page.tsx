"use client";

import React, { useState } from 'react';
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, CheckCircle, AlertCircle, ExternalLink, Settings, Loader2 } from "lucide-react";
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function IntegrationsPage() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const { status, isLoading, checkConnection } = useGoogleAds();

  const handleConnectionSuccess = () => {
    checkConnection();
  };

  const isConnected = status?.is_connected === true;

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Integrations" },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
              <p className="text-muted-foreground mt-2">
                Connect and manage your third-party integrations
              </p>
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ff8904] mb-4" />
                <p className="text-sm text-muted-foreground">Loading integrations...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Google Ads Integration */}
              <Card className={`hover:shadow-md transition-all ${isConnected ? 'border-tertiary/30' : 'border-gray-200'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#ff8904]/10 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            fill="#ff8904"
                            fillOpacity="0.3"
                          />
                          <path
                            d="M2 17L12 22L22 17"
                            stroke="#ff8904"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12L12 17L22 12"
                            stroke="#ff8904"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Google Ads</CardTitle>
                        <CardDescription className="text-xs">
                          Campaign tracking & analytics
                        </CardDescription>
                      </div>
                    </div>
                    {isConnected ? (
                      <Badge className="bg-tertiary/20 text-tertiary border-tertiary/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-300">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isConnected && status ? (
                    <Alert className="bg-tertiary/10 border-tertiary/30">
                      <CheckCircle className="h-4 w-4 text-tertiary" />
                      <AlertDescription className="text-gray-800">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{status.customer_name}</p>
                          <p className="text-xs text-muted-foreground">ID: {status.customer_id}</p>
                          <p className="text-xs text-muted-foreground">Email: {status.email}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-[#ff8904]/10 border-[#ff8904]/30">
                      <AlertCircle className="h-4 w-4 text-[#ff8904]" />
                      <AlertDescription className="text-gray-800 text-sm">
                        Connect your Google Ads account to start tracking campaigns and carbon emissions.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-tertiary" />
                      <span>Campaign performance tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-tertiary" />
                      <span>Automated UTM generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-tertiary" />
                      <span>Carbon footprint analytics</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#ff8904]/30 hover:bg-[#ff8904]/10"
                          onClick={() => setConnectDialogOpen(true)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Ads
                          </a>
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setConnectDialogOpen(true)}
                        className="w-full bg-[#ff8904] hover:bg-[#ff8904]/90"
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect Google Ads
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon Cards */}
              <Card className="opacity-60 hover:opacity-100 transition-opacity border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Meta Ads</CardTitle>
                        <CardDescription className="text-xs">
                          Facebook & Instagram campaigns
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-300">
                      Coming Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Track your Facebook and Instagram advertising campaigns and their environmental impact.
                  </p>
                  <Button disabled className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="opacity-60 hover:opacity-100 transition-opacity border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">LinkedIn Ads</CardTitle>
                        <CardDescription className="text-xs">
                          B2B campaign tracking
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-300">
                      Coming Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Monitor LinkedIn advertising campaigns and measure their carbon footprint.
                  </p>
                  <Button disabled className="w-full" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <GoogleAdsConnectDialog
            open={connectDialogOpen}
            onOpenChange={setConnectDialogOpen}
            isConnected={isConnected}
            onSuccess={handleConnectionSuccess}
          />
        </div>
      </div>
    </>
  );
}