'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/contexts/AuthContext';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, Monitor, TrendingDown, AlertCircle, Search, Video, FileText, Share2, MousePointerClick, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const adsApi = {
  calculate: (payload: any) => api.post('/web/ads/entries/', payload).then(r => r.data),
  getHistory: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
};
const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa', '#f59e0b', '#8b5cf6'];

export default function OnlineAdsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const summary = useQuery({
    queryKey: ['ads-summary', month, year],
    queryFn: () => adsApi.getHistory(month, year),
  });

  const [form, setForm] = useState({
    impressions: 100000,
    platform: 'google_ads',
    ad_format: 'display',
    avg_view_seconds: 5,
  });

  const calcMutation = useMutation({
    mutationFn: adsApi.calculate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads-summary'] });
    },
  });

  // Derived for Pie Chart
  const breakdownEntries = summary.data?.breakdown ? Object.entries(summary.data.breakdown) : [];
  const pieData = breakdownEntries.map(([name, value]) => ({ name: name.replace('_', ' '), value })).filter(d => (d.value as number) > 0);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Online Advertising</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track carbon footprint from digital ad campaigns</p>
          </div>
          <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Campaign calculation saved ({calcMutation.data.data?.total_emissions_kg?.toFixed(2)} kg CO₂ added).</p>
          </div>
        )}
        {calcMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[12px] text-red-600 font-medium">Failed to calculate emissions. Please try again.</p>
          </div>
        )}

        <Tabs defaultValue="calculate" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['calculate', 'overview'].map((tab) => (
              <TabsTrigger 
                key={tab} value={tab}
                className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ CALCULATE TAB ═══════════ */}
          <TabsContent value="calculate" className="space-y-6">
            
            {/* Stat Cards for Calculate View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Current Logged Emissions', value: summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Monitor },
                { label: 'Primary Scope', value: 'Scope 3', unit: 'Digital Supply Chain', icon: Share2 },
                { label: 'Calculation Source', value: 'Internet Ads Tool', unit: 'GHG Protocol Based', icon: Activity },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 relative overflow-hidden group hover:border-[#24d18f]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[#0f5c56] flex items-center justify-center shrink-0 shadow-sm">
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-600">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[26px] font-bold text-gray-900 tracking-tight">{stat.value}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{stat.unit}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden max-w-4xl">
              <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white">Log Ad Campaign</h2>
                <span className="text-[11px] font-medium text-[#24d18f]">Calculator</span>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Platform</label>
                    <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                      <SelectTrigger className="h-[36px] text-[13px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google_ads" className="text-[12px]">Google Ads</SelectItem>
                        <SelectItem value="meta_ads" className="text-[12px]">Meta Ads (FB/IG)</SelectItem>
                        <SelectItem value="tiktok_ads" className="text-[12px]">TikTok Ads</SelectItem>
                        <SelectItem value="linkedin_ads" className="text-[12px]">LinkedIn Ads</SelectItem>
                        <SelectItem value="twitter_ads" className="text-[12px]">X / Twitter Ads</SelectItem>
                        <SelectItem value="generic" className="text-[12px]">Generic Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Ad Format</label>
                    <Select value={form.ad_format} onValueChange={v => setForm({ ...form, ad_format: v })}>
                      <SelectTrigger className="h-[36px] text-[13px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="display" className="text-[12px]">Display Banner</SelectItem>
                        <SelectItem value="video" className="text-[12px]">Video Ad</SelectItem>
                        <SelectItem value="search" className="text-[12px]">Search Result</SelectItem>
                        <SelectItem value="social" className="text-[12px]">Social Post</SelectItem>
                        <SelectItem value="native" className="text-[12px]">Native Ad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Impressions</label>
                    <Input
                      type="number" min="0" className="h-[36px] text-[13px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                      value={form.impressions || ''}
                      onChange={e => setForm({ ...form, impressions: +e.target.value })}
                      placeholder="e.g. 100000"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Number of times the ad was shown.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Avg View Duration (sec)</label>
                    <Input
                      type="number" min="0" step="0.1" className="h-[36px] text-[13px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                      value={form.avg_view_seconds || ''}
                      onChange={e => setForm({ ...form, avg_view_seconds: +e.target.value })}
                      placeholder="e.g. 5.5"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Estimated dwell time per impression.</p>
                  </div>
                </div>

                {form.impressions > 0 && (
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 grid grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Network</p>
                      <p className="text-[13px] font-semibold text-gray-900 capitalize mt-0.5">{form.platform.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Format</p>
                      <div className="flex items-center gap-1 mt-0.5 text-gray-900">
                        {form.ad_format === 'video' ? <Video className="h-3.5 w-3.5" /> : form.ad_format === 'search' ? <Search className="h-3.5 w-3.5" /> : form.ad_format === 'display' ? <Monitor className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                        <span className="text-[13px] font-semibold capitalize">{form.ad_format}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Scale</p>
                      <p className="text-[13px] font-semibold text-gray-900 mt-0.5">{form.impressions.toLocaleString()} views</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Engagement</p>
                      <p className="text-[13px] font-semibold text-gray-900 mt-0.5">{form.avg_view_seconds}s avg</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-[#f0f1f5] flex justify-end">
                <Button 
                  onClick={() => calcMutation.mutate({ ...form, month, year })}
                  disabled={calcMutation.isPending || form.impressions <= 0}
                  className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-2 px-6"
                >
                  {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  Commit Data
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              
              {/* Summary Block */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-center min-h-[300px]">
                {summary.isLoading ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin text-[#0f5c56]" /></div>
                ) : summary.data?.total_emissions_kg ? (
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-[#e6f7f1] rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-8 w-8 text-[#0f5c56]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Total Ad Emissions • {month}/{year}</p>
                      <p className="text-[48px] font-black text-[#0f5c56] tracking-tight leading-none mt-2">
                        {summary.data.total_emissions_kg.toFixed(2)}
                      </p>
                      <p className="text-[14px] text-gray-500 font-medium mt-1">kilograms of CO₂ equivalent</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-[14px] font-semibold text-gray-900">No data for this period</p>
                    <p className="text-[12px] text-gray-500 mt-1">Switch to Calculate tab to log a campaign.</p>
                  </div>
                )}
              </div>

              {/* Breakdown Green Card */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Source Breakdown</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Share</span>
                </div>
                
                <div className="flex-1 p-5 bg-white flex flex-col justify-center">
                  {pieData.length > 0 ? (
                    <>
                      <div className="h-[140px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65}
                              paddingAngle={4} dataKey="value" stroke="none"
                            >
                              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', padding: '4px 8px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 px-2">
                        {pieData.map((d, i) => (
                          <div key={d.name} className="flex items-center justify-between border-b border-[#f0f1f5] pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                              <span className="text-[12px] font-semibold text-gray-700 capitalize">{d.name}</span>
                            </div>
                            <span className="text-[13px] font-bold text-[#0f5c56]">{(d.value as number).toFixed(2)} <span className="text-[10px] font-normal text-gray-400">kg</span></span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[12px] text-gray-400 text-center">No impact recorded.</p>
                  )}
                </div>
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}