'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';

const machineApi = {
  getRealtime: (window: string) =>
    api.get('/realtime/emissions', { params: { window } }).then(r => r.data.data),
  getStream: (since?: string) =>
    api.get('/realtime/stream', { params: { since } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
};

export default function MachinePage() {
  const [timeWindow, setTimeWindow] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const realtime = useQuery({
    queryKey: ['machine-realtime', timeWindow],
    queryFn: () => machineApi.getRealtime(timeWindow),
    refetchInterval: autoRefresh ? 30_000 : false, // poll every 30s
  });

  const now = new Date();
  const analytics = useQuery({
    queryKey: ['machine-analytics'],
    queryFn: () => machineApi.getAnalytics(now.getMonth() + 1, now.getFullYear()),
  });

  const data = realtime.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Machine / Website Emissions</h1>
        <div className="flex items-center gap-3">
          <select value={timeWindow} onChange={e => setTimeWindow(e.target.value)} className="border rounded px-3 py-2">
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
            Auto-refresh
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Emissions" value={data?.summary?.total_emissions_g} unit="g CO₂" loading={realtime.isLoading} />
        <StatCard title="Events Tracked" value={data?.summary?.event_count} loading={realtime.isLoading} />
        <StatCard title="Avg per Event" value={data?.summary?.avg_emission_per_event_g} unit="g" loading={realtime.isLoading} />
        <StatCard title="Active Sessions" value={data?.sessions?.active_count} loading={realtime.isLoading} />
      </div>

      {/* By Event Type */}
      {data?.by_event_type?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Emissions by Event Type</h3>
          <div className="space-y-2">
            {data.by_event_type.map((evt: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-32 text-sm font-mono">{evt.event_type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${evt.percentage}%` }} />
                </div>
                <span className="text-sm w-24 text-right">{evt.total_g.toFixed(1)} g ({evt.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Trend */}
      {data?.hourly_trend?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Hourly Trend</h3>
          {/* Chart placeholder — use recharts/chart.js */}
          <div className="h-48 flex items-end gap-1">
            {data.hourly_trend.slice(-24).map((h: any, i: number) => (
              <div key={i} className="flex-1 bg-green-400 rounded-t" title={`${h.emissions_g}g - ${h.event_count} events`}
                style={{ height: `${Math.max(4, (h.emissions_g / Math.max(...data.hourly_trend.map((x: any) => x.emissions_g || 1))) * 100)}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      {data?.recent_events?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Recent Events</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="py-2">Type</th><th>Emissions</th><th>Source</th><th>Time</th></tr></thead>
            <tbody>
              {data.recent_events.map((e: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="py-2 font-mono">{e.event_type}</td>
                  <td>{e.emissions_g.toFixed(3)} g</td>
                  <td>{e.source}</td>
                  <td>{new Date(e.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}