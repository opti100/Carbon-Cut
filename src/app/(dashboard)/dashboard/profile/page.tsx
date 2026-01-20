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
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Loader2,
  Edit2,
  X,
  Key,
  Plus,
  Link2,
  LogOut,
  AlertTriangle,
  Settings,
  Cloud,
  Globe,
  Users,
  Server,
  Plane,
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

type TabType = 'basic-info' | 'integrations' | 'configuration'

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
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
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

  const handleCreateKeyClick = () => {
    if (hasApiKey) return
    setCreateKeyDialogOpen(true)
  }

  const sidebarItems = [
    {
      id: 'basic-info' as TabType,
      label: 'Basic Info',
      icon: User,
      description: 'Personal details',
    },
    {
      id: 'integrations' as TabType,
      label: 'Integrations',
      icon: Link2,
      description: 'Connected services',
    },
    {
      id: 'configuration' as TabType,
      label: 'Configuration',
      icon: Settings,
      description: 'Onboarding settings',
    },
  ]

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, integrations, and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-white rounded-md sticky top-6">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs opacity-80 truncate">{item.description}</p>
                      </div>
                    </button>
                  ))}
                  <Separator className="my-3" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Logout</p>
                      <p className="text-xs opacity-80">Sign out of account</p>
                    </div>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
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
                getInitials={getInitials}
              />
            )}

            {activeTab === 'integrations' && (
              <IntegrationsTab
                googleAdsStatus={googleAdsStatus}
                setConnectGoogleDialogOpen={setConnectGoogleDialogOpen}
                hasApiKey={hasApiKey}
                handleCreateKeyClick={handleCreateKeyClick}
              />
            )}

            {activeTab === 'configuration' && (
              <ConfigurationTab
                configData={configData}
                configLoading={configLoading}
              />
            )}
          </div>
        </div>
      </div>

      <CreateApiKeyDialog
        open={createKeyDialogOpen}
        onOpenChange={setCreateKeyDialogOpen}
      />
      <GoogleAdsConnectDialog
        open={connectGoogleDialogOpen}
        onOpenChange={setConnectGoogleDialogOpen}
      />
    </div>
  )
}

// Basic Info Tab Component
function BasicInfoTab({
  user,
  isEditing,
  setIsEditing,
  formData,
  setFormData,
  handleSubmit,
  handleCancel,
  updateProfileMutation,
  getInitials,
}: any) {
  return (
    <Card className="bg-white rounded-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your personal details and contact information.
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {updateProfileMutation.isSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}
        {updateProfileMutation.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{updateProfileMutation.error.message}</AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name || 'User'}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-muted-foreground">{user?.name || 'Not set'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              ) : (
                <p className="text-muted-foreground">
                  {user?.phoneNumber || 'Not set'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              ) : (
                <p className="text-muted-foreground">
                  {user?.companyName || 'Not set'}
                </p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// Integrations Tab Component
function IntegrationsTab({
  googleAdsStatus,
  setConnectGoogleDialogOpen,
  hasApiKey,
  handleCreateKeyClick,
}: any) {
  return (
    <div className="space-y-6">
      {/* Google Ads Integration */}
      <Card className="bg-white rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" /> Google Ads Integration
          </CardTitle>
          <CardDescription>
            Connect and manage your Google Ads account for campaign tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Image
                src="/dsp/google-ads.svg"
                alt="Google Ads"
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">Google Ads</p>
                <p className="text-sm text-muted-foreground">
                  Sync your campaign data automatically.
                </p>
              </div>
            </div>
            {googleAdsStatus?.is_connected ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setConnectGoogleDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {googleAdsStatus?.is_connected && googleAdsStatus?.customer_id && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer ID</p>
                  <p className="font-mono font-medium">{googleAdsStatus.customer_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="bg-white rounded-md">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" /> API Keys
            </CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access.
            </CardDescription>
          </div>
          <Button onClick={handleCreateKeyClick} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Create API Key
          </Button>
        </CardHeader>
        <CardContent>
          <ApiKeysList />
        </CardContent>
      </Card>
    </div>
  )
}

function ConfigurationTab({ configData, configLoading }: any) {
  const config = configData?.data || {}

  if (configLoading) {
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

  const configSections = [
    {
      title: 'Cloud Infrastructure',
      icon: Cloud,
      items: config.cloud_providers || [],
      emptyMessage: 'No cloud providers configured',
      renderItem: (item: any) => (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium capitalize">
                {item.provider || 'Cloud Provider'}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.connection_type === 'manual' ? 'Manual Entry' : 'CSV Upload'}
                {item.monthly_cost_usd && ` • $${item.monthly_cost_usd}/mo`}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {item.regions && item.regions.length > 0 
              ? item.regions.join(', ') 
              : 'N/A'}
          </Badge>
        </div>
      ),
    },
    {
      title: 'CDN Configuration',
      icon: Globe,
      items: config.cdn_configs || [],
      emptyMessage: 'No CDN configured',
      renderItem: (item: any) => (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium capitalize">
                {item.provider || 'CDN Provider'}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.monthly_gb_transferred 
                  ? `${item.monthly_gb_transferred} GB/mo` 
                  : 'Data transfer not specified'}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {item.regions && item.regions.length > 0 
              ? item.regions.join(', ') 
              : 'Global'}
          </Badge>
        </div>
      ),
    },
    {
      title: 'Workforce Details',
      icon: Users,
      items: config.workforce_config ? [config.workforce_config] : [],
      emptyMessage: 'No workforce details configured',
      renderItem: (item: any) => (
        <div className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <p className="font-medium">Workforce Configuration</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Employees</p>
              <p className="font-medium">{item.total_employees || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remote Percentage</p>
              <p className="font-medium">
                {item.remote_employee_percentage 
                  ? `${item.remote_employee_percentage}%` 
                  : 'N/A'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground mb-2">Office Locations</p>
              {item.office_locations && item.office_locations.length > 0 ? (
                <div className="space-y-2">
                  {item.office_locations.map((loc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium text-sm">
                          {[loc.city, loc.country].filter(Boolean).join(', ')}
                        </p>
                        {loc.employee_count && (
                          <p className="text-xs text-muted-foreground">
                            {loc.employee_count} employees
                          </p>
                        )}
                      </div>
                      {loc.square_meters && (
                        <Badge variant="outline" className="text-xs">
                          {loc.square_meters} m²
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-medium">No locations specified</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'On-Premise Infrastructure',
      icon: Server,
      items: config.onprem_configs || [],
      emptyMessage: 'No on-premise servers configured',
      renderItem: (item: any) => (
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {item.location_city || 'Data Center'}
                {item.location_country_code && ` (${item.location_country_code})`}
              </p>
              <p className="text-sm text-muted-foreground">
                PUE: {item.power_usage_effectiveness || '1.6'}
              </p>
            </div>
          </div>
          {item.servers && item.servers.length > 0 && (
            <div className="space-y-2 mt-3">
              {item.servers.map((server: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium text-sm">{server.name || `Server ${idx + 1}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {server.cpu_cores} cores • {server.ram_gb}GB RAM • {server.storage_tb}TB
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((server.avg_cpu_utilization || 0.35) * 100)}% CPU
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ]

  // Check if there's any configuration data
  const hasAnyConfig = 
    (config.cloud_providers && config.cloud_providers.length > 0) ||
    (config.cdn_configs && config.cdn_configs.length > 0) ||
    config.workforce_config ||
    (config.onprem_configs && config.onprem_configs.length > 0)

  return (
    <div className="space-y-6">
      {hasAnyConfig ? (
        configSections.map((section) => (
          <Card key={section.title} className="bg-white rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <CardDescription>
                Configuration from your onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {section.items.length > 0 ? (
                <div className="space-y-3">
                  {section.items.map((item: any, index: number) => (
                    <div key={item.id || index}>{section.renderItem(item)}</div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <section.icon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>{section.emptyMessage}</p>
                  <p className="text-sm mt-1">Complete the onboarding to add this information</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-white rounded-md">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No Configuration Found</p>
              <p className="text-sm mt-2">
                Complete the onboarding process to set up your configurations
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/v2'}
              >
                Start Onboarding
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}