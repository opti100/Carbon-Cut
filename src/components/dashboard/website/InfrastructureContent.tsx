'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Settings, CheckCircle, Globe, ArrowRight, Cloud, Server, Users, Plane, Zap, Plus, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const INFRA_ITEMS = [
  {
    key: 'cloud_providers',
    label: 'Cloud Infrastructure',
    description: (n: number) => `${n} provider${n !== 1 ? 's' : ''} configured`,
    icon: Cloud,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    isArray: true,
  },
  {
    key: 'cdn_configs',
    label: 'CDN',
    description: (n: number) => `${n} CDN${n !== 1 ? 's' : ''} configured`,
    icon: Globe,
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    isArray: true,
  },
  {
    key: 'onprem_configs',
    label: 'On-Premise Servers',
    description: (n: number) => `${n} server${n !== 1 ? 's' : ''} configured`,
    icon: Server,
    color: 'text-orange-600',
    bg: 'bg-orange-500/10',
    isArray: true,
  },
  {
    key: 'workforce_config',
    label: 'Workforce',
    description: () => 'Remote & office emissions tracked',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    isArray: false,
  },
  {
    key: 'travel_configs',
    label: 'Travel',
    description: (n: number) => `${n} travel pattern${n !== 1 ? 's' : ''} configured`,
    icon: Plane,
    color: 'text-sky-600',
    bg: 'bg-sky-500/10',
    isArray: true,
  },
]

export default function InfrastructureContent({ config }: { config: any }) {
  const router = useRouter()

  const getCount = (item: typeof INFRA_ITEMS[0]): number => {
    if (!item.isArray) return config[item.key] ? 1 : 0
    return config[item.key]?.length ?? 0
  }

  const configuredItems = INFRA_ITEMS.filter(item => getCount(item) > 0)
  const missingItems = INFRA_ITEMS.filter(item => getCount(item) === 0)
  const hasAny = configuredItems.length > 0

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Infrastructure Configuration</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure your emission sources for accurate carbon footprint calculations
            </p>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Configured', value: configuredItems.length, icon: CheckCircle, iconColor: 'text-emerald-500' },
              { label: 'Missing', value: missingItems.length, icon: AlertTriangle, iconColor: 'text-amber-500' },
              { label: 'Available', value: INFRA_ITEMS.length, icon: Settings, iconColor: 'text-muted-foreground' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-xl p-4 border border-border bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={cn('h-3.5 w-3.5', stat.iconColor)} />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Sources list */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-2 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Emission Sources</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Configure more sources for more accurate calculations
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 border-border shadow-sm"
                  onClick={() => router.push('/v2')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Source
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-0 divide-y divide-border">
                {INFRA_ITEMS.map((item) => {
                  const count = getCount(item)
                  const configured = count > 0
                  const Icon = item.icon

                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3.5 first:pt-1 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                          configured ? item.bg : 'bg-muted'
                        )}>
                          <Icon className={cn('h-4 w-4', configured ? item.color : 'text-muted-foreground/40')} />
                        </div>
                        <div>
                          <p className={cn('text-sm font-medium', !configured && 'text-muted-foreground')}>{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {configured ? item.description(count) : 'Not configured'}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {configured ? (
                          <Badge variant="secondary" className="text-[10px] font-normal gap-1 px-2 py-0.5">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            Active
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                            onClick={() => router.push('/v2')}
                          >
                            Configure <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bottom action */}
          {hasAny && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Settings className="h-4.5 w-4.5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Need to update your configuration?</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can modify existing sources or add new ones at any time.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-border shadow-sm shrink-0"
                onClick={() => router.push('/v2')}
              >
                Update Config
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}