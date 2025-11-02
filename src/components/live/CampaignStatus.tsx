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
        h-full flex flex-col relative transition-all duration-300 overflow-hidden
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}
        ${isCompleted ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"}
        ${!isActive && !isCompleted ? "opacity-60" : ""}
      `}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Header - Compact */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            {isActive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Campaign Status</h3>
          <p className="text-xs text-gray-600">Monitor performance</p>
        </div>

        {/* Stats - Compact */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {isActive ? (
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between bg-blue-50 rounded px-2 py-1">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-gray-700">Views</span>
                </div>
                <span className="text-xs font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between bg-purple-50 rounded px-2 py-1">
                <div className="flex items-center gap-1">
                  <MousePointerClick className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-gray-700">Clicks</span>
                </div>
                <span className="text-xs font-semibold">83</span>
              </div>
              <div className="flex items-center justify-between bg-green-50 rounded px-2 py-1">
                <div className="flex items-center gap-1">
                  <Leaf className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-gray-700">CO₂</span>
                </div>
                <span className="text-xs font-semibold">24.5g</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
            </div>
          )}

          {/* Action Button */}
          {isActive && (
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details
            </Button>
          )}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
      )}
    </Card>
  );
}