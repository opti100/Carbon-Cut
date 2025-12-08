"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Users, Globe, Zap, TrendingUp, Globe2, Smartphone, Calendar } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { ApiKeyService } from "@/services/apikey/apikey"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Helper function to format small numbers
const formatEmissions = (value: number, unit: 'kg' | 'g' = 'g') => {
  if (!value || value === 0) return `0 ${unit}`
  
  if (unit === 'kg') {
    if (value < 0.001) {
      // Convert to grams if less than 1g
      return `${(value * 1000).toFixed(6)} g`
    }
    return `${value.toFixed(6)} kg`
  }
  
  if (value < 0.001) {
    return `${value.toExponential(2)} g`
  }
  return `${value.toFixed(6)} g`
}

export default function WebsiteDashboardPage() {
  const { data: analyticsData, isLoading, isError } = useQuery({
    queryKey: ["websiteAnalytics", 30],
    queryFn: () => ApiKeyService.getWebsiteAnalytics(30),
    refetchInterval: 60000, 
  })

  const stats = analyticsData?.data?.stats
  const hasData = analyticsData?.data?.has_data
  const dailyBreakdown = analyticsData?.data?.daily_breakdown || []
  const deviceBreakdown = analyticsData?.data?.device_breakdown || []
  const countryBreakdown = analyticsData?.data?.country_breakdown || []
  const topPages = analyticsData?.data?.top_pages || []

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Alert variant="destructive">
            <AlertDescription>Failed to load website analytics. Please try again.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Website/App Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor carbon emissions from your website and applications
            </p>
          </div>

          {!hasData ? (
            <Card className="bg-white rounded-md">
              <CardHeader>
                <CardTitle>Get Started with Website Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    {analyticsData?.data?.message || "No website API keys found. Create one to start tracking."}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Install our SDK to start tracking carbon emissions from your website or application.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Generate a Website API key in your Profile</li>
                  <li>Install the Carbon Cut SDK on your website</li>
                  <li>View real-time emissions data and optimize your site</li>
                </ol>
                <Button asChild className="bg-[#adff00] text-black hover:bg-[#adff00]/90">
                  <Link href="/onboarding">Create Website API Key</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white rounded-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_sessions || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.total_visitors || 0} unique visitors (last {analyticsData?.data?.period_days || 30} days)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_page_views || 0}</div>
                    <p className="text-xs text-muted-foreground">Total page views</p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatEmissions(stats?.total_emissions_g || 0, 'g')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      CO₂ tracked
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Emissions/Visit</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatEmissions(stats?.avg_emissions_per_visit_g || 0, 'g')}
                    </div>
                    <p className="text-xs text-muted-foreground">Per visitor</p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Breakdown */}
              {dailyBreakdown.length > 0 && (
                <Card className="bg-white rounded-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Daily Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Sessions</TableHead>
                          <TableHead className="text-right">Emissions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyBreakdown.map((day, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-right">{day.sessions}</TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {formatEmissions(day.emissions_g, 'g')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Device Breakdown */}
              {deviceBreakdown.length > 0 && (
                <Card className="bg-white rounded-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Device Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deviceBreakdown.map((device, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-medium capitalize min-w-[80px]">{device.device}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                              <div
                                className="bg-[#adff00] h-2 rounded-full"
                                style={{ width: `${device.percentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground min-w-[100px] text-right">
                            {device.count} ({device.percentage.toFixed(1)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Country Breakdown */}
              {countryBreakdown.length > 0 && (
                <Card className="bg-white rounded-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe2 className="h-5 w-5" />
                      Top Countries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Visitors</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {countryBreakdown.map((country, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{country.country}</TableCell>
                            <TableCell className="text-right">{country.count}</TableCell>
                            <TableCell className="text-right">{country.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Top Pages */}
              {topPages.length > 0 ? (
                <Card className="bg-white rounded-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page URL</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topPages.map((page, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-sm max-w-md truncate">
                              {page.url}
                            </TableCell>
                            <TableCell className="text-right">{page.views}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white rounded-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No page view data available yet. Page views will appear here once tracked.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* API Keys Info */}
              <Card className="bg-blue-50 border-blue-200 rounded-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {stats?.api_keys_count || 0} Website API Key{stats?.api_keys_count !== 1 ? 's' : ''} Active
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Tracking data for the last {analyticsData?.data?.period_days || 30} days
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/profile">Manage API Keys</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}