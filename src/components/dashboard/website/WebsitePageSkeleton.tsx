'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function TotalEmissionsBannerSkeleton() {
  return (
    <div className="rounded-xl bg-[#0f5c56]/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28 bg-gray-300/50" />
        <div className="flex items-baseline gap-2.5">
          <Skeleton className="h-10 w-32 bg-gray-300/50" />
          <Skeleton className="h-5 w-16 bg-gray-300/50" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-lg bg-gray-300/50" />
        <Skeleton className="h-8 w-20 rounded-lg bg-gray-300/50" />
        <Skeleton className="h-8 w-16 rounded-lg bg-gray-300/50" />
        <Skeleton className="h-8 w-8 rounded-lg bg-gray-300/50" />
      </div>
    </div>
  )
}

export function EmissionTrendChartSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-5 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-gray-200" />
          <Skeleton className="h-5 w-32 bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md bg-gray-200" />
          <Skeleton className="h-8 w-16 rounded-md bg-gray-200" />
          <Skeleton className="h-8 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="h-[220px] w-full flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-sm bg-gray-200"
              style={{ height: `${Math.random() * 60 + 30}%` }}
            />
            <Skeleton className="h-3 w-8 bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScopeCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-center flex-1 animate-pulse">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-7 w-20 bg-gray-200" />
          <Skeleton className="h-3 w-24 bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function SourceCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-4 animate-pulse">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-gray-200" />
          <Skeleton className="h-4 w-28 bg-gray-200" />
        </div>
        <Skeleton className="h-3 w-20 bg-gray-200" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-baseline gap-1">
          <Skeleton className="h-3 w-3 rounded bg-gray-200" />
          <Skeleton className="h-7 w-16 bg-gray-200" />
          <Skeleton className="h-4 w-12 bg-gray-200" />
        </div>
        <Skeleton className="h-3 w-32 bg-gray-200" />
      </div>
    </div>
  )
}

export function RecentActivityTableSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] flex flex-col animate-pulse">
      <div className="p-4 border-b border-[#f0f1f5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-gray-200" />
          <Skeleton className="h-5 w-32 bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md bg-gray-200" />
          <Skeleton className="h-8 w-16 rounded-md bg-gray-200" />
          <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="p-4 pt-2 flex-1">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 mb-3 px-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-3 w-12 bg-gray-200" />
          <Skeleton className="h-3 w-12 bg-gray-200" />
          <Skeleton className="h-3 w-12 bg-gray-200" />
        </div>
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 py-2.5 px-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full bg-gray-200" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24 bg-gray-200" />
                  <Skeleton className="h-2 w-16 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-3 w-12 bg-gray-200" />
              <Skeleton className="h-3 w-16 bg-gray-200" />
              <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PrimaryGoalCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.02)] p-4 flex flex-col animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-gray-200" />
          <Skeleton className="h-5 w-28 bg-gray-200" />
        </div>
        <Skeleton className="h-4 w-14 bg-gray-200" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl bg-gray-200" />
    </div>
  )
}

export function DateFilterSkeleton() {
  return (
    <div className="flex items-center justify-end gap-2 animate-pulse">
      <Skeleton className="h-8 w-36 rounded-lg bg-gray-200" />
      <Skeleton className="h-8 w-28 rounded-lg bg-gray-200" />
      <Skeleton className="h-8 w-20 rounded-lg bg-gray-200" />
    </div>
  )
}

export default function WebsitePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-5">
        {/* Top Filters */}
        <DateFilterSkeleton />

        {/* Total Emissions Banner */}
        <TotalEmissionsBannerSkeleton />

        {/* Main Chart + Side Stats */}
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <EmissionTrendChartSkeleton />
          <div className="flex flex-col gap-5">
            <ScopeCardSkeleton />
            <ScopeCardSkeleton />
          </div>
        </div>

        {/* Three Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SourceCardSkeleton />
          <SourceCardSkeleton />
          <SourceCardSkeleton />
        </div>

        {/* Recent Activity Table + Primary Goal */}
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <RecentActivityTableSkeleton />
          <PrimaryGoalCardSkeleton />
        </div>
      </div>
    </div>
  )
}
