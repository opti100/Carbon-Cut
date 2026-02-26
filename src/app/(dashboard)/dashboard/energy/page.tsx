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
  Zap, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  TrendingDown, Info, Pencil, Flame, Fuel, Activity, Leaf,
  BarChart3, Droplets,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

/* ─────────────── API ─────────────── */
const energyApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/energy/', payload).then(r => r.data),
  getEntries: (month: number, year: number) =>
    api.get('/web/energy/', { params: { month, year } }).then(r => r.data.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
};

/* ─────────────── Constants ─────────────── */
const GRID_FACTORS: Record<string, number> = {
  US: 0.417, GB: 0.233, DE: 0.385, FR: 0.057, AU: 0.656,
  IN: 0.716, CN: 0.555, CA: 0.130, JP: 0.474, WORLD: 0.475,
};

const FUEL_FACTORS: Record<string, number> = {
  natural_gas: 0.184,   // kg CO2 per kWh
  diesel: 2.68,          // kg CO2 per liter
  petrol: 2.31,
  lpg: 1.51,
  heating_oil: 2.54,
  biomass: 0.015,
};

const SOURCE_OPTIONS = [
  { value: 'electricity', label: 'Electricity (Grid)', icon: Zap, unit: 'kWh', scope: 'Scope 2' },
  { value: 'natural_gas', label: 'Natural Gas', icon: Flame, unit: 'kWh', scope: 'Scope 1' },
  { value: 'diesel', label: 'Diesel Generator', icon: Fuel, unit: 'liters', scope: 'Scope 1' },
  { value: 'petrol', label: 'Petrol / Gasoline', icon: Droplets, unit: 'liters', scope: 'Scope 1' },
  { value: 'lpg', label: 'LPG', icon: Flame, unit: 'liters', scope: 'Scope 1' },
  { value: 'heating_oil', label: 'Heating Oil', icon: Flame, unit: 'liters', scope: 'Scope 1' },
];

const COUNTRY_OPTIONS = [
  { code: 'US', label: 'United States' }, { code: 'GB', label: 'United Kingdom' },
  { code: 'DE', label: 'Germany' }, { code: 'FR', label: 'France' },
  { code: 'CA', label: 'Canada' }, { code: 'AU', label: 'Australia' },
  { code: 'IN', label: 'India' }, { code: 'CN', label: 'China' },
  { code: 'JP', label: 'Japan' },
];

interface EnergySource {
  source_type: string;
  label: string;
  country_code: string;
  monthly_kwh?: number;
  monthly_liters?: number;
  green_energy_percentage?: number;
  unit?: string;
}

const DEFAULT_SOURCE: EnergySource = {
  source_type: 'electricity', label: 'Office Grid Power', country_code: 'US',
  monthly_kwh: 5000, green_energy_percentage: 0,
};

function estimateEmissions(src: EnergySource): number {
  if (src.source_type === 'electricity') {
    const kwh = src.monthly_kwh || 0;
    const factor = GRID_FACTORS[src.country_code] || GRID_FACTORS.WORLD;
    const greenPct = (src.green_energy_percentage || 0) / 100;
    return +(kwh * (1 - greenPct) * factor).toFixed(2);
  }
  if (src.source_type === 'natural_gas') {
    const kwh = src.monthly_kwh || 0;
    return +(kwh * FUEL_FACTORS.natural_gas).toFixed(2);
  }
  const liters = src.monthly_liters || 0;
  const factor = FUEL_FACTORS[src.source_type] || 2.5;
  return +(liters * factor).toFixed(2);
}

/* ─────────────── Source Dialog ─────────────── */
function SourceDialog({
  initial, onSave, trigger,
}: {
  initial?: EnergySource; onSave: (s: EnergySource) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EnergySource>(initial ?? { ...DEFAULT_SOURCE });
  const est = estimateEmissions(form);
  const sourceInfo = SOURCE_OPTIONS.find(s => s.value === form.source_type);
  const isElectricity = form.source_type === 'electricity';
  const isGas = form.source_type === 'natural_gas';
  const isLiquid = !isElectricity && !isGas;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">{initial ? 'Edit' : 'Add'} Energy Source</h2>
          <p className="text-[12px] text-gray-500 mt-1">Configure direct energy consumption for emissions tracking.</p>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Energy Type</label>
              <Select value={form.source_type} onValueChange={v => setForm({ ...form, source_type: v, monthly_kwh: undefined, monthly_liters: undefined })}>
                <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-[12px]">
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-3.5 w-3.5" /> {opt.label}
                        <span className="text-[10px] text-gray-400 ml-auto">{opt.scope}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Label / Description</label>
              <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="e.g. Main Office Power" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
            </div>

            {isElectricity && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Country (Grid)</label>
                  <Select value={form.country_code} onValueChange={v => setForm({ ...form, country_code: v })}>
                    <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map(c => (
                        <SelectItem key={c.code} value={c.code} className="text-[12px]">
                          {c.label} ({GRID_FACTORS[c.code]} kg/kWh)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Green Energy %</label>
                  <Input type="number" min="0" max="100" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.green_energy_percentage || 0} onChange={e => setForm({ ...form, green_energy_percentage: +e.target.value })} />
                </div>
              </>
            )}

            {(isElectricity || isGas) && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Monthly Consumption (kWh)</label>
                <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="e.g. 5000" value={form.monthly_kwh || ''} onChange={e => setForm({ ...form, monthly_kwh: +e.target.value })} />
              </div>
            )}

            {isLiquid && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Monthly Consumption (liters)</label>
                <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="e.g. 200" value={form.monthly_liters || ''} onChange={e => setForm({ ...form, monthly_liters: +e.target.value })} />
              </div>
            )}
          </div>

          <div className="bg-[#f9fafb] rounded-md p-3 border border-[#e5e7eb] flex items-center justify-between mt-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Est. Monthly Impact</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                {sourceInfo?.scope} • {isElectricity ? `Grid: ${GRID_FACTORS[form.country_code] || GRID_FACTORS.WORLD} kg/kWh` : `${FUEL_FACTORS[form.source_type] || 2.5} kg/${sourceInfo?.unit}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#0f5c56]">
                {est.toFixed(2)} <span className="text-[11px] font-medium text-gray-500">kg CO₂</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Source</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function EnergyPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const config = useQuery({ queryKey: ['energy-config'], queryFn: energyApi.getConfig });
  const entries = useQuery({ queryKey: ['energy-entries', month, year], queryFn: () => energyApi.getEntries(month, year) });
  const summary = useQuery({ queryKey: ['energy-summary', month, year], queryFn: () => energyApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['energy-analytics', month, year], queryFn: () => energyApi.getAnalytics(month, year) });

  const [sources, setSources] = useState<EnergySource[]>([]);

  useEffect(() => {
    if (config.data?.energy_configs?.length) {
      setSources(config.data.energy_configs);
    }
  }, [config.data]);

  // ── NEW: Save config mutation ──
  const saveConfigMutation = useMutation({
    mutationFn: (payload: { energy_configs: EnergySource[] }) => energyApi.updateConfig(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['energy-config'] });
    },
  });

  const calcMutation = useMutation({
    mutationFn: energyApi.calculate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['energy-entries'] });
      qc.invalidateQueries({ queryKey: ['energy-summary'] });
      qc.invalidateQueries({ queryKey: ['energy-analytics'] });
      qc.invalidateQueries({ queryKey: ['energy-config'] });
    },
  });

  const breakdown = sources.map(s => {
    const info = SOURCE_OPTIONS.find(o => o.value === s.source_type);
    return {
      source_type: s.source_type,
      label: s.label,
      scope: info?.scope || 'Scope 1',
      consumption: s.source_type === 'electricity' || s.source_type === 'natural_gas'
        ? `${(s.monthly_kwh || 0).toLocaleString()} kWh`
        : `${(s.monthly_liters || 0).toLocaleString()} L`,
      emissions: estimateEmissions(s),
      greenPct: s.green_energy_percentage || 0,
    };
  });

  const totalEst = breakdown.reduce((a, b) => a + b.emissions, 0);

  const typeAgg: Record<string, number> = {};
  sources.forEach(s => {
    typeAgg[s.source_type] = (typeAgg[s.source_type] || 0) + estimateEmissions(s);
  });
  const pieData = Object.entries(typeAgg).map(([name, value]) => ({
    name: SOURCE_OPTIONS.find(o => o.value === name)?.label || name,
    value,
  })).filter(d => d.value > 0);

  const trendData = analytics.data?.monthly_trend ?? [];

  const handleAddSource = (s: EnergySource) => {
    const updated = [...sources, s];
    setSources(updated);
    saveConfigMutation.mutate({ energy_configs: updated });
  };

  const handleEditSource = (i: number, s: EnergySource) => {
    const updated = sources.map((x, j) => j === i ? s : x);
    setSources(updated);
    saveConfigMutation.mutate({ energy_configs: updated });
  };

  const handleRemoveSource = (i: number) => {
    const updated = sources.filter((_, j) => j !== i);
    setSources(updated);
    saveConfigMutation.mutate({ energy_configs: updated });
  };

  const handleCommit = () => {
    calcMutation.mutate({ energy_sources: sources, month, year });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Energy Consumption</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track Scope 1 & 2 emissions from electricity, gas, and fuel usage</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={handleCommit} disabled={sources.length === 0}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Energy emissions calculated and saved ({calcMutation.data.data?.total_emissions_kg?.toFixed(2)} kg CO₂).</p>
          </div>
        )}
        {calcMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[12px] text-red-600 font-medium">Failed to calculate energy emissions. Please try again.</p>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'sources', 'calculate'].map(tab => (
              <TabsTrigger key={tab} value={tab} className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ OVERVIEW ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Energy Emissions', value: entries.data?.total_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Zap },
                { label: 'This Month Estimate', value: totalEst.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 1 & 2', unit: 'Direct Energy', icon: Flame },
                { label: 'Sources', value: sources.length, unit: 'Tracked', icon: BarChart3 },
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
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Historical Energy Footprint
                  </h2>
                </div>
                <div className="h-[240px] w-full">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorEnergy)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Zap className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown Pie */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">By Source Type</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center bg-white">
                  {pieData.length > 0 ? (
                    <>
                      <div className="h-[130px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
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
                              <span className="text-[12px] font-semibold text-gray-700">{d.name}</span>
                            </div>
                            <span className="text-[13px] font-bold text-[#0f5c56]">{d.value.toFixed(1)} <span className="text-[10px] font-normal text-gray-400">kg</span></span>
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

          {/* ═══════════ SOURCES (CONFIG) ═══════════ */}
          <TabsContent value="sources" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Energy Source Inventory</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Configure energy sources for monthly emissions logging.</p>
                </div>
                <SourceDialog
                  onSave={handleAddSource}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Source
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Source</span>
                  <span>Label</span>
                  <span>Scope</span>
                  <span>Consumption</span>
                  <span>Est. Impact</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="space-y-2">
                  {sources.length > 0 ? breakdown.map((row, i) => {
                    const info = SOURCE_OPTIONS.find(o => o.value === row.source_type);
                    const Icon = info?.icon || Zap;
                    return (
                      <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-1.5 rounded"><Icon className="h-3.5 w-3.5 text-gray-600" /></div>
                          <span className="text-[13px] font-bold text-gray-900">{info?.label || row.source_type}</span>
                        </div>
                        <span className="text-[12px] text-gray-600">{row.label}</span>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{row.scope}</span>
                        <span className="text-[12px] font-medium text-gray-900">{row.consumption}</span>
                        <div className="flex items-center gap-1">
                          <p className="text-[13px] font-bold text-[#0f5c56]">{row.emissions.toFixed(2)} kg</p>
                          {row.greenPct > 0 && <Leaf className="h-3 w-3 text-green-500" />}
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <SourceDialog
                            initial={sources[i]} onSave={s => handleEditSource(i, s)}
                            trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>}
                          />
                          <button onClick={() => handleRemoveSource(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No energy sources configured. Add your first source above.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 flex items-start gap-4">
              <Info className="h-5 w-5 text-[#0f5c56] shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-gray-900">Emission Factors Reference</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Electricity (Scope 2)</p>
                    <ul className="space-y-1.5">
                      {COUNTRY_OPTIONS.slice(0, 4).map(c => (
                        <li key={c.code} className="text-[12px] text-gray-600 flex justify-between">
                          <span>{c.label}</span> <span className="font-mono">{GRID_FACTORS[c.code]} kg/kWh</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Fuels (Scope 1)</p>
                    <ul className="space-y-1.5">
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Natural Gas</span> <span className="font-mono">{FUEL_FACTORS.natural_gas} kg/kWh</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Diesel</span> <span className="font-mono">{FUEL_FACTORS.diesel} kg/L</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Petrol</span> <span className="font-mono">{FUEL_FACTORS.petrol} kg/L</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>LPG</span> <span className="font-mono">{FUEL_FACTORS.lpg} kg/L</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CALCULATE ═══════════ */}
          <TabsContent value="calculate" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">Run Energy Emission Calculation</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Review configured energy sources and commit emissions for {month}/{year}.</p>
                  <div className="mt-4 space-y-2">
                    {breakdown.map((b, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-[#e5e7eb]">
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900">{b.label}</p>
                          <p className="text-[11px] text-gray-500">{SOURCE_OPTIONS.find(o => o.value === b.source_type)?.label} • {b.scope} • {b.consumption}</p>
                        </div>
                        <p className="text-[14px] font-bold text-[#0f5c56]">{b.emissions.toFixed(2)} kg</p>
                      </div>
                    ))}
                    {sources.length === 0 && (
                      <p className="text-[13px] text-gray-400">No energy sources configured. Go to the Sources tab to add some.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 border border-[#e5e7eb] rounded-lg p-4 flex flex-col items-end min-w-[240px]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Total Estimated Footprint</p>
                  <p className="text-[32px] font-black text-[#0f5c56] tracking-tight">{totalEst.toFixed(2)} <span className="text-[14px] text-gray-500 font-medium">kg CO₂e</span></p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}