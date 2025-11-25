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
      <div className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-linear-to-br from-[#fcfdf6] via-[#f5f7e8] to-[#eef2d9]">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#080c04]">Integrations</h1>
              <p className="mt-2 text-sm sm:text-base text-[#6c5f31]">
                Connect and manage your third-party integrations
              </p>
            </div>
          </div>

          {isLoading ? (
            <Card className="border border-white/40 bg-white/30 backdrop-blur-2xl shadow-xl rounded-2xl">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#b0ea1d]" />
                <p className="text-sm text-[#6c5f31]">Loading integrations...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Google Ads Integration */}
              <Card className="border border-white/40 hover:border-white/60 transition-all duration-300 bg-white/30 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] rounded-2xl group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/30 backdrop-blur-lg border border-white/20 ckdrop-blur-lg border border-white/20 ckdrop-blur-lg border border-white/30">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            fill="#b0ea1d"
                            fillOpacity="0.3"
                          />
                          <path
                            d="M2 17L12 22L22 17"
                            stroke="#b0ea1d"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12L12 17L22 12"
                            stroke="#b0ea1d"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#080c04]">Google Ads</CardTitle>
                        <CardDescription className="text-xs text-[#6c5f31]">
                          Campaign tracking & analytics
                        </CardDescription>
                      </div>
                    </div>
                    {isConnected ? (
                      <Badge className="bg-white/40 backdrop-blur-lg text-[#6c5f31] border border-white/30 rounded-xl">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border border-white/30 text-[#6c5f31] bg-white/30 backdrop-blur-lg rounded-xl">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isConnected && status ? (
                    <Alert className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-xl">
                      <CheckCircle className="h-4 w-4 text-[#6c5f31]" />
                      <AlertDescription className="text-[#080c04]">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-[#080c04]">{status.customer_name}</p>
                          <p className="text-xs text-[#6c5f31]">ID: {status.customer_id}</p>
                          <p className="text-xs text-[#6c5f31]">Email: {status.email}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-xl">
                      <AlertCircle className="h-4 w-4 text-[#6c5f31]" />
                      <AlertDescription className="text-sm text-[#080c04]">
                        Connect your Google Ads account to start tracking campaigns and carbon emissions.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#6c5f31]">
                      <CheckCircle className="h-4 w-4 text-[#6c5f31]" />
                      <span>Campaign performance tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6c5f31]">
                      <CheckCircle className="h-4 w-4 text-[#6c5f31]" />
                      <span>Automated UTM generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6c5f31]">
                      <CheckCircle className="h-4 w-4 text-[#6c5f31]" />
                      <span>Carbon footprint analytics</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border border-white/40 hover:border-white/60 text-[#080c04] bg-white/30 backdrop-blur-lg transition-all duration-300 hover:shadow-lg rounded-xl"
                          onClick={() => setConnectDialogOpen(true)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border border-white/40 hover:border-white/60 text-[#080c04] bg-white/30 backdrop-blur-lg transition-all duration-300 hover:shadow-lg rounded-xl"
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
                        className="w-full bg-[#b0ea1d]/90 hover:bg-[#6c5f31]/90 backdrop-blur-xl hover:text-white text-[#080c04] transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl border border-white/20"
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect Google Ads
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon Cards */}
              <Card className="border border-white/30 bg-white/20 backdrop-blur-xl opacity-60 hover:opacity-100 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl shadow-xl hover:shadow-2xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(209, 206, 187, 0.3)' }}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#6c5f31' }}>
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#080c04]">Meta Ads</CardTitle>
                        <CardDescription className="text-xs text-[#6c5f31]">
                          Facebook & Instagram campaigns
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-2 border-[#d1cebb] text-[#6c5f31] bg-[#fcfdf6]">
                      Coming Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm" style={{ color: '#6c5f31' }}>
                    Track your Facebook and Instagram advertising campaigns and their environmental impact.
                  </p>
                  <Button disabled className="w-full border border-white/40 text-[#6c5f31] bg-white/30 backdrop-blur-lg rounded-xl" variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-white/30 bg-white/20 backdrop-blur-xl opacity-60 hover:opacity-100 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(209, 206, 187, 0.3)' }}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#6c5f31' }}>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#080c04]">LinkedIn Ads</CardTitle>
                        <CardDescription className="text-xs text-[#6c5f31]">
                          B2B campaign tracking
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-2 border-[#d1cebb] text-[#6c5f31] bg-[#edede2]">
                      Coming Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#6c5f31]">
                    Monitor LinkedIn advertising campaigns and measure their carbon footprint.
                  </p>
                  <Button disabled className="w-full border border-white/40 text-[#6c5f31] bg-white/30 backdrop-blur-lg rounded-xl" variant="outline">
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