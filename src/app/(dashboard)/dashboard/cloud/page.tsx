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
  Cloud, Upload, Loader2, CheckCircle2, AlertCircle, Plus,
  Trash2, TrendingDown, Settings, Info, Pencil, ArrowUpRight, Activity, Database
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

/* ─────────────── API ─────────────── */
const cloudApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
  calculateManual: (payload: any) =>
    api.post('/web/cloud/manual/', payload).then(r => r.data),
  uploadCSV: (formData: FormData) =>
    api.post('/web/cloud/upload-csv/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),
  getEmissionFactors: () =>
    api.get('/web/emission-factors/').then(r => r.data.data),
  getMonthlyReport: (year: number, month: number) =>
    api.get(`/reports/monthly/${year}/${month}/`).then(r => r.data.data),
};

/* ─────────────── Types ─────────────── */
interface CloudProvider {
  provider: string;
  connection_method: string;
  regions: string[];
  monthly_cost_usd: number;
}

/* ─────────────── Dynamic Factors Helper ─────────────── */
function useDynamicEmissionFactor(provider: string, region: string) {
  const { data: factorsList } = useQuery({
    queryKey: ['emission-factors'],
    queryFn: cloudApi.getEmissionFactors,
    staleTime: 1000 * 60 * 60,
  });

  let factor = 0.000350; 

  if (factorsList && Array.isArray(factorsList)) {
    const match = factorsList.find(
      f => f.provider.toLowerCase() === provider.toLowerCase() && f.region === region
    );
    if (match) factor = match.factor_kg_per_usd;
  }
  
  return factor;
}

/* ─────────────── Add / Edit Provider Dialog ─────────────── */
function ProviderDialog({
  initial, onSave, trigger,
}: {
  initial?: CloudProvider; onSave: (p: CloudProvider) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CloudProvider>(
    initial ?? { provider: 'aws', connection_method: 'cost_estimate', regions: ['us-east-1'], monthly_cost_usd: 0 }
  );

  const factor = useDynamicEmissionFactor(form.provider, form.regions[0]);
  const estimatedEmissions = form.monthly_cost_usd * factor;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0f5c56]">{initial ? 'Edit' : 'Add'} Cloud Source</h2>
          <p className="text-[12px] text-gray-500 mt-1">Configure your cloud region and monthly spend.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Provider</label>
            <Select value={form.provider} onValueChange={v => setForm({ ...form, provider: v })}>
              <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws" className="text-[12px]">AWS</SelectItem>
                <SelectItem value="gcp" className="text-[12px]">Google Cloud</SelectItem>
                <SelectItem value="azure" className="text-[12px]">Microsoft Azure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Primary Region</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="e.g. us-east-1" value={form.regions[0]} onChange={e => setForm({ ...form, regions: [e.target.value] })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Monthly Cost (USD)</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" type="number" placeholder="0.00" min="0" value={form.monthly_cost_usd || ''} onChange={e => setForm({ ...form, monthly_cost_usd: +e.target.value })} />
          </div>

          <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(6)} kg/$</p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#0f5c56]">
                {estimatedEmissions.toFixed(2)} <span className="text-[11px] font-medium text-[#0f5c56]/70">kg CO₂</span>
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

/* ─────────────── Main Page ─────────────── */
export default function CloudPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  // Queries
  const { data: factorsList } = useQuery({ queryKey: ['emission-factors'], queryFn: cloudApi.getEmissionFactors });
  const config = useQuery({ queryKey: ['cloud-config'], queryFn: cloudApi.getConfig });
  const summary = useQuery({ queryKey: ['cloud-summary', month, year], queryFn: () => cloudApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['cloud-analytics', month, year], queryFn: () => cloudApi.getAnalytics(month, year) });
  const monthlyReport = useQuery({ queryKey: ['cloud-monthly', year, month], queryFn: () => cloudApi.getMonthlyReport(year, month) });

  const [providers, setProviders] = useState<CloudProvider[]>([]);

  useEffect(() => {
    if (config.data?.cloud_providers) {
      setProviders(config.data.cloud_providers);
    }
  }, [config.data]);

  // Mutations
  const updateConfigMutation = useMutation({
    mutationFn: cloudApi.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cloud-config'] }),
  });

  const calcMutation = useMutation({
    mutationFn: cloudApi.calculateManual,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cloud-summary'] });
      qc.invalidateQueries({ queryKey: ['cloud-analytics'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: cloudApi.uploadCSV,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cloud-summary'] }),
  });

  // Handlers
  const handleAddProvider = (p: CloudProvider) => { const u = [...providers, p]; setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };
  const handleEditProvider = (i: number, p: CloudProvider) => { const u = providers.map((x, j) => j === i ? p : x); setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };
  const handleRemoveProvider = (i: number) => { const u = providers.filter((_, j) => j !== i); setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };

  // Derived Data
  const totalEstimatedEmissions = providers.reduce((acc, p) => {
    const match = Array.isArray(factorsList) ? factorsList.find(f => f.provider === p.provider && f.region === p.regions[0]) : null;
    return acc + p.monthly_cost_usd * (match ? match.factor_kg_per_usd : 0.000350);
  }, 0);

  const trendData = analytics.data?.monthly_trend ?? [];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Cloud Infrastructure</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track & manage AWS, GCP, and Azure emissions</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={() => calcMutation.mutate({ cloud_providers: providers, month, year })}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          
          {/* Green Pill-Style Tabs */}
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'config', 'upload'].map((tab) => (
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
            
            {/* Pop of Color: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Cloud Emissions', value: summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Cloud },
                { label: 'This Month Estimate', value: totalEstimatedEmissions.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 2', unit: 'Purchased Energy', icon: Database },
                { label: 'Data Quality', value: monthlyReport.data?.data_sources?.cloud?.accuracy ?? 'N/A', unit: 'Confidence', icon: CheckCircle2 },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 relative overflow-hidden group hover:border-[#24d18f]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Green Icon Box */}
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
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Emission Trend
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
                      <Cloud className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Green Header Card: Provider Breakdown */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Est. by Provider</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-0">
                  {providers.length > 0 ? providers.map((p, i) => {
                     const match = Array.isArray(factorsList) ? factorsList.find(f => f.provider === p.provider && f.region === p.regions[0]) : null;
                     const est = p.monthly_cost_usd * (match ? match.factor_kg_per_usd : 0.000350);
                     return (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 uppercase">{p.provider}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{p.regions[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-[#0f5c56]">{est.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">kg</span></p>
                        </div>
                      </div>
                     )
                  }) : (
                    <p className="text-[12px] text-gray-400 text-center mt-6">No providers mapped.</p>
                  )}
                </div>
                {providers.length > 0 && (
                  <div className="p-3 bg-gray-50 border-t border-[#f0f1f5]">
                    <Button variant="ghost" size="sm" className="w-full text-[12px] text-[#0f5c56] hover:bg-[#e6f7f1]">Show More</Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CONFIGURATION ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Configured Sources</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage regions and monthly spend mapping.</p>
                </div>
                <ProviderDialog
                  onSave={handleAddProvider}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Source
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Provider</span>
                  <span>Region</span>
                  <span>Spend (USD)</span>
                  <span>Factor / Impact</span>
                  <span className="text-right">Actions</span>
                </div>
                
                <div className="space-y-2">
                  {providers.length > 0 ? providers.map((p, i) => {
                    const match = Array.isArray(factorsList) ? factorsList.find(f => f.provider === p.provider && f.region === p.regions[0]) : null;
                    const factor = match ? match.factor_kg_per_usd : 0.000350;
                    return (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <span className="text-[13px] font-bold text-gray-900 uppercase">{p.provider}</span>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{p.regions[0]}</span>
                        <span className="text-[13px] font-semibold text-gray-900">${p.monthly_cost_usd}</span>
                        <div>
                          <p className="text-[13px] font-bold text-[#0f5c56]">{(p.monthly_cost_usd * factor).toFixed(2)} kg</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{factor.toFixed(6)} / $</p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <ProviderDialog
                            initial={p} onSave={updated => handleEditProvider(i, updated)}
                            trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>}
                          />
                          <button onClick={() => handleRemoveProvider(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No cloud sources configured.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ UPLOAD CSV ═══════════ */}
          <TabsContent value="upload" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-8">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Upload Provider Export</h2>
              <p className="text-[13px] text-gray-500 mb-8">Bypass estimations by uploading exact footprint CSVs provided by AWS/GCP.</p>
              
              <div className="border-2 border-dashed border-[#24d18f]/50 bg-[#e6f7f1]/30 rounded-xl p-12 text-center hover:bg-[#e6f7f1]/60 transition-colors relative">
                <div className="h-12 w-12 rounded-full bg-[#0f5c56] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <label htmlFor="csv-upload" className="cursor-pointer text-[#0f5c56] hover:underline text-[14px] font-semibold">
                  Click to select CSV file
                </label>
                <p className="text-[12px] text-gray-500 mt-2">AWS Carbon Footprint Tool formats supported.</p>
                <Input
                  id="csv-upload" type="file" accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('provider', 'aws');
                    fd.append('month', String(month));
                    fd.append('year', String(year));
                    uploadMutation.mutate(fd);
                  }}
                  className="hidden" disabled={uploadMutation.isPending}
                />
              </div>

              {uploadMutation.isPending && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-gray-500 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-[#0f5c56]" />
                  Processing CSV data...
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}