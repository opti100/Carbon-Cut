'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, CheckCircle, Loader2, Code, Globe, AlertCircle, ExternalLink } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const CDN_URL = 'https://cdn.jsdelivr.net/gh/rishi-optiminastic/cc-cdn@main/dist/carboncut.min.js?v=2'

interface WebAPIKeySetupProps {
  onKeyCreated?: (key: string) => void
}

export function WebAPIKeySetup({ onKeyCreated }: WebAPIKeySetupProps) {
  const [domain, setDomain] = useState('')
  const [name, setName] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    installed: boolean
    errors?: string[]
  } | null>(null)
  const queryClient = useQueryClient()

  // Fetch existing API keys
  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: ['apiKeys', 'web'],
    queryFn: () => ApiKeyService.getApiKeys('web'),
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const webApiKey = apiKeys.find(
    (key) => key.product === 'web' || key.industry_category === 'internet'
  )

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: async ({ name, domain }: { name: string; domain: string }) => {
      return ApiKeyService.createApiKey(name, domain, 'web', {
        website_url: domain,
        industry_category: 'internet',
      })
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      queryClient.invalidateQueries({ queryKey: ['apiKeys', 'web'] })
      if (response.data?.api_key?.full_key) {
        onKeyCreated?.(response.data.api_key.full_key)
      }
      setDomain('')
      setName('')
    },
  })

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && domain.trim()) {
      createKeyMutation.mutate({
        name: name.trim(),
        domain: domain.trim(),
      })
    }
  }

  const handleCopy = async (text: string, type: 'key' | 'script') => {
    await navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    }
  }

  const handleVerify = async () => {
    if (!webApiKey) return
    
    const url = webApiKey.domain === '*' ? '' : webApiKey.domain
    if (!url) {
      setVerificationResult({
        installed: false,
        errors: ['Please provide a URL to verify. Your API key is set to allow all domains.']
      })
      return
    }
    
    setVerifying(true)
    setVerificationResult(null)
    
    try {
      const result = await ApiKeyService.verifyInstallation(webApiKey.id, url)
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({
        installed: false,
        errors: ['Failed to verify installation. Please try again.']
      })
    } finally {
      setVerifying(false)
    }
  }

  const getScriptTag = (apiKey: string, domain: string = '*') => {
    return `<script 
  src="${CDN_URL}"
  data-token="${apiKey}"
  data-api-url="${API_BASE_URL}/events/"
  data-debug="false"
  data-domain="${domain}"
/>`
  }

  const getAsyncScriptTag = (apiKey: string, domain: string = '*') => {
    return `<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${CDN_URL}';
    s.setAttribute('data-token', '${apiKey}');
    s.setAttribute('data-api-url', '${API_BASE_URL}/events/');
    s.setAttribute('data-debug', 'false');
    s.setAttribute('data-domain', '${domain}');
    s.async = true;
    document.head.appendChild(s);
  })();
</script>`
  }

  const getNextJsCode = (apiKey: string, domain: string = '*') => {
    return `// app/layout.tsx or pages/_app.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="${CDN_URL}"
          data-token="${apiKey}"
          data-api-url="${API_BASE_URL}/events/"
          data-debug="false"
          data-domain="${domain}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading API key status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If API key exists, show the script tag and instructions
  if (webApiKey) {
    const apiKey = webApiKey.prefix || webApiKey.key
    const domain = webApiKey.domain || '*'
    const scriptTag = getScriptTag(apiKey || "", domain)

    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Web API Key Active
              </CardTitle>
              <CardDescription>
                Your website is ready to track carbon emissions
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              {webApiKey.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Key Name</p>
                <p className="font-medium">{webApiKey.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Domain</p>
                <p className="font-medium">{domain === '*' ? 'All domains' : domain}</p>
              </div>
            </div>

            {/* API Key Display */}
            <div className="space-y-2">
              <Label>API Key (Token)</Label>
              <div className="flex gap-2">
                <Input
                  value={apiKey}
                  readOnly
                  className="font-mono text-sm bg-white"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(apiKey||"", 'key')}
                >
                  {copiedKey ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="async">Async Load</TabsTrigger>
              <TabsTrigger value="nextjs">Next.js</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-3">
              <Alert className="bg-blue-50 border-blue-200">
                <Code className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Add this script to the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your website
                </AlertDescription>
              </Alert>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                  <code>{scriptTag}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(scriptTag, 'script')}
                >
                  {copiedScript ? (
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
            </TabsContent>

            <TabsContent value="async" className="space-y-3">
              <Alert className="bg-purple-50 border-purple-200">
                <Code className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800 text-sm">
                  Async loading for better performance (non-blocking)
                </AlertDescription>
              </Alert>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                  <code>{getAsyncScriptTag(apiKey || "", domain)}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(getAsyncScriptTag(apiKey || "", domain), 'script')}
                >
                  {copiedScript ? (
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
            </TabsContent>

            <TabsContent value="nextjs" className="space-y-3">
              <Alert className="bg-black/5 border-black/10">
                <Code className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  For Next.js 13+ with App Router
                </AlertDescription>
              </Alert>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                  <code>{getNextJsCode(apiKey || "", domain)}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(getNextJsCode(apiKey || "", domain), 'script')}
                >
                  {copiedScript ? (
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
            </TabsContent>
          </Tabs>

          {/* Quick Setup Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-yellow-900">Quick Setup Steps:</p>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Copy the script tag above</li>
              <li>Paste it into your website&apos;s HTML <code className="bg-yellow-100 px-1 rounded">&lt;head&gt;</code> section</li>
              <li>Deploy your changes</li>
              <li>Verify installation below</li>
            </ol>
          </div>

          {/* Verification Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Verify Installation</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerify}
                disabled={verifying || domain === '*'}
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Verify
                  </>
                )}
              </Button>
            </div>
            
            {domain === '*' && (
              <p className="text-xs text-muted-foreground">
                Verification requires a specific domain. Your API key allows all domains.
              </p>
            )}

            {verificationResult && (
              <Alert className={verificationResult.installed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                {verificationResult.installed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={verificationResult.installed ? 'text-green-800' : 'text-red-800'}>
                  {verificationResult.installed 
                    ? 'Script installed correctly! Carbon tracking is active.'
                    : verificationResult.errors?.join('. ') || 'Verification failed'
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show creation form if no API key exists
  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-orange-600" />
          Create Web API Key
        </CardTitle>
        <CardDescription>
          Set up carbon tracking for your website in minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateKey} className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Once created, you&apos;ll receive a tracking script to add to your website
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="key-name">
              API Key Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="key-name"
              placeholder="e.g., Production Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createKeyMutation.isPending}
              required
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground">
              A friendly name to identify this API key
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">
              Website Domain <span className="text-red-500">*</span>
            </Label>
            <Input
              id="domain"
              placeholder="e.g., example.com or www.example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={createKeyMutation.isPending}
              required
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground">
              Enter your website domain (without https://)
            </p>
          </div>

          {createKeyMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createKeyMutation.error instanceof Error
                  ? createKeyMutation.error.message
                  : 'Failed to create API key. Please try again.'}
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
                Creating API Key...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Create API Key & Get Script
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}