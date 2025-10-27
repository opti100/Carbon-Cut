"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function GoogleAdsCallbackPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_ADS_AUTH_ERROR',
          error: error
        }, window.location.origin);
      }
      return;
    }

    if (success === 'true') {
      setStatus('success');
      setMessage('Successfully connected to Google Ads!');
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_ADS_AUTH_SUCCESS',
          success: true
        }, window.location.origin);
      }

      setTimeout(() => {
        window.close();
      }, 2000);
      queryClient.invalidateQueries({ queryKey: ['googleAdsStatus'] });
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Missing authorization code or state parameter');
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_ADS_AUTH_ERROR',
          error: 'Missing parameters'
        }, window.location.origin);
      }
      return;
    }

    setStatus('success');
    setMessage('Successfully connected to Google Ads!');

    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_ADS_AUTH_SUCCESS',
        code,
        state
      }, window.location.origin);
    }

    setTimeout(() => {
      window.close();
    }, 2000);

  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'processing' && (
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            )}
            {status === 'success' && (
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle>
            {status === 'processing' && 'Connecting to Google Ads'}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                This window will close automatically...
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button
                onClick={() => window.close()}
                variant="outline"
                className="w-full"
              >
                Close Window
              </Button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center text-sm text-muted-foreground">
              Please wait while we complete the authorization...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}