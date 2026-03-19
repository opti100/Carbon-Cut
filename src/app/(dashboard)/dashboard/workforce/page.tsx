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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  TrendingDown, Building2, Settings, Info, Pencil, Home, MapPin, Activity,
  RefreshCw, Wifi, WifiOff, Eye, EyeOff, HelpCircle, Shield, Link2,
  Zap, Car, UserCheck,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════
   API Layer
   ═══════════════════════════════════════════════════════════ */
const workforceApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/configure/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/workforce/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),

  // Integrations
  getIntegrations: () => api.get('/web/workforce/integrations/').then(r => r.data.data),
  createIntegration: (payload: any) => api.post('/web/workforce/integrations/', payload).then(r => r.data),
  deleteIntegration: (id: string) => api.delete('/web/workforce/integrations/', { data: { integration_id: id } }).then(r => r.data),
  syncIntegration: (payload: any) => api.post('/web/workforce/sync/', payload).then(r => r.data),
  getGuide: (type?: string) =>
    api.get('/web/workforce/guide/', { params: type ? { integration_type: type } : {} }).then(r => r.data.data),
};

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */
interface OfficeLocation {
  name: string;
  sqm: number;
  country_code: string;
}

interface IntegrationRecord {
  id: string;
  label: string;
  integration_type: string;
  connection_status: string;
  sync_enabled: boolean;
  last_sync_at: string | null;
  last_sync_error: string | null;
  last_total_employees: number | null;
  last_remote_percentage: number | null;
  last_energy_kwh: number | null;
  last_power_watts: number | null;
  last_commute_emissions_kg: number | null;
  last_avg_commute_km: number | null;
  last_respondents: number | null;
  created_at: string;
}

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */
const OFFICE_FACTORS: Record<string, number> = {
  US: 1.52, GB: 1.18, DE: 1.35, FR: 0.45, CA: 1.20, AU: 2.10,
  IN: 2.45, CN: 1.98, JP: 1.65, SG: 1.72, NL: 1.15, SE: 0.18, WORLD: 1.50,
};
const REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH = 52;
const COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH = 89;

const INTEGRATIONS_META: Record<string, { label: string; icon: typeof Users; color: string; description: string }> = {
  hr_platform: { label: 'HR Platform', icon: UserCheck, color: '#8b5cf6', description: 'Auto-sync headcount & remote split from BambooHR, Personio, or API' },
  building_energy: { label: 'Building Energy', icon: Zap, color: '#f59e0b', description: 'Real kWh readings from smart meters, BMS, or manual entry' },
  commute_survey: { label: 'Commute Survey', icon: Car, color: '#3b82f6', description: 'Employee commute mode & distance for transport emissions' },
};

const FIELD_LABELS: Record<string, { label: string; placeholder: string; sensitive: boolean }> = {
  platform: { label: 'Platform', placeholder: 'bamboohr / personio / generic_rest', sensitive: false },
  subdomain: { label: 'BambooHR Subdomain', placeholder: 'mycompany', sensitive: false },
  api_key: { label: 'API Key', placeholder: 'Enter API key', sensitive: true },
  client_id: { label: 'Client ID', placeholder: 'Enter client ID', sensitive: false },
  client_secret: { label: 'Client Secret', placeholder: 'Enter client secret', sensitive: true },
  api_url: { label: 'API URL', placeholder: 'https://api.example.com/employees', sensitive: false },
  bearer_token: { label: 'Bearer Token', placeholder: 'Enter token', sensitive: true },
  remote_field: { label: 'Remote Field Name (optional)', placeholder: 'is_remote', sensitive: false },
  location_field: { label: 'Location Field Name (optional)', placeholder: 'office', sensitive: false },
  mode: { label: 'Mode', placeholder: 'rest_api / prometheus / manual_reading', sensitive: false },
  bms_url: { label: 'BMS / Meter API URL', placeholder: 'https://bms.example.com/api/energy', sensitive: false },
  bms_api_key: { label: 'BMS API Key', placeholder: 'Enter key', sensitive: true },
  bms_api_token: { label: 'BMS API Token', placeholder: 'Enter token', sensitive: true },
  prometheus_url: { label: 'Prometheus URL', placeholder: 'http://prometheus:9090', sensitive: false },
  meter_id: { label: 'Meter ID (optional)', placeholder: 'meter-01', sensitive: false },
  office_name: { label: 'Office Name', placeholder: 'NYC HQ', sensitive: false },
  country_code: { label: 'Country Code', placeholder: 'US', sensitive: false },
  square_meters: { label: 'Floor Area m² (optional)', placeholder: '500', sensitive: false },
  survey_api_url: { label: 'Survey API URL', placeholder: 'https://commute.example.com/api', sensitive: false },
  api_token: { label: 'API Token', placeholder: 'Enter token', sensitive: true },
};

type IntegrationType = 'hr_platform' | 'building_energy' | 'commute_survey';

const INTEGRATION_SUBMODES: Record<IntegrationType, { value: string; label: string; fields: string[] }[]> = {
  hr_platform: [
    { value: 'bamboohr', label: 'BambooHR', fields: ['subdomain', 'api_key', 'remote_field', 'location_field'] },
    { value: 'personio', label: 'Personio', fields: ['client_id', 'client_secret', 'remote_field'] },
    { value: 'generic_rest', label: 'Custom REST API', fields: ['api_url', 'bearer_token', 'remote_field', 'location_field'] },
  ],
  building_energy: [
    { value: 'rest_api', label: 'BMS / Smart Meter API', fields: ['bms_url', 'bms_api_key', 'office_name', 'country_code', 'square_meters', 'meter_id'] },
    { value: 'prometheus', label: 'Prometheus', fields: ['prometheus_url', 'bearer_token', 'office_name', 'country_code', 'meter_id', 'square_meters'] },
    { value: 'manual_reading', label: 'Manual kWh Entry', fields: ['office_name', 'country_code', 'square_meters'] },
  ],
  commute_survey: [
    { value: 'rest_api', label: 'Commute Platform API', fields: ['survey_api_url', 'api_key'] },
    { value: 'manual_survey', label: 'Manual Survey Entry', fields: [] },
  ],
};

const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa'];

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */
function getOfficeFactor(code: string): number {
  return OFFICE_FACTORS[code.toUpperCase()] ?? OFFICE_FACTORS['WORLD'];
}

function estimateWorkforceEmissions(totalEmployees: number, remotePct: number, offices: OfficeLocation[]) {
  const remoteCount = (remotePct / 100) * totalEmployees;
  const officeCount = totalEmployees - remoteCount;
  const remoteEmissions = remoteCount * REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH;
  const commuteEmissions = officeCount * COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH;
  const officeEnergyEmissions = offices.reduce((acc, o) => acc + o.sqm * getOfficeFactor(o.country_code), 0);
  return {
    remoteCount, officeCount,
    remote: +remoteEmissions.toFixed(2),
    office_energy: +officeEnergyEmissions.toFixed(2),
    commute: +commuteEmissions.toFixed(2),
    total: +(remoteEmissions + commuteEmissions + officeEnergyEmissions).toFixed(2),
  };
}

/* ═══════════════════════════════════════════════════════════
   Small Components
   ═══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    connected: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <Wifi className="h-3 w-3" />, label: 'Connected' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Loader2 className="h-3 w-3 animate-spin" />, label: 'Pending' },
    error: { bg: 'bg-red-50', text: 'text-red-700', icon: <WifiOff className="h-3 w-3" />, label: 'Error' },
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
   Office Dialog
   ═══════════════════════════════════════════════════════════ */
function OfficeDialog({
  initial, onSave, trigger,
}: {
  initial?: OfficeLocation; onSave: (o: OfficeLocation) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OfficeLocation>(initial ?? { name: '', sqm: 200, country_code: 'US' });
  const factor = getOfficeFactor(form.country_code);
  const estMonthly = form.sqm * factor;

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

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
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" placeholder="HQ / Branch" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Floor Area (m²)</label>
            <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.sqm || ''} onChange={e => setForm({ ...form, sqm: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Country Code (ISO 2-letter)</label>
            <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] uppercase" placeholder="US" value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value.toUpperCase() })} maxLength={2} />
          </div>
          <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
              <p className="text-[11px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(2)} kg/m²</p>
            </div>
            <span className="text-[14px] font-bold text-[#0f5c56]">
              {estMonthly.toFixed(2)} <span className="text-[11px] font-medium text-[#0f5c56]/70">kg CO₂/mo</span>
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]"
            disabled={!form.name.trim()}
            onClick={() => { onSave(form); setOpen(false); }}>
            Save Office
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   Integration Dialog
   ═══════════════════════════════════════════════════════════ */
function IntegrationDialog({
  onSaved, trigger,
}: {
  onSaved: () => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [intType, setIntType] = useState<IntegrationType>('hr_platform');
  const [subMode, setSubMode] = useState('');
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'result'>('form');

  const submodes = INTEGRATION_SUBMODES[intType] || [];
  const activeSub = submodes.find(s => s.value === subMode) || submodes[0];

  useEffect(() => {
    if (submodes.length > 0 && !submodes.find(s => s.value === subMode)) {
      setSubMode(submodes[0].value);
    }
  }, [intType, submodes, subMode]);

  const { data: guide } = useQuery({
    queryKey: ['wf-guide', intType],
    queryFn: () => workforceApi.getGuide(intType),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: workforceApi.createIntegration,
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

  const reset = () => {
    setStep('form');
    setFields({});
    setLabel('');
    setIntType('hr_platform');
    setSubMode('');
  };

  const hasLabel = label.trim().length > 0;

  const handleSubmit = () => {
    const payload: Record<string, any> = {
      integration_type: intType,
      label,
      ...fields,
    };

    if (intType === 'hr_platform') {
      payload.platform = subMode;
    } else {
      payload.mode = subMode;
    }

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 gap-0 rounded-xl border-[#e5e7eb] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 shrink-0">
          <h2 className="text-[16px] font-semibold text-black">Add Workforce Integration</h2>
          <p className="text-[12px] text-black mt-0.5">Connect real data sources for accurate Scope 3 tracking</p>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {step === 'form' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Integration Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(INTEGRATIONS_META) as [IntegrationType, typeof INTEGRATIONS_META[string]][]).map(([key, m]) => (
                    <button
                      key={key}
                      onClick={() => { setIntType(key); setFields({}); }}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${intType === key
                        ? 'border-[#0f5c56] bg-[#e6f7f1]'
                        : 'border-[#e5e7eb] bg-white hover:border-gray-300'
                      }`}
                    >
                      <m.icon className={`h-5 w-5 ${intType === key ? 'text-[#0f5c56]' : 'text-gray-400'}`} />
                      <p className={`text-[11px] font-bold mt-1.5 ${intType === key ? 'text-[#0f5c56]' : 'text-gray-700'}`}>{m.label}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{m.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-mode / Platform */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {intType === 'hr_platform' ? 'Platform' : 'Connection Mode'}
                </label>
                <Select value={subMode} onValueChange={v => { setSubMode(v); setFields({}); }}>
                  <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {submodes.map(s => (
                      <SelectItem key={s.value} value={s.value} className="text-[12px]">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Display Label <span className="text-red-400 text-[9px]">*</span>
                </label>
                <Input
                  className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                  placeholder={
                    intType === 'hr_platform' ? 'BambooHR Prod'
                    : intType === 'building_energy' ? 'NYC Office Meter'
                    : 'Q1 2026 Commute Survey'
                  }
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                />
              </div>

              {/* Setup Guide */}
              {guide && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-blue-800 mb-1.5">Setup Guide</p>
                      <ol className="space-y-1">
                        {(guide as any).steps?.map((s: string, i: number) => (
                          <li key={i} className="text-[10px] text-blue-700 flex gap-1.5">
                            <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span> {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Credential Fields */}
              {activeSub && activeSub.fields.length > 0 && (
                <div className="space-y-3">
                  {activeSub.fields.map(fk => {
                    const fm = FIELD_LABELS[fk];
                    if (!fm) return null;
                    return (
                      <div key={fk} className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{fm.label}</label>
                        {fm.sensitive ? (
                          <SensitiveInput
                            value={fields[fk] || ''}
                            onChange={v => setFields({ ...fields, [fk]: v })}
                            placeholder={fm.placeholder}
                          />
                        ) : (
                          <Input
                            className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                            placeholder={fm.placeholder}
                            value={fields[fk] || ''}
                            onChange={e => setFields({ ...fields, [fk]: e.target.value })}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Security notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-800">
                  Credentials are encrypted at rest. Read-only access is sufficient for all integrations.
                </p>
              </div>
            </>
          )}

          {/* Result Step */}
          {step === 'result' && (
            <div className="space-y-3">
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
                  <p className="text-[11px] text-red-600 mt-1">
                    {createMutation.data?.data?.test_result?.message || 'Unable to verify endpoint'}
                  </p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full h-[32px] text-[12px]" onClick={() => setStep('form')}>
                ← Edit Credentials
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'result' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-[#e5e7eb] flex justify-between items-center shrink-0">
            <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]"
              onClick={() => { setOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
              disabled={!hasLabel || createMutation.isPending}
              onClick={handleSubmit}>
              {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
              Connect & Verify
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sync Dialog (for manual data entry on sync)
   ═══════════════════════════════════════════════════════════ */
function ManualSyncDialog({
  integration, month, year, onSynced, trigger,
}: {
  integration: IntegrationRecord; month: number; year: number; onSynced: () => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});

  const syncMutation = useMutation({
    mutationFn: workforceApi.syncIntegration,
    onSuccess: () => { onSynced(); setOpen(false); setParams({}); },
  });

  const isBuildingManual = integration.integration_type === 'building_energy';
  const isCommuteManual = integration.integration_type === 'commute_survey';

  const handleSync = () => {
    syncMutation.mutate({
      integration_id: integration.id,
      month,
      year,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, isNaN(Number(v)) ? v : Number(v)])
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-[#0f5c56]">Sync: {integration.label}</h2>
          <p className="text-[12px] text-gray-500 mt-1">
            {isBuildingManual
              ? "Enter this month's energy reading."
              : isCommuteManual
              ? 'Enter commute survey results.'
              : 'Pull latest data from the connected source.'}
          </p>
        </div>

        {/* Building Energy — manual kWh entry */}
        {isBuildingManual && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Energy Consumed (kWh) <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                placeholder="2400"
                value={params.energy_kwh || ''}
                onChange={e => setParams({ ...params, energy_kwh: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Period (days, optional)
              </label>
              <Input
                type="number"
                className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                placeholder="30"
                value={params.period_days || ''}
                onChange={e => setParams({ ...params, period_days: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Commute Survey — manual survey entry */}
        {isCommuteManual && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Respondents</label>
                <Input
                  type="number"
                  className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                  placeholder="80"
                  value={params.total_respondents || ''}
                  onChange={e => setParams({ ...params, total_respondents: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Avg Distance (km one-way)</label>
                <Input
                  type="number"
                  step="0.5"
                  className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                  placeholder="15"
                  value={params.avg_one_way_km || ''}
                  onChange={e => setParams({ ...params, avg_one_way_km: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Working Days / Month</label>
                <Input
                  type="number"
                  className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                  placeholder="22"
                  value={params.working_days_per_month || ''}
                  onChange={e => setParams({ ...params, working_days_per_month: e.target.value })}
                />
              </div>
              <div />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 pt-1">Transport Mode Split (%)</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['pct_car', 'Car'],
                ['pct_public_transit', 'Public Transit'],
                ['pct_bike', 'Bike / Walk'],
                ['pct_train', 'Train'],
              ].map(([key, lbl]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-500">{lbl}</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="h-[30px] text-[11px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono"
                    placeholder="0"
                    value={params[key] || ''}
                    onChange={e => setParams({ ...params, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Percentages should sum to 100. They&apos;ll be normalised automatically.</p>
          </div>
        )}

        {/* API-based integrations — just a confirmation */}
        {!isBuildingManual && !isCommuteManual && (
          <p className="text-[12px] text-gray-600">
            This will pull the latest data from the connected {integration.integration_type.replace('_', ' ')} endpoint.
          </p>
        )}

        {/* Sync error */}
        {syncMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <p className="text-[10px] text-red-600">Sync failed. Check credentials and try again.</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
            disabled={syncMutation.isPending || (isBuildingManual && !params.energy_kwh)}
            onClick={handleSync}
          >
            {syncMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Sync Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════ */
export default function WorkforcePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  /* ── Queries ── */
  const config = useQuery({ queryKey: ['wf-config'], queryFn: workforceApi.getConfig });
  const summary = useQuery({ queryKey: ['wf-summary', month, year], queryFn: () => workforceApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['wf-analytics', month, year], queryFn: () => workforceApi.getAnalytics(month, year) });
  const integrationsQuery = useQuery({ queryKey: ['wf-integrations'], queryFn: workforceApi.getIntegrations });

  /* ── State ── */
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

  /* ── Mutations ── */
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

  const deleteIntegrationMutation = useMutation({
    mutationFn: workforceApi.deleteIntegration,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wf-integrations'] }),
  });

  const syncAllMutation = useMutation({
    mutationFn: () => workforceApi.syncIntegration({ month, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wf-integrations'] });
      qc.invalidateQueries({ queryKey: ['wf-summary'] });
      qc.invalidateQueries({ queryKey: ['wf-analytics'] });
      qc.invalidateQueries({ queryKey: ['wf-config'] });
    },
  });

  /* ── Derived ── */
  const integrations: IntegrationRecord[] = integrationsQuery.data || [];
  const connectedIntegrations = integrations.filter(i => i.connection_status === 'connected');

  // If HR integration provides live data, use it
  const hrIntg = integrations.find(i => i.integration_type === 'hr_platform' && i.connection_status === 'connected');
  const effectiveEmployees = hrIntg?.last_total_employees ?? totalEmployees;
  const effectiveRemote = hrIntg?.last_remote_percentage ?? remotePct;

  const est = estimateWorkforceEmissions(effectiveEmployees, effectiveRemote, offices);
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
    calcMutation.mutate({
      total_employees: effectiveEmployees,
      remote_percentage: effectiveRemote,
      office_locations: offices,
      calculation_period: 'monthly',
      month,
      year,
    });
  };

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['wf-integrations'] });
    qc.invalidateQueries({ queryKey: ['wf-summary'] });
    qc.invalidateQueries({ queryKey: ['wf-analytics'] });
    qc.invalidateQueries({ queryKey: ['wf-config'] });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Workforce Footprint</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track Scope 3 emissions from employee activities, commuting & office energy</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            {connectedIntegrations.length > 0 && (
              <Button size="sm" variant="outline"
                className="h-[34px] text-[12px] rounded-md gap-1.5 border-[#0f5c56] text-[#0f5c56] hover:bg-[#e6f7f1]"
                onClick={() => syncAllMutation.mutate()}
                disabled={syncAllMutation.isPending}
              >
                {syncAllMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Sync All
              </Button>
            )}
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm"
              onClick={handleCalculate}
              disabled={effectiveEmployees === 0 || calcMutation.isPending}
            >
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* ── Alerts ── */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Workforce data processed and saved successfully.</p>
          </div>
        )}
        {syncAllMutation.isSuccess && syncAllMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">
              All integrations synced — {syncAllMutation.data.data?.synced || 0} sources updated.
            </p>
          </div>
        )}
        {calcMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[12px] text-red-600 font-medium">Failed to calculate emissions. Please try again.</p>
          </div>
        )}

        {/* ── Live Data Banner ── */}
        {hrIntg && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-4 w-4 text-violet-600" />
              <p className="text-[12px] text-violet-800 font-medium">
                HR data active — using <span className="font-bold">{effectiveEmployees}</span> employees,{' '}
                <span className="font-bold">{effectiveRemote}%</span> remote from {hrIntg.label}
              </p>
            </div>
            <span className="text-[8px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">LIVE</span>
          </div>
        )}

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'config', 'integrations'].map(tab => (
              <TabsTrigger key={tab} value={tab}
                className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Workforce Emissions', value: summary.data?.workforce_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Users },
                { label: 'This Month Estimate', value: est.total.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Live Integrations', value: connectedIntegrations.length, unit: `of ${integrations.length} configured`, icon: Wifi },
                { label: 'Headcount', value: effectiveEmployees, unit: `${effectiveRemote}% Remote`, icon: Home },
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

            {/* Chart + Pie */}
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              {/* Area Chart */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Historical Footprint
                </h2>
                <div className="h-[240px] w-full">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWF" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip
                          cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorWF)" />
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

              {/* Pie Chart */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Impact Sources</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center">
                  {est.total > 0 ? (
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
                          <div key={d.name} className="flex items-center justify-between border-b border-[#f0f1f5] pb-2 last:border-0">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                              <span className="text-[12px] font-semibold text-gray-700">{d.name}</span>
                            </div>
                            <span className="text-[13px] font-bold text-[#0f5c56]">
                              {d.value} <span className="text-[10px] font-normal text-gray-400">kg</span>
                            </span>
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

          {/* ═══════════ CONFIG TAB ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            {/* Workforce Details */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-[#0f5c56]" />
                <h2 className="text-[15px] font-semibold text-gray-900">Workforce Details</h2>
                {hrIntg && <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded ml-2">HR LINKED</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Employees</label>
                  <Input
                    type="number" min="0"
                    className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                    value={effectiveEmployees}
                    disabled={!!hrIntg}
                    onChange={e => { setTotalEmployees(+e.target.value); updateConfig(+e.target.value, remotePct, offices); }}
                  />
                  <p className="text-[11px] text-gray-500 mt-1">{hrIntg ? 'Managed by HR integration' : 'Full-time equivalents'}</p>
                </div>
                <div className="space-y-3 max-w-md">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Remote vs Office Split</label>
                    <span className="text-[12px] font-semibold text-[#0f5c56] bg-[#e6f7f1] px-2 py-0.5 rounded">{effectiveRemote}% Remote</span>
                  </div>
                  <Slider
                    min={0} max={100} step={5}
                    value={[effectiveRemote]}
                    disabled={!!hrIntg}
                    onValueChange={([v]) => { setRemotePct(v); updateConfig(totalEmployees, v, offices); }}
                    className="py-3"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>{est.officeCount} In-Office</span>
                    <span>{est.remoteCount} Remote</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Energy Topology */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Office Energy Topology</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage building size to compute location-based energy impact.</p>
                </div>
                <OfficeDialog
                  onSave={o => { const u = [...offices, o]; setOffices(u); updateConfig(totalEmployees, remotePct, u); }}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Office
                    </Button>
                  }
                />
              </div>
              <div className="p-5">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Location</span>
                  <span>Country</span>
                  <span>Size (m²)</span>
                  <span>Grid Impact</span>
                  <span className="text-right">Actions</span>
                </div>
                {/* Office Rows */}
                <div className="space-y-2">
                  {offices.length > 0 ? offices.map((o, i) => {
                    const factor = getOfficeFactor(o.country_code);
                    const bldgIntg = integrations.find(
                      ig => ig.integration_type === 'building_energy'
                        && ig.connection_status === 'connected'
                        && ig.label.toLowerCase().includes(o.name.toLowerCase())
                    );
                    return (
                      <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-gray-900">{o.name}</span>
                          {bldgIntg && (
                            <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">METERED</span>
                          )}
                        </div>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{o.country_code}</span>
                        <span className="text-[13px] font-semibold text-gray-900">{o.sqm.toLocaleString()}</span>
                        <div>
                          {bldgIntg?.last_energy_kwh != null ? (
                            <>
                              <p className="text-[13px] font-bold text-[#0f5c56]">{bldgIntg.last_energy_kwh.toFixed(0)} kWh/mo</p>
                              <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Live reading</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[13px] font-bold text-[#0f5c56]">{(o.sqm * factor).toFixed(2)} kg/mo</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{factor.toFixed(2)} kg/m² est.</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <OfficeDialog
                            initial={o}
                            onSave={updated => {
                              const u = offices.map((x, j) => j === i ? updated : x);
                              setOffices(u);
                              updateConfig(totalEmployees, remotePct, u);
                            }}
                            trigger={
                              <button className="p-1.5 text-gray-400 hover:text-[#0f5c56] transition-colors">
                                <Pencil className="h-4 w-4" />
                              </button>
                            }
                          />
                          <button
                            onClick={() => {
                              const u = offices.filter((_, j) => j !== i);
                              setOffices(u);
                              updateConfig(totalEmployees, remotePct, u);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No office locations mapped. Add one to calculate location-based energy impact.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 flex items-start gap-4">
              <Info className="h-5 w-5 text-[#0f5c56] shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-gray-900">Emissions Methodology</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Per Employee Fixed Estimates</p>
                    <ul className="space-y-1.5">
                      <li className="text-[12px] text-gray-600 flex justify-between max-w-[240px]">
                        <span>Remote (Energy)</span>
                        <span className="font-mono font-medium">{REMOTE_FACTOR_KG_PER_EMPLOYEE_MONTH} kg/mo</span>
                      </li>
                      <li className="text-[12px] text-gray-600 flex justify-between max-w-[240px]">
                        <span>Commuting (Avg)</span>
                        <span className="font-mono font-medium">{COMMUTE_FACTOR_KG_PER_EMPLOYEE_MONTH} kg/mo</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">With Integrations</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      HR integrations replace estimated headcount with live data. Building energy meters replace area-based
                      estimates with real kWh readings. Commute surveys replace per-employee averages with actual mode/distance data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ INTEGRATIONS TAB ═══════════ */}
          <TabsContent value="integrations" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Workforce Integrations</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Connect HR, building energy, or commute data for real-time accuracy.
                  </p>
                </div>
                <IntegrationDialog
                  onSaved={() => qc.invalidateQueries({ queryKey: ['wf-integrations'] })}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Add Integration
                    </Button>
                  }
                />
              </div>

              {/* Integration List */}
              <div className="p-5">
                {integrationsQuery.isLoading ? (
                  <div className="py-12 flex flex-col items-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-[12px]">Loading…</p>
                  </div>
                ) : integrations.length > 0 ? (
                  <div className="space-y-3">
                    {integrations.map(intg => {
                      const meta = INTEGRATIONS_META[intg.integration_type as IntegrationType];
                      const IconComp = meta?.icon || Users;
                      return (
                        <div key={intg.id} className="rounded-xl border border-[#e5e7eb] bg-white hover:border-[#0f5c56]/30 transition-colors overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div
                                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: (meta?.color || '#6b7280') + '15' }}
                                >
                                  <IconComp className="h-5 w-5" style={{ color: meta?.color || '#6b7280' }} />
                                </div>
                                {/* Info */}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-[14px] font-bold text-gray-900">{intg.label}</h3>
                                    <StatusBadge status={intg.connection_status} />
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-0.5">{meta?.label}</p>

                                  {/* Metrics Row */}
                                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                                    {intg.last_total_employees != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <Users className="h-3 w-3" /> Headcount
                                        </p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_total_employees}</p>
                                      </div>
                                    )}
                                    {intg.last_remote_percentage != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Remote</p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_remote_percentage}%</p>
                                      </div>
                                    )}
                                    {intg.last_energy_kwh != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <Zap className="h-3 w-3" /> Energy
                                        </p>
                                        <p className="text-[14px] font-bold text-[#0f5c56]">{intg.last_energy_kwh.toFixed(0)} kWh</p>
                                      </div>
                                    )}
                                    {intg.last_power_watts != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Power</p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_power_watts.toFixed(0)}W</p>
                                      </div>
                                    )}
                                    {intg.last_commute_emissions_kg != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                          <Car className="h-3 w-3" /> Commute
                                        </p>
                                        <p className="text-[14px] font-bold text-[#0f5c56]">{intg.last_commute_emissions_kg.toFixed(1)} kg</p>
                                      </div>
                                    )}
                                    {intg.last_avg_commute_km != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Dist</p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_avg_commute_km} km</p>
                                      </div>
                                    )}
                                    {intg.last_respondents != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Responses</p>
                                        <p className="text-[14px] font-bold text-gray-900">{intg.last_respondents}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Timestamps */}
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
                                <ManualSyncDialog
                                  integration={intg}
                                  month={month}
                                  year={year}
                                  onSynced={invalidateAll}
                                  trigger={
                                    <Button variant="outline" size="sm"
                                      className="h-[30px] text-[11px] rounded-md gap-1 border-[#0f5c56]/30 text-[#0f5c56] hover:bg-[#e6f7f1]">
                                      <RefreshCw className="h-3 w-3" /> Sync
                                    </Button>
                                  }
                                />
                                <button
                                  onClick={() => deleteIntegrationMutation.mutate(intg.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="bg-gray-50 border-t border-[#f0f1f5] px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              {intg.integration_type.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {intg.integration_type === 'hr_platform'
                                ? 'Updates headcount & remote split automatically'
                                : intg.integration_type === 'building_energy'
                                ? 'Replaces area estimates with real kWh'
                                : 'Real commute mode & distance data'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                    <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-semibold text-gray-600">No workforce integrations</p>
                    <p className="text-[12px] text-gray-400 mt-1 max-w-[380px] mx-auto">
                      Connect your HR system for live headcount, building meters for real energy data,
                      or commute surveys for transport emissions.
                    </p>
                    <IntegrationDialog
                      onSaved={() => qc.invalidateQueries({ queryKey: ['wf-integrations'] })}
                      trigger={
                        <Button size="sm" className="mt-4 h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5">
                          <Plus className="h-3.5 w-3.5" /> Add First Integration
                        </Button>
                      }
                    />
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