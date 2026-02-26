'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/contexts/AuthContext';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Users, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  TrendingDown, Building2, Settings, Info, Pencil, Home, MapPin, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';


const workforceApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/configure/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/workforce/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
};


const OFFICE_FACTORS: Record<string, number> = {
  US: 1.52, GB: 1.18, DE: 1.35, FR: 0.45, CA: 1.20, AU: 2.10,
  IN: 2.45, CN: 1.98, JP: 1.65, SG: 1.72, NL: 1.15, SE: 0.18, WORLD: 1.50,
};

const REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH = 52;
const COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH = 89;

function getOfficeFactor(countryCode: string): number {
  return OFFICE_FACTORS[countryCode.toUpperCase()] ?? OFFICE_FACTORS['WORLD'];
}

function estimateWorkforceEmissions(totalEmployees: number, remotePct: number, offices: OfficeLocation[]) {
  const remoteCount = (remotePct / 100) * totalEmployees;
  const officeCount = totalEmployees - remoteCount;

  const remoteEmissions = remoteCount * REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH;
  const commuteEmissions = officeCount * COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH;
  const officeEnergyEmissions = offices.reduce((acc, o) => acc + o.sqm * getOfficeFactor(o.country_code), 0);

  return {
    remoteCount,
    officeCount,
    remote: +remoteEmissions.toFixed(2),
    office_energy: +officeEnergyEmissions.toFixed(2),
    commute: +commuteEmissions.toFixed(2),
    total: +(remoteEmissions + commuteEmissions + officeEnergyEmissions).toFixed(2),
  };
}

/* ─────────────── Types ─────────────── */
interface OfficeLocation {
  name: string;
  sqm: number;
  country_code: string;
}

/* ─────────────── Office Dialog ─────────────── */
function OfficeDialog({
  initial, onSave, trigger,
}: {
  initial?: OfficeLocation; onSave: (o: OfficeLocation) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OfficeLocation>(initial ?? { name: '', sqm: 200, country_code: 'US' });

  const factor = getOfficeFactor(form.country_code);
  const estMonthly = form.sqm * factor;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0f5c56]">{initial ? 'Edit' : 'Add'} Office Location</h2>
          <p className="text-[12px] text-gray-500 mt-1">Configure floor area to calculate energy impact.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Office Name</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="HQ / Branch / etc." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Floor Area (m²)</label>
            <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.sqm || ''} onChange={e => setForm({ ...form, sqm: +e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Country Code (ISO 2-letter)</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] uppercase" placeholder="US" value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value.toUpperCase() })} />
          </div>

          <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(2)} kg/m²</p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#0f5c56]">
                {estMonthly.toFixed(2)} <span className="text-[11px] font-medium text-[#0f5c56]/70">kg CO₂/mo</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Office</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa'];

/* ─────────────── Main Page ─────────────── */
export default function WorkforcePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const config = useQuery({ queryKey: ['wf-config'], queryFn: workforceApi.getConfig });
  const summary = useQuery({ queryKey: ['wf-summary', month, year], queryFn: () => workforceApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['wf-analytics', month, year], queryFn: () => workforceApi.getAnalytics(month, year) });

  const [totalEmployees, setTotalEmployees] = useState(100);
  const [remotePct, setRemotePct] = useState(40);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);

  useEffect(() => {
    const wf = config.data?.workforce || config.data?.workforce_config;
    if (!wf) return;
    if (wf.total_employees) setTotalEmployees(wf.total_employees);
    if (wf.remote_percentage != null) setRemotePct(+wf.remote_percentage);
    else if (wf.remote_employee_percentage != null) setRemotePct(+wf.remote_employee_percentage);
    if (wf.office_locations?.length) {
      setOffices(wf.office_locations.map((loc: any) => ({
        name: loc.name || loc.city || 'Office',
        sqm: loc.sqm ?? (loc.square_meters ? parseFloat(loc.square_meters) : 200),
        country_code: loc.country_code || 'US',
      })));
    }
  }, [config.data]);

  const updateConfigMutation = useMutation({
    mutationFn: workforceApi.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wf-config'] }),
  });

  const calcMutation = useMutation({
    mutationFn: workforceApi.calculate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wf-summary'] });
      qc.invalidateQueries({ queryKey: ['wf-analytics'] });
    },
  });

  const est = estimateWorkforceEmissions(totalEmployees, remotePct, offices);
  const pieData = [
    { name: 'Remote Work', value: est.remote },
    { name: 'Office Energy', value: est.office_energy },
    { name: 'Commuting', value: est.commute },
  ].filter(d => d.value > 0);

    const trendData = analytics.data?.workforce_monthly_trend ?? analytics.data?.monthly_trend ?? [];

  const updateConfig = (t: number, r: number, o: OfficeLocation[]) => {
    updateConfigMutation.mutate({ workforce: { total_employees: t, remote_percentage: r, office_locations: o } });
  };

  const handleCalculate = () => {
    calcMutation.mutate({ total_employees: totalEmployees, remote_percentage: remotePct, office_locations: offices, calculation_period: 'monthly', month, year });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Workforce footprint</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track Scope 3 emissions from employee activities, commuting & office energy</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={handleCalculate} disabled={totalEmployees === 0}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Workforce data processed and saved successfully.</p>
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
            {['overview', 'config', 'calculate'].map((tab) => (
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
                { label: 'Workforce Emissions', value: summary.data?.workforce_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Users },
                { label: 'This Month Estimate', value: est.total.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 3', unit: 'Employee Activities', icon: Settings },
                { label: 'Headcount', value: totalEmployees, unit: `${remotePct}% Remote`, icon: Home },
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
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0} />
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
                      <Users className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Green Header Card: Breakdown */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Impact Sources</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center bg-white">
                  {est.total > 0 ? (
                    <>
                      <div className="h-[130px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={60}
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
                              <span className="text-[12px] font-semibold text-gray-700">{d.name}</span>
                            </div>
                            <span className="text-[13px] font-bold text-[#0f5c56]">{d.value} <span className="text-[10px] font-normal text-gray-400">kg</span></span>
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

          {/* ═══════════ CONFIGURATION ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            {/* General Workforce Setup */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-[#0f5c56]" />
                <h2 className="text-[15px] font-semibold text-gray-900">Workforce Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Employees</label>
                  <Input
                    type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                    value={totalEmployees}
                    onChange={e => {
                      setTotalEmployees(+e.target.value);
                      updateConfig(+e.target.value, remotePct, offices);
                    }}
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Full-time equivalents</p>
                </div>

                <div className="space-y-3 max-w-md">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Remote vs Office Split</label>
                    <span className="text-[12px] font-semibold text-[#0f5c56] bg-[#e6f7f1] px-2 py-0.5 rounded">{remotePct}% Remote</span>
                  </div>
                  <Slider
                    min={0} max={100} step={5} value={[remotePct]}
                    onValueChange={([v]) => {
                      setRemotePct(v);
                      updateConfig(totalEmployees, v, offices);
                    }}
                    className="py-3"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>{est.officeCount} In-Office</span>
                    <span>{est.remoteCount} Remote</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offices Table */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Office Energy Topology</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage building size to compute location-based energy impact.</p>
                </div>
                <OfficeDialog
                  onSave={(o) => { const u = [...offices, o]; setOffices(u); updateConfig(totalEmployees, remotePct, u); }}
                  trigger={<Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Office</Button>}
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Location</span>
                  <span>Country</span>
                  <span>Size (m²)</span>
                  <span>Grid Impact</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="space-y-2">
                  {offices.length > 0 ? offices.map((o, i) => {
                    const factor = getOfficeFactor(o.country_code);
                    return (
                      <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <span className="text-[13px] font-bold text-gray-900">{o.name}</span>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{o.country_code}</span>
                        <span className="text-[13px] font-semibold text-gray-900">{o.sqm.toLocaleString()}</span>
                        <div>
                          <p className="text-[13px] font-bold text-[#0f5c56]">{(o.sqm * factor).toFixed(2)} kg/mo</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{factor.toFixed(2)} kg/m²</p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <OfficeDialog
                            initial={o}
                            onSave={updated => { const u = offices.map((x, j) => j === i ? updated : x); setOffices(u); updateConfig(totalEmployees, remotePct, u); }}
                            trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>}
                          />
                          <button onClick={() => { const u = offices.filter((_, j) => j !== i); setOffices(u); updateConfig(totalEmployees, remotePct, u); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No office locations mapped.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 flex items-start gap-4">
              <Info className="h-5 w-5 text-[#0f5c56] shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-gray-900">Emissions Methodology</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Per Employee Fixed Estimates</p>
                    <ul className="space-y-1.5">
                      <li className="text-[12px] text-gray-600 flex justify-between max-w-[240px]"><span>Remote (Energy)</span> <span className="font-mono font-medium">{REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH} kg/mo</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between max-w-[240px]"><span>Commuting (Avg)</span> <span className="font-mono font-medium">{COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH} kg/mo</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Office Energy Baseline</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      Office emissions rely on regional HVAC/lighting averages multiplied by standard grid intensities (~120 kWh/m²/year). Defaults to 1.50 kg/m²/mo globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CALCULATE ═══════════ */}
          <TabsContent value="calculate" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">Run Scope 3 Workforce Calculation</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Review organizational splits and lock in emissions to the ledger for {month}/{year}.</p>
                </div>

                <div className="bg-gray-50 border border-[#e5e7eb] rounded-lg p-4 flex flex-col items-end min-w-[240px]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Total Estimated Footprint</p>
                  <p className="text-[32px] font-black text-[#0f5c56] tracking-tight">{est.total.toFixed(2)} <span className="text-[14px] text-gray-500 font-medium">kg CO₂</span></p>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#e5e7eb] pt-6">
                <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-sm hover:border-[#24d18f]/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-2"><Home className="h-4 w-4" /> <span className="text-[12px] font-bold uppercase tracking-wider">Remote Work</span></div>
                  <p className="text-[20px] font-bold text-gray-900">{est.remote} <span className="text-[12px] text-gray-400 font-medium">kg</span></p>
                </div>
                <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-sm hover:border-[#24d18f]/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-2"><MapPin className="h-4 w-4" /> <span className="text-[12px] font-bold uppercase tracking-wider">Commuting</span></div>
                  <p className="text-[20px] font-bold text-gray-900">{est.commute} <span className="text-[12px] text-gray-400 font-medium">kg</span></p>
                </div>
                <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-sm hover:border-[#24d18f]/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-2"><Building2 className="h-4 w-4" /> <span className="text-[12px] font-bold uppercase tracking-wider">Office Energy</span></div>
                  <p className="text-[20px] font-bold text-gray-900">{est.office_energy} <span className="text-[12px] text-gray-400 font-medium">kg</span></p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}