"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { Link2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from 'react';
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog';
import { DashboardHeader } from "@/components/DashboardHeader";

export default function IntegrationsPage() {
  const { status, isLoading } = useGoogleAds();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
            <p className="text-muted-foreground mt-2">
              Connect and manage your advertising platform integrations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Google Ads Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Link2 className="h-5 w-5 text-blue-600" />
                    </div>
                    Google Ads
                  </CardTitle>
                  {isLoading ? (
                    <Badge variant="secondary">Loading...</Badge>
                  ) : status?.is_connected ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Track your Google Ads campaigns and measure carbon emissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status?.is_connected ? (
                  <div className="space-y-3">
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">Account</p>
                      <p className="font-medium">{status.customer_name}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">Customer ID</p>
                      <p className="font-mono text-xs">{status.customer_id}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">Email</p>
                      <p className="text-xs">{status.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setConnectDialogOpen(true)}
                    >
                      Manage Connection
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setConnectDialogOpen(true)}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect Google Ads
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Facebook Ads (Coming Soon) */}
            <Card className="opacity-60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Link2 className="h-5 w-5 text-blue-600" />
                    </div>
                    Facebook Ads
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Track Facebook advertising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Facebook Ads
                </Button>
              </CardContent>
            </Card>

            {/* LinkedIn Ads (Coming Soon) */}
            <Card className="opacity-60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Link2 className="h-5 w-5 text-blue-600" />
                    </div>
                    LinkedIn Ads
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Track LinkedIn advertising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect LinkedIn Ads
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={status?.is_connected}
      />
    </>
  );
}