"use client";

import React, { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  MousePointer,
  Eye,
  DollarSign,
  Leaf,
  Calendar,
  Loader2,
  AlertCircle,
  Download,
  BarChart3,
} from "lucide-react";
import { campaignApi } from '@/services/campaign/campaign';
import { DashboardHeader } from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

const EMISSION_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

interface CampaignAnalyticsPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to safely convert to number
const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

export default function CampaignAnalyticsPage({ params }: CampaignAnalyticsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState({
    start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignApi.get(Number(id)),
  });

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['campaign-analytics', id, dateRange],
    queryFn: () => campaignApi.getAnalytics(id, {
      ...dateRange,
      group_by: 'day',
    }),
    enabled: !!campaign,
  });

  const syncMutation = useMutation({
    mutationFn: (data: { start_date: string; end_date: string }) =>
      campaignApi.syncImpressions(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-analytics', id] });
    },
  });

  const handleSync = () => {
    syncMutation.mutate(dateRange);
  };

  const isLoading = campaignLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign || !analytics) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load campaign analytics
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Convert string values to numbers
  const totalEmissionsKg = toNumber(analytics.totals.total_emissions_kg);
  const emissionsPerConversionKg = toNumber(analytics.totals.emissions_per_conversion_kg);

  // Prepare emissions breakdown data for pie chart
  const emissionsBreakdownData = [
    { 
      name: 'Impressions', 
      value: toNumber(analytics.emissions_breakdown.impressions_g) / 1000, 
      color: EMISSION_COLORS[0] 
    },
    { 
      name: 'Page Views', 
      value: toNumber(analytics.emissions_breakdown.page_views_g) / 1000, 
      color: EMISSION_COLORS[1] 
    },
    { 
      name: 'Clicks', 
      value: toNumber(analytics.emissions_breakdown.clicks_g) / 1000, 
      color: EMISSION_COLORS[2] 
    },
    { 
      name: 'Conversions', 
      value: toNumber(analytics.emissions_breakdown.conversions_g) / 1000, 
      color: EMISSION_COLORS[3] 
    },
  ].filter(item => item.value > 0); // Filter out zero values

  // Prepare device breakdown data
  const deviceData = analytics.by_device.map((device, idx) => ({
    name: device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1),
    impressions: device.impressions,
    sessions: device.sessions,
    conversions: device.conversions,
    emissions: toNumber(device.emissions_kg),
    cost: device.cost,
    color: DEVICE_COLORS[idx % DEVICE_COLORS.length],
  }));

  // Prepare region data
  const regionData = analytics.by_region
    .map(region => ({
      ...region,
      emissions_kg: toNumber(region.emissions_kg),
      emissions_g: toNumber(region.emissions_kg),
    }))
    .sort((a, b) => b.emissions_kg - a.emissions_kg)
    .slice(0, 5);

  // Prepare time series data
  const timeSeriesData = analytics.time_series.map(item => ({
    ...item,
    emissions_kg: toNumber(item.emissions_kg),
    emissions_g: toNumber(item.emissions_kg),
  }));

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Campaigns", href: "/dashboard/campaigns" },
          { label: campaign.name, href: `/dashboard/campaigns/${id}` },
          { label: "Analytics" },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/campaigns/${id}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              </div>
              <p className="text-muted-foreground ml-12">
                Campaign Analytics & Carbon Footprint
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncMutation.isPending}
              >
                {syncMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(analytics.date_range.start), 'MMM dd, yyyy')} - {format(new Date(analytics.date_range.end), 'MMM dd, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Impressions"
              value={analytics.totals.impressions.toLocaleString()}
              icon={Eye}
              color="blue"
            />
            <MetricCard
              title="Conversions"
              value={analytics.totals.conversions.toLocaleString()}
              subtitle={analytics.totals.conversions > 0 ? `${analytics.totals.conversion_rate.toFixed(2)}% CVR` : 'No conversions yet'}
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              title="Total Cost"
              value={`$${analytics.totals.cost.toLocaleString()}`}
              subtitle={analytics.totals.clicks > 0 ? `$${toNumber(analytics.totals.cpc).toFixed(2)} CPC` : 'No clicks yet'}
              icon={DollarSign}
              color="yellow"
            />
            <MetricCard
              title="Carbon Emissions"
              value={`${totalEmissionsKg.toFixed(3)} kg`}
              subtitle={analytics.totals.conversions > 0 ? `${emissionsPerConversionKg.toFixed(4)} kg/conv` : `${(totalEmissionsKg * 1000).toFixed(2)} g total`}
              icon={Leaf}
              color="green"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.sessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totals.impressions > 0 
                    ? `${(analytics.totals.sessions / analytics.totals.impressions * 100).toFixed(2)}% engagement rate`
                    : 'No impressions yet'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.clicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totals.ctr.toFixed(2)}% CTR
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.page_views.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totals.sessions > 0 
                    ? `${(analytics.totals.page_views / analytics.totals.sessions).toFixed(2)} pages/session`
                    : 'No sessions yet'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPA</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics.totals.conversions > 0 ? toNumber(analytics.totals.cpa).toFixed(2) : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cost per acquisition
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Impressions, sessions, and conversions</CardDescription>
              </CardHeader>
              <CardContent>
                {timeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        stroke="#6b7280"
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="impressions"
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        dot={false}
                        name="Impressions"
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={false}
                        name="Sessions"
                      />
                      <Line
                        type="monotone"
                        dataKey="conversions"
                        stroke={COLORS.accent}
                        strokeWidth={2}
                        dot={false}
                        name="Conversions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Emissions Trend</CardTitle>
                <CardDescription>Daily emissions in kg CO₂e</CardDescription>
              </CardHeader>
              <CardContent>
                {timeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        stroke="#6b7280"
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        formatter={(value: any) => [`${toNumber(value).toFixed(4)} kg`, 'Emissions']}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="emissions_kg"
                        stroke={COLORS.primary}
                        fillOpacity={1}
                        fill="url(#colorEmissions)"
                        name="Emissions (kg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No emissions data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Emissions & Device Breakdown */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emissions Breakdown</CardTitle>
                <CardDescription>Carbon footprint by activity type</CardDescription>
              </CardHeader>
              <CardContent>
                {emissionsBreakdownData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={emissionsBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {emissionsBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `${value.toFixed(4)} kg`}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {emissionsBreakdownData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <div className="text-sm">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">{item.value.toFixed(4)} kg</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No emissions data to display
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Device</CardTitle>
                <CardDescription>Conversions and emissions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deviceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="conversions" fill={COLORS.primary} name="Conversions" />
                      <Bar dataKey="emissions" fill={COLORS.accent} name="Emissions (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No device data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Regions by Emissions</CardTitle>
              <CardDescription>Carbon footprint across different countries</CardDescription>
            </CardHeader>
            <CardContent>
              {regionData.length > 0 ? (
                <div className="space-y-4">
                  {regionData.map((region, idx) => {
                    const maxEmissions = Math.max(...regionData.map(r => r.emissions_kg));
                    const percentage = maxEmissions > 0 ? (region.emissions_kg / maxEmissions) * 100 : 0;
                    
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{region.country}</span>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span>{region.conversions} conversions</span>
                            <span className="font-semibold text-foreground">
                              {region.emissions_kg.toFixed(4)} kg CO₂e
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{region.impressions.toLocaleString()} impressions</span>
                          <span>${region.cost.toLocaleString()} spent</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No regional data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs mt-1',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}