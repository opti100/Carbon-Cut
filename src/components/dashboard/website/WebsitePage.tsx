'use client'
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Download, Cloud, Globe, Server, Users, Plane, Zap,
  Megaphone, MoreHorizontal, Activity, ArrowUpRight, ArrowDownRight,
  Filter, ArrowUpDown, Calendar, ArrowUp, ArrowDown, Plus,
  RefreshCw, Check, Clock
} from 'lucide-react'
import { AnalyticsData } from '@/types/web-analytics'
import { fetchAnalytics, onboardingApi } from '@/services/onboarding/onboarding'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import WebsiteOnboarding from './OnboardingContent'
import {
  BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { api } from '@/contexts/AuthContext'

const MONTHS = [
  { value: 'all', label: 'Full Year' },
  { value: '1', label: 'January' }, { value: '2', label: 'February' },
  { value: '3', label: 'March' }, { value: '4', label: 'April' },
  { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' },
  { value: '9', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [selectedYear, selectedMonth])

  const { data: apiKeysData, isLoading: apiKeysLoading } = useQuery({
    queryKey: ['apiKeys', 'web'],
    queryFn: () => ApiKeyService.getApiKeys(),
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const hasApiKey = apiKeys.length > 0

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const month = selectedMonth !== 'all' ? parseInt(selectedMonth) : undefined
      const response = await fetchAnalytics(parseInt(selectedYear), month)
      if (response) {
        setAnalytics(response.data)
      } else {
        setError(response.error || 'Failed to load analytics')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!analytics) return
    const rows = [
      ['Emission Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Metric', 'Value'],
      ['Total Emissions (tonnes)', analytics.overview.total_emissions_tonnes.toFixed(2)],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emissions-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (apiKeysLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!hasApiKey && !onboardingComplete) {
    return <WebsiteOnboarding onComplete={() => setOnboardingComplete(true)} />
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-5">

        {/* Top Filters */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-3 h-8 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
              {selectedMonth === 'all'
                ? `Full Year ${selectedYear}`
                : `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
              }
            </span>
          </div>
          <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setAnalytics(null) }}>
            <SelectTrigger className="w-[110px] h-8 bg-white text-xs font-medium border-[#e5e7eb] rounded-lg shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1.5 rounded-lg border-[#e5e7eb] text-xs font-medium bg-white shadow-sm"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            Export
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-[#0f5c56]" /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>
        ) : analytics ? (
          <>
            {/* Total Balance Banner - DYNAMIC */}
            <div className="rounded-xl bg-[#0f5c56] p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #ffffff 0%, transparent 40%), radial-gradient(circle at 0% 100%, #ffffff 0%, transparent 40%)' }} />

              <div className="relative z-10">
                <p className="text-xs text-white/80 font-medium mb-1">Total Emissions</p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[32px] font-bold text-white leading-none tracking-tight">
                    {analytics.overview.total_emissions_tonnes.toFixed(2)}
                    <span className="text-lg font-normal ml-1">t</span>
                  </span>
                  <span className={cn(
                    "text-[11px] font-medium flex items-center gap-0.5",
                    analytics.comparison.total_emissions.change_percent > 0
                      ? "text-red-400"
                      : "text-[#24d18f]"
                  )}>
                    {Math.abs(analytics.comparison.total_emissions.change_percent).toFixed(1)}%
                    {analytics.comparison.total_emissions.change_percent > 0
                      ? <ArrowUpRight className="h-3 w-3 shrink-0" />
                      : <ArrowDownRight className="h-3 w-3 shrink-0" />
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <Button
                  size="sm"
                  className="bg-[#24d18f] hover:bg-[#1eb87d] text-[#0f5c56] rounded-lg gap-1.5 h-8 px-3 text-xs font-semibold border-0 shadow-sm"
                  onClick={() => router.push('/dashboard/decide')}
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  Reduce
                </Button>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg gap-1.5 h-8 px-3 text-xs font-medium shadow-sm"
                  onClick={() => router.push('/dashboard/action')}
                >
                  <ArrowUp className="h-3.5 w-3.5 shrink-0" />
                  Actions
                </Button>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg gap-1.5 h-8 px-3 text-xs font-medium shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                  Sync
                </Button>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg h-8 w-8 p-0 shadow-sm"
                >
                  <MoreHorizontal className="h-4 w-4 shrink-0" />
                </Button>
              </div>
            </div>

            {/* Main Chart + Side Stats */}
            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              {/* Left Chart Card */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-[#0f5c56] shrink-0" />
                    <h2 className="text-sm font-semibold text-gray-900">Emission Trend</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#f4f5f7] rounded-md p-0.5">
                      <button className="px-3 h-7 text-[11px] font-medium rounded bg-white shadow-sm text-gray-900">Weekly</button>
                      <button className="px-3 h-7 text-[11px] font-medium rounded text-gray-500 hover:text-gray-900">Daily</button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-[11px] font-medium border-[#e5e7eb] shadow-none"
                    >
                      ⚙ Manage
                    </Button>
                  </div>
                </div>
                <div className="h-[220px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.monthly_trend || []} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                      <XAxis
                        dataKey="month_name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}t`}
                      />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="total_kg" radius={[4, 4, 4, 4]} maxBarSize={16}>
                        {(analytics.monthly_trend || []).map((_, i) => (
                          <Cell key={i} fill={i % 2 === 0 ? '#0f5c56' : '#24d18f'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Stats - DYNAMIC */}
              <div className="flex flex-col gap-5">
                {/* Scope 1 */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-center flex-1">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#0f5c56] flex items-center justify-center shrink-0">
                      <ArrowDownRight className="h-5 w-5 text-white shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Scope 1</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-gray-900 tracking-tight">
                          {analytics.comparison.scope_1.current.toFixed(2)}
                        </p>
                        <span className={cn(
                          "text-[10px] font-semibold flex items-center",
                          analytics.comparison.scope_1.change_percent > 0
                            ? "text-red-500"
                            : "text-[#24d18f]"
                        )}>
                          {Math.abs(analytics.comparison.scope_1.change_percent).toFixed(1)}%
                          {analytics.comparison.scope_1.change_percent > 0
                            ? <ArrowUpRight className="h-2.5 w-2.5 ml-0.5 shrink-0" />
                            : <ArrowDownRight className="h-2.5 w-2.5 ml-0.5 shrink-0" />
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope 2 - DYNAMIC */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-center flex-1">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#24d18f] flex items-center justify-center shrink-0">
                      <ArrowUpRight className="h-5 w-5 text-white shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Scope 2</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-gray-900 tracking-tight">
                          {analytics.comparison.scope_2.current.toFixed(2)}
                        </p>
                        <span className={cn(
                          "text-[10px] font-semibold flex items-center",
                          analytics.comparison.scope_2.change_percent > 0
                            ? "text-red-500"
                            : "text-[#24d18f]"
                        )}>
                          {Math.abs(analytics.comparison.scope_2.change_percent).toFixed(1)}%
                          {analytics.comparison.scope_2.change_percent > 0
                            ? <ArrowUpRight className="h-2.5 w-2.5 ml-0.5 shrink-0" />
                            : <ArrowDownRight className="h-2.5 w-2.5 ml-0.5 shrink-0" />
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Horizontal Cards - DYNAMIC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analytics.source_breakdown?.slice(0, 3).map((source: any, i: number) => {
                const icons = { cloud: Cloud, workforce: Zap, travel: Plane, onprem: Server }
                const Icon = icons[source.source as keyof typeof icons] || Activity

                return (
                  <div key={i} className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-medium">{source.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Last 30 days</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-[22px] font-bold text-gray-900 tracking-tight">
                        t {source.emissions_tonnes.toFixed(2)}
                      </span>
                      <span className={cn(
                        "text-[11px] font-semibold flex items-center",
                        source.is_increasing ? "text-red-500" : "text-[#24d18f]"
                      )}>
                        {Math.abs(source.change_percent).toFixed(1)}%
                        {source.is_increasing
                          ? <ArrowUpRight className="h-3 w-3 ml-0.5 shrink-0" />
                          : <ArrowDownRight className="h-3 w-3 ml-0.5 shrink-0" />}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      vs. {source.previous_emissions_tonnes?.toFixed(2)}t Last Period
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity Table - DYNAMIC */}
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="p-4 border-b border-[#f0f1f5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#0f5c56] shrink-0" />
                    <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[11px] font-medium border-[#e5e7eb] shadow-none gap-1.5"
                    >
                      <Filter className="h-3 w-3 shrink-0" /> Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[11px] font-medium border-[#e5e7eb] shadow-none gap-1.5"
                    >
                      <ArrowUpDown className="h-3 w-3 shrink-0" /> Sort
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 border-[#e5e7eb] shadow-none"
                    >
                      <MoreHorizontal className="h-3 w-3 shrink-0" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 pt-2 flex-1">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-3 px-2">
                    <span>Source</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Scope</span>
                  </div>

                  <div className="space-y-1">
                    {(analytics.recent_activity || []).slice(0, 4).map((activity: any, i: number) => (
                      <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center p-2 rounded-lg hover:bg-[#f9fafb] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#f0f9f6] text-[#0f5c56] flex items-center justify-center shrink-0">
                            {activity.is_automated ? <RefreshCw className="h-3.5 w-3.5 shrink-0" /> : <Plus className="h-3.5 w-3.5 shrink-0" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{activity.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            {activity.emissions_tonnes.toFixed(2)} t
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{activity.period}</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#ecfdf5] text-[#10b981]">
                            {activity.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium capitalize">
                            {activity.scope?.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {activity.is_automated ? 'Automated' : 'Manual'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Solid Card (Primary Goal) */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-[#0f5c56] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <h2 className="text-sm font-semibold text-gray-900">Primary Goal</h2>
                  </div>
                  <button className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    See All <ArrowUpRight className="h-3 w-3 shrink-0" />
                  </button>
                </div>

                <div className="relative flex-1 bg-[#0f5c56] rounded-xl p-5 overflow-hidden flex flex-col justify-between mt-1 shadow-md">
                  {/* Card inner subtle circles */}
                  <div className="absolute right-[-20%] bottom-[-30%] w-[140px] h-[140px] rounded-full border-[15px] border-white/5" />
                  <div className="absolute right-[-5%] bottom-[-10%] w-[80px] h-[80px] rounded-full border-[10px] border-white/5" />

                  <div className="relative z-10 flex items-start justify-between">
                    <span className="text-white font-bold text-lg tracking-wider">NET ZERO</span>
                    <span className="text-white/60 text-[10px] tracking-widest">TARGET 2030</span>
                  </div>

                  <div className="relative z-10 mt-8">
                    <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">Remaining Budget</p>
                    <p className="text-xl font-bold text-white tracking-tight">4.540,20 t</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
