'use client'

import type React from 'react'
import { use, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react'
import { campaignApi } from '@/services/campaign/campaign'
import { cn } from '@/lib/utils'
import { format, subDays, parseISO } from 'date-fns'
import { PerformanceOverTimeChart } from '@/components/dashboard/PerformanceOverTimeChart'
import { EmissionsTrendChart } from '@/components/dashboard/EmissionsTrendChart'
import { DevicePerformanceChart } from '@/components/dashboard/DevicePerformanceChart'
import { EmissionsBreakdownChart } from '@/components/dashboard/EmissionsBreakdownChart'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { type DateRange } from 'react-day-picker'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { toast } from 'sonner'

interface CampaignAnalyticsPageProps {
  params: Promise<{ id: string }>
}

const toNumber = (value: any): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number.parseFloat(value) || 0
  return 0
}

// --- Date Range Picker Component ---
function DateRangePicker({
  className,
  date,
  setDate,
}: {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date)

  useEffect(() => {
    if (!isOpen) {
      setLocalDate(date)
    }
  }, [date, isOpen])

  const handleApply = () => {
    if (localDate?.from && localDate?.to) {
      setDate(localDate)
      setIsOpen(false)
    } else {
      toast.error('Please select both start and end dates')
    }
  }

  const handleCancel = () => {
    setLocalDate(date)
    setIsOpen(false)
  }

  const handleReset = () => {
    const defaultRange = {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
    setLocalDate(defaultRange)
    setDate(defaultRange)
    setIsOpen(false)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal bg-white hover:bg-muted border',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={setLocalDate}
            numberOfMonths={2}
            disabled={(date) => date > new Date() || date < new Date('2000-01-01')}
          />
          <div className="flex justify-end items-center gap-2 p-3 border-t bg-background">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
              className="hover:opacity-90"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// --- Skeleton Loaders ---
function MetricCardSkeleton() {
  return (
    <Card className="border-0 bg-card">
      <CardContent className="pt-6">
        <Skeleton className="h-8 w-3/5 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-4/5 mt-2 bg-muted-foreground/20" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <Skeleton className="h-6 w-48 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-64 mt-2 bg-muted-foreground/20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg bg-muted-foreground/20" />
      </CardContent>
    </Card>
  )
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function RegionalEmissionsMap({ data }: { data: any[] }) {
  const [tooltipContent, setTooltipContent] = useState<any>(null)

  const dataMap = new Map(data.map((item) => [item.country, item]))
  const maxEmissions = Math.max(...data.map((d) => d.emissions_kg))

  const colorScale = scaleLinear<string>()
    .domain([0, maxEmissions])
    .range(['#dcfce7', '#15803d'])

  return (
    <Card className="border bg-white relative">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Top Regions by Emissions</CardTitle>
          <CardDescription>Carbon footprint across different countries</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[450px] w-full p-0 relative">
        {tooltipContent && (
          <div
            className="absolute z-10 p-2 text-xs rounded-md shadow-lg pointer-events-none bg-popover text-popover-foreground"
            style={{ top: tooltipContent.y, left: tooltipContent.x }}
          >
            <p className="font-bold">{tooltipContent.name}</p>
            <p>{tooltipContent.emissions_kg.toFixed(4)} kg CO₂e</p>
            <p>{tooltipContent.conversions} conversions</p>
          </div>
        )}
        <ComposableMap
          projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={[0, 20]}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = dataMap.get(geo.properties.name)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        countryData ? colorScale(countryData.emissions_kg) : '#E9EAEA'
                      }
                      stroke="#FFF"
                      strokeWidth={0.5}
                      onMouseEnter={(evt) => {
                        const { name } = geo.properties
                        const countryInfo = dataMap.get(name)
                        if (countryInfo) {
                          setTooltipContent({
                            ...countryInfo,
                            name,
                            x: evt.clientX + 15,
                            y: evt.clientY - 30,
                          })
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(null)
                      }}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#16a34a' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </CardContent>
    </Card>
  )
}

export default function CampaignAnalyticsPage({ params }: CampaignAnalyticsPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [isExporting, setIsExporting] = useState(false)

  const apiDateRange = {
    start_date: date?.from
      ? format(date.from, 'yyyy-MM-dd')
      : format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end_date: date?.to ? format(date.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  }

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignApi.get(Number(id)),
  })

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useQuery({
    queryKey: ['campaign-analytics', id, apiDateRange],
    queryFn: () =>
      campaignApi.getAnalytics(id, {
        ...apiDateRange,
        group_by: 'day',
      }),
    enabled: !!campaign,
  })

  const syncMutation = useMutation({
    mutationFn: (data: { start_date: string; end_date: string }) =>
      campaignApi.syncImpressions(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-analytics', id] })
      toast.success('Data synced successfully!')
    },
    onError: () => {
      toast.error('Failed to sync data. Please try again.')
    },
  })

  const handleSync = () => {
    syncMutation.mutate(apiDateRange)
  }

  const handleExport = async () => {
    if (!campaign || !analytics) {
      toast.error('Unable to generate report. Please try again.')
      return
    }

    try {
      setIsExporting(true)

      const reportPayload = {
        campaign: {
          name: campaign.name,
          google_ads_campaign_id: campaign.google_ads_campaign_id,
          status: 'Active',
        },
        analytics: {
          totals: analytics.totals,
          emissions_breakdown: analytics.emissions_breakdown,
          by_device: analytics.by_device,
          by_region: analytics.by_region,
          time_series: analytics.time_series,
        },
        dateRange: {
          start: apiDateRange.start_date,
          end: apiDateRange.end_date,
        },
      }

      const response = await fetch('/api/reports/campaign-export', {
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

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${campaign.name.replace(/[^a-zA-Z0-9]/g, '_')}_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Analytics report downloaded successfully!')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate report. Please try again.'
      )
    } finally {
      setIsExporting(false)
    }
  }

  const isLoading = campaignLoading || (analyticsLoading && !analytics)

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
        <div className="flex-1 overflow-auto p-6 bg-background">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-10 w-96 bg-muted-foreground/20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32 bg-muted-foreground/20" />
                <Skeleton className="h-10 w-32 bg-muted-foreground/20" />
              </div>
            </div>

            <Skeleton className="h-10 w-[300px] bg-muted-foreground/20" />

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
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
      category: 'impressions',
      emissions: toNumber(analytics.emissions_breakdown.impressions_g) / 1000,
      fill: '#10b981',
    },
    {
      category: 'pageviews',
      emissions: toNumber(analytics.emissions_breakdown.page_views_g) / 1000,
      fill: '#3b82f6',
    },
    {
      category: 'clicks',
      emissions: toNumber(analytics.emissions_breakdown.clicks_g) / 1000,
      fill: '#f59e0b',
    },
    {
      category: 'conversions',
      emissions: toNumber(analytics.emissions_breakdown.conversions_g) / 1000,
      fill: '#ec4899',
    },
  ].filter((item) => item.emissions > 0)

  const deviceData = analytics.by_device.map((device) => ({
    device: device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1),
    sessions: device.sessions,
    conversions: device.conversions,
    emissions: toNumber(device.emissions_kg),
  }))

  const timeSeriesData = analytics.time_series.map((item) => ({
    date: format(new Date(item.date), 'MMM dd'),
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
      <div className="flex-1 overflow-auto p-6 bg-background">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/campaigns`)}
                  className="hover:bg-muted shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncMutation.isPending}
                className="border-0 hover:bg-muted"
              >
                {syncMutation.isPending ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Sync Data</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-0 hover:bg-muted"
                onClick={handleExport}
                disabled={isExporting || !analytics}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </div>
          </div>

          <DateRangePicker date={date} setDate={setDate} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Impressions"
              value={analytics.totals.impressions.toLocaleString()}
              subtitle="Total Impressions"
              icon={Eye}
              color="blue"
            />
            <MetricCard
              title="Conversions"
              value={analytics.totals.conversions.toLocaleString()}
              subtitle={
                analytics.totals.conversions > 0
                  ? `${analytics.totals.conversion_rate.toFixed(2)}% CVR`
                  : 'No conversions yet'
              }
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              title="Total Cost"
              value={`${analytics.totals.cost.toLocaleString()}`}
              subtitle={
                analytics.totals.clicks > 0
                  ? `${toNumber(analytics.totals.cpc).toFixed(2)} CPC`
                  : 'Clicks'
              }
              icon={DollarSign}
              color="yellow"
            />
            <MetricCard
              title="Carbon Emissions"
              value={
                totalEmissionsKg >= 1
                  ? `${totalEmissionsKg.toFixed(3)} kg`
                  : `${totalEmissionsValue.toFixed(2)} g`
              }
              subtitle={
                analytics.totals.conversions > 0
                  ? `${emissionsPerConversionKg.toFixed(4)} kg/conv`
                  : `Total emissions`
              }
              icon={Leaf}
              color="emerald"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Sessions"
              value={analytics.totals.sessions.toLocaleString()}
              subtitle={
                analytics.totals.impressions > 0
                  ? `${((analytics.totals.sessions / analytics.totals.impressions) * 100).toFixed(2)}% engagement rate`
                  : 'No impressions yet'
              }
              icon={Users}
              color="green"
            />
            <MetricCard
              title="Clicks"
              value={analytics.totals.clicks.toLocaleString()}
              subtitle={`${analytics.totals.ctr.toFixed(2)}% CTR`}
              icon={MousePointer}
              color="blue"
            />
            <MetricCard
              title="Page Views"
              value={analytics.totals.page_views.toLocaleString()}
              subtitle={
                analytics.totals.sessions > 0
                  ? `${(analytics.totals.page_views / analytics.totals.sessions).toFixed(2)} pages/session`
                  : 'No sessions yet'
              }
              icon={Activity}
              color="yellow"
            />
            <MetricCard
              title="CPA"
              value={`$${analytics.totals.conversions > 0 ? toNumber(analytics.totals.cpa).toFixed(2) : '0.00'}`}
              subtitle="Cost per acquisition"
              icon={DollarSign}
              color="emerald"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {analyticsLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <PerformanceOverTimeChart
                  data={timeSeriesData}
                  dateRange={analytics.date_range}
                />
                <EmissionsTrendChart
                  data={timeSeriesData}
                  totalEmissions={totalEmissionsKg}
                  dateRange={analytics.date_range}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {analyticsLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <EmissionsBreakdownChart
                  data={emissionsBreakdownData}
                  totalEmissions={totalEmissionsKg}
                />
                <DevicePerformanceChart data={deviceData} />
              </>
            )}
          </div>

          <RegionalEmissionsMap data={regionData} />
        </div>
      </div>
    </>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color?: 'blue' | 'green' | 'yellow' | 'emerald' | 'red'
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    green: 'text-green-600 bg-green-50 dark:bg-green-950/30',
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    red: 'text-red-600 bg-red-50 dark:bg-red-950/30',
  }

  return (
    <Card className="border rounded-md bg-white shadow-none hover:shadow-sm transition-shadow">
      <CardContent className="">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
