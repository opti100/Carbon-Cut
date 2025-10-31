"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link2 } from "lucide-react";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function ConnectGoogleAds({ isActive, isCompleted, onComplete }: Props) {
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
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
            {isCompleted && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Connect Account</h3>
          <p className="text-sm text-gray-600">Link your Google Ads account to get started</p>
        </div>

        {isCompleted ? (
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">Account connected</p>
            </div>
            <div className="text-xs text-gray-600 bg-white rounded px-3 py-2 border border-gray-200">
              <span className="font-medium">Customer ID:</span> 2195662760
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">OAuth 2.0 authentication</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Read-only access</p>
            </div>
          </div>
        )}

        {/* Action */}
        {isActive && !isCompleted && (
          <Button onClick={onComplete} className="w-full">
            Connect with Google
          </Button>
        )}

        {isCompleted && (
          <Button variant="outline" className="w-full text-green-700 border-green-200">
            Connected
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