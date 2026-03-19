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
  Plus, Trash2, Settings, Pencil, Activity, Database,
  RefreshCw, Wifi, WifiOff, Eye, EyeOff, HelpCircle,
  Zap, FileText, Link2, Shield,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════
   API Layer
   ═══════════════════════════════════════════════════════════ */
const cdnApi = {
  // Legacy config-based
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/configure/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/cdn/', payload).then(r => r.data),

  // Reports
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
  getEmissionFactors: () =>
    api.get('/web/emission-factors/').then(r => r.data.data),

  // New API-based CDN connections
  getConnections: () => api.get('/web/cdn/connect/').then(r => r.data.data),
  createConnection: (payload: any) => api.post('/web/cdn/connect/', payload).then(r => r.data),
  deleteConnection: (id: string) => api.delete('/web/cdn/connect/', { data: { connection_id: id } }).then(r => r.data),
  syncConnection: (payload: any) => api.post('/web/cdn/sync/', payload).then(r => r.data),
  getGuide: (provider?: string) =>
    api.get('/web/cdn/guide/', { params: provider ? { provider } : {} }).then(r => r.data.data),
};

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */
interface CDNConnectionAPI {
  id: string;
  provider: string;
  connection_type: string;
  connection_status: string;
  monthly_gb_transferred: number | null;
  regions: string[];
  last_sync_at: string | null;
  last_sync_error: string | null;
  sync_enabled: boolean;
  cache_hit_ratio: number | null;
  last_fetched_gb: number | null;
  created_at: string;
}

interface CDNFactor {
  provider: string;
  region: string;
  factor_kg_per_gb: number;
  unit: string;
}

interface ProviderGuide {
  provider: string;
  name: string;
  steps: string[];
  required_fields: string[];
  optional_fields: string[];
  docs_url: string;
}

type ConnectionType = 'manual' | 'api_token';

/* ═══════════════════════════════════════════════════════════
   Provider Metadata
   ═══════════════════════════════════════════════════════════ */
const PROVIDERS: Record<string, { label: string; icon: string; color: string; apiSupported: boolean }> = {
  cloudflare: { label: 'Cloudflare', icon: '⚡', color: '#f48120', apiSupported: true },
  aws_cloudfront: { label: 'AWS CloudFront', icon: '☁️', color: '#ff9900', apiSupported: true },
  akamai: { label: 'Akamai', icon: '🌐', color: '#009bdb', apiSupported: true },
  fastly: { label: 'Fastly', icon: '🚀', color: '#ff282d', apiSupported: true },
  generic: { label: 'Generic / Other', icon: '📡', color: '#6b7280', apiSupported: false },
};

const FIELD_LABELS: Record<string, { label: string; placeholder: string; sensitive: boolean }> = {
  cloudflare_api_token: { label: 'API Token', placeholder: 'Enter Cloudflare API token', sensitive: true },
  cloudflare_zone_id: { label: 'Zone ID', placeholder: '32-character zone identifier', sensitive: false },
  cloudflare_account_id: { label: 'Account ID (optional)', placeholder: 'Account identifier', sensitive: false },
  aws_distribution_id: { label: 'Distribution ID', placeholder: 'E1234567890ABC', sensitive: false },
  aws_role_arn: { label: 'IAM Role ARN', placeholder: 'arn:aws:iam::123456789012:role/CarbonCutCDN', sensitive: false },
  aws_external_id: { label: 'External ID (optional)', placeholder: 'External ID for assume role', sensitive: false },
  aws_access_key_id: { label: 'Access Key ID', placeholder: 'AKIA...', sensitive: false },
  aws_secret_access_key_ref: { label: 'Secret Access Key', placeholder: 'Enter secret access key', sensitive: true },
  akamai_client_token: { label: 'Client Token', placeholder: 'akab-xxxxx', sensitive: false },
  akamai_client_secret_ref: { label: 'Client Secret', placeholder: 'Enter client secret', sensitive: true },
  akamai_access_token: { label: 'Access Token', placeholder: 'akab-xxxxx', sensitive: true },
  akamai_host: { label: 'Host', placeholder: 'akab-xxxxx.luna.akamaiapis.net', sensitive: false },
  akamai_cp_code: { label: 'CP Code (optional)', placeholder: '123456', sensitive: false },
  fastly_api_token: { label: 'API Token', placeholder: 'Enter Fastly API token', sensitive: true },
  fastly_service_id: { label: 'Service ID', placeholder: 'Service identifier', sensitive: false },
};

const PROVIDER_FIELDS: Record<string, { required: string[]; optional: string[] }> = {
  cloudflare: {
    required: ['cloudflare_api_token', 'cloudflare_zone_id'],
    optional: ['cloudflare_account_id'],
  },
  aws_cloudfront: {
    required: ['aws_distribution_id'],
    optional: ['aws_role_arn', 'aws_external_id', 'aws_access_key_id', 'aws_secret_access_key_ref'],
  },
  akamai: {
    required: ['akamai_client_token', 'akamai_client_secret_ref', 'akamai_access_token', 'akamai_host'],
    optional: ['akamai_cp_code'],
  },
  fastly: {
    required: ['fastly_api_token', 'fastly_service_id'],
    optional: [],
  },
};

/* ═══════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════ */
function useDynamicCDNFactor(provider: string, region: string) {
  const { data: factorsData } = useQuery({
    queryKey: ['emission-factors'],
    queryFn: cdnApi.getEmissionFactors,
    staleTime: 1000 * 60 * 60,
  });
  let factor = 0.00030;
  if (factorsData?.cdn_factors && Array.isArray(factorsData.cdn_factors)) {
    const match = factorsData.cdn_factors.find(
      (f: CDNFactor) => f.provider.toLowerCase() === provider.toLowerCase() && f.region === region,
    );
    if (match) factor = match.factor_kg_per_gb;
  }
  return factor;
}

/* ═══════════════════════════════════════════════════════════
   Status Badge
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

/* ═══════════════════════════════════════════════════════════
   Sensitive Input
   ═══════════════════════════════════════════════════════════ */
function SensitiveInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
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
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CDN Connection Dialog — supports Manual + API
   ═══════════════════════════════════════════════════════════ */
function CDNConnectionDialog({
  existingConnection,
  onSaved,
  trigger,
}: {
  existingConnection?: CDNConnectionAPI;
  onSaved: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(existingConnection?.provider || 'cloudflare');
  const [connectionType, setConnectionType] = useState<ConnectionType>(
    (existingConnection?.connection_type as ConnectionType) || 'manual',
  );
  const [fields, setFields] = useState<Record<string, string>>({});
  const [manualGB, setManualGB] = useState(existingConnection?.monthly_gb_transferred || 0);
  const [region, setRegion] = useState(existingConnection?.regions?.[0] || 'WORLD');
  const [step, setStep] = useState<'type' | 'credentials' | 'result'>('type');

  const providerMeta = PROVIDERS[provider];
  const factor = useDynamicCDNFactor(provider, region);

  const { data: guide } = useQuery({
    queryKey: ['cdn-guide', provider],
    queryFn: () => cdnApi.getGuide(provider),
    enabled: open && connectionType === 'api_token' && provider !== 'generic',
  });

  const createMutation = useMutation({
    mutationFn: cdnApi.createConnection,
    onSuccess: (data) => {
      if (data.success) {
        const testResult = data.data?.test_result;
        if (connectionType === 'api_token' && testResult && !testResult.success) {
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
    setStep('type');
    setFields({});
    setManualGB(0);
    setRegion('WORLD');
  };

  const handleSubmit = () => {
    const payload: any = {
      provider,
      connection_type: connectionType,
      regions: [region],
      ...fields,
    };
    if (connectionType === 'manual') {
      payload.monthly_gb_transferred = manualGB;
    }
    createMutation.mutate(payload);
  };

  const allProviderFields = PROVIDER_FIELDS[provider];
  const requiredFilled =
    connectionType === 'manual'
      ? manualGB > 0
      : allProviderFields
        ? allProviderFields.required.every(f => (fields[f] || '').trim().length > 0)
        : true;

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-xl border border-[#e5e7eb] shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header - Updated to match ProviderDialog design */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] shrink-0">
          <h2 className="text-[15px] font-semibold text-[#0f5c56]">
            {existingConnection ? 'Update' : 'Add'} CDN Connection
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Connect your CDN provider for accurate emission tracking.
          </p>
        </div>

        {/* Scrollable Body Container */}
        <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
          {/* Provider Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Provider</label>
            <Select
              value={provider}
              onValueChange={v => {
                setProvider(v);
                setFields({});
                if (!PROVIDERS[v]?.apiSupported) setConnectionType('manual');
              }}
            >
              <SelectTrigger className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROVIDERS).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-[12px]">
                    <span className="flex items-center gap-2">
                      <span>{v.icon}</span> {v.label}
                      {v.apiSupported && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">
                          API
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Connection Type */}
          {providerMeta?.apiSupported && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Connection Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setConnectionType('manual'); setStep('type'); }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    connectionType === 'manual'
                      ? 'border-[#0f5c56] bg-[#e6f7f1]'
                      : 'border-[#e5e7eb] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className={`h-4 w-4 ${connectionType === 'manual' ? 'text-[#0f5c56]' : 'text-gray-400'}`} />
                    <span className={`text-[12px] font-bold ${connectionType === 'manual' ? 'text-[#0f5c56]' : 'text-gray-700'}`}>
                      Manual
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Enter monthly data transfer volume</p>
                </button>

                <button
                  onClick={() => { setConnectionType('api_token'); setStep('credentials'); }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    connectionType === 'api_token'
                      ? 'border-[#0f5c56] bg-[#e6f7f1]'
                      : 'border-[#e5e7eb] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className={`h-4 w-4 ${connectionType === 'api_token' ? 'text-[#0f5c56]' : 'text-gray-400'}`} />
                    <span className={`text-[12px] font-bold ${connectionType === 'api_token' ? 'text-[#0f5c56]' : 'text-gray-700'}`}>
                      API Connect
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Auto-fetch real bandwidth data</p>
                </button>
              </div>
            </div>
          )}

          {/* ── Manual Fields ───────────────── */}
          {connectionType === 'manual' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Monthly Transfer (GB)
                </label>
                <Input
                  className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={manualGB || ''}
                  onChange={e => setManualGB(+e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Region</label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
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

              {/* Estimation Block - Updated to match ProviderDialog */}
              <div className="bg-[#e6f7f1] rounded-md p-3 border border-[#24d18f]/30 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#0f5c56]/70">Est. Impact</p>
                  <p className="text-[10px] text-[#0f5c56] mt-0.5 font-mono">{factor.toFixed(6)} kg/GB</p>
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-bold text-[#0f5c56]">
                    {(manualGB * factor).toFixed(2)} <span className="text-[10px] font-medium text-[#0f5c56]/70">kg CO₂</span>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ── API Credential Fields ───────── */}
          {connectionType === 'api_token' && step === 'credentials' && (
            <>
              {/* Setup Guide */}
              {guide && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-blue-800 mb-1.5">Setup Guide</p>
                      <ol className="space-y-1">
                        {(guide as ProviderGuide).steps.map((s: string, i: number) => (
                          <li key={i} className="text-[10px] text-blue-700 flex gap-1.5">
                            <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                      {(guide as ProviderGuide).docs_url && (
                        <a
                          href={(guide as ProviderGuide).docs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 underline mt-2 inline-block"
                        >
                          View documentation →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Credential Fields */}
              {allProviderFields && (
                <div className="space-y-4">
                  {/* Required */}
                  {allProviderFields.required.map(fieldKey => {
                    const meta = FIELD_LABELS[fieldKey];
                    if (!meta) return null;
                    return (
                      <div key={fieldKey} className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          {meta.label}
                          <span className="text-red-400 text-[9px]">*</span>
                        </label>
                        {meta.sensitive ? (
                          <SensitiveInput
                            value={fields[fieldKey] || ''}
                            onChange={v => setFields({ ...fields, [fieldKey]: v })}
                            placeholder={meta.placeholder}
                            // @ts-ignore
                            className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]"
                          />
                        ) : (
                          <Input
                            className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56] font-mono"
                            placeholder={meta.placeholder}
                            value={fields[fieldKey] || ''}
                            onChange={e => setFields({ ...fields, [fieldKey]: e.target.value })}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Optional */}
                  {allProviderFields.optional.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optional</span>
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                      </div>
                      {allProviderFields.optional.map(fieldKey => {
                        const meta = FIELD_LABELS[fieldKey];
                        if (!meta) return null;
                        return (
                          <div key={fieldKey} className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              {meta.label}
                            </label>
                            {meta.sensitive ? (
                              <SensitiveInput
                                value={fields[fieldKey] || ''}
                                onChange={v => setFields({ ...fields, [fieldKey]: v })}
                                placeholder={meta.placeholder}
                                // @ts-ignore
                                className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56]"
                              />
                            ) : (
                              <Input
                                className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] focus:ring-1 focus:ring-[#0f5c56] font-mono"
                                placeholder={meta.placeholder}
                                value={fields[fieldKey] || ''}
                                onChange={e => setFields({ ...fields, [fieldKey]: e.target.value })}
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
                  Credentials are encrypted and used only to fetch bandwidth metrics. Read-only access is sufficient.
                </p>
              </div>
            </>
          )}

          {/* ── Test Result ─────────────────── */}
          {step === 'result' && (
            <div className="space-y-3 pb-2">
              {createMutation.data?.data?.test_result?.success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-emerald-800">Connection Verified</p>
                  <p className="text-[11px] text-emerald-600 mt-1">
                    {createMutation.data.data.test_result.message}
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-red-800">Connection Failed</p>
                  <p className="text-[11px] text-red-600 mt-1">
                    {createMutation.data?.data?.test_result?.message || 'Unable to verify credentials'}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full h-[34px] text-[12px] rounded-md border-[#e5e7eb]"
                onClick={() => setStep('credentials')}
              >
                ← Edit Credentials
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Updated to match ProviderDialog styling & right-aligned flow */}
        {step !== 'result' && (
          <div className="px-6 py-3.5 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"
              onClick={() => { setOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
              disabled={!requiredFilled || createMutation.isPending}
              onClick={handleSubmit}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : connectionType === 'api_token' ? (
                <Link2 className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {connectionType === 'api_token' ? 'Connect & Verify' : 'Save Source'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════ */
export default function CDNPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  /* ── Queries ──────────────────────────────────────────── */
  const { data: factorsData } = useQuery({
    queryKey: ['emission-factors'],
    queryFn: cdnApi.getEmissionFactors,
    staleTime: 1000 * 60 * 60,
  });

  const connectionsQuery = useQuery({
    queryKey: ['cdn-connections'],
    queryFn: cdnApi.getConnections,
  });

  const summary = useQuery({
    queryKey: ['cdn-summary', month, year],
    queryFn: () => cdnApi.getSummary(month, year),
  });

  const analytics = useQuery({
    queryKey: ['cdn-analytics', month, year],
    queryFn: () => cdnApi.getAnalytics(month, year),
  });

  /* ── Mutations ────────────────────────────────────────── */
  const deleteMutation = useMutation({
    mutationFn: cdnApi.deleteConnection,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cdn-connections'] }),
  });

  const syncMutation = useMutation({
    mutationFn: cdnApi.syncConnection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cdn-connections'] });
      qc.invalidateQueries({ queryKey: ['cdn-summary'] });
      qc.invalidateQueries({ queryKey: ['cdn-analytics'] });
    },
  });

  const syncAllMutation = useMutation({
    mutationFn: () => cdnApi.syncConnection({ month, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cdn-connections'] });
      qc.invalidateQueries({ queryKey: ['cdn-summary'] });
      qc.invalidateQueries({ queryKey: ['cdn-analytics'] });
    },
  });

  /* ── Derived Data ─────────────────────────────────────── */
  const connections: CDNConnectionAPI[] = connectionsQuery.data || [];
  const cdnFactors: CDNFactor[] = factorsData?.cdn_factors || [];

  const apiConnections = connections.filter(c => c.connection_type !== 'manual');
  const manualConnections = connections.filter(c => c.connection_type === 'manual');

  const breakdown = connections.map(c => {
    const gb = c.monthly_gb_transferred || 0;
    const region = c.regions?.[0] || 'WORLD';
    const match = cdnFactors.find(
      f => f.provider.toLowerCase() === c.provider.toLowerCase() && f.region === region,
    );
    const factor = match ? match.factor_kg_per_gb : 0.00030;
    const prov = PROVIDERS[c.provider];
    return {
      id: c.id,
      name: prov?.label || c.provider,
      icon: prov?.icon || '📡',
      region,
      gb,
      factor,
      emissions: gb * factor,
      type: c.connection_type,
      status: c.connection_status,
      cacheHit: c.cache_hit_ratio,
    };
  });

  const totalEstimated = breakdown.reduce((a, b) => a + b.emissions, 0);

  const trendData =
    analytics.data?.monthly_trend?.map((d: any) => ({
      month: d.month_name || d.month,
      emissions: d.cdn_kg || d.total_kg / 1000 || 0,
    })) || [];

  const actualCDNEmissions =
    summary.data?.by_source?.find(
      (s: any) => s.source === 'cdn' || s.source === 'cdn_data_transfer',
    )?.emissions_kg || 0;

  const connectedCount = connections.filter(c => c.connection_status === 'connected').length;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">CDN Data Transfer</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track emissions from content delivery networks</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
            {apiConnections.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-[34px] text-[12px] rounded-md gap-1.5 border-[#0f5c56] text-[#0f5c56] hover:bg-[#e6f7f1]"
                onClick={() => syncAllMutation.mutate()}
                disabled={syncAllMutation.isPending}
              >
                {syncAllMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Sync All
              </Button>
            )}
          </div>
        </div>

        {/* ── Alerts ───────────────────────────────────────── */}
        {syncAllMutation.isSuccess && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">
              All CDN sources synced successfully.
            </p>
          </div>
        )}
        {syncMutation.isSuccess && syncMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">
              CDN data synced — {syncMutation.data.data?.bandwidth_gb?.toFixed(2)} GB transferred,{' '}
              {syncMutation.data.data?.emissions_kg?.toFixed(4)} kg CO₂
            </p>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            {['overview', 'connections'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
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
                { label: 'API Connected', value: connectedCount, unit: `of ${connections.length}`, icon: Wifi },
                { label: 'Data Accuracy', value: apiConnections.length > 0 ? 'High' : 'Estimated', unit: apiConnections.length > 0 ? 'API-based' : 'Manual entry', icon: Shield },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 relative overflow-hidden group hover:border-[#24d18f]/50 transition-colors"
                >
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
                          <linearGradient id="colorCDN" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#24d18f" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#24d18f" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip
                          cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorCDN)" />
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
                  <h2 className="text-[14px] font-semibold text-white">By Provider</h2>
                  <span className="text-[11px] font-medium text-[#24d18f]">Emissions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-0">
                  {breakdown.length > 0 ? (
                    breakdown.map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0f1f5] last:border-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[16px]">{b.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-[13px] font-bold text-gray-900">{b.name}</p>
                              {b.type !== 'manual' && (
                                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                                  API
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                              {b.region} • {b.gb.toLocaleString()} GB
                              {b.cacheHit != null && ` • ${b.cacheHit.toFixed(0)}% cache`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-[#0f5c56]">
                            {b.emissions.toFixed(1)}{' '}
                            <span className="text-[10px] font-normal text-gray-500">kg</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-gray-400 text-center mt-6">No CDN sources configured.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ CONNECTIONS ═══════════ */}
          <TabsContent value="connections" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              {/* Section Header */}
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">CDN Connections</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Connect via API for real-time data or enter volumes manually.
                  </p>
                </div>
                <CDNConnectionDialog
                  onSaved={() => qc.invalidateQueries({ queryKey: ['cdn-connections'] })}
                  trigger={
                    <Button
                      size="sm"
                      className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Connection
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                {connectionsQuery.isLoading ? (
                  <div className="py-12 flex flex-col items-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-[12px]">Loading connections…</p>
                  </div>
                ) : connections.length > 0 ? (
                  <div className="space-y-3">
                    {connections.map(c => {
                      const prov = PROVIDERS[c.provider];
                      const gb = c.monthly_gb_transferred || 0;
                      const region = c.regions?.[0] || 'WORLD';
                      const match = cdnFactors.find(
                        f => f.provider.toLowerCase() === c.provider.toLowerCase() && f.region === region,
                      );
                      const factor = match ? match.factor_kg_per_gb : 0.00030;
                      const est = gb * factor;
                      const isAPI = c.connection_type !== 'manual';

                      return (
                        <div
                          key={c.id}
                          className="rounded-xl border border-[#e5e7eb] bg-white hover:border-[#0f5c56]/30 transition-colors overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              {/* Left: Provider Info */}
                              <div className="flex items-start gap-3">
                                <div
                                  className="h-10 w-10 rounded-lg flex items-center justify-center text-[18px] shrink-0"
                                  style={{ backgroundColor: (prov?.color || '#6b7280') + '15' }}
                                >
                                  {prov?.icon || '📡'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-[14px] font-bold text-gray-900">{prov?.label || c.provider}</h3>
                                    <StatusBadge status={c.connection_status} />
                                    {isAPI && (
                                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                        API
                                      </span>
                                    )}
                                    {!isAPI && (
                                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                        MANUAL
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 mt-2">
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">Bandwidth</p>
                                      <p className="text-[14px] font-bold text-gray-900">{gb.toLocaleString()} GB</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">Region</p>
                                      <p className="text-[12px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                        {region}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">Emissions</p>
                                      <p className="text-[14px] font-bold text-[#0f5c56]">
                                        {est.toFixed(2)} <span className="text-[10px] font-normal text-gray-500">kg</span>
                                      </p>
                                    </div>
                                    {c.cache_hit_ratio != null && (
                                      <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Cache Hit</p>
                                        <p className="text-[14px] font-bold text-blue-600">{c.cache_hit_ratio.toFixed(1)}%</p>
                                      </div>
                                    )}
                                  </div>

                                  {c.last_sync_at && (
                                    <p className="text-[10px] text-gray-400 mt-2">
                                      Last synced: {new Date(c.last_sync_at).toLocaleString()}
                                    </p>
                                  )}
                                  {c.last_sync_error && c.connection_status === 'error' && (
                                    <p className="text-[10px] text-red-500 mt-1 truncate max-w-[400px]">
                                      Error: {c.last_sync_error}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                {isAPI && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-[30px] text-[11px] rounded-md gap-1 border-[#0f5c56]/30 text-[#0f5c56] hover:bg-[#e6f7f1]"
                                    disabled={syncMutation.isPending}
                                    onClick={() =>
                                      syncMutation.mutate({
                                        connection_id: c.id,
                                        month,
                                        year,
                                      })
                                    }
                                  >
                                    {syncMutation.isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <RefreshCw className="h-3 w-3" />
                                    )}
                                    Sync
                                  </Button>
                                )}
                                <button
                                  onClick={() => deleteMutation.mutate(c.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Remove connection"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Factor bar */}
                          <div className="bg-gray-50 border-t border-[#f0f1f5] px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-mono">
                              Factor: {factor.toFixed(6)} kg/GB
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {isAPI ? 'High accuracy (API data)' : 'Estimated (manual entry)'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                    <Globe className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-semibold text-gray-600">No CDN sources connected</p>
                    <p className="text-[12px] text-gray-400 mt-1 max-w-[320px] mx-auto">
                      Connect your CDN provider via API for real-time bandwidth metrics, or add sources manually.
                    </p>
                    <CDNConnectionDialog
                      onSaved={() => qc.invalidateQueries({ queryKey: ['cdn-connections'] })}
                      trigger={
                        <Button
                          size="sm"
                          className="mt-4 h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add First Connection
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