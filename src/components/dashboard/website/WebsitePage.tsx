'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    TrendingUp, TrendingDown, Minus, Filter, Download, Calendar,
    Activity, Settings, Code, CheckCircle, Globe, ArrowRight,
    Cloud, Server, Users, Plane
} from 'lucide-react'
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
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts'
import { AnalyticsData } from '@/types/web-analytics'
import { fetchAnalytics } from '@/services/onboarding/onboarding'
import { Button } from '@/components/ui/button'
import { format, subDays } from 'date-fns'
import { RealtimeEmissionsWidget } from './RealtimePage'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { useRouter } from 'next/navigation'
import { onboardingApi } from '@/services/onboarding/onboarding'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Loader2, AlertCircle } from 'lucide-react'

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const CDN_URL = 'https://cdn.jsdelivr.net/gh/rishi-optiminastic/cc-cdn@main/dist/carboncut.min.js?v=2'

export default function AnalyticsDashboard() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState(currentYear.toString())
    const [selectedMonth, setSelectedMonth] = useState('all')
    const [activeTab, setActiveTab] = useState('realtime')
    const [showSetup, setShowSetup] = useState(false)
    const [onboardingComplete, setOnboardingComplete] = useState(false)

    // Fetch API keys
    const { data: apiKeysData, isLoading: apiKeysLoading } = useQuery({
        queryKey: ['apiKeys', 'web'],
        queryFn: () => ApiKeyService.getApiKeys(),
        staleTime: 30000,
    })

    // Fetch user config
    const { data: configData } = useQuery({
        queryKey: ['userConfig'],
        queryFn: () => onboardingApi.getConfig(),
        staleTime: 30000,
    })

    const apiKeys = apiKeysData?.data?.api_keys || []
    const webApiKey = apiKeys[0]
    const hasApiKey = apiKeys.length > 0
    const config = configData?.data || {}

    // const hasConfig = 
    //     (config.cloud_providers && config.cloud_providers.length > 0) ||
    //     (config.cdn_configs && config.cdn_configs.length > 0) ||
    //     config.workforce_config ||
    //     (config.onprem_configs && config.onprem_configs.length > 0)

    useEffect(() => {
        if (hasApiKey && activeTab === 'analytics' && !loading && !analytics) {
            loadAnalytics()
        }
    }, [selectedYear, selectedMonth, hasApiKey, activeTab])

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
        ].map(row => row.join(',')).join('\n')

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

    const handleOnboardingComplete = () => {
        setOnboardingComplete(true)
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    }

    // Show loading
    if (apiKeysLoading) {
        return (
            <div className="flex-1 p-6 bg-background">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    // No API key - show onboarding (unless they just completed it)
    if (!hasApiKey && !onboardingComplete) {
        return <WebsiteOnboarding onComplete={handleOnboardingComplete} />
    }

    return (
        <div className="flex-1 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {/* Setup Button - Always Visible */}
                <div className="mb-4 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSetup(!showSetup)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        {showSetup ? 'Hide Setup' : 'Setup'}
                    </Button>
                </div>

                {/* Setup Panel (Collapsible) */}
                {showSetup && (
                    <div className="mb-6">
                        <SetupPanel
                            apiKey={webApiKey}
                            config={config}
                            hasConfig={true}
                            onClose={() => setShowSetup(false)}
                        />
                    </div>
                )}

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="realtime" className="gap-2">
                                <Activity className="h-4 w-4" />
                                Real-time
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Analytics
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'analytics' && (
                            <div className="flex gap-2 items-center flex-wrap">
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-[130px] h-9 bg-white">
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

                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-[100px] h-9 bg-white">
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

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                    onClick={handleExport}
                                    disabled={!analytics}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Real-time Tab */}
                    <TabsContent value="realtime" className="space-y-4 mt-0">
                        {webApiKey ? (
                            <RealtimeEmissionsWidget apiKey={webApiKey?.prefix || webApiKey?.key} />
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Setting up tracking...</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6 mt-0">
                        {loading ? (
                            <Card>
                                <CardContent className="py-12 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Loading analytics...</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : error ? (
                            <Card className="border-destructive">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <p>{error}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : analytics ? (
                            <AnalyticsContent analytics={analytics} />
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No analytics data available yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Data will appear once your website starts sending events
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Onboarding component for new users
function WebsiteOnboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [domain, setDomain] = useState('')
    const [copied, setCopied] = useState(false)
    const [createdKey, setCreatedKey] = useState<string | null>(null)

    const createKeyMutation = useMutation({
        mutationFn: async ({ name, domain }: { name: string; domain: string }) => {
            return ApiKeyService.createApiKey(name, domain, 'web', {
                industry_category: 'internet',
            })
        },
        onSuccess: (response) => {
            const fullKey = response.data?.api_key?.full_key || response.data?.api_key?.prefix
            if (fullKey) {
                setCreatedKey(fullKey)
                setStep(2)
            }
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim() && domain.trim()) {
            createKeyMutation.mutate({ name: name.trim(), domain: domain.trim() })
        }
    }

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getScriptTag = (apiKey: string, domain: string) => {
        return `<script 
  src="${CDN_URL}"
  data-token="${apiKey}"
  data-api-url="${API_BASE_URL}/events/"
  data-domain="${domain}"
></script>`
    }

    return (
        <div className="flex-1 p-6 bg-background min-h-screen">
            <div className="mx-auto max-w-2xl pt-8">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Setup Progress</span>
                        <span className="text-sm text-muted-foreground">Step {step} of 2</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Set up website tracking</CardTitle>
                            <CardDescription>
                                Add carbon emission tracking to your website in minutes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Website Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="My Website"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={createKeyMutation.isPending}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain</Label>
                                    <Input
                                        id="domain"
                                        placeholder="example.com"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        disabled={createKeyMutation.isPending}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter without https://
                                    </p>
                                </div>

                                {createKeyMutation.error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {createKeyMutation.error instanceof Error
                                                ? createKeyMutation.error.message
                                                : 'Failed to create API key'}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createKeyMutation.isPending || !name.trim() || !domain.trim()}
                                >
                                    {createKeyMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 2 && createdKey && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <CardTitle>Add tracking script</CardTitle>
                            </div>
                            <CardDescription>
                                Copy this script and add it to your website&apos;s &lt;head&gt; section
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{getScriptTag(createdKey, domain)}</code>
                                </pre>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2"
                                    onClick={() => handleCopy(getScriptTag(createdKey, domain))}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium">Next steps:</p>
                                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                    <li>Copy the script tag above</li>
                                    <li>Paste it in your HTML &lt;head&gt; section</li>
                                    <li>Deploy your changes</li>
                                    <li>View real-time emissions data</li>
                                </ol>
                            </div>

                            <Button onClick={onComplete} className="w-full">
                                View Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

function SetupPanel({
    apiKey,
    config,
    hasConfig,
    onClose
}: {
    apiKey: any
    config: any
    hasConfig: boolean
    onClose: () => void
}) {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [activeSetupTab, setActiveSetupTab] = useState('script')

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getScriptTag = () => {
        const key = apiKey?.prefix || apiKey?.key || ''
        const domain = apiKey?.domain || '*'
        return `<script 
  src="${CDN_URL}"
  data-token="${key}"
  data-api-url="${API_BASE_URL}/events/"
  data-domain="${domain}"
></script>`
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Setup & Configuration</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={activeSetupTab} onValueChange={setActiveSetupTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="script">Tracking Script</TabsTrigger>
                        <TabsTrigger value="config">Infrastructure</TabsTrigger>
                    </TabsList>

                    <TabsContent value="script" className="space-y-4">
                        {/* API Key Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">API Key</p>
                                <p className="font-mono text-xs">{apiKey?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Domain</p>
                                <p className="text-xs">{apiKey?.domain === '*' ? 'All domains' : apiKey?.domain}</p>
                            </div>
                        </div>

                        {/* Script */}
                        <div className="space-y-2">
                            <Label>Script Tag</Label>
                            <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                                    <code>{getScriptTag()}</code>
                                </pre>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2"
                                    onClick={() => handleCopy(getScriptTag())}
                                >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                        {hasConfig ? (
                            <div className="space-y-3">
                                {/* Cloud Providers */}
                                {config.cloud_providers?.length > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Cloud className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">Cloud Infrastructure</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {config.cloud_providers.length} provider(s) configured
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                )}

                                {/* CDN */}
                                {config.cdn_configs?.length > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-purple-600" />
                                            <div>
                                                <p className="text-sm font-medium">CDN Configuration</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {config.cdn_configs.length} CDN(s) configured
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                )}

                                {/* On-Prem */}
                                {config.onprem_configs?.length > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Server className="h-4 w-4 text-orange-600" />
                                            <div>
                                                <p className="text-sm font-medium">On-Premise Servers</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {config.onprem_configs.length} server(s) configured
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                )}

                                {/* Workforce */}
                                {config.workforce_config && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium">Workforce</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Configured
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => router.push('/v2')}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Update Configuration
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                    <Settings className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium mb-1">No infrastructure configured</p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Add cloud, CDN, and workforce data for accurate emissions
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => router.push('/v2')}
                                >
                                    Add Configuration
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

// Analytics Content component
function AnalyticsContent({ analytics }: { analytics: AnalyticsData }) {
    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total Emissions</p>
                        <p className="text-2xl font-bold">{analytics.overview.total_emissions_tonnes.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">tonnes CO₂e</p>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Scope 1</p>
                        <p className="text-2xl font-bold">{(analytics.overview.scope_1_kg / 1000).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Direct emissions</p>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Scope 2</p>
                        <p className="text-2xl font-bold">{(analytics.overview.scope_2_kg / 1000).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Energy indirect</p>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Scope 3</p>
                        <p className="text-2xl font-bold">{(analytics.overview.scope_3_kg / 1000).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Value chain</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Scope Breakdown */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Emissions by Scope</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.scope_breakdown?.length > 0 ? (
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.scope_breakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            dataKey="value_kg"
                                            nameKey="label"
                                        >
                                            {analytics.scope_breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(2)} t`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No data</p>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Monthly Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.monthly_trend?.length > 0 ? (
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.monthly_trend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month_name" tick={{ fontSize: 12 }} />
                                        <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                                        <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(2)} t`} />
                                        <Line
                                            type="monotone"
                                            dataKey="total_kg"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ fill: '#10b981' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No data</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Sources */}
            {analytics.source_breakdown?.length > 0 && (
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Top Emission Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.source_breakdown.slice(0, 5)} layout="vertical" margin={{ left: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                                    <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(2)} t`} />
                                    <Bar dataKey="value_kg" radius={[0, 4, 4, 0]}>
                                        {analytics.source_breakdown.slice(0, 5).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Monthly Table */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-base">Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
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
                                {analytics.monthly_breakdown_table.map((row) => (
                                    <TableRow key={row.month}>
                                        <TableCell className="font-medium">{row.month_name}</TableCell>
                                        <TableCell className="text-right">{(row.total_kg / 1000).toFixed(2)} t</TableCell>
                                        <TableCell className="text-right">{(row.scope_1_kg / 1000).toFixed(2)} t</TableCell>
                                        <TableCell className="text-right">{(row.scope_2_kg / 1000).toFixed(2)} t</TableCell>
                                        <TableCell className="text-right">{(row.scope_3_kg / 1000).toFixed(2)} t</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}