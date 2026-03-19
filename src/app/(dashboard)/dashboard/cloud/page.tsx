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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Cloud, Upload, Loader2, CheckCircle2, AlertCircle, Plus,
  Trash2, TrendingDown, Settings, Info, Pencil, ArrowUpRight, Activity, Database,
  Link2, Unlink, RefreshCw, Shield, ExternalLink, Zap, WifiOff
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

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
  getConnectionGuide: () =>
    api.get('/web/cloud/connection-guide/').then(r => r.data.data),
  connectProvider: (payload: any) =>
    api.post('/web/cloud/connect/', payload).then(r => r.data),
  disconnectProvider: (provider: string) =>
    api.delete('/web/cloud/connect/', { data: { provider } }).then(r => r.data),
  getSyncStatus: () =>
    api.get('/web/cloud/sync/').then(r => r.data.data),
  triggerSync: (payload: any) =>
    api.post('/web/cloud/sync/', payload).then(r => r.data),
};

interface CloudProvider {
  provider: string;
  connection_method: string;
  regions: string[];
  monthly_cost_usd: number;
}

interface ConnectionField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'file';
}

interface ProviderGuide {
  title: string;
  method: string;
  steps: string[];
  fields: ConnectionField[];
  external_id?: string;
  required_permissions: string[];
}

function useDynamicEmissionFactor(provider: string, region: string) {
  const { data: factorsList } = useQuery({
    queryKey: ['emission-factors'],
    queryFn: cloudApi.getEmissionFactors,
    staleTime: 1000 * 60 * 60,
  });

  let factor = 0.000350;

  if (factorsList && Array.isArray(factorsList)) {
    const match = factorsList.find(
      (f: any) => f.provider.toLowerCase() === provider.toLowerCase() && f.region === region
    );
    if (match) factor = match.factor_kg_per_usd;
  }

  return factor;
}

function ConnectProviderDialog({
  provider,
  guide,
  onConnected,
}: {
  provider: string;
  guide: ProviderGuide;
  onConnected: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [gcpKeyFile, setGcpKeyFile] = useState<any>(null);

  const connectMutation = useMutation({
    mutationFn: cloudApi.connectProvider,
    onSuccess: (data) => {
      if (data.success || data.data?.success) {
        onConnected();
        setOpen(false);
        setForm({});
      }
    },
  });

  const handleSubmit = () => {
    const credentials: Record<string, any> = { ...form };

    if (provider === "aws" && guide.external_id) {
      credentials.external_id = guide.external_id;
    }

    if (provider === "gcp" && gcpKeyFile) {
      credentials.service_account_key = gcpKeyFile;
    }

    connectMutation.mutate({ provider, credentials });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Link2 className="h-4 w-4 mr-2" />
          Connect {provider.toUpperCase()}
        </Button>
      </DialogTrigger>

      {/* ADDED: max-h-[90vh] and flex flex-col to constrain height */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
          <DialogDescription>
            Method: {guide.method}
          </DialogDescription>
        </DialogHeader>

        {/* ADDED: flex-1, overflow-y-auto, and pr-2 to enable internal scrolling */}
        <div className="space-y-6 py-4 flex-1 overflow-y-auto pr-2">
          {/* Setup Steps */}
          <div>
            <h4 className="text-sm font-medium mb-2">Setup Steps</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Required Permissions */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Required Permissions
            </h4>
            <div className="flex flex-wrap gap-2">
              {guide.required_permissions.map((perm, i) => (
                <Badge key={i} variant="secondary">
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          {/* External ID */}
          {guide.external_id && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                External ID
              </h4>
              <div className="rounded-md bg-muted p-3 text-sm font-mono break-all">
                {guide.external_id}
              </div>
            </div>
          )}

          {/* Credential Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Credentials</h4>

            {guide.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>

                {field.type === "file" ? (
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            setGcpKeyFile(
                              JSON.parse(ev.target?.result as string)
                            );
                          } catch {}
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {connectMutation.isError && (
            <div className="text-sm text-destructive">
              {(connectMutation.error as any)?.response?.data?.data?.error ||
                "Connection failed. Check your credentials."}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={connectMutation.isPending}
          >
            {connectMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Connection Status Badge ─────────────── */
function ConnectionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    connected: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <Zap className="h-3 w-3" /> },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    error: { bg: 'bg-red-50', text: 'text-red-700', icon: <AlertCircle className="h-3 w-3" /> },
    expired: { bg: 'bg-gray-100', text: 'text-gray-500', icon: <WifiOff className="h-3 w-3" /> },
  };
  const c = config[status] || config.expired;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', c.bg, c.text)}>
      {c.icon} {status}
    </span>
  );
}

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
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 rounded-xl border border-[#e5e7eb] shadow-lg">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] font-semibold text-[#0f5c56]">{initial ? 'Edit' : 'Add'} Cloud Source</h2>
          <p className="text-[11px] text-gray-500 mt-1">Configure your cloud region and monthly spend.</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Provider</label>
            <Select value={form.provider} onValueChange={v => setForm({ ...form, provider: v })}>
              <SelectTrigger className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Primary Region</label>
            <Input className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]" placeholder="e.g. us-east-1" value={form.regions[0]} onChange={e => setForm({ ...form, regions: [e.target.value] })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Monthly Cost (USD)</label>
            <Input className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]" type="number" placeholder="0.00" min="0" value={form.monthly_cost_usd || ''} onChange={e => setForm({ ...form, monthly_cost_usd: +e.target.value })} />
          </div>

          <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
              <p className="text-[10px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(6)} kg/$</p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#0f5c56]">
                {estimatedEmissions.toFixed(2)} <span className="text-[10px] font-medium text-[#0f5c56]/70">kg CO₂</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Source</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CloudPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();
  const { data: factorsList } = useQuery({ queryKey: ['emission-factors'], queryFn: cloudApi.getEmissionFactors });
  const config = useQuery({ queryKey: ['cloud-config'], queryFn: cloudApi.getConfig });
  const summary = useQuery({ queryKey: ['cloud-summary', month, year], queryFn: () => cloudApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['cloud-analytics', month, year], queryFn: () => cloudApi.getAnalytics(month, year) });
  const monthlyReport = useQuery({ queryKey: ['cloud-monthly', year, month], queryFn: () => cloudApi.getMonthlyReport(year, month) });
  const guides = useQuery({ queryKey: ['cloud-guides'], queryFn: cloudApi.getConnectionGuide, staleTime: 1000 * 60 * 60 });
  const syncStatus = useQuery({ queryKey: ['cloud-sync-status'], queryFn: cloudApi.getSyncStatus, refetchInterval: 30000 });

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

  const syncMutation = useMutation({
    mutationFn: cloudApi.triggerSync,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cloud-summary'] });
      qc.invalidateQueries({ queryKey: ['cloud-analytics'] });
      qc.invalidateQueries({ queryKey: ['cloud-sync-status'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: cloudApi.disconnectProvider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cloud-sync-status'] });
      qc.invalidateQueries({ queryKey: ['cloud-config'] });
    },
  });

  // Handlers
  const handleAddProvider = (p: CloudProvider) => { const u = [...providers, p]; setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };
  const handleEditProvider = (i: number, p: CloudProvider) => { const u = providers.map((x, j) => j === i ? p : x); setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };
  const handleRemoveProvider = (i: number) => { const u = providers.filter((_, j) => j !== i); setProviders(u); updateConfigMutation.mutate({ cloud_providers: u }); };

  // Derived Data
  const totalEstimatedEmissions = providers.reduce((acc, p) => {
    const match = Array.isArray(factorsList) ? factorsList.find((f: any) => f.provider === p.provider && f.region === p.regions[0]) : null;
    return acc + p.monthly_cost_usd * (match ? match.factor_kg_per_usd : 0.000350);
  }, 0);

  const trendData = analytics.data?.monthly_trend ?? [];
  const connectedProviders = syncStatus.data ? Object.keys(syncStatus.data).filter(k => syncStatus.data[k].status === 'connected') : [];
  const hasApiConnections = connectedProviders.length > 0;

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
            {hasApiConnections && (
              <Button
                size="sm"
                variant="outline"
                className="h-[34px] text-[12px] rounded-md gap-1.5 border-[#24d18f] text-[#0f5c56] hover:bg-[#e6f7f1]"
                onClick={() => syncMutation.mutate({ month, year })}
                disabled={syncMutation.isPending}
              >
                {syncMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Sync Now
              </Button>
            )}
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={() => calcMutation.mutate({ cloud_providers: providers, month, year })}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">

          {/* Tabs with new "connect" tab */}
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'connect', 'config', 'upload'].map((tab) => (
              <TabsTrigger
                key={tab} value={tab}
                className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none relative"
              >
                {tab === 'connect' ? 'API Connect' : tab}
                {tab === 'connect' && hasApiConnections && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-[#24d18f] rounded-full border-2 border-white" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ OVERVIEW ═══════════ */}
          <TabsContent value="overview" className="space-y-6">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Cloud Emissions', value: summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Cloud },
                { label: 'This Month Estimate', value: totalEstimatedEmissions.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'API Connections', value: `${connectedProviders.length}/3`, unit: hasApiConnections ? 'Live' : 'Manual', icon: hasApiConnections ? Zap : Database },
                { label: 'Data Quality', value: hasApiConnections ? 'High' : (monthlyReport.data?.data_sources?.cloud?.accuracy ?? 'N/A'), unit: hasApiConnections ? 'API Data' : 'Confidence', icon: CheckCircle2 },
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
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Emission Trend
                    {hasApiConnections && <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-full uppercase">Live</span>}
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
                      <Cloud className="h-8 w-8 mb-2 opacity-20" />
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
                  {providers.length > 0 ? providers.map((p, i) => {
                    const match = Array.isArray(factorsList) ? factorsList.find((f: any) => f.provider === p.provider && f.region === p.regions[0]) : null;
                    const est = p.monthly_cost_usd * (match ? match.factor_kg_per_usd : 0.000350);
                    const isConnected = syncStatus.data?.[p.provider]?.status === 'connected';
                    return (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 uppercase flex items-center gap-1.5">
                            {p.provider}
                            {isConnected && <Zap className="h-3 w-3 text-[#24d18f]" />}
                          </p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{p.regions[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-[#0f5c56]">{est.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">kg</span></p>
                        </div>
                      </div>
                    );
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

          {/* ═══════════ API CONNECT TAB (NEW) ═══════════ */}
          <TabsContent value="connect" className="space-y-6">

            {/* Connection Status Banner */}
            {hasApiConnections && (
              <div className="bg-gradient-to-r from-[#e6f7f1] to-[#d4f5e9] border border-[#24d18f]/30 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#0f5c56] flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#24d18f]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0f5c56]">
                      {connectedProviders.length} Provider{connectedProviders.length > 1 ? 's' : ''} Connected
                    </p>
                    <p className="text-[12px] text-[#0f5c56]/70">Data syncs automatically every 6 hours</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-[34px] text-[12px] rounded-md gap-1.5 border-[#0f5c56] text-[#0f5c56] hover:bg-[#0f5c56] hover:text-white"
                  onClick={() => syncMutation.mutate({ month, year })}
                  disabled={syncMutation.isPending}
                >
                  {syncMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Sync All Now
                </Button>
              </div>
            )}

            {/* Provider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(['aws', 'gcp', 'azure'] as const).map((provider) => {
                const status = syncStatus.data?.[provider];
                const guide = guides.data?.[provider] as ProviderGuide | undefined;
                const isConnected = status?.status === 'connected';
                const providerInfo: Record<string, { name: string; logo: string; bg: string; desc: string }> = {
                  aws: { name: 'Amazon Web Services', logo: '/integrations/aws.svg', bg: 'from-[#FF9900]/5 to-[#FF9900]/10', desc: 'IAM Cross-Account Role with Cost Explorer & Carbon Footprint Tool access.' },
                  gcp: { name: 'Google Cloud Platform', logo: '/integrations/gcp.svg', bg: 'from-[#4285F4]/5 to-[#4285F4]/10', desc: 'Service Account with BigQuery access to Carbon Footprint export.' },
                  azure: { name: 'Microsoft Azure', logo: '/integrations/azure.svg', bg: 'from-[#0078D4]/5 to-[#0078D4]/10', desc: 'App Registration with Carbon Optimization & Cost Management access.' },
                };
                const info = providerInfo[provider]

                return (
                  <div
                    key={provider}
                    className={cn(
                      'bg-white border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col',
                      isConnected ? 'border-[#24d18f]' : 'border-[#e5e7eb]'
                    )}
                  >
                    <div className={cn('p-5 bg-gradient-to-br', info.bg)}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Image
                          src={info.logo}
                          alt={info.name}
                          height={10}
                          width={10}
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-[14px]"
                          />
                            {/* {provider.toUpperCase().slice(0, 2)} */}
                          <div>
                            <p className="text-[14px] font-bold text-gray-900">{provider.toUpperCase()}</p>
                            <p className="text-[11px] text-gray-500">{info.name}</p>
                          </div>
                        </div>
                        {status && <ConnectionStatusBadge status={status.status} />}
                      </div>
                      <p className="text-[12px] text-gray-600 leading-relaxed">{info.desc}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-end">
                      {isConnected ? (
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-500">Last Sync</span>
                              <span className="font-mono text-gray-700">
                                {status?.last_sync_at
                                  ? new Date(status.last_sync_at).toLocaleString()
                                  : 'Never'}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-500">Auto-Sync</span>
                              <span className="font-semibold text-emerald-600">Every 6 hours</span>
                            </div>
                          </div>
                          {status?.last_sync_error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                              <p className="text-[11px] text-red-700">{status.last_sync_error}</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-[32px] text-[12px] rounded-md gap-1 border-[#e5e7eb] text-[#0f5c56]"
                              onClick={() => syncMutation.mutate({ provider, month, year })}
                              disabled={syncMutation.isPending}
                            >
                              <RefreshCw className={cn("h-3 w-3", syncMutation.isPending && "animate-spin")} /> Sync
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-[32px] text-[12px] rounded-md gap-1 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => disconnectMutation.mutate(provider)}
                              disabled={disconnectMutation.isPending}
                            >
                              <Unlink className="h-3 w-3" /> Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[11px] text-gray-500 text-center">Not connected</p>
                          </div>
                          {guide ? (
                            <ConnectProviderDialog
                              provider={provider}
                              guide={guide}
                              onConnected={() => {
                                qc.invalidateQueries({ queryKey: ['cloud-sync-status'] });
                                qc.invalidateQueries({ queryKey: ['cloud-config'] });
                              }}
                            />
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              className="w-full h-[32px] text-[12px] rounded-md"
                            >
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Loading...
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* How It Works */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-[#0f5c56]" /> How API Connections Work
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Grant Access', desc: 'Create a read-only role/service account in your cloud provider.' },
                  { step: '2', title: 'Enter Credentials', desc: 'Provide the role ARN, service account key, or app registration details.' },
                  { step: '3', title: 'Auto-Sync', desc: 'We fetch carbon footprint and cost data every 6 hours automatically.' },
                  { step: '4', title: 'Real-time View', desc: 'See accurate emissions by service, region, and time period.' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="h-8 w-8 rounded-full bg-[#0f5c56] text-white text-[13px] font-bold flex items-center justify-center mx-auto mb-2">
                      {item.step}
                    </div>
                    <p className="text-[13px] font-semibold text-gray-900">{item.title}</p>
                    <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
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
                    const match = Array.isArray(factorsList) ? factorsList.find((f: any) => f.provider === p.provider && f.region === p.regions[0]) : null;
                    const factor = match ? match.factor_kg_per_usd : 0.000350;
                    const isApiConnected = syncStatus.data?.[p.provider]?.status === 'connected';
                    return (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <span className="text-[13px] font-bold text-gray-900 uppercase flex items-center gap-1.5">
                          {p.provider}
                          {isApiConnected && <Zap className="h-3 w-3 text-[#24d18f]" />}
                        </span>
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
                    );
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