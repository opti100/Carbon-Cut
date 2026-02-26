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
  Server, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  TrendingDown, Settings, Info, Pencil, Cpu, Activity, HardDrive, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

/* ─────────────── API ─────────────── */
const onpremApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/onprem/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
};

/* ─────────────── Constants & Factors ─────────────── */
const GRID_FACTORS: Record<string, number> = {
  US: 0.386, GB: 0.233, DE: 0.364, FR: 0.052, CA: 0.130, 
  AU: 0.610, IN: 0.708, CN: 0.555, JP: 0.474, WORLD: 0.475,
};

const SERVER_TDP = {
  cpu_watts_per_core: 5,
  ram_watts_per_gb: 0.375,
  ssd_watts_per_tb: 1.2,
  hdd_watts_per_tb: 6.5,
  nvme_watts_per_tb: 3.5,
};

const PUE_REFERENCE = [
  { label: 'Excellent (hyperscale)', value: 1.1 },
  { label: 'Good (modern DC)', value: 1.3 },
  { label: 'Average (typical DC)', value: 1.6 },
  { label: 'Poor (older DC)', value: 2.0 },
];

function getGridFactor(code: string): number {
  return GRID_FACTORS[code.toUpperCase()] ?? GRID_FACTORS['WORLD'];
}

function estimateServerEmissions(server: ServerType, pue: number, countryCode: string): number {
  const cpuW = server.cpu_cores * SERVER_TDP.cpu_watts_per_core;
  const ramW = server.ram_gb * SERVER_TDP.ram_watts_per_gb;
  const storageW = server.storage_tb * (server.storage_type === 'hdd' ? SERVER_TDP.hdd_watts_per_tb : server.storage_type === 'nvme' ? SERVER_TDP.nvme_watts_per_tb : SERVER_TDP.ssd_watts_per_tb);
  const totalW = (cpuW + ramW + storageW) * server.avg_cpu_utilization;
  const hours = server.hours_per_day * server.days_per_month;
  const kwh = (totalW * hours * pue) / 1000;
  return +(kwh * getGridFactor(countryCode)).toFixed(4);
}

/* ─────────────── Types ─────────────── */
interface ServerType {
  name: string;
  cpu_cores: number;
  ram_gb: number;
  storage_tb: number;
  storage_type: 'ssd' | 'hdd' | 'nvme';
  avg_cpu_utilization: number;
  hours_per_day: number;
  days_per_month: number;
}

const DEFAULT_SERVER: ServerType = {
  name: 'server-01', cpu_cores: 8, ram_gb: 32, storage_tb: 1, 
  storage_type: 'ssd', avg_cpu_utilization: 0.4, hours_per_day: 24, days_per_month: 30,
};

/* ─────────────── Server Dialog ─────────────── */
function ServerDialog({
  initial, pue, countryCode, onSave, trigger,
}: {
  initial?: ServerType; pue: number; countryCode: string; onSave: (s: ServerType) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ServerType>(initial ?? { ...DEFAULT_SERVER });

  const est = estimateServerEmissions(form, pue, countryCode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0f5c56]">{initial ? 'Edit' : 'Add'} Server Hardware</h2>
          <p className="text-[12px] text-gray-500 mt-1">Define hardware specs to calculate TDP and power draw.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Server Name</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="web-node-01" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">CPU Cores</label>
            <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.cpu_cores} onChange={e => setForm({ ...form, cpu_cores: +e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">RAM (GB)</label>
            <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.ram_gb} onChange={e => setForm({ ...form, ram_gb: +e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Storage (TB)</label>
            <div className="flex gap-2">
              <Input type="number" step="0.1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] w-1/2" value={form.storage_tb} onChange={e => setForm({ ...form, storage_tb: +e.target.value })} />
              <Select value={form.storage_type} onValueChange={v => setForm({ ...form, storage_type: v as any })}>
                <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56] w-1/2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssd" className="text-[12px]">SSD</SelectItem>
                  <SelectItem value="hdd" className="text-[12px]">HDD</SelectItem>
                  <SelectItem value="nvme" className="text-[12px]">NVMe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Avg CPU Load (0-1)</label>
            <Input type="number" step="0.05" min="0" max="1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.avg_cpu_utilization} onChange={e => setForm({ ...form, avg_cpu_utilization: +e.target.value })} />
          </div>
        </div>

        <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Grid Factor</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{getGridFactor(countryCode).toFixed(3)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">PUE</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{pue}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[14px] font-bold text-[#0f5c56]">
              {est.toFixed(2)} <span className="text-[11px] font-medium text-[#0f5c56]/70">kg CO₂</span>
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Server</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function OnPremPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  // Queries
  const config = useQuery({ queryKey: ['onprem-config'], queryFn: onpremApi.getConfig });
  const summary = useQuery({ queryKey: ['onprem-summary', month, year], queryFn: () => onpremApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['onprem-analytics', month, year], queryFn: () => onpremApi.getAnalytics(month, year) });

  // State
  const [servers, setServers] = useState<ServerType[]>([]);
  const [countryCode, setCountryCode] = useState('US');
  const [pue, setPue] = useState(1.6);

  useEffect(() => {
    if (config.data?.onprem_configs?.length) {
      const first = config.data.onprem_configs[0];
      if (first.servers?.length) setServers(first.servers);
      if (first.location_country_code) setCountryCode(first.location_country_code);
      if (first.power_usage_effectiveness) setPue(first.power_usage_effectiveness);
    }
  }, [config.data]);

  // Mutations
  const updateConfigMutation = useMutation({
    mutationFn: onpremApi.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['onprem-config'] }),
  });

  const calcMutation = useMutation({
    mutationFn: onpremApi.calculate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onprem-summary'] });
      qc.invalidateQueries({ queryKey: ['onprem-analytics'] });
    },
  });

  // Derived
  const breakdown = servers.map(s => ({
    name: s.name,
    emissions: estimateServerEmissions(s, pue, countryCode),
    specs: `${s.cpu_cores}c / ${s.ram_gb}GB / ${s.storage_tb}TB ${s.storage_type?.toUpperCase()}`,
    utilization: `${(s.avg_cpu_utilization * 100).toFixed(0)}%`,
    hours: `${s.hours_per_day}h × ${s.days_per_month}d`,
  }));
  const totalEstimated = breakdown.reduce((a, b) => a + b.emissions, 0);
  const trendData = analytics.data?.monthly_trend ?? [];

  const saveConfig = (updatedServers: ServerType[], c: string, p: number) => {
    updateConfigMutation.mutate({
      onprem_configs: [{
        servers: updatedServers,
        location_city: 'Default',
        location_country_code: c,
        power_usage_effectiveness: p,
      }]
    });
  };
  const handleAddServer = (s: ServerType) => { const u = [...servers, s]; setServers(u); saveConfig(u, countryCode, pue); };
  const handleEditServer = (i: number, s: ServerType) => { const u = servers.map((x, j) => (j === i ? s : x)); setServers(u); saveConfig(u, countryCode, pue); };
  const handleRemoveServer = (i: number) => { const u = servers.filter((_, j) => j !== i); setServers(u); saveConfig(u, countryCode, pue); };

  const handleCalculate = () => {
    calcMutation.mutate({ servers, location_country_code: countryCode, pue, calculation_period: 'monthly', month, year });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">On-Premises Infrastructure</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track emissions from owned data centers and physical servers</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={handleCalculate} disabled={servers.length === 0}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Infrastructure data processed and saved successfully.</p>
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
                { label: 'On-Prem Emissions', value: summary.data?.onprem_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Server },
                { label: 'This Month Estimate', value: totalEstimated.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 2', unit: 'Owned Power', icon: Zap },
                { label: 'Hardware', value: servers.length, unit: 'Servers Tracked', icon: HardDrive },
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
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Historical Footprint
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
                      <Server className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Green Header Card: Server Breakdown */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Top Consumers</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-0">
                  {breakdown.length > 0 ? breakdown.sort((a,b) => b.emissions - a.emissions).map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                      <div className="min-w-0 pr-3">
                        <p className="text-[13px] font-bold text-gray-900 truncate">{b.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{b.specs}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-bold text-[#0f5c56]">{b.emissions.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">kg</span></p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[12px] text-gray-400 text-center mt-6">No servers mapped.</p>
                  )}
                </div>
                {breakdown.length > 0 && (
                  <div className="p-3 bg-gray-50 border-t border-[#f0f1f5]">
                    <Button variant="ghost" size="sm" className="w-full text-[12px] text-[#0f5c56] hover:bg-[#e6f7f1]">Show More</Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CONFIGURATION ═══════════ */}
          <TabsContent value="config" className="space-y-6">
            {/* Environment Settings */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Settings className="h-5 w-5 text-[#0f5c56]" />
                <h2 className="text-[15px] font-semibold text-gray-900">Data Center Environment</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Country Code (ISO 2-letter)</label>
                  <div className="flex gap-2">
                    <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] w-24 uppercase" placeholder="US" value={countryCode} onChange={e => setCountryCode(e.target.value.toUpperCase())} onBlur={() => saveConfig(servers, countryCode, pue)} />
                    <div className="h-[34px] flex items-center px-4 bg-gray-50 border border-[#e5e7eb] rounded-md text-[12px] text-gray-700 font-mono">
                      Grid: {getGridFactor(countryCode).toFixed(3)} kg/kWh
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Power Usage Effectiveness (PUE)</label>
                  <div className="flex gap-2">
                    <Select value={String(pue)} onValueChange={v => { setPue(+v); saveConfig(servers, countryCode, +v); }}>
                      <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56] flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PUE_REFERENCE.map(p => (
                          <SelectItem key={p.value} value={String(p.value)} className="text-[12px]">{p.value} — {p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" step="0.1" min="1" max="3" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] w-20" value={pue} onChange={e => { setPue(+e.target.value); }} onBlur={() => saveConfig(servers, countryCode, pue)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Table */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Hardware Inventory</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage individual servers to calculate power draw.</p>
                </div>
                <ServerDialog
                  pue={pue} countryCode={countryCode} onSave={handleAddServer}
                  trigger={<Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Server</Button>}
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Server</span>
                  <span>Hardware Specs</span>
                  <span>Avg Load</span>
                  <span>Uptime</span>
                  <span>Est. Impact</span>
                  <span className="text-right">Actions</span>
                </div>
                
                <div className="space-y-2">
                  {breakdown.length > 0 ? breakdown.map((b, i) => (
                    <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                      <span className="text-[13px] font-bold text-gray-900">{b.name}</span>
                      <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{b.specs}</span>
                      <span className="text-[13px] font-semibold text-gray-900">{b.utilization}</span>
                      <span className="text-[13px] font-semibold text-gray-900">{b.hours}</span>
                      <span className="text-[13px] font-bold text-[#0f5c56]">{b.emissions.toFixed(2)} kg</span>
                      <div className="flex items-center justify-end gap-1">
                        <ServerDialog initial={servers[i]} pue={pue} countryCode={countryCode} onSave={s => handleEditServer(i, s)} trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>} />
                        <button onClick={() => handleRemoveServer(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No server hardware configured.
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