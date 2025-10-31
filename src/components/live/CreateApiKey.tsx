"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Key, Copy } from "lucide-react";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function CreateApiKey({ isActive, isCompleted, onComplete }: Props) {
  const [apiKey] = useState("ck_1a2b3c4d5e6f7g8h9i0j");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={`
        relative transition-all duration-300 overflow-hidden
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}
        ${isCompleted ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"}
        ${!isActive && !isCompleted ? "opacity-60" : ""}
      `}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Key className="h-6 w-6 text-purple-600" />
            </div>
            {isCompleted && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">API Key & SDK</h3>
          <p className="text-sm text-gray-600">Generate key and install tracking code</p>
        </div>

        {/* Content */}
        {isCompleted ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">API key generated</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">SDK installed</p>
            </div>
            <div className="bg-white rounded px-3 py-2 border border-gray-200">
              <code className="text-xs text-gray-600 break-all">{apiKey}</code>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Generate unique API key</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Install tracking SDK</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Verify installation</p>
            </div>
          </div>
        )}

        {/* Action */}
        {isActive && !isCompleted && (
          <Button onClick={onComplete} className="w-full">
            Generate & Install
          </Button>
        )}

        {isCompleted && (
          <Button variant="outline" onClick={handleCopy} className="w-full">
            {copied ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy API Key
              </>
            )}
          </Button>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && !isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      )}
    </Card>
  );
}