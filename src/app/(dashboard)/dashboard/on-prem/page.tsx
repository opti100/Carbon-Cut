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
  TrendingDown, Settings, Pencil, Activity, HardDrive, Zap,
  RefreshCw, Wifi, WifiOff, Eye, EyeOff, HelpCircle,
  Thermometer, Gauge, PlugZap, Shield, Link2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const onpremApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/onprem/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),

  getIntegrations: () => api.get('/web/onprem/integrations/').then(r => r.data.data),
  createIntegration: (payload: any) => api.post('/web/onprem/integrations/', payload).then(r => r.data),
  deleteIntegration: (id: string) => api.delete('/web/onprem/integrations/', { data: { integration_id: id } }).then(r => r.data),
  syncIntegration: (payload: any) => api.post('/web/onprem/sync/', payload).then(r => r.data),
  getGuide: (type?: string) =>
    api.get('/web/onprem/guide/', { params: type ? { integration_type: type } : {} }).then(r => r.data.data),
};

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */
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

interface IntegrationRecord {
  id: string;
  server_name: string;
  integration_type: string;
  connection_status: string;
  sync_enabled: boolean;
  last_sync_at: string | null;
  last_sync_error: string | null;
  last_power_watts: number | null;
  last_energy_kwh: number | null;
  last_cpu_utilization: number | null;
  last_ram_utilization: number | null;
  last_cpu_temp: number | null;
  created_at: string;
}

interface ProviderGuide {
  integration_type: string;
  name: string;
  steps: string[];
  required_fields: string[];
  optional_fields: string[];
  docs_url: string;
}

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */
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

const INTEGRATIONS_META: Record<string, { label: string; icon: string; color: string; description: string }> = {
  prometheus: { label: 'Prometheus / Grafana', icon: '', color: '#e6522c', description: 'Pull CPU & RAM utilisation from node_exporter' },
  ipmi: { label: 'IPMI / BMC', icon: '', color: '#0078d4', description: 'Direct power readings from server BMC / iDRAC / iLO' },
  pdu: { label: 'PDU', icon: '', color: '#f59e0b', description: 'Rack-level power metering via REST or SNMP' },
};

const FIELD_LABELS: Record<string, { label: string; placeholder: string; sensitive: boolean }> = {
  prometheus_url: { label: 'Prometheus URL', placeholder: 'http://prometheus:9090', sensitive: false },
  bearer_token: { label: 'Bearer Token', placeholder: 'Enter API token', sensitive: true },
  basic_user: { label: 'Basic Auth User', placeholder: 'admin', sensitive: false },
  basic_password: { label: 'Basic Auth Password', placeholder: 'Enter password', sensitive: true },
  instance_label: { label: 'Instance Label (optional)', placeholder: 'instance', sensitive: false },
  ipmi_host: { label: 'BMC / IPMI Host', placeholder: '192.168.1.100', sensitive: false },
  ipmi_user: { label: 'IPMI Username', placeholder: 'admin', sensitive: false },
  ipmi_password: { label: 'IPMI Password', placeholder: 'Enter password', sensitive: true },
  pdu_url: { label: 'PDU REST API URL', placeholder: 'https://pdu.local/api/power', sensitive: false },
  pdu_api_token: { label: 'PDU API Token', placeholder: 'Enter token', sensitive: true },
  pdu_snmp_host: { label: 'PDU SNMP Host', placeholder: '192.168.1.200', sensitive: false },
  pdu_snmp_community: { label: 'SNMP Community', placeholder: 'public', sensitive: false },
  pdu_snmp_oid: { label: 'Power OID (optional)', placeholder: '1.3.6.1.4.1.318...', sensitive: false },
  pdu_outlet_name: { label: 'Outlet Name (optional)', placeholder: 'Outlet 3', sensitive: false },
};

const INTEGRATION_FIELDS: Record<string, { required: string[]; optional: string[] }> = {
  prometheus: {
    required: ['prometheus_url'],
    optional: ['bearer_token', 'basic_user', 'basic_password', 'instance_label'],
  },
  ipmi: {
    required: ['ipmi_host'],
    optional: ['ipmi_user', 'ipmi_password'],
  },
  pdu: {
    required: [],
    optional: ['pdu_url', 'pdu_api_token', 'pdu_snmp_host', 'pdu_snmp_community', 'pdu_snmp_oid', 'pdu_outlet_name'],
  },
};

const DEFAULT_SERVER: ServerType = {
  name: 'server-01', cpu_cores: 8, ram_gb: 32, storage_tb: 1,
  storage_type: 'ssd', avg_cpu_utilization: 0.4, hours_per_day: 24, days_per_month: 30,
};

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */
function getGridFactor(code: string): number {
  return GRID_FACTORS[code.toUpperCase()] ?? GRID_FACTORS['WORLD'];
}

function estimateServerEmissions(server: ServerType, pue: number, countryCode: string): number {
  const cpuW = server.cpu_cores * SERVER_TDP.cpu_watts_per_core;
  const ramW = server.ram_gb * SERVER_TDP.ram_watts_per_gb;
  const storageW = server.storage_tb * (
    server.storage_type === 'hdd' ? SERVER_TDP.hdd_watts_per_tb
    : server.storage_type === 'nvme' ? SERVER_TDP.nvme_watts_per_tb
    : SERVER_TDP.ssd_watts_per_tb
  );
  const totalW = (cpuW + ramW + storageW) * server.avg_cpu_utilization;
  const hours = server.hours_per_day * server.days_per_month;
  const kwh = (totalW * hours * pue) / 1000;
  return +(kwh * getGridFactor(countryCode)).toFixed(4);
}

/* ═══════════════════════════════════════════════════════════
   Small Components
   ═══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    connected: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <Wifi className="h-3 w-3" />, label: 'Connected' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Loader2 className="h-3 w-3 animate-spin" />, label: 'Pending' },
    error: { bg: 'bg-red-50', text: 'text-red-700', icon: <WifiOff className="h-3 w-3" />, label: 'Error' },
    expired: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <AlertCircle className="h-3 w-3" />, label: 'Expired' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      {s.icon} {s.label}
    </span>
  );
}

function SensitiveInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] pr-9 font-mono"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShow(!show)}>
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Server Hardware Dialog (manual config — unchanged logic)
   ═══════════════════════════════════════════════════════════ */
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

function IntegrationDialog({
  servers,
  onSaved,
  trigger,
}: {
  servers: ServerType[];
  onSaved: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [integrationType, setIntegrationType] = useState('prometheus');
  const [serverName, setServerName] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'result'>('form');

  const meta = INTEGRATIONS_META[integrationType];
  const fieldDef = INTEGRATION_FIELDS[integrationType];

  const { data: guide } = useQuery({
    queryKey: ['onprem-guide', integrationType],
    queryFn: () => onpremApi.getGuide(integrationType),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: onpremApi.createIntegration,
    onSuccess: (data) => {
      if (data.success) {
        const testResult = data.data?.test_result;
        if (testResult && !testResult.success) {
          setStep('result');
        } else {
          onSaved();
          setOpen(false);
          reset();
        }
      }
    },
  });

  const reset = () => { setStep('form'); setFields({}); setServerName(''); };

  const hasRequired =
    serverName.trim().length > 0 &&
    (fieldDef?.required?.length === 0 || fieldDef?.required?.every(f => (fields[f] || '').trim().length > 0));

  // PDU needs at least one of the optional fields that constitutes a connection method
  const pduHasAnyField =
    integrationType !== 'pdu' ||
    ['pdu_url', 'pdu_snmp_host'].some(f => (fields[f] || '').trim().length > 0);

  const handleSubmit = () => {
    createMutation.mutate({
      integration_type: integrationType,
      server_name: serverName,
      ...fields,
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-xl border border-[#e5e7eb] shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header - Updated to match new light theme */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] shrink-0">
          <h2 className="text-[15px] font-semibold text-[#0f5c56]">Add Monitoring Integration</h2>
          <p className="text-[11px] text-gray-500 mt-1">Connect a real-time data source for accurate emission tracking.</p>
        </div>

        {/* Scrollable Body Container */}
        <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
          {step === 'form' && (
            <>
              {/* Integration Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Integration Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(INTEGRATIONS_META).map(([key, m]) => (
                    <button
                      key={key}
                      onClick={() => { setIntegrationType(key); setFields({}); }}
                      className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col ${
                        integrationType === key
                          ? 'border-[#0f5c56] bg-[#e6f7f1]'
                          : 'border-[#e5e7eb] bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[16px] mb-1">{m.icon}</span>
                      <span className={`text-[11px] font-bold ${integrationType === key ? 'text-[#0f5c56]' : 'text-gray-700'}`}>
                        {m.label}
                      </span>
                      <span className="text-[9px] text-gray-500 mt-0.5 leading-tight">{m.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  Target Server <span className="text-red-400 text-[9px]">*</span>
                </label>
                {servers.length > 0 ? (
                  <Select value={serverName} onValueChange={setServerName}>
                    <SelectTrigger className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                      <SelectValue placeholder="Select a configured server" />
                    </SelectTrigger>
                    <SelectContent>
                      {servers.map(s => (
                        <SelectItem key={s.name} value={s.name} className="text-[12px]">
                          {s.name} — {s.cpu_cores}c / {s.ram_gb}GB
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2.5">
                    Add servers in the Config tab first, then connect integrations.
                  </div>
                )}
              </div>

              {/* Setup Guide */}
              {guide && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-blue-800 mb-1.5">Setup Guide</p>
                      <ol className="space-y-1">
                        {(guide as ProviderGuide).steps?.map((s: string, i: number) => (
                          <li key={i} className="text-[10px] text-blue-700 flex gap-1.5">
                            <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span> {s}
                          </li>
                        ))}
                      </ol>
                      {(guide as ProviderGuide).docs_url && (
                        <a href={(guide as ProviderGuide).docs_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 underline mt-2 inline-block">
                          View documentation →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Credential Fields */}
              {fieldDef && (
                <div className="space-y-4">
                  {fieldDef.required.map(fk => {
                    const fm = FIELD_LABELS[fk];
                    if (!fm) return null;
                    return (
                      <div key={fk} className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          {fm.label} <span className="text-red-400 text-[9px]">*</span>
                        </label>
                        {fm.sensitive ? (
                          <SensitiveInput 
                            value={fields[fk] || ''} 
                            onChange={v => setFields({ ...fields, [fk]: v })} 
                            placeholder={fm.placeholder} 
                            // className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]"
                          />
                        ) : (
                          <Input 
                            className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56] font-mono" 
                            placeholder={fm.placeholder} 
                            value={fields[fk] || ''} 
                            onChange={e => setFields({ ...fields, [fk]: e.target.value })} 
                          />
                        )}
                      </div>
                    );
                  })}
                  {fieldDef.optional.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optional</span>
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                      </div>
                      {fieldDef.optional.map(fk => {
                        const fm = FIELD_LABELS[fk];
                        if (!fm) return null;
                        return (
                          <div key={fk} className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{fm.label}</label>
                            {fm.sensitive ? (
                              <SensitiveInput 
                                value={fields[fk] || ''} 
                                onChange={v => setFields({ ...fields, [fk]: v })} 
                                placeholder={fm.placeholder} 
                                // className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]"
                              />
                            ) : (
                              <Input 
                                className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56] font-mono" 
                                placeholder={fm.placeholder} 
                                value={fields[fk] || ''} 
                                onChange={e => setFields({ ...fields, [fk]: e.target.value })} 
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-800">
                  Credentials are encrypted at rest. Read-only access is sufficient for all integration types.
                </p>
              </div>
            </>
          )}

          {/* Test Result */}
          {step === 'result' && (
            <div className="space-y-3 pb-2">
              {createMutation.data?.data?.test_result?.success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-emerald-800">Connection Verified</p>
                  <p className="text-[11px] text-emerald-600 mt-1">{createMutation.data.data.test_result.message}</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-red-800">Connection Failed</p>
                  <p className="text-[11px] text-red-600 mt-1">{createMutation.data?.data?.test_result?.message || 'Unable to verify endpoint'}</p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full h-[34px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setStep('form')}>
                ← Edit Credentials
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Restyled to match new flow */}
        {step !== 'result' && (
          <div className="px-6 py-3.5 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => { setOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
              disabled={!hasRequired || !pduHasAnyField || createMutation.isPending}
              onClick={handleSubmit}
            >
              {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
              Connect & Verify
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function OnPremPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  /* ── Queries ── */
  const config = useQuery({ queryKey: ['onprem-config'], queryFn: onpremApi.getConfig });
  const summary = useQuery({ queryKey: ['onprem-summary', month, year], queryFn: () => onpremApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['onprem-analytics', month, year], queryFn: () => onpremApi.getAnalytics(month, year) });
  const integrationsQuery = useQuery({ queryKey: ['onprem-integrations'], queryFn: onpremApi.getIntegrations });

  /* ── State ── */
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

  /* ── Mutations ── */
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

  const deleteIntegrationMutation = useMutation({
    mutationFn: onpremApi.deleteIntegration,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['onprem-integrations'] }),
  });

  const syncMutation = useMutation({
    mutationFn: onpremApi.syncIntegration,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onprem-integrations'] });
      qc.invalidateQueries({ queryKey: ['onprem-summary'] });
      qc.invalidateQueries({ queryKey: ['onprem-analytics'] });
    },
  });

  const syncAllMutation = useMutation({
    mutationFn: () => onpremApi.syncIntegration({ month, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onprem-integrations'] });
      qc.invalidateQueries({ queryKey: ['onprem-summary'] });
      qc.invalidateQueries({ queryKey: ['onprem-analytics'] });
    },
  });

  /* ── Derived ── */
  const integrations: IntegrationRecord[] = integrationsQuery.data || [];
  const connectedIntegrations = integrations.filter(i => i.connection_status === 'connected');

  const breakdown = servers.map(s => {
    const intg = integrations.find(i => i.server_name === s.name && i.connection_status === 'connected');
    const hasLiveData = !!intg;
    const liveCpu = intg?.last_cpu_utilization != null ? intg.last_cpu_utilization / 100 : null;
    const effectiveUtil = liveCpu ?? s.avg_cpu_utilization;
    const effectiveServer = { ...s, avg_cpu_utilization: effectiveUtil };
    return {
      name: s.name,
      emissions: estimateServerEmissions(effectiveServer, pue, countryCode),
      specs: `${s.cpu_cores}c / ${s.ram_gb}GB / ${s.storage_tb}TB ${s.storage_type?.toUpperCase()}`,
      utilization: `${(effectiveUtil * 100).toFixed(0)}%`,
      hours: `${s.hours_per_day}h × ${s.days_per_month}d`,
      hasLiveData,
      liveWatts: intg?.last_power_watts,
      liveTemp: intg?.last_cpu_temp,
      integrationStatus: intg?.connection_status,
    };
  });
  const totalEstimated = breakdown.reduce((a, b) => a + b.emissions, 0);
  const trendData = analytics.data?.monthly_trend ?? [];

  const saveConfig = (updatedServers: ServerType[], c: string, p: number) => {
    updateConfigMutation.mutate({
      onprem_configs: [{
        servers: updatedServers,
        location_city: 'Default',
        location_country_code: c,
        power_usage_effectiveness: p,
      }],
    });
  };

  const handleAddServer = (s: ServerType) => { const u = [...servers, s]; setServers(u); saveConfig(u, countryCode, pue); };
  const handleEditServer = (i: number, s: ServerType) => { const u = servers.map((x, j) => j === i ? s : x); setServers(u); saveConfig(u, countryCode, pue); };
  const handleRemoveServer = (i: number) => { const u = servers.filter((_, j) => j !== i); setServers(u); saveConfig(u, countryCode, pue); };

  const handleCalculate = () => {
    calcMutation.mutate({ servers, location_country_code: countryCode, pue, calculation_period: 'monthly', month, year });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">On-Premises Infrastructure</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track emissions from owned data centers and physical servers</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            {connectedIntegrations.length > 0 && (
              <Button
                size="sm" variant="outline"
                className="h-[34px] text-[12px] rounded-md gap-1.5 border-[#0f5c56] text-[#0f5c56] hover:bg-[#e6f7f1]"
                onClick={() => syncAllMutation.mutate()}
                disabled={syncAllMutation.isPending}
              >
                {syncAllMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Sync All
              </Button>
            )}
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={handleCalculate} disabled={servers.length === 0}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* ── Alerts ── */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Infrastructure data processed and saved successfully.</p>
          </div>
        )}
        {syncMutation.isSuccess && syncMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">
              Live sync complete — {syncMutation.data.data?.power_watts ? `${syncMutation.data.data.power_watts.toFixed(0)}W measured, ` : ''}
              {syncMutation.data.data?.emissions_kg?.toFixed(4) || syncMutation.data.data?.results?.[0]?.emissions_kg?.toFixed(4) || '0'} kg CO₂
            </p>
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
            {['overview', 'config', 'integrations'].map(tab => (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'On-Prem Emissions', value: summary.data?.onprem_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Server },
                { label: 'This Month Estimate', value: totalEstimated.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Live Integrations', value: connectedIntegrations.length, unit: `of ${servers.length} servers`, icon: Wifi },
                { label: 'Data Accuracy', value: connectedIntegrations.length > 0 ? 'High' : 'Estimated', unit: connectedIntegrations.length > 0 ? 'Live metrics' : 'TDP model', icon: Shield },
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
                          <linearGradient id="colorOnprem" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorOnprem)" />
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

              {/* Top Consumers */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Top Consumers</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-0">
                  {breakdown.length > 0 ? breakdown.sort((a, b) => b.emissions - a.emissions).map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-bold text-gray-900 truncate">{b.name}</p>
                          {b.hasLiveData && (
                            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">LIVE</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">
                          {b.specs}
                          {b.liveWatts != null && ` • ${b.liveWatts.toFixed(0)}W`}
                          {b.liveTemp != null && ` • ${b.liveTemp.toFixed(0)}°C`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-bold text-[#0f5c56]">{b.emissions.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">kg</span></p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[12px] text-gray-400 text-center mt-6">No servers mapped.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CONFIG ═══════════ */}
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
                    <Input type="number" step="0.1" min="1" max="3" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] w-20" value={pue} onChange={e => setPue(+e.target.value)} onBlur={() => saveConfig(servers, countryCode, pue)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Hardware Inventory</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage individual servers to calculate power draw.</p>
                </div>
                <ServerDialog pue={pue} countryCode={countryCode} onSave={handleAddServer}
                  trigger={<Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Server</Button>} />
              </div>
              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Server</span><span>Hardware Specs</span><span>Avg Load</span><span>Uptime</span><span>Est. Impact</span><span className="text-right">Actions</span>
                </div>
                <div className="space-y-2">
                  {breakdown.length > 0 ? breakdown.map((b, i) => (
                    <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-gray-900">{b.name}</span>
                        {b.hasLiveData && <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">LIVE</span>}
                      </div>
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
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">No server hardware configured.</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ INTEGRATIONS ═══════════ */}
          <TabsContent value="integrations" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Monitoring Integrations</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Connect Prometheus, IPMI, or PDU for real-time power & utilisation data.
                  </p>
                </div>
                <IntegrationDialog
                  servers={servers}
                  onSaved={() => qc.invalidateQueries({ queryKey: ['onprem-integrations'] })}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5"
                      disabled={servers.length === 0}>
                      <Plus className="h-3.5 w-3.5" /> Add Integration
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                {integrationsQuery.isLoading ? (
                  <div className="py-12 flex flex-col items-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-[12px]">Loading integrations…</p>
                  </div>
                ) : integrations.length > 0 ? (
                  <div className="space-y-3">
                    {integrations.map(intg => {
                      const meta = INTEGRATIONS_META[intg.integration_type];
                      return (
                        <div key={intg.id} className="rounded-xl border border-[#e5e7eb] bg-white hover:border-[#0f5c56]/30 transition-colors overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div
                                  className="h-10 w-10 rounded-lg flex items-center justify-center text-[18px] shrink-0"
                                  style={{ backgroundColor: (meta?.color || '#6b7280') + '15' }}
                                >
                                  {meta?.icon || ''}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-[14px] font-bold text-gray-900">{meta?.label || intg.integration_type}</h3>
                                    <StatusBadge status={intg.connection_status} />
                                  </div>
                                  <p className="text-[12px] text-gray-600 mt-0.5">
                                    Server: <span className="font-mono font-bold">{intg.server_name}</span>
                                  </p>

                                  {/* Live Metrics Row */}
                                  <div className="flex items-center gap-4 mt-3">
                                    {intg.last_power_watts != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <PlugZap className="h-3 w-3" /> Power
                                        </p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_power_watts.toFixed(0)}W</p>
                                      </div>
                                    )}
                                    {intg.last_cpu_utilization != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <Gauge className="h-3 w-3" /> CPU
                                        </p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_cpu_utilization.toFixed(1)}%</p>
                                      </div>
                                    )}
                                    {intg.last_ram_utilization != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">RAM</p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_ram_utilization.toFixed(1)}%</p>
                                      </div>
                                    )}
                                    {intg.last_cpu_temp != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <Thermometer className="h-3 w-3" /> Temp
                                        </p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_cpu_temp.toFixed(0)}°C</p>
                                      </div>
                                    )}
                                    {intg.last_energy_kwh != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Energy</p>
                                        <p className="text-[14px] font-bold text-[#0f5c56]">{intg.last_energy_kwh.toFixed(1)} kWh</p>
                                      </div>
                                    )}
                                  </div>

                                  {intg.last_sync_at && (
                                    <p className="text-[10px] text-gray-400 mt-2">
                                      Last synced: {new Date(intg.last_sync_at).toLocaleString()}
                                    </p>
                                  )}
                                  {intg.last_sync_error && intg.connection_status === 'error' && (
                                    <p className="text-[10px] text-red-500 mt-1 truncate max-w-[400px]">
                                      Error: {intg.last_sync_error}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="outline" size="sm"
                                  className="h-[30px] text-[11px] rounded-md gap-1 border-[#0f5c56]/30 text-[#0f5c56] hover:bg-[#e6f7f1]"
                                  disabled={syncMutation.isPending}
                                  onClick={() => syncMutation.mutate({ integration_id: intg.id, month, year })}
                                >
                                  {syncMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                  Sync
                                </Button>
                                <button
                                  onClick={() => deleteIntegrationMutation.mutate(intg.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 border-t border-[#f0f1f5] px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              Type: {intg.integration_type.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {intg.last_power_watts != null ? 'Direct power measurement — high accuracy' : 'Utilisation-based — medium accuracy'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                    <Server className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-semibold text-gray-600">No monitoring integrations</p>
                    <p className="text-[12px] text-gray-400 mt-1 max-w-[360px] mx-auto">
                      Connect Prometheus for CPU/RAM metrics, IPMI for direct power readings, or a PDU for rack-level metering.
                    </p>
                    {servers.length > 0 ? (
                      <IntegrationDialog
                        servers={servers}
                        onSaved={() => qc.invalidateQueries({ queryKey: ['onprem-integrations'] })}
                        trigger={
                          <Button size="sm" className="mt-4 h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5">
                            <Plus className="h-3.5 w-3.5" /> Add First Integration
                          </Button>
                        }
                      />
                    ) : (
                      <p className="text-[11px] text-amber-600 mt-4">Add servers in the Config tab first.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}