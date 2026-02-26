'use client'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Loader2,
  Edit2,
  Plus,
  Link2,
  LogOut,
  Settings,
  Cloud,
  Globe,
  Users,
  Server,
  FileText,
  ArrowRight,
  Shield,
  ExternalLink,
  Copy,
  ChevronRight,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeysList } from '@/components/dashboard/api-key/ApiList'
import { CreateApiKeyDialog } from '@/components/dashboard/api-key/CreateAPIKeyDialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog'
import { ApiKeyService } from '@/services/apikey/apikey'
import { useGoogleAds } from '@/contexts/GoogleAdsContext'
import { useRouter } from 'next/dist/client/components/navigation'
import { onboardingApi } from '@/services/onboarding/onboarding'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ReportsTab } from '@/components/dashboard/profile/MonthlyReports'
import { cn } from '@/lib/utils'

type TabType = 'basic-info' | 'integrations' | 'configuration' | 'reports'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { status: googleAdsStatus } = useGoogleAds()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabType>('basic-info')
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false)
  const [connectGoogleDialogOpen, setConnectGoogleDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    companyName: user?.companyName || '',
  })

  const { data: apiKeysData } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => ApiKeyService.getApiKeys(),
    retry: 1,
    staleTime: 30000,
  })

  const { data: configData, isLoading: configLoading } = useQuery({
    queryKey: ['userConfig'],
    queryFn: () => onboardingApi.getConfig(),
    retry: 1,
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const hasApiKey = apiKeys.length > 0

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) return email.slice(0, 2).toUpperCase()
    return 'U'
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/users/update/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setIsEditing(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      companyName: user?.companyName || '',
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'basic-info', label: 'Profile' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'reports', label: 'Reports' },
  ]

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Profile header card */}
          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent" />
            <CardContent className="px-5 pb-5 -mt-10">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-4">
                  <Avatar className="h-16 w-16 border-4 border-card shadow-sm">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pb-0.5">
                    <h2 className="text-lg font-semibold text-foreground">{user?.name || 'User'}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {user?.companyName && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {user.companyName}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 border-border shadow-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Horizontal tabs */}
          <div className="border-b border-border">
            <nav className="flex gap-0 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div>
            {activeTab === 'basic-info' && (
              <BasicInfoTab
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                updateProfileMutation={updateProfileMutation}
              />
            )}
            {activeTab === 'integrations' && (
              <IntegrationsTab
                googleAdsStatus={googleAdsStatus}
                setConnectGoogleDialogOpen={setConnectGoogleDialogOpen}
                hasApiKey={hasApiKey}
                handleCreateKeyClick={() => { if (!hasApiKey) setCreateKeyDialogOpen(true) }}
              />
            )}
            {activeTab === 'configuration' && (
              <ConfigurationTab configData={configData} configLoading={configLoading} />
            )}
            {activeTab === 'reports' && <ReportsTab />}
          </div>
        </div>
      </div>

      <CreateApiKeyDialog open={createKeyDialogOpen} onOpenChange={setCreateKeyDialogOpen} />
      <GoogleAdsConnectDialog open={connectGoogleDialogOpen} onOpenChange={setConnectGoogleDialogOpen} />
    </div>
  )
}

/* ─── Basic Info ─── */
function BasicInfoTab({ user, isEditing, setIsEditing, formData, setFormData, handleSubmit, handleCancel, updateProfileMutation }: any) {
  const fields = [
    { id: 'name', label: 'Full Name', value: user?.name, formKey: 'name', editable: true, icon: User },
    { id: 'email', label: 'Email', value: user?.email, formKey: null, editable: false, icon: Mail },
    { id: 'phoneNumber', label: 'Phone', value: user?.phoneNumber, formKey: 'phoneNumber', editable: true, icon: Phone },
    { id: 'companyName', label: 'Company', value: user?.companyName, formKey: 'companyName', editable: true, icon: Building2 },
  ]

  return (
    <div className="space-y-6">
      {updateProfileMutation.isSuccess && (
        <Alert className="border-emerald-500/20 bg-emerald-500/5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          <AlertDescription className="text-xs text-emerald-800">Profile updated successfully!</AlertDescription>
        </Alert>
      )}
      {updateProfileMutation.error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{updateProfileMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="px-5 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
            {!isEditing ? (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button size="sm" className="h-7 text-xs shadow-sm" onClick={handleSubmit} disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={handleCancel} disabled={updateProfileMutation.isPending}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 divide-y sm:divide-y-0 divide-border">
              {fields.map((field, i) => {
                const Icon = field.icon
                return (
                  <div key={field.id} className={cn('py-3.5', i < 2 && 'sm:border-b sm:border-border')}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{field.label}</span>
                    </div>
                    {isEditing && field.editable && field.formKey ? (
                      <Input
                        value={(formData as any)[field.formKey]}
                        onChange={(e) => setFormData({ ...formData, [field.formKey!]: e.target.value })}
                        className="h-8 text-sm border-border mt-1"
                      />
                    ) : (
                      <p className={cn('text-sm font-medium mt-0.5', field.value ? 'text-foreground' : 'text-muted-foreground/50')}>
                        {field.value || '—'}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Security</p>
              <p className="text-xs text-muted-foreground">Manage your password and authentication settings</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground gap-1">
              Change Password <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Integrations ─── */
function IntegrationsTab({ googleAdsStatus, setConnectGoogleDialogOpen, hasApiKey, handleCreateKeyClick }: any) {
  const integrations = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: 'Sync campaign emissions data automatically',
      icon: (
        <Image src="/dsp/google-ads.svg" alt="Google Ads" width={20} height={20} />
      ),
      connected: googleAdsStatus?.is_connected,
      onConnect: () => setConnectGoogleDialogOpen(true),
      meta: googleAdsStatus?.customer_id ? `ID: ${googleAdsStatus.customer_id}` : null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Connected services */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Connected Services</h3>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-10 w-10 rounded-lg border border-border bg-background flex items-center justify-center shrink-0">
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{integration.name}</p>
                      {integration.connected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {integration.connected ? (integration.meta || 'Connected') : integration.description}
                    </p>
                  </div>
                  {integration.connected ? (
                    <Badge variant="secondary" className="text-[10px] font-normal gap-1 px-2 h-6 shrink-0">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-border shadow-sm shrink-0" onClick={integration.onConnect}>
                      Connect
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">API Keys</h3>
          <Button size="sm" className="h-7 text-xs gap-1.5 shadow-sm" onClick={handleCreateKeyClick} disabled={hasApiKey}>
            <Plus className="h-3 w-3" />
            New Key
          </Button>
        </div>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-5">
            <ApiKeysList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Configuration ─── */
function ConfigurationTab({ configData, configLoading }: any) {
  const config = configData?.data || {}

  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading configuration…</span>
      </div>
    )
  }

  const sections = [
    {
      key: 'cloud',
      title: 'Cloud Infrastructure',
      icon: Cloud,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      items: config.cloud_providers || [],
      render: (item: any) => ({
        primary: item.provider || 'Cloud Provider',
        secondary: [
          item.connection_type === 'manual' ? 'Manual' : 'CSV',
          item.monthly_cost_usd ? `$${item.monthly_cost_usd}/mo` : null,
        ].filter(Boolean).join(' · '),
        badge: item.regions?.length > 0 ? item.regions.join(', ') : null,
      }),
    },
    {
      key: 'cdn',
      title: 'CDN',
      icon: Globe,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      items: config.cdn_configs || [],
      render: (item: any) => ({
        primary: item.provider || 'CDN Provider',
        secondary: item.monthly_gb_transferred ? `${item.monthly_gb_transferred} GB/mo` : 'Not specified',
        badge: item.regions?.length > 0 ? item.regions.join(', ') : 'Global',
      }),
    },
    {
      key: 'workforce',
      title: 'Workforce',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      items: config.workforce_config ? [config.workforce_config] : [],
      render: (item: any) => ({
        primary: `${item.total_employees || '?'} employees`,
        secondary: [
          item.remote_employee_percentage ? `${item.remote_employee_percentage}% remote` : null,
          item.office_locations?.length ? `${item.office_locations.length} office${item.office_locations.length !== 1 ? 's' : ''}` : null,
        ].filter(Boolean).join(' · '),
        badge: null,
      }),
    },
    {
      key: 'onprem',
      title: 'On-Premise',
      icon: Server,
      color: 'text-orange-600',
      bg: 'bg-orange-500/10',
      items: config.onprem_configs || [],
      render: (item: any) => ({
        primary: [item.location_city, item.location_country_code].filter(Boolean).join(', ') || 'Data Center',
        secondary: [
          `PUE ${item.power_usage_effectiveness || '1.6'}`,
          item.servers?.length ? `${item.servers.length} server${item.servers.length !== 1 ? 's' : ''}` : null,
        ].filter(Boolean).join(' · '),
        badge: null,
      }),
    },
  ]

  const configuredCount = sections.filter(s => s.items.length > 0).length
  const hasAny = configuredCount > 0

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{configuredCount}</span> of {sections.length} sources configured
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 border-border shadow-sm"
          onClick={() => (window.location.href = '/v2')}
        >
          <Settings className="h-3 w-3" />
          {hasAny ? 'Update' : 'Configure'}
        </Button>
      </div>

      {/* Compact source grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((section) => {
          const Icon = section.icon
          const hasItems = section.items.length > 0

          return (
            <Card
              key={section.key}
              className={cn(
                'bg-card border-border shadow-sm transition-colors',
                !hasItems && 'opacity-50'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg shrink-0', hasItems ? section.bg : 'bg-muted')}>
                    <Icon className={cn('h-4 w-4', hasItems ? section.color : 'text-muted-foreground/40')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{section.title}</p>
                      {hasItems ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground shrink-0">Not set</span>
                      )}
                    </div>

                    {hasItems ? (
                      <div className="mt-2 space-y-1.5">
                        {section.items.map((item: any, idx: number) => {
                          const rendered = section.render(item)
                          return (
                            <div key={item.id || idx} className="rounded-md bg-muted/50 px-2.5 py-1.5">
                              <p className="text-xs font-medium text-foreground capitalize">{rendered.primary}</p>
                              {rendered.secondary && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">{rendered.secondary}</p>
                              )}
                              {rendered.badge && (
                                <Badge variant="secondary" className="text-[9px] font-normal px-1 py-0 h-4 mt-1">
                                  {rendered.badge}
                                </Badge>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Not configured yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!hasAny && (
        <Card className="border-dashed border-border bg-card shadow-sm">
          <CardContent className="py-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Settings className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No sources configured</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Complete onboarding to set up your emission sources for accurate tracking
              </p>
            </div>
            <Button size="sm" className="h-8 text-xs shadow-sm gap-1.5" onClick={() => (window.location.href = '/v2')}>
              Start Setup <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}