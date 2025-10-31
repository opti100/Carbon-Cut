"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Eye, MousePointerClick, Leaf } from "lucide-react";

interface Props {
  isActive: boolean;
  isCompleted: boolean;
}

export default function CampaignStatus({ isActive, isCompleted }: Props) {
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
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            {isActive && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Campaign Status</h3>
          <p className="text-sm text-gray-600">Monitor your campaign performance</p>
        </div>

        {/* Stats */}
        {isActive ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">Impressions</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-700">Clicks</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">83</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">CO₂</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">24.5g</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        )}

        {/* Action */}
        {isActive && (
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
      )}
    </Card>
  );
}