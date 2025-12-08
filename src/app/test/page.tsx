"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

const GoogleAdsConnect: React.FC = () => {
  const [status, setStatus] = useState<{
    is_connected: boolean;
    customer_name?: string;
    email?: string;
    customer_id?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8000/api/v1';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDM5ZjE3YTEtYjI1NS00MGRmLTgzMzctNTNjYjViZTQzNGUxIiwiZW1haWwiOiJ0ZWNoMUBjYXJib25jdXQuY28iLCJleHAiOjE3NjUyMDI1NTZ9.CBQuOFg8fQI-UBazRcpKzePPbB4u6H7YkxtQEaXfFTY';

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-ads/status/`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Status response:', data);
      
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.message || 'Failed to fetch status');
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      setError('Failed to check connection status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setConnecting(true);
    // Store the auth token before redirect
    localStorage.setItem('auth_token', AUTH_TOKEN);
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google/redirect/`;
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Ads?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google-ads/disconnect/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(null);
        setError(null);
      } else {
        setError(data.message || 'Failed to disconnect');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
      setError('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f1]">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff8904]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f1] p-6">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Google Ads Integration</h2>
          <p className="text-gray-600 text-sm">
            Test the Google Ads connection and authentication flow.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status?.is_connected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Google Ads account connected successfully!
              </AlertDescription>
            </Alert>

            <div className="p-4 border rounded-lg space-y-2 bg-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Account:</span>
                <span className="font-medium">{status.customer_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{status.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer ID:</span>
                <span className="font-mono text-xs">{status.customer_id || 'N/A'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={checkStatus}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Status'
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="flex-1"
                disabled={loading}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You&apos;ll be redirected to Google to authorize access to your Google Ads data. 
                We only request read-only permissions.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleConnect}
              disabled={connecting || loading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border font-medium"
              size="lg"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Connect with Google Ads
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdsConnect;