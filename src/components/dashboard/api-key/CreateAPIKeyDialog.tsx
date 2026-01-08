'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, CheckCircle, Loader2, AlertTriangle, Globe } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeyService } from '@/services/apikey/apikey'

interface CreateApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateApiKeyDialog({ open, onOpenChange }: CreateApiKeyDialogProps) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const queryClient = useQueryClient()

  // Check if user already has an API key
  const { data: apiKeysData } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const result = await ApiKeyService.getApiKeys()
      return result
    },
    retry: 1,
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const hasApiKey = apiKeys.length > 0

  const createKeyMutation = useMutation({
    mutationFn: ({ name, domain }: { name: string; domain: string }) =>
      ApiKeyService.createApiKey(name, domain),
    onSuccess: (response) => {
      if (response.data?.full_key) {
        setGeneratedKey(response.data.full_key)
      }
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && domain.trim() && !hasApiKey) {
      createKeyMutation.mutate({
        name: name.trim(),
        domain: domain.trim(),
      })
    }
  }

  const handleCopy = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setName('')
    setDomain('')
    setGeneratedKey(null)
    setCopied(false)
    createKeyMutation.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {generatedKey ? 'API Key Generated' : 'Create New API Key'}
          </DialogTitle>
          <DialogDescription>
            {generatedKey
              ? "Save this API key securely. You won't be able to see it again."
              : 'Enter your website domain to generate an API key for CarbonCut SDK.'}
          </DialogDescription>
        </DialogHeader>

        {!generatedKey ? (
          <>
            {hasApiKey ? (
              <Alert className="bg-[#ff8904]/10 border-[#ff8904]/30">
                <AlertTriangle className="h-4 w-4 text-[#ff8904]" />
                <AlertDescription className="text-gray-800">
                  <p className="font-medium mb-1">API Key Limit Reached</p>
                  <p className="text-sm">
                    You already have an API key. Please delete your existing key before
                    creating a new one.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Important:</strong> Enter the domain where you&apos;ll
                      install the CarbonCut SDK. This ensures proper tracking and
                      security.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="domain">
                      Website Domain <span className="text-[#ff8904]">*</span>
                    </Label>
                    <Input
                      id="domain"
                      className="border border-gray-300 rounded focus:border-[#ff8904]/50 focus:ring-1 focus:ring-[#ff8904]/50"
                      placeholder="e.g., example.com or www.example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      disabled={createKeyMutation.isPending}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the domain where you&apos;ll install the tracking script
                      (without https://)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      API Key Name <span className="text-[#ff8904]">*</span>
                    </Label>
                    <Input
                      className="border border-gray-300 rounded focus:border-[#ff8904]/50 focus:ring-1 focus:ring-[#ff8904]/50"
                      id="name"
                      placeholder="e.g., Production Website, Main Site"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={createKeyMutation.isPending}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Choose a descriptive name to identify this API key
                    </p>
                  </div>

                  {createKeyMutation.error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {createKeyMutation.error.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={createKeyMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !name.trim() || !domain.trim() || createKeyMutation.isPending
                    }
                    className={`rounded-sm ${
                      !name.trim() || !domain.trim()
                        ? 'bg-gray-400 text-white'
                        : 'bg-[#ff8904] hover:bg-[#ff8904]/90 text-white'
                    }`}
                  >
                    {createKeyMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate Key
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Input
                  value={generatedKey}
                  readOnly
                  className="font-mono text-sm flex-1 bg-gray-50"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="shrink-0 border-[#ff8904]/30 hover:bg-[#ff8904]/10"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-tertiary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-[#ff8904]/10 border border-[#ff8904]/30 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#ff8904] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-800">
                    <strong>Important:</strong> Copy this key now and store it securely.
                    For security reasons, you won&apos;t be able to view it again.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded space-y-2">
              <div className="text-blue-800 text-sm sm:text-base">
                <strong>Next Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Copy and save your API key</li>
                  <li>Close this dialog to view the installation script</li>
                  <li>Install the script on your website</li>
                  <li>Optionally verify the installation</li>
                </ol>
              </div>
            </div>

            <DialogFooter className="flex justify-end">
              <Button
                onClick={handleClose}
                className="bg-tertiary text-white hover:bg-tertiary/90"
              >
                Done - View Installation Script
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
