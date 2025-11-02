"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Key, Copy, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ApiKeyService } from "@/services/apikey/apikey";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function CreateApiKey({ isActive, isCompleted, onComplete }: Props) {
  const [copied, setCopied] = useState(false);

  // Check if user has any API keys - using the same logic as ApiList component
  const { data, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const result = await ApiKeyService.getApiKeys();
      return result;
    },
    retry: 1,
    staleTime: 30 * 1000,
  });

  const apiKeys = data?.data?.api_keys || [];
  const hasApiKeys = apiKeys && apiKeys.length > 0;
  const latestApiKey = hasApiKeys ? apiKeys[0] : null;

  // Auto-complete if user has API keys and this step is active
  useEffect(() => {
    if (hasApiKeys && !isCompleted && isActive) {
      setTimeout(() => onComplete(), 100);
    }
  }, [hasApiKeys, isCompleted, isActive, onComplete]);

  const handleCreateApiKey = () => {
    window.dispatchEvent(new CustomEvent('openCreateApiKeyDialog'));
  };

  const handleCopy = () => {
    if (latestApiKey) {
      const fullKey = `${latestApiKey.prefix}${latestApiKey.key || ''}`;
      navigator.clipboard.writeText(fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCompleteState = isCompleted || hasApiKeys;

  return (
    <Card
      className={`
        h-full flex flex-col relative transition-all duration-300 overflow-hidden
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}
        ${isCompleteState ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"}
        ${!isActive && !isCompleteState ? "opacity-60" : ""}
      `}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Header - Compact */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Key className="h-4 w-4 text-purple-600" />
            </div>
            {isCompleteState && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">API Key & SDK</h3>
          <p className="text-xs text-gray-600">Generate tracking key</p>
        </div>

        {/* Content - Minimal */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {isCompleteState ? (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                <p className="text-xs text-gray-700">API key generated</p>
              </div>
              {latestApiKey && (
                <div className="bg-white rounded px-2 py-1 border text-xs text-gray-600 font-mono">
                  {latestApiKey.prefix}••••••••
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">Generate unique key</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">Install tracking SDK</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isActive && !isCompleteState && (
            <Button
              size="sm"
              onClick={handleCreateApiKey}
              className="w-full text-white bg-orange-600 hover:bg-orange-700 text-xs"
              disabled={isLoading}
            >
              <Plus className="h-3 w-3 mr-1" />
              {isLoading ? 'Checking...' : 'Create Key'}
            </Button>
          )}

          {isCompleteState && latestApiKey && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="w-full text-xs">
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Key
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && !isCompleteState && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      )}
    </Card>
  );
}