'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { API_BASE_URL, CDN_URL } from "@/constants/constants"
import { CheckCircle, Copy, Code2, Globe, Zap, ShieldCheck, Key, ExternalLink } from 'lucide-react'
import { useState } from "react"
import { cn } from '@/lib/utils'

export default function SetupContent({ apiKey }: { apiKey: any }) {
  const [copied, setCopied] = useState(false)

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

  const steps = [
    { icon: Copy,  label: 'Copy the script tag below' },
    { icon: Code2, label: 'Paste it in your HTML <head>' },
    { icon: Globe, label: 'Deploy your changes' },
    { icon: Zap,   label: 'View real-time emissions data' },
  ]

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Website Tracking Setup</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add our lightweight tracking script to start monitoring your website&apos;s carbon emissions
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'API Key', value: apiKey?.name || 'N/A', icon: Key },
              { label: 'Domain', value: apiKey?.domain === '*' ? 'All domains' : (apiKey?.domain || 'N/A'), icon: Globe },
              { label: 'Status', value: apiKey ? 'Active' : 'Not configured', icon: CheckCircle, highlight: !!apiKey },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl p-4 border border-border bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={cn('h-3.5 w-3.5', item.highlight ? 'text-emerald-500' : 'text-muted-foreground')} />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                  <p className={cn('text-sm font-semibold', item.highlight ? 'text-emerald-600' : 'text-foreground')}>{item.value}</p>
                </div>
              )
            })}
          </div>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 px-5">
              <CardTitle className="text-sm font-semibold">Tracking Script</CardTitle>
              <CardDescription className="text-xs">
                Add this snippet to your website&apos;s <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">&lt;head&gt;</code> section
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="relative group">
                <pre className="bg-zinc-950 text-zinc-200 p-5 rounded-lg overflow-x-auto text-[13px] leading-relaxed font-mono border border-zinc-800">
                  <code>{getScriptTag()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 h-7 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  onClick={() => handleCopy(getScriptTag())}
                >
                  {copied ? (
                    <><CheckCircle className="h-3 w-3 text-emerald-500" />Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" />Copy</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 px-5">
              <CardTitle className="text-sm font-semibold">Installation Steps</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-0 divide-y divide-border">
                {steps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="w-7 h-7 rounded-full border border-border bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                        {i + 1}
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-sm text-foreground">{step.label}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Privacy-first tracking</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                CarbonCut only tracks page-level emission data. No personal information, cookies, or user identifiers are collected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}