'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, Minus, Filter, Download, Calendar } from 'lucide-react'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from '@/components/ui/chart'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts'
import { AnalyticsData } from '@/types/web-analytics'
import { fetchAnalytics } from '@/services/onboarding/onboarding'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, subDays } from 'date-fns'

const MONTHS = [
    { value: 'all', label: 'Full Year' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

// Chart configs using theme colors
const scopeChartConfig = {
    scope_1: {
        label: 'Scope 1',
        color: 'hsl(var(--chart-1))'
    },
    scope_2: {
        label: 'Scope 2',
        color: 'hsl(var(--chart-2))'
    },
    scope_3: {
        label: 'Scope 3',
        color: 'hsl(var(--chart-3))'
    },
} satisfies ChartConfig

const trendChartConfig = {
    total_kg: {
        label: 'Total Emissions',
        color: 'hsl(var(--chart-1))'
    },
} satisfies ChartConfig

const scopeTrendChartConfig = {
    scope_1_kg: {
        label: 'Scope 1',
        color: 'hsl(var(--chart-1))'
    },
    scope_2_kg: {
        label: 'Scope 2',
        color: 'hsl(var(--chart-2))'
    },
    scope_3_kg: {
        label: 'Scope 3',
        color: 'hsl(var(--chart-3))'
    },
} satisfies ChartConfig

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState(currentYear.toString())
    const [selectedMonth, setSelectedMonth] = useState('all')
    const [dateFrom, setDateFrom] = useState(subDays(new Date(), 30))
    const [dateTo, setDateTo] = useState(new Date())
    const [filterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        loadAnalytics()
    }, [selectedYear, selectedMonth])

    const loadAnalytics = async () => {
        setLoading(true)
        setError(null)
        try {
            const month = selectedMonth !== 'all' ? parseInt(selectedMonth) : undefined
            const response = await fetchAnalytics(parseInt(selectedYear), month)
            if (response.success) {
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

        // Create CSV content
        const csvContent = [
            ['Emission Analytics Report'],
            ['Generated:', new Date().toLocaleString()],
            ['Period:', analytics.period.display],
            [''],
            ['Overview Metrics'],
            ['Metric', 'Value'],
            ['Total Emissions (tonnes)', analytics.overview.total_emissions_tonnes.toFixed(2)],
            ['Scope 1 (tonnes)', (analytics.overview.scope_1_kg / 1000).toFixed(2)],
            ['Scope 2 (tonnes)', (analytics.overview.scope_2_kg / 1000).toFixed(2)],
            ['Scope 3 (tonnes)', (analytics.overview.scope_3_kg / 1000).toFixed(2)],
            [''],
            ['Monthly Breakdown'],
            ['Month', 'Total (t)', 'Scope 1 (t)', 'Scope 2 (t)', 'Scope 3 (t)'],
            ...analytics.monthly_breakdown_table.map(row => [
                row.month_name,
                (row.total_kg / 1000).toFixed(2),
                (row.scope_1_kg / 1000).toFixed(2),
                (row.scope_2_kg / 1000).toFixed(2),
                (row.scope_3_kg / 1000).toFixed(2),
            ]),
            [''],
            ['Top Contributors'],
            ['Rank', 'Source', 'Scope', 'Emissions (t)', 'Share (%)', 'Accuracy'],
            ...analytics.top_contributors.map(item => [
                item.rank,
                item.label,
                item.scope.replace('_', ' ').toUpperCase(),
                item.total_tonnes.toFixed(2),
                item.percentage.toFixed(1),
                item.accuracy,
            ])
        ].map(row => row.join(',')).join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        const filename = `emissions-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return <>Loading..</>
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!analytics) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">No analytics data available</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8 bg-background">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Emission Analytics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive view of your carbon footprint for {analytics.period.display}
                    </p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">
                                    {format(dateFrom, 'MMM dd')} - {format(dateTo, 'MMM dd')}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="end">
                            <div className="space-y-2">
                                <div className="text-sm font-medium mb-2">Quick Select</div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => {
                                            setDateFrom(subDays(new Date(), 7))
                                            setDateTo(new Date())
                                        }}
                                    >
                                        Last 7 days
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => {
                                            setDateFrom(subDays(new Date(), 30))
                                            setDateTo(new Date())
                                        }}
                                    >
                                        Last 30 days
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => {
                                            setDateFrom(subDays(new Date(), 90))
                                            setDateTo(new Date())
                                        }}
                                    >
                                        Last 90 days
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => {
                                            const startOfYear = new Date(new Date().getFullYear(), 0, 1)
                                            setDateFrom(startOfYear)
                                            setDateTo(new Date())
                                        }}
                                    >
                                        Year to date
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[130px] h-9 border-input bg-background shadow-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm">Filter</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-3">Filter Options</h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                            Year
                                        </label>
                                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                                            <SelectTrigger className="h-9">
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
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                            Period
                                        </label>
                                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MONTHS.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedYear(currentYear.toString())
                                            setSelectedMonth('all')
                                            setFilterOpen(false)
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            loadAnalytics()
                                            setFilterOpen(false)
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-9"
                        onClick={handleExport}
                    >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Export</span>
                    </Button>
                </div>
            </div>

            <OverviewCards overview={analytics.overview} yoy={analytics.yoy_comparison} />

            <Tabs defaultValue="overview" className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sources">By Source</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 ">
                        {/* Scope Breakdown Pie Chart */}
                        <Card className='border-border rounded-sm bg-white text-card-foreground'>
                            <CardHeader>
                                <CardTitle>Emissions by Scope</CardTitle>
                                <CardDescription>GHG Protocol scope classification</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScopeBreakdownChart data={analytics.scope_breakdown} />
                            </CardContent>
                        </Card>

                        {/* Source Breakdown Bar Chart */}
                        <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                            <CardHeader>
                                <CardTitle>Top Emission Sources</CardTitle>
                                <CardDescription>Breakdown by emission category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SourceBreakdownChart data={analytics.source_breakdown} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Accuracy Distribution */}
                    <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                        <CardHeader>
                            <CardTitle>Data Quality</CardTitle>
                            <CardDescription>Distribution of emission data accuracy levels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccuracyChart data={analytics.accuracy_distribution} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                    {/* Source by Scope Matrix */}
                    <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                        <CardHeader>
                            <CardTitle>Sources by Scope</CardTitle>
                            <CardDescription>Stacked view of emission sources grouped by GHG scope</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SourceScopeMatrix data={analytics.source_scope_matrix} />
                        </CardContent>
                    </Card>

                    {/* Top Contributors Table */}
                    <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                        <CardHeader>
                            <CardTitle>Top Contributors</CardTitle>
                            <CardDescription>Detailed breakdown of highest emission sources</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TopContributorsTable data={analytics.top_contributors} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    {/* Monthly Trend Line Chart */}
                    <Card className="border-border rounded-sm  bg-white text-card-foreground">
                        <CardHeader>
                            <CardTitle>Monthly Emissions Trend</CardTitle>
                            <CardDescription>Track your emissions over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyTrendChart data={analytics.monthly_trend} />
                        </CardContent>
                    </Card>

                    {/* Scope Trend Area Chart */}
                    <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                        <CardHeader>
                            <CardTitle>Scope Distribution Over Time</CardTitle>
                            <CardDescription>How different scopes contribute month by month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScopeTrendChart data={analytics.monthly_trend} />
                        </CardContent>
                    </Card>

                    {/* YoY Comparison */}
                    <YoYComparisonCard yoy={analytics.yoy_comparison} />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                    {/* Intensity Metrics */}
                    <IntensityMetricsCard metrics={analytics.intensity_metrics} />

                    {/* Monthly Breakdown Table */}
                    <Card className='border-border rounded-sm  bg-white text-card-foreground'>
                        <CardHeader>
                            <CardTitle>Monthly Breakdown</CardTitle>
                            <CardDescription>Detailed month-by-month emission data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyBreakdownTable data={analytics.monthly_breakdown_table} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function OverviewCards({ overview, yoy }: { overview: AnalyticsData['overview']; yoy: AnalyticsData['yoy_comparison'] }) {
    const TrendIcon = overview.trend === 'up' ? TrendingUp : overview.trend === 'down' ? TrendingDown : Minus
    const trendColor = overview.trend === 'down' ? 'text-green-500' : overview.trend === 'up' ? 'text-red-500' : 'text-gray-500'
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  ">
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
                <CardContent>
                    <div className="text-3xl font-bold">{overview.total_emissions_tonnes.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total Emissions (tonnes)</p>
                </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
                <CardContent>
                    <div className="text-3xl font-bold">{(overview.scope_1_kg / 1000).toFixed(2)}</div>
                    <p className="text-xs text-[#6c5f31]/70">Scope 1 (Direct Emissions)</p>
                </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
                <CardContent>
                    <div className="text-3xl font-bold">{(overview.scope_2_kg / 1000).toFixed(2)}</div>
                    <p className="text-xs text-[#6c5f31]/70">Scope 2 (Energy Indirect)</p>
                </CardContent>
            </Card>
            <Card className="border-border rounded-sm h-24 bg-white text-card-foreground">
                <CardContent>
                    <div className="text-3xl font-bold">{(overview.scope_3_kg / 1000).toFixed(2)}</div>
                    <p className="text-xs text-[#6c5f31]/70">Scope 3 (Value Chain)</p>
                </CardContent>
            </Card>
        </div>
    );
}

// Scope Breakdown Pie Chart
function ScopeBreakdownChart({ data }: { data: AnalyticsData['scope_breakdown'] }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No scope data available</p>
    }

    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value_kg"
                        nameKey="label"
                        label={({ label, percentage }) => `${label}: ${percentage}%`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, 'Emissions']}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

// Source Breakdown Bar Chart
function SourceBreakdownChart({ data }: { data: AnalyticsData['source_breakdown'] }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No source data available</p>
    }

    const chartData = data.slice(0, 6) // Top 6 sources

    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                    <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, 'Emissions']}
                    />
                    <Bar dataKey="value_kg" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// Accuracy Distribution Chart
function AccuracyChart({ data }: { data: AnalyticsData['accuracy_distribution'] }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No accuracy data available</p>
    }

    return (
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']} />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// Source Scope Matrix (Stacked Bar)
function SourceScopeMatrix({ data }: { data: AnalyticsData['source_scope_matrix'] }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No matrix data available</p>
    }

    return (
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                    <YAxis type="category" dataKey="source" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, '']} />
                    <Legend />
                    <Bar dataKey="scope_1" stackId="a" fill="#ef4444" name="Scope 1" />
                    <Bar dataKey="scope_2" stackId="a" fill="#f59e0b" name="Scope 2" />
                    <Bar dataKey="scope_3" stackId="a" fill="#3b82f6" name="Scope 3" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// Monthly Trend Line Chart
function MonthlyTrendChart({ data }: { data: AnalyticsData['monthly_trend'] }) {
    return (
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month_name" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                    <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, '']} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="total_kg"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Total Emissions"
                        dot={{ fill: '#10b981' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

// Scope Trend Area Chart
function ScopeTrendChart({ data }: { data: AnalyticsData['monthly_trend'] }) {
    return (
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month_name" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                    <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, '']} />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="scope_1_kg"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Scope 1"
                    />
                    <Area
                        type="monotone"
                        dataKey="scope_2_kg"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                        name="Scope 2"
                    />
                    <Area
                        type="monotone"
                        dataKey="scope_3_kg"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Scope 3"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// Top Contributors Table
function TopContributorsTable({ data }: { data: AnalyticsData['top_contributors'] }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No contributor data available</p>
    }

    const getAccuracyBadge = (accuracy: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            high: 'default',
            medium: 'secondary',
            estimated: 'destructive',
        }
        return <Badge variant={variants[accuracy] || 'secondary'}>{accuracy}</Badge>
    }

    const getScopeBadge = (scope: string) => {
        const colors: Record<string, string> = {
            scope_1: 'bg-red-100 text-red-800',
            scope_2: 'bg-amber-100 text-amber-800',
            scope_3: 'bg-blue-100 text-blue-800',
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[scope] || 'bg-gray-100'}`}>
                {scope.replace('_', ' ').toUpperCase()}
            </span>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead className="text-right">Emissions</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                    <TableHead>Accuracy</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.rank}>
                        <TableCell className="font-medium">{item.rank}</TableCell>
                        <TableCell>{item.label}</TableCell>
                        <TableCell>{getScopeBadge(item.scope)}</TableCell>
                        <TableCell className="text-right">{item.total_tonnes.toFixed(2)} t</TableCell>
                        <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                        <TableCell>{getAccuracyBadge(item.accuracy)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

// YoY Comparison Card
function YoYComparisonCard({ yoy }: { yoy: AnalyticsData['yoy_comparison'] }) {
    const TrendIcon = yoy.trend === 'increase' ? TrendingUp : yoy.trend === 'decrease' ? TrendingDown : Minus
    const trendColor =
        yoy.trend === 'decrease' ? 'text-green-500' : yoy.trend === 'increase' ? 'text-red-500' : 'text-gray-500'

    return (
        <Card>
            <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>
                    Comparing {yoy.current_year} vs {yoy.previous_year}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {yoy.has_previous_data ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">{yoy.previous_year}</p>
                            <p className="text-2xl font-bold">{(yoy.previous_kg / 1000).toFixed(2)} t</p>
                        </div>
                        <div className="text-center flex flex-col items-center justify-center">
                            <TrendIcon className={`h-8 w-8 ${trendColor}`} />
                            <p className={`text-lg font-semibold ${trendColor}`}>
                                {yoy.change_percentage > 0 ? '+' : ''}
                                {yoy.change_percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {yoy.change_kg > 0 ? '+' : ''}
                                {(yoy.change_kg / 1000).toFixed(2)} tonnes
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">{yoy.current_year}</p>
                            <p className="text-2xl font-bold">{(yoy.current_kg / 1000).toFixed(2)} t</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-4">
                        No data available for {yoy.previous_year} for comparison
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// Intensity Metrics Card
function IntensityMetricsCard({ metrics }: { metrics: AnalyticsData['intensity_metrics'] }) {
    return (
        <Card className='border-border rounded-sm bg-white text-card-foreground'>
            <CardHeader>
                <CardTitle>Emission Intensity</CardTitle>
                <CardDescription>Normalized emission metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Per Employee</p>
                        <p className="text-2xl font-bold">{metrics.per_employee_tonnes.toFixed(2)} t</p>
                        <p className="text-xs text-muted-foreground">{metrics.employee_count} employees</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Daily Average</p>
                        <p className="text-2xl font-bold">{metrics.daily_average_kg.toFixed(1)} kg</p>
                        <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Monthly Average</p>
                        <p className="text-2xl font-bold">{(metrics.monthly_average_kg / 1000).toFixed(2)} t</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Per Employee/Month</p>
                        <p className="text-2xl font-bold">
                            {(metrics.per_employee_kg / 12).toFixed(1)} kg
                        </p>
                        <p className="text-xs text-muted-foreground">monthly avg</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Monthly Breakdown Table
function MonthlyBreakdownTable({ data }: { data: AnalyticsData['monthly_breakdown_table'] }) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Scope 1</TableHead>
                        <TableHead className="text-right">Scope 2</TableHead>
                        <TableHead className="text-right">Scope 3</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.month}>
                            <TableCell className="font-medium">{row.month_name}</TableCell>
                            <TableCell className="text-right">{(row.total_kg / 1000).toFixed(2)} t</TableCell>
                            <TableCell className="text-right">{(row.scope_1_kg / 1000).toFixed(2)} t</TableCell>
                            <TableCell className="text-right">{(row.scope_2_kg / 1000).toFixed(2)} t</TableCell>
                            <TableCell className="text-right">{(row.scope_3_kg / 1000).toFixed(2)} t</TableCell>
                        </TableRow>
                    ))}
                    {/* Total Row */}
                    <TableRow className="font-bold bg-muted">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                            {(data.reduce((sum, r) => sum + r.total_kg, 0) / 1000).toFixed(2)} t
                        </TableCell>
                        <TableCell className="text-right">
                            {(data.reduce((sum, r) => sum + r.scope_1_kg, 0) / 1000).toFixed(2)} t
                        </TableCell>
                        <TableCell className="text-right">
                            {(data.reduce((sum, r) => sum + r.scope_2_kg, 0) / 1000).toFixed(2)} t
                        </TableCell>
                        <TableCell className="text-right">
                            {(data.reduce((sum, r) => sum + r.scope_3_kg, 0) / 1000).toFixed(2)} t
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}