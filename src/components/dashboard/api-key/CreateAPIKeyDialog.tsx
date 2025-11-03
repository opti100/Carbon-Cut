"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiKeyService } from '@/services/apikey/apikey';

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateApiKeyDialog({ open, onOpenChange }: CreateApiKeyDialogProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const createKeyMutation = useMutation({
    mutationFn: ({ name, domain }: { name: string; domain: string }) => 
      ApiKeyService.createApiKey(name, domain),
    onSuccess: (response) => {
      if (response.data?.full_key) {
        setGeneratedKey(response.data.full_key);
      }
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createKeyMutation.mutate({ 
        name: name.trim(), 
        domain: domain.trim() || '*' 
      });
    }
  };

  const handleCopy = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName('');
    setDomain('');
    setGeneratedKey(null);
    setCopied(false);
    createKeyMutation.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {generatedKey ? 'API Key Generated' : 'Create New API Key'}
          </DialogTitle>
          <DialogDescription>
            {generatedKey
              ? 'Save this API key securely. You won\'t be able to see it again.'
              : 'Generate a new API key to access the CarbonCut API.'}
          </DialogDescription>
        </DialogHeader>

        {!generatedKey ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Server, Dev Environment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={createKeyMutation.isPending}
                  required
                />
                <p className="text-sm text-gray-500">
                  Choose a descriptive name to identify this API key
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain (Optional)</Label>
                <Input
                  id="domain"
                  placeholder="e.g., example.com or * for all domains"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={createKeyMutation.isPending}
                />
                <p className="text-sm text-gray-500">
                  Restrict this key to a specific domain. Use * to allow all domains.
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
                disabled={!name.trim() || createKeyMutation.isPending}
              >
                {createKeyMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Key
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Copy and save this API key now. For security
                reasons, you won&apos;t be able to view it again.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedKey}
                  readOnly
                  className="font-mono text-sm bg-gray-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-sm">
                <strong>How to use:</strong> Include this key in the{' '}
                <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">data-token</code>{' '}
                attribute of your CarbonCut SDK script tag.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                {copied ? 'Done' : 'I\'ve Saved My Key'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
