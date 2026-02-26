'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Activity, Zap, TrendingUp, AlertCircle, Pause, Play, RefreshCw, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  RealtimeEmissionsService,
  RealtimeData,
  StreamData,
  formatEmissions,
  formatTimestamp,
} from '@/services/realtime/realtime-service'

interface RealtimeEmissionsWidgetProps {
  apiKey?: string
}

export function RealtimeEmissionsWidget({ apiKey: propApiKey }: RealtimeEmissionsWidgetProps) {
  const [data, setData] = useState<RealtimeData | null>(null)
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLive, setIsLive] = useState(true)

  const { data: fetchedApiKey, error: apiKeyError } = useQuery({
    queryKey: ['apiKey', 'realtime'],
    queryFn: () => RealtimeEmissionsService.getApiKey(),
    staleTime: 5 * 60 * 1000,
    enabled: !propApiKey,
  })

  const apiKey = propApiKey || fetchedApiKey

  const fetchRealtimeData = useCallback(async () => {
    if (!apiKey) return

    try {
      setError(null)
      const response = await RealtimeEmissionsService.getEmissions(apiKey, '1h')
      setData(response.data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch realtime data'
      setError(errorMessage)
      console.error('Realtime data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  const pollStream = useCallback(async () => {
    if (!isLive || !apiKey) return

    try {
      const since = lastUpdate.toISOString()
      const response = await RealtimeEmissionsService.pollStream(apiKey, since)

      if (response.data.has_new_data) {
        setStreamData(response.data)
        setLastUpdate(new Date())
        fetchRealtimeData()
      }
    } catch (err) {
      console.error('Stream poll error:', err)
    }
  }, [apiKey, lastUpdate, isLive, fetchRealtimeData])

  useEffect(() => {
    if (apiKey) {
      fetchRealtimeData()
    }
  }, [fetchRealtimeData, apiKey])

  useEffect(() => {
    if (!isLive || !apiKey) return

    const interval = setInterval(pollStream, 5000)
    return () => clearInterval(interval)
  }, [pollStream, isLive, apiKey])

  if (apiKeyError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2.5 shadow-sm">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <p className="text-[13px] text-red-600 font-medium">Failed to load API keys</p>
      </div>
    )
  }

  if (!apiKey && !loading) {
    return (
      <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] py-16 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900">No API key found</p>
          <p className="text-[12px] text-gray-500 mt-1 max-w-sm mx-auto">
            Please create a web API key to view real-time emissions.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2">
        <Activity className="h-4 w-4 animate-pulse text-[#0f5c56]" />
        <span className="text-[13px] font-medium text-gray-500">Loading live data stream…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-[13px] text-red-600 font-medium">{error}</p>
        </div>
        <Button variant="outline" size="sm" className="h-[28px] text-[11px] bg-white border-red-200 text-red-600 hover:bg-red-50" onClick={() => fetchRealtimeData()}>
          <RefreshCw className="h-3 w-3 mr-1.5" /> Retry
        </Button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      
      {/* ── Header + Live Controls ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Live Tracker</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Real-time carbon footprint from website activity</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-[#e5e7eb] rounded-lg p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 px-3 border-r border-[#e5e7eb]">
            <div className={cn('h-2 w-2 rounded-full shrink-0', isLive ? 'bg-[#24d18f] animate-pulse shadow-[0_0_8px_rgba(36,209,143,0.6)]' : 'bg-gray-300')} />
            <span className="text-[12px] font-bold uppercase tracking-wider text-gray-700">{isLive ? 'Live' : 'Paused'}</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-[11px] text-gray-500 font-mono">{formatTimestamp(lastUpdate.toISOString())}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-[28px] text-[12px] text-gray-600 hover:bg-gray-100 px-2" onClick={() => setIsLive(!isLive)}>
              {isLive ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
              {isLive ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="ghost" size="sm" className="h-[28px] w-[28px] p-0 text-gray-600 hover:bg-gray-100" onClick={() => fetchRealtimeData()}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Emissions', value: formatEmissions(data.summary.total_emissions_g), sub: `${data.summary.time_window} window`, icon: Zap },
          { label: 'Event Count', value: data.summary.event_count.toLocaleString(), sub: `${data.summary.events_per_hour.toFixed(0)}/hour`, icon: Activity },
          { label: 'Avg per Event', value: formatEmissions(data.summary.avg_emission_per_event_g), sub: 'per event avg', icon: TrendingUp },
          { label: 'Active Sessions', value: data.sessions.active_count.toLocaleString(), sub: `${formatEmissions(data.sessions.total_emissions_g)} total impact`, icon: Radio },
        ].map((card, i) => (
          <div key={card.label} className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 relative overflow-hidden group hover:border-[#24d18f]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f5c56] flex items-center justify-center shrink-0 shadow-sm">
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-[13px] font-semibold text-gray-600">{card.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[26px] font-bold text-gray-900 tracking-tight">{card.value}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Data Grid ── */}
      <div className="grid gap-5 lg:grid-cols-5">
        
        {/* Recent Events List */}
        <div className="lg:col-span-3 bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-[14px] font-semibold text-gray-900">Event Feed</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Live stream of captured emission activities.</p>
            </div>
            {streamData?.new_events && streamData.new_events.length > 0 && (
              <span className="bg-[#e6f7f1] text-[#0f5c56] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {streamData.new_events.length} New
              </span>
            )}
          </div>
          
          <div className="flex-1 p-2">
            {data.recent_events.length === 0 ? (
              <div className="py-12 text-center">
                <Activity className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <p className="text-[12px] text-gray-500">Awaiting events...</p>
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1">
                {data.recent_events.map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                        {event.event_type}
                      </span>
                      <span className="text-[13px] font-medium text-gray-900 truncate">{event.source}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-3">
                      <span className="text-[13px] font-bold text-[#0f5c56] tabular-nums">
                        {formatEmissions(event.emissions_g)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono tabular-nums w-16 text-right">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown by Type */}
        <div className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-white">Event Distribution</h2>
            <span className="text-[11px] font-medium text-[#24d18f]">Share</span>
          </div>
          
          <div className="flex-1 p-5 bg-white">
            {data.by_event_type.length > 0 ? (
              <div className="space-y-5">
                {data.by_event_type.map((type) => (
                  <div key={type.event_type} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-gray-900 capitalize">{type.event_type}</span>
                      <span className="text-[12px] font-semibold text-[#0f5c56]">{type.percentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-[#f0f1f5] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#24d18f] h-full transition-all" style={{ width: `${type.percentage}%` }} />
                    </div>
                    
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] text-gray-500 font-medium">{type.count} events</span>
                      <span className="text-[11px] text-gray-500 font-medium">{formatEmissions(type.total_g)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 text-center py-10">No data available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}