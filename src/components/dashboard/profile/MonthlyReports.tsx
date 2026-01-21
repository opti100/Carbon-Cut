'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  FileText,
  CheckCircle,
  AlertCircle,
  Cloud,
  Globe,
  Users,
  Server,
  Plane,
  Activity,
  ChevronRight,
  RefreshCw,
  Plus,
  Calendar,
  TrendingUp,
  Download,
} from 'lucide-react'
import {
  ReportsService,
  MonthlyReportStatus,
  DataSource,
  formatKgCO2,
  getStatusBadgeVariant,
  getStatusLabel,
  getScopeColor,
  getMonthName,
} from '@/services/monthy-reports'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const YEARS = Array.from({ length: 3 }, (_, i) => currentYear - i)

export function ReportsTab() {
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [entryType, setEntryType] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch monthly report status
  const { data: monthlyReport, isLoading: reportLoading, refetch } = useQuery({
    queryKey: ['monthlyReport', selectedYear, selectedMonth],
    queryFn: () => ReportsService.getMonthlyReport(selectedYear, selectedMonth),
    staleTime: 30000,
  })

  // Fetch yearly summary
  const { data: yearlySummary, isLoading: yearlyLoading } = useQuery({
    queryKey: ['yearlySummary', selectedYear],
    queryFn: () => ReportsService.getYearlySummary(selectedYear),
    staleTime: 60000,
  })

  // Recalculate mutation
  const recalculateMutation = useMutation({
    mutationFn: () => ReportsService.recalculateReport(selectedYear, selectedMonth),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyReport'] })
      queryClient.invalidateQueries({ queryKey: ['yearlySummary'] })
    },
  })

  const report = monthlyReport?.data
  const yearly = yearlySummary?.data

  const getSourceIcon = (source: string) => {
    if (source.startsWith('cloud')) return Cloud
    if (source === 'cdn') return Globe
    if (source === 'workforce') return Users
    if (source === 'onprem') return Server
    if (source === 'travel') return Plane
    if (source === 'website_sdk') return Activity
    return FileText
  }

  const handleAddEntry = (source: DataSource) => {
    setEntryType(source.entry_type)
    setEntryDialogOpen(true)
  }

  if (reportLoading) {
    return (
      <Card className="bg-white rounded-md">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card className="bg-white rounded-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Emission Reports
              </CardTitle>
              <CardDescription>
                Track and manage your monthly emission data
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(v) => setSelectedMonth(parseInt(v))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem
                      key={month}
                      value={month.toString()}
                      disabled={
                        selectedYear === currentYear && month > currentMonth
                      }
                    >
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(v) => setSelectedYear(parseInt(v))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Monthly Summary */}
      {report && (
        <Card className="bg-white rounded-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {report.month_name} {report.year}
                </CardTitle>
                <CardDescription>
                  {report.is_complete
                    ? 'All data sources submitted'
                    : `${report.pending_entries} data source(s) pending`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => recalculateMutation.mutate()}
                  disabled={recalculateMutation.isPending}
                >
                  {recalculateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Recalculate</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Totals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="text-2xl font-bold">
                  {formatKgCO2(report.total_emissions_kg)}
                </p>
              </div>
              {report.scope_breakdown && (
                <>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Scope 1</p>
                    <p className="text-xl font-bold text-red-700">
                      {formatKgCO2(report.scope_breakdown.scope_1)}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-600">Scope 2</p>
                    <p className="text-xl font-bold text-amber-700">
                      {formatKgCO2(report.scope_breakdown.scope_2)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Scope 3</p>
                    <p className="text-xl font-bold text-blue-700">
                      {formatKgCO2(report.scope_breakdown.scope_3)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Completion Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data Completion</span>
                <span className="font-medium">
                  {report.data_sources.length - report.pending_entries} /{' '}
                  {report.data_sources.length}
                </span>
              </div>
              <Progress
                value={
                  ((report.data_sources.length - report.pending_entries) /
                    report.data_sources.length) *
                  100
                }
                className="h-2"
              />
            </div>

            <Separator />

            {/* Data Sources */}
            <div className="space-y-3">
              <h4 className="font-medium">Data Sources</h4>
              {report.data_sources.map((source:any, index:any) => {
                const Icon = getSourceIcon(source.source)
                return (
                  <div
                    key={`${source.source}-${index}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getScopeColor(source.scope)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{source.label}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {source.scope.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span>•</span>
                          <span className="capitalize">{source.accuracy} accuracy</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {source.kg_co2 !== null ? formatKgCO2(source.kg_co2) : '—'}
                        </p>
                        <Badge variant={getStatusBadgeVariant(source.status)}>
                          {getStatusLabel(source.status)}
                        </Badge>
                      </div>
                      {source.requires_monthly_input && source.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddEntry(source)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yearly Overview */}
      {yearly && (
        <Card className="bg-white rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {selectedYear} Overview
            </CardTitle>
            <CardDescription>
              {yearly.months_reported} of 12 months reported
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total (Year)</p>
                <p className="text-xl font-bold">
                  {yearly.totals_tonnes.total.toFixed(2)} t
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Scope 1 (Year)</p>
                <p className="text-lg font-bold text-red-700">
                  {yearly.totals_tonnes.scope_1.toFixed(2)} t
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-600">Scope 2 (Year)</p>
                <p className="text-lg font-bold text-amber-700">
                  {yearly.totals_tonnes.scope_2.toFixed(2)} t
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Scope 3 (Year)</p>
                <p className="text-lg font-bold text-blue-700">
                  {yearly.totals_tonnes.scope_3.toFixed(2)} t
                </p>
              </div>
            </div>

            {/* Monthly breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium mb-3">Monthly Breakdown</h4>
              <div className="grid gap-2">
                {yearly.months.map((month:any) => (
                  <button
                    key={month.month}
                    onClick={() => setSelectedMonth(month.month)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                      month.month === selectedMonth
                        ? 'border-primary bg-primary/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{month.month_name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {formatKgCO2(month.total_kg)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry Dialog */}
      <DataEntryDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        entryType={entryType}
        year={selectedYear}
        month={selectedMonth}
        onSuccess={() => {
          setEntryDialogOpen(false)
          refetch()
          queryClient.invalidateQueries({ queryKey: ['yearlySummary'] })
        }}
      />
    </div>
  )
}

// Data Entry Dialog Component
function DataEntryDialog({
  open,
  onOpenChange,
  entryType,
  year,
  month,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entryType: string | null
  year: number
  month: number
  onSuccess: () => void
}) {
  const [value, setValue] = useState('')
  const [provider, setProvider] = useState('aws')

  const cloudMutation = useMutation({
    mutationFn: (data: { provider: string; monthly_cost_usd: number }) =>
      ReportsService.submitCloudEntry(year, month, {
        provider: data.provider,
        entry_type: 'cloud_cost',
        monthly_cost_usd: data.monthly_cost_usd,
      }),
    onSuccess,
  })

  const cdnMutation = useMutation({
    mutationFn: (gb: number) =>
      ReportsService.submitCDNEntry(year, month, { gb_transferred: gb }),
    onSuccess,
  })

  const handleSubmit = () => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return

    if (entryType === 'cloud_cost') {
      cloudMutation.mutate({ provider, monthly_cost_usd: numValue })
    } else if (entryType === 'cdn_transfer') {
      cdnMutation.mutate(numValue)
    }
  }

  const isPending = cloudMutation.isPending || cdnMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entryType === 'cloud_cost' && 'Add Cloud Cost'}
            {entryType === 'cdn_transfer' && 'Add CDN Data Transfer'}
            {entryType === 'travel_flight' && 'Add Travel Data'}
          </DialogTitle>
          <DialogDescription>
            Enter data for {getMonthName(month)} {year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {entryType === 'cloud_cost' && (
            <>
              <div className="space-y-2">
                <Label>Cloud Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="gcp">Google Cloud</SelectItem>
                    <SelectItem value="azure">Azure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Cost (USD)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1500.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </>
          )}

          {entryType === 'cdn_transfer' && (
            <div className="space-y-2">
              <Label>GB Transferred This Month</Label>
              <Input
                type="number"
                placeholder="e.g., 500"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !value}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}