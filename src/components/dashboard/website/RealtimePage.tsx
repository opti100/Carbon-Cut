'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Zap, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import {
  RealtimeEmissionsService,
  RealtimeData,
  StreamData,
  formatEmissions,
  formatTimestamp,
  getEventTypeColor,
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

  // Fetch API key if not provided as prop
  const { data: fetchedApiKey, error: apiKeyError } = useQuery({
    queryKey: ['apiKey', 'realtime'],
    queryFn: () => RealtimeEmissionsService.getApiKey(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !propApiKey, // Only fetch if no API key provided
  })

  // Use provided API key or fetched one
  const apiKey = propApiKey || fetchedApiKey

  // Fetch full realtime data
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

  // Poll for new events (lightweight)
  const pollStream = useCallback(async () => {
    if (!isLive || !apiKey) return

    try {
      const since = lastUpdate.toISOString()
      const response = await RealtimeEmissionsService.pollStream(apiKey, since)

      if (response.data.has_new_data) {
        setStreamData(response.data)
        setLastUpdate(new Date())
        // Refresh full data if new events detected
        fetchRealtimeData()
      }
    } catch (err) {
      console.error('Stream poll error:', err)
    }
  }, [apiKey, lastUpdate, isLive, fetchRealtimeData])

  // Initial load
  useEffect(() => {
    if (apiKey) {
      fetchRealtimeData()
    }
  }, [fetchRealtimeData, apiKey])

  // Polling interval (every 5 seconds)
  useEffect(() => {
    if (!isLive || !apiKey) return

    const interval = setInterval(pollStream, 5000)
    return () => clearInterval(interval)
  }, [pollStream, isLive, apiKey])

  // Handle API key errors
  if (apiKeyError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">Failed to load API keys</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle no API key
  if (!apiKey && !loading) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-orange-800">
              No API key found. Please create a web API key to view real-time emissions.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse" />
            <span>Loading real-time data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">{error}</span>
            </div>
            <button
              onClick={() => fetchRealtimeData()}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4">
      {/* Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
          />
          <span className="text-sm text-muted-foreground">{isLive ? 'Live' : 'Paused'}</span>
          <span className="text-xs text-muted-foreground">
            Last updated: {formatTimestamp(lastUpdate.toISOString())}
          </span>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Emissions</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {formatEmissions(data.summary.total_emissions_g)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.time_window} window
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Event Count</span>
            </div>
            <div className="text-2xl font-bold mt-1">{data.summary.event_count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.events_per_hour.toFixed(0)}/hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Avg per Event</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {formatEmissions(data.summary.avg_emission_per_event_g)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">per event</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold mt-1">{data.sessions.active_count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatEmissions(data.sessions.total_emissions_g)} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Feed */}
      <Card className="border-border bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Events
            {streamData?.new_events && streamData.new_events.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {streamData.new_events.length} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {data.recent_events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent events</p>
            ) : (
              data.recent_events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`bg-${getEventTypeColor(event.event_type)}-50`}
                    >
                      {event.event_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{event.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatEmissions(event.emissions_g)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(event.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emissions by Type */}
      {data.by_event_type.length > 0 && (
        <Card className="border-border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">By Event Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.by_event_type.map((type) => (
                <div key={type.event_type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{type.event_type}</span>
                    <span className="text-muted-foreground">
                      {formatEmissions(type.total_g)} ({type.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{type.count} events</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}