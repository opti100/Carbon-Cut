"use client";

import React, { useState, useEffect } from 'react';
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
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Copy,
  ExternalLink,
  Code,
  RefreshCw
} from 'lucide-react';
import { ApiKeyService } from '@/services/apikey/apikey';
import { VerificationResult, InstallationGuide } from '@/types/api-key';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VerifyInstallationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeyId: string;
  apiKeyName: string;
  apiKeyPrefix: string;
}

export function VerifyInstallationDialog({
  open,
  onOpenChange,
  apiKeyId,
  apiKeyName,
  apiKeyPrefix
}: VerifyInstallationDialogProps) {
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [installationGuide, setInstallationGuide] = useState<InstallationGuide | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'verify' | 'guide'>('verify');

  useEffect(() => {
    if (open && !installationGuide) {
      handleGetGuide();
    }
  }, [open]);

  const handleVerify = async () => {
    if (!verificationUrl.trim()) {
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await ApiKeyService.verifyInstallation(apiKeyId, verificationUrl);
      setVerificationResult(result);
      
      if (result.data.status === 'verified') {
        // Auto-switch to results
        setTimeout(() => setActiveTab('verify'), 500);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        data: {
          installed: false,
          status: 'not_found',
          warnings: ['Failed to verify installation. Please check the URL and try again.'],
          details: {
            sdk_script_found: false,
            token_found: false,
            correct_token: false
          }
        }
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGetGuide = async () => {
    setLoadingGuide(true);
    try {
      const response = await ApiKeyService.getInstallationGuide(apiKeyId);
      setInstallationGuide(response.data.installation);
    } catch (error) {
      console.error('Error fetching installation guide:', error);
    } finally {
      setLoadingGuide(false);
    }
  };

  const handleCopySnippet = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleClose = () => {
    setVerificationUrl('');
    setVerificationResult(null);
    setActiveTab('verify');
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'not_found':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'not_found':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>SDK Installation Verification</DialogTitle>
          <DialogDescription>
            Verify that CarbonCut SDK is properly installed for <strong>{apiKeyName}</strong> ({apiKeyPrefix}...)
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'verify' | 'guide')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verify">Verify Installation</TabsTrigger>
            <TabsTrigger value="guide">Installation Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="verification-url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="verification-url"
                  placeholder="https://example.com"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  disabled={isVerifying}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                />
                <Button
                  onClick={handleVerify}
                  disabled={!verificationUrl.trim() || isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Enter the URL where you&apos;ve installed the CarbonCut SDK
              </p>
            </div>

            {verificationResult && (
              <Alert className={getStatusColor(verificationResult.data.status)}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(verificationResult.data.status)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-semibold mb-2">
                        {verificationResult.data.status === 'verified' && 'Installation Verified! ✅'}
                        {verificationResult.data.status === 'warning' && 'Installation Found with Warnings ⚠️'}
                        {verificationResult.data.status === 'not_found' && 'SDK Not Detected ❌'}
                      </div>

                      {verificationResult.data.warnings && verificationResult.data.warnings.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {verificationResult.data.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      )}

                      {verificationResult.data.details && (
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              {verificationResult.data.details.sdk_script_found ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>SDK Script</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {verificationResult.data.details.token_found ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>API Token</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {verificationResult.data.details.correct_token ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>Correct Token</span>
                            </div>
                          </div>

                          {verificationResult.data.details.script_details && (
                            <div className="mt-2 p-2 bg-white rounded border">
                              <div className="font-mono text-xs">
                                <div>Source: {verificationResult.data.details.script_details.src}</div>
                                {verificationResult.data.details.script_details.token && (
                                  <div>Token: {verificationResult.data.details.script_details.token.substring(0, 15)}...</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {verificationResult.data.status !== 'verified' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab('guide')}
                          className="mt-3"
                        >
                          View Installation Guide
                        </Button>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            {!verificationResult && (
              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  Enter your website URL above to check if the CarbonCut SDK is properly installed and configured.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4 mt-4">
            {loadingGuide ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : installationGuide ? (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <Code className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Installation Instructions:</strong> {installationGuide.placement}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Script Tag</Label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{installationGuide.script_tag}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                      onClick={() => handleCopySnippet(installationGuide.script_tag)}
                    >
                      {copiedSnippet ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Next Steps</Label>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {installationGuide.next_steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <Alert>
                  <AlertDescription className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Need help? Check out our{' '}
                      <a href="/docs/installation" className="text-blue-600 hover:underline">
                        detailed installation documentation
                      </a>
                    </span>
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Alert variant="destructive">
                {/* <AlertCircle className="h-4 w-4" /> */}
                <AlertDescription>
                  Failed to load installation guide. Please try again.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetGuide}
                    className="ml-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}