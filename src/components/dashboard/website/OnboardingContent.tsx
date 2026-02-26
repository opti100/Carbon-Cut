import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiKeyService } from "@/services/apikey/apikey"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import {
    AlertCircle,
    Loader2,
    Copy,
    ArrowRight,
    CheckCircle
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { API_BASE_URL, CDN_URL } from '@/constants/constants'

export default function WebsiteOnboarding({ onComplete }: { onComplete: () => void }) {
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
