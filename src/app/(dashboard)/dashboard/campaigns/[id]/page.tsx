"use client"

import type React from "react"
import { use, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
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
} from "lucide-react"
import { campaignApi } from "@/services/campaign/campaign"
import { DashboardHeader } from "@/components/DashboardHeader"
import { cn } from "@/lib/utils"
import { format, subDays } from "date-fns"
import { PerformanceOverTimeChart } from "@/components/dashboard/PerformanceOverTimeChart"
import { EmissionsTrendChart } from "@/components/dashboard/EmissionsTrendChart"
import { DevicePerformanceChart } from "@/components/dashboard/DevicePerformanceChart"
import { EmissionsBreakdownChart } from "@/components/dashboard/EmissionsBreakdownChart"
import { Skeleton } from "@/components/ui/skeleton"

interface CampaignAnalyticsPageProps {
  params: Promise<{ id: string }>
}

const toNumber = (value: any): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number.parseFloat(value) || 0
  return 0
}

// Skeleton loaders
function MetricCardSkeleton() {
  return (
    <Card className="border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="border-0">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export default function CampaignAnalyticsPage({ params }: CampaignAnalyticsPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dateRange, setDateRange] = useState({
    start_date: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  })

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignApi.get(Number(id)),
  })

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useQuery({
    queryKey: ["campaign-analytics", id, dateRange],
    queryFn: () =>
      campaignApi.getAnalytics(id, {
        ...dateRange,
        group_by: "day",
      }),
    enabled: !!campaign,
    refetchInterval: 10,
  })

  const syncMutation = useMutation({
    mutationFn: (data: { start_date: string; end_date: string }) => campaignApi.syncImpressions(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-analytics", id] })
    },
  })

  const handleSync = () => {
    syncMutation.mutate(dateRange)
  }

  const isLoading = campaignLoading || analyticsLoading

  if (analyticsError && !analyticsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load campaign analytics</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Campaigns", href: "/dashboard/campaigns" },
            { label: "Loading..." },
          ]}
        />
        <div className="flex-1 overflow-auto p-6 bg-muted/40">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-10 w-96" />
                <Skeleton className="h-4 w-80" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Date range skeleton */}
            <Skeleton className="h-16 w-full rounded-lg" />

            {/* Key metrics skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>

            {/* Secondary metrics skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!campaign || !analytics) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load campaign analytics</AlertDescription>
        </Alert>
      </div>
    )
  }

  const totalEmissionsKg = toNumber(analytics.totals.total_emissions_kg)
  const emissionsPerConversionKg = toNumber(analytics.totals.emissions_per_conversion_kg)

  const emissionsBreakdownData = [
    {
      category: "impressions",
      emissions: toNumber(analytics.emissions_breakdown.impressions_g) / 1000,
      fill: "#10b981",
    },
    {
      category: "pageviews",
      emissions: toNumber(analytics.emissions_breakdown.page_views_g) / 1000,
      fill: "#3b82f6",
    },
    {
      category: "clicks",
      emissions: toNumber(analytics.emissions_breakdown.clicks_g) / 1000,
      fill: "#f59e0b",
    },
    {
      category: "conversions",
      emissions: toNumber(analytics.emissions_breakdown.conversions_g) / 1000,
      fill: "#ec4899",
    },
  ].filter((item) => item.emissions > 0)

  const deviceData = analytics.by_device.map((device) => ({
    device: device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1),
    sessions: device.sessions,
    conversions: device.conversions,
    emissions: toNumber(device.emissions_kg),
  }))

  const timeSeriesData = analytics.time_series.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    fullDate: item.date,
    impressions: item.impressions,
    sessions: item.sessions,
    conversions: item.conversions,
    emissions: toNumber(item.emissions_kg),
  }))

  const regionData = analytics.by_region
    .map((region) => ({
      ...region,
      emissions_kg: toNumber(region.emissions_kg),
      emissions_g: toNumber(region.emissions_kg),
    }))
    .sort((a, b) => b.emissions_kg - a.emissions_kg)
    .slice(0, 5)

  const totalEmissionsValue = totalEmissionsKg * 1000

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
      <div className="flex-1 overflow-auto p-6 bg-muted/40">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/campaigns`)}
                  className="hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                  <p className="text-muted-foreground text-sm mt-1">Campaign Analytics & Carbon Footprint</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncMutation.isPending}
                className="border-0 hover:bg-muted bg-transparent"
              >
                {syncMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Data
              </Button>
              <Button variant="outline" size="sm" className="border-0 hover:bg-muted bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <Card className="border-0 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {format(new Date(analytics.date_range.start), "MMM dd, yyyy")} -{" "}
                  {format(new Date(analytics.date_range.end), "MMM dd, yyyy")}
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
              subtitle={
                analytics.totals.conversions > 0
                  ? `${analytics.totals.conversion_rate.toFixed(2)}% CVR`
                  : "No conversions yet"
              }
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              title="Total Cost"
              value={`$${analytics.totals.cost.toLocaleString()}`}
              subtitle={
                analytics.totals.clicks > 0 ? `$${toNumber(analytics.totals.cpc).toFixed(2)} CPC` : "No clicks yet"
              }
              icon={DollarSign}
              color="yellow"
            />
            <MetricCard
              title="Carbon Emissions"
              value={
                totalEmissionsKg >= 1 ? `${totalEmissionsKg.toFixed(3)} kg` : `${totalEmissionsValue.toFixed(2)} g`
              }
              subtitle={
                analytics.totals.conversions > 0 ? `${emissionsPerConversionKg.toFixed(4)} kg/conv` : `Total emissions`
              }
              icon={Leaf}
              color="emerald"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-card hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.sessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totals.impressions > 0
                    ? `${((analytics.totals.sessions / analytics.totals.impressions) * 100).toFixed(2)}% engagement rate`
                    : "No impressions yet"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.clicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{analytics.totals.ctr.toFixed(2)}% CTR</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totals.page_views.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totals.sessions > 0
                    ? `${(analytics.totals.page_views / analytics.totals.sessions).toFixed(2)} pages/session`
                    : "No sessions yet"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPA</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics.totals.conversions > 0 ? toNumber(analytics.totals.cpa).toFixed(2) : "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cost per acquisition</p>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            {analyticsLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <PerformanceOverTimeChart data={timeSeriesData} dateRange={analytics.date_range} />
                <EmissionsTrendChart
                  data={timeSeriesData}
                  totalEmissions={totalEmissionsKg}
                  dateRange={analytics.date_range}
                />
              </>
            )}
          </div>

          {/* Emissions & Device Breakdown */}
          <div className="grid gap-4 lg:grid-cols-2">
            {analyticsLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <EmissionsBreakdownChart data={emissionsBreakdownData} totalEmissions={totalEmissionsKg} />
                <DevicePerformanceChart data={deviceData} />
              </>
            )}
          </div>

          {/* Regional Performance */}
          <Card className="border-0 bg-card">
            <CardHeader>
              <CardTitle>Top Regions by Emissions</CardTitle>
              <CardDescription>Carbon footprint across different countries</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-full rounded-full" />
                      <Skeleton className="h-4 w-96" />
                    </div>
                  ))}
                </div>
              ) : regionData.length > 0 ? (
                <div className="space-y-4">
                  {regionData.map((region, idx) => {
                    const maxEmissions = Math.max(...regionData.map((r) => r.emissions_kg))
                    const percentage = maxEmissions > 0 ? (region.emissions_kg / maxEmissions) * 100 : 0

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
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-600 transition-all rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {region.impressions.toLocaleString()} impressions • {region.sessions} sessions
                          </span>
                          <span>${region.cost.toLocaleString()} spent</span>
                        </div>
                      </div>
                    )
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
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color?: "blue" | "green" | "yellow" | "emerald" | "red"
}

function MetricCard({ title, value, subtitle, icon: Icon, color = "blue" }: MetricCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    green: "text-green-600 bg-green-50 dark:bg-green-950/30",
    yellow: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    red: "text-red-600 bg-red-50 dark:bg-red-950/30",
  }

  return (
    <Card className="border-0 bg-card hover:shadow-sm transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
