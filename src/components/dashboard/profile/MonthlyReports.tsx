'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  FileText,
  Cloud,
  Globe,
  Users,
  Server,
  Plane,
  Monitor,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MonthlyReport, reportsApi } from '@/services/reportsApi'

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const SOURCE_CONFIG = [
  { key: 'cloud_kg', label: 'Cloud', icon: Cloud, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { key: 'cdn_kg', label: 'CDN', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  { key: 'workforce_kg', label: 'Workforce', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { key: 'onprem_kg', label: 'On-Premise', icon: Server, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  { key: 'travel_kg', label: 'Travel', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-500/10' },
  { key: 'website_sdk_kg', label: 'Website', icon: Monitor, color: 'text-pink-600', bg: 'bg-pink-500/10' },
] as const

function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`
  if (kg >= 1) return `${kg.toFixed(2)} kg`
  if (kg > 0) return `${(kg * 1000).toFixed(1)} g`
  return '0 kg'
}

export function ReportsTab() {
  const queryClient = useQueryClient()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [expandedReport, setExpandedReport] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyReports', selectedYear],
    queryFn: () => reportsApi.getMonthlyReports(selectedYear),
    retry: 1,
    staleTime: 60000,
  })

  const generateMutation = useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      reportsApi.generateReport(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyReports'] })
    },
  })

  const reports: MonthlyReport[] = data?.data?.reports || []
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i)

  const totalYearEmissions = reports.reduce((sum, r) => sum + r.total_kg_co2, 0)

  // Calculate trend (compare last two months)
  const sortedReports = [...reports].sort((a, b) => a.month - b.month)
  const lastTwo = sortedReports.slice(-2)
  const trend = lastTwo.length === 2
    ? ((lastTwo[1].total_kg_co2 - lastTwo[0].total_kg_co2) / (lastTwo[0].total_kg_co2 || 1)) * 100
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading reports…</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="py-12 text-center space-y-3">
          <p className="text-sm text-destructive">Failed to load reports</p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['monthlyReports'] })}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs border-border shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{reports.length}</span> report{reports.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-border shadow-sm"
          onClick={() => generateMutation.mutate({ month: currentMonth, year: currentYear })}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Generate Current Month
        </Button>
      </div>

      {/* Year summary */}
      {reports.length > 0 && (
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {selectedYear} Total Emissions
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatKg(totalYearEmissions)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  CO₂ equivalent
                </p>
              </div>
              <div className="flex items-center gap-4">
                {trend !== null && (
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Month Trend
                    </p>
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      trend > 0 ? 'text-red-600' : trend < 0 ? 'text-emerald-600' : 'text-muted-foreground'
                    )}>
                      {trend > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : trend < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : null}
                      <span className="text-lg font-semibold">
                        {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-primary/5">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report list */}
      {reports.length > 0 ? (
        <div className="space-y-3">
          {[...reports]
            .sort((a, b) => b.year - a.year || b.month - a.month)
            .map((report) => {
              const isExpanded = expandedReport === report.id
              const maxSource = SOURCE_CONFIG.reduce(
                (max, s) => {
                  const val = (report as any)[s.key] || 0
                  return val > max.val ? { ...s, val } : max
                },
                { key: '', label: '', icon: Cloud, color: '', bg: '', val: 0 }
              )

              return (
                <Card
                  key={report.id}
                  className={cn(
                    'bg-card border-border shadow-sm transition-all cursor-pointer hover:shadow-md',
                    isExpanded && 'ring-1 ring-primary/20'
                  )}
                  onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                >
                  <CardContent className="p-0">
                    {/* Summary row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                      <div className="p-2.5 rounded-lg bg-primary/5 shrink-0">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {MONTH_NAMES[report.month]} {report.year}
                          </p>
                          {report.month === currentMonth && report.year === currentYear && (
                            <Badge variant="secondary" className="text-[9px] font-normal px-1.5 h-4">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Top source: {maxSource.label} ({formatKg(maxSource.val)})
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-foreground">
                          {formatKg(report.total_kg_co2)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">CO₂e</p>
                      </div>
                    </div>

                    {/* Expanded breakdown */}
                    {isExpanded && (
                      <div className="border-t border-border px-5 py-4 bg-muted/20">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
                          Breakdown by Source
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {SOURCE_CONFIG.map((source) => {
                            const Icon = source.icon
                            const value = (report as any)[source.key] || 0
                            const pct = report.total_kg_co2 > 0
                              ? ((value / report.total_kg_co2) * 100).toFixed(1)
                              : '0'

                            return (
                              <div
                                key={source.key}
                                className={cn(
                                  'rounded-lg border border-border p-3 bg-card',
                                  value === 0 && 'opacity-40'
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className={cn('p-1 rounded', source.bg)}>
                                    <Icon className={cn('h-3 w-3', source.color)} />
                                  </div>
                                  <span className="text-[11px] font-medium text-foreground">
                                    {source.label}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                  {formatKg(value)}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {pct}% of total
                                </p>
                                {/* Mini bar */}
                                <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={cn('h-full rounded-full', source.bg.replace('/10', '/60'))}
                                    style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {report.generated_at && (
                          <p className="text-[10px] text-muted-foreground mt-3">
                            Generated: {new Date(report.generated_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>
      ) : (
        <Card className="border-dashed border-border bg-card shadow-sm">
          <CardContent className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No reports yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Generate your first monthly emission report to start tracking your carbon footprint over time.
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 text-xs shadow-sm gap-1.5"
              onClick={(e) => {
                e.stopPropagation()
                generateMutation.mutate({ month: currentMonth, year: currentYear })
              }}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}