"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Users, Globe, Zap, TrendingUp, Globe2, Smartphone, Calendar, FileDown, Award } from "lucide-react"
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
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { toast } from "sonner"

const formatEmissions = (value: number, unit: 'kg' | 'g' = 'g') => {
  if (!value || value === 0) return `0 ${unit}`

  if (unit === 'kg') {
    if (value < 0.000001) {
      return `${value.toExponential(2)} kg`
    }
    if (value < 0.001) {
      // Convert to grams if less than 1g
      return `${(value * 1000).toFixed(8)} g`
    }
    return `${value.toFixed(6)} kg`
  }

  // For grams
  if (value < 0.001) {
    return `${value.toExponential(2)} g`
  }
  if (value < 1) {
    return `${value.toFixed(8)} g`
  }
  return `${value.toFixed(6)} g`
}

export default function WebsiteDashboardPage() {
  const { user } = useAuth()
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

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

  const handleDownloadReport = async () => {
    if (!user || !stats) {
      toast.error("Unable to generate report. Please ensure you're logged in.")
      return
    }

    if (!stats.total_emissions_g || stats.total_emissions_g === 0) {
      toast.error("No emissions data available to generate report")
      return
    }

    try {
      setIsGeneratingReport(true)

      const reportPayload = {
        user: {
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          phoneNumber: user.phoneNumber,
        },
        stats,
        dailyBreakdown,
        periodDays: analyticsData?.data?.period_days || 30,
      }

      // Call the new website emissions API
      const response = await fetch('/api/reports/website-emissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate report')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${user.companyName || 'Company'}_Website_Emissions_Report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Certified emissions report downloaded successfully!")
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error(error instanceof Error ? error.message : "Failed to generate report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Website/App Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor carbon emissions from your website and applications
              </p>
            </div>
            {hasData && stats && stats.total_emissions_g > 0 && (
              <Button
                onClick={handleDownloadReport}
                disabled={isGeneratingReport}
                className="bg-[#adff00] text-black hover:bg-[#adff00]/90 h-11"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Download Certified Report
                  </>
                )}
              </Button>
            )}
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
                  <Link href="/onboarding?type=website">Create Website API Key</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-linear-to-br from-[#adff00]/10 to-[#adff00]/5 border-[#adff00]/20 rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-6 w-6 text-[#adff00]" />
                    Total Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <div className="text-4xl font-bold text-foreground mb-2">
                        <div className="emissions-value">
                          {formatEmissions(stats?.total_emissions_g || 0, 'g')}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total carbon emissions from website traffic
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tracked over {analyticsData?.data?.period_days || 30} days • {stats?.total_sessions || 0} sessions
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-muted-foreground">Scope 3 Emissions</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Average: {formatEmissions(stats?.avg_emissions_per_visit_g || 0, 'g')} per visit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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