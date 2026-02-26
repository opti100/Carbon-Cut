'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/contexts/AuthContext';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Globe, Loader2, CheckCircle2, AlertCircle, TrendingDown,
  Plus, Trash2, Settings, Pencil, Activity, Database
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const cdnApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/configure/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/cdn/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
  getEmissionFactors: () => 
    api.get('/web/emission-factors/').then(r => r.data.data),
};

interface CDNConnection {
  provider: string;
  monthly_gb_transferred: number;
  regions: string[];
}

interface CDNFactor {
  provider: string;
  region: string;
  factor_kg_per_gb: number;
  unit: string;
}

function useDynamicCDNFactor(provider: string, region: string) {
  const { data: factorsData } = useQuery({
    queryKey: ['emission-factors'],
    queryFn: cdnApi.getEmissionFactors,
    staleTime: 1000 * 60 * 60,
  });

  let factor = 0.00030; // Default fallback

  if (factorsData?.cdn_factors && Array.isArray(factorsData.cdn_factors)) {
    const match = factorsData.cdn_factors.find(
      (f: CDNFactor) => f.provider.toLowerCase() === provider.toLowerCase() && f.region === region
    );
    if (match) factor = match.factor_kg_per_gb;
  }
  
  return factor;
}

function CDNDialog({
  initial, onSave, trigger,
}: {
  initial?: CDNConnection; onSave: (c: CDNConnection) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CDNConnection>(
    initial ?? { provider: 'cloudflare', monthly_gb_transferred: 0, regions: ['WORLD'] }
  );

  const factor = useDynamicCDNFactor(form.provider, form.regions[0]);
  const estEmissions = form.monthly_gb_transferred * factor;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0f5c56]">{initial ? 'Edit' : 'Add'} CDN Source</h2>
          <p className="text-[12px] text-gray-500 mt-1">Configure provider and monthly data transfer.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Provider</label>
            <Select value={form.provider} onValueChange={v => setForm({ ...form, provider: v })}>
              <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cloudflare" className="text-[12px]">Cloudflare</SelectItem>
                <SelectItem value="akamai" className="text-[12px]">Akamai</SelectItem>
                <SelectItem value="fastly" className="text-[12px]">Fastly</SelectItem>
                <SelectItem value="aws_cloudfront" className="text-[12px]">AWS CloudFront</SelectItem>
                <SelectItem value="generic" className="text-[12px]">Generic / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Monthly Transfer (GB)</label>
            <Input
              className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
              type="number" placeholder="0" min="0"
              value={form.monthly_gb_transferred || ''}
              onChange={e => setForm({ ...form, monthly_gb_transferred: +e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Region / Distribution</label>
            <Select value={form.regions[0]} onValueChange={v => setForm({ ...form, regions: [v] })}>
              <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORLD" className="text-[12px]">Global / World</SelectItem>
                <SelectItem value="US" className="text-[12px]">United States</SelectItem>
                <SelectItem value="EU" className="text-[12px]">Europe</SelectItem>
                <SelectItem value="APAC" className="text-[12px]">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(6)} kg/GB</p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#0f5c56]">
                {estEmissions.toFixed(2)} <span className="text-[11px] font-medium text-[#0f5c56]/70">kg CO₂</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Source</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CDNPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const { data: factorsData } = useQuery({ 
    queryKey: ['emission-factors'], 
    queryFn: cdnApi.getEmissionFactors 
  });
  
  const config = useQuery({ 
    queryKey: ['cdn-config'], 
    queryFn: cdnApi.getConfig 
  });
  
  const summary = useQuery({ 
    queryKey: ['cdn-summary', month, year], 
    queryFn: () => cdnApi.getSummary(month, year) 
  });
  
  const analytics = useQuery({ 
    queryKey: ['cdn-analytics', month, year], 
    queryFn: () => cdnApi.getAnalytics(month, year) 
  });

  const [connections, setConnections] = useState<CDNConnection[]>([]);

  useEffect(() => {
    if (config.data?.cdn_connections) {
      setConnections(config.data.cdn_connections.map((c: any) => ({
        provider: c.provider,
        monthly_gb_transferred: parseFloat(c.monthly_gb_transferred) || 0,
        regions: c.regions || ['WORLD']
      })));
    }
  }, [config.data]);

  const updateConfigMutation = useMutation({
    mutationFn: cdnApi.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cdn-config'] }),
  });

  const calcMutation = useMutation({
    mutationFn: (data: any) => cdnApi.calculate({ ...data, month, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cdn-summary'] });
      qc.invalidateQueries({ queryKey: ['cdn-analytics'] });
    },
  });

  // Handlers
  const handleAdd = (c: CDNConnection) => { 
    const u = [...connections, c]; 
    setConnections(u); 
    updateConfigMutation.mutate({ cdn_connections: u }); 
  };
  
  const handleEdit = (i: number, c: CDNConnection) => { 
    const u = connections.map((x, j) => j === i ? c : x); 
    setConnections(u); 
    updateConfigMutation.mutate({ cdn_connections: u }); 
  };
  
  const handleRemove = (i: number) => { 
    const u = connections.filter((_, j) => j !== i); 
    setConnections(u); 
    updateConfigMutation.mutate({ cdn_connections: u }); 
  };

  const handleCalculate = () => {
    connections.forEach(conn => {
      calcMutation.mutate({
        provider: conn.provider,
        monthly_gb_transferred: conn.monthly_gb_transferred,
        regions: conn.regions,
      });
    });
  };

  // Derived Data
  const cdnFactors = factorsData?.cdn_factors || [];
  const breakdown = connections.map(c => {
    const match = cdnFactors.find((f: CDNFactor) => 
      f.provider.toLowerCase() === c.provider.toLowerCase() && 
      f.region === c.regions[0]
    );
    const factor = match ? match.factor_kg_per_gb : 0.00030;
    return {
      name: c.provider.replace('aws_cloudfront', 'CloudFront').replace(/^\w/, s => s.toUpperCase()),
      region: c.regions[0],
      gb: c.monthly_gb_transferred,
      factor: factor,
      emissions: c.monthly_gb_transferred * factor,
    };
  });

  const totalEstimated = breakdown.reduce((a, b) => a + b.emissions, 0);
  
  // Get trend data from analytics
  const trendData = analytics.data?.monthly_trend?.map((d: any) => ({
    month: d.month_name || d.month,
    emissions: d.cdn_kg || d.total_kg / 1000 || 0
  })) || [];

  // Get actual CDN emissions from summary
  const actualCDNEmissions = summary.data?.by_source?.find((s: any) => 
    s.source === 'cdn' || s.source === 'cdn_data_transfer'
  )?.emissions_kg || 0;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">CDN Data Transfer</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track emissions from content delivery networks</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Button 
              size="sm" 
              className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" 
              onClick={handleCalculate} 
              disabled={connections.length === 0 || calcMutation.isPending}
            >
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Data processed and saved successfully.</p>
          </div>
        )}
        {calcMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[12px] text-red-600 font-medium">Failed to calculate emissions. Please try again.</p>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'config'].map((tab) => (
              <TabsTrigger 
                key={tab} value={tab}
                className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ OVERVIEW ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'CDN Emissions', value: actualCDNEmissions.toFixed(2), unit: 'kg CO₂', icon: Globe },
                { label: 'This Month Estimate', value: totalEstimated.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 3', unit: 'Upstream Transport', icon: Settings },
                { label: 'Sources', value: connections.length, unit: 'Configured', icon: Database },
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
                    <span className="text-[12px] font-medium text-gray-500">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              {/* Trend Chart */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Monthly CDN Trend
                  </h2>
                </div>
                <div className="h-[240px] w-full">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorBrand)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Globe className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Provider Breakdown */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Est. by Provider</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-0">
                  {breakdown.length > 0 ? breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                      <div>
                        <p className="text-[13px] font-bold text-gray-900 uppercase">{b.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">{b.region} • {b.gb} GB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-[#0f5c56]">{b.emissions.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">kg</span></p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[12px] text-gray-400 text-center mt-6">No CDN sources mapped.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CONFIGURATION ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Configured CDN Sources</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage data transfer volumes by provider and region.</p>
                </div>
                <CDNDialog
                  onSave={handleAdd}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add CDN
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Provider</span>
                  <span>Region</span>
                  <span>Data Transfer</span>
                  <span>Factor / Impact</span>
                  <span className="text-right">Actions</span>
                </div>
                
                <div className="space-y-2">
                  {connections.length > 0 ? connections.map((c, i) => {
                    const match = cdnFactors.find((f: CDNFactor) => 
                      f.provider.toLowerCase() === c.provider.toLowerCase() && 
                      f.region === c.regions[0]
                    );
                    const factor = match ? match.factor_kg_per_gb : 0.00030;
                    const est = c.monthly_gb_transferred * factor;
                    
                    return (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <span className="text-[13px] font-bold text-gray-900 uppercase">{c.provider.replace('aws_cloudfront', 'CloudFront')}</span>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{c.regions[0]}</span>
                        <span className="text-[13px] font-semibold text-gray-900">{c.monthly_gb_transferred.toLocaleString()} GB</span>
                        <div>
                          <p className="text-[13px] font-bold text-[#0f5c56]">{est.toFixed(2)} kg</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{factor.toFixed(6)} / GB</p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <CDNDialog
                            initial={c} onSave={updated => handleEdit(i, updated)}
                            trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>}
                          />
                          <button onClick={() => handleRemove(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No CDN sources configured.
                    </div>
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