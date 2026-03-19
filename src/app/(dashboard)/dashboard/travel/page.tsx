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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plane, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  TrendingDown, Settings, Info, Pencil, Train, Car, Hotel,
  Activity, MapPin, RefreshCw, Wifi, WifiOff, Eye, EyeOff,
  HelpCircle, Shield, Link2, CreditCard, Calendar, Briefcase,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════
   API Layer
   ═══════════════════════════════════════════════════════════ */
const travelApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/travel/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),

  // Integrations
  getIntegrations: () => api.get('/web/travel/integrations/').then(r => r.data.data),
  createIntegration: (payload: any) => api.post('/web/travel/integrations/', payload).then(r => r.data),
  deleteIntegration: (id: string) =>
    api.delete('/web/travel/integrations/', { data: { integration_id: id } }).then(r => r.data),
  syncIntegration: (payload: any) => api.post('/web/travel/sync/', payload).then(r => r.data),
  getGuide: (type?: string) =>
    api.get('/web/travel/guide/', { params: type ? { integration_type: type } : {} }).then(r => r.data.data),
};

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */
const TRAVEL_FACTORS: Record<string, number> = {
  flight_domestic: 0.255, flight_intl_economy: 0.195, flight_intl_premium_economy: 0.293,
  flight_intl_business: 0.585, flight_intl_first: 0.975,
  rail_electric: 0.041, rail_diesel: 0.065,
  car_petrol: 0.192, car_diesel: 0.171, car_hybrid: 0.109, car_electric: 0.053,
  bus: 0.089, taxi: 0.211, motorcycle: 0.113,
  hotel_avg: 30.0, hotel_luxury: 72.0, hotel_budget: 18.0,
};
const FLIGHT_RF = 1.9;

// ── Integration metadata ────────────────────────────────────
const INTEGRATION_TYPE_META: Record<string, {
  label: string; icon: React.ReactNode; color: string; description: string;
  platforms: Record<string, { label: string; description: string }>;
}> = {
  expense_platform: {
    label: 'Expense Platform',
    icon: <CreditCard className="h-5 w-5" />,
    color: '#0f5c56',
    description: 'Pull travel spend from SAP Concur, Brex, or Navan',
    platforms: {
      concur: { label: 'SAP Concur', description: 'OAuth2 client credentials' },
      brex: { label: 'Brex', description: 'API key authentication' },
      navan: { label: 'Navan (TripActions)', description: 'API key authentication' },
      generic_rest: { label: 'Generic REST', description: 'Any REST endpoint' },
    },
  },
  tmc_booking: {
    label: 'TMC / Booking Tool',
    icon: <Briefcase className="h-5 w-5" />,
    color: '#2563eb',
    description: 'Pull booked trips from Egencia, CWT, or custom tool',
    platforms: {
      egencia: { label: 'Egencia / Amex GBT', description: 'OAuth2 client credentials' },
      cwt: { label: 'CWT (Carlson Wagonlit)', description: 'API key authentication' },
      generic_rest: { label: 'Generic REST', description: 'Any REST endpoint' },
    },
  },
  calendar_travel: {
    label: 'Calendar',
    icon: <Calendar className="h-5 w-5" />,
    color: '#7c3aed',
    description: 'Infer travel from Google or Outlook calendar events',
    platforms: {
      google: { label: 'Google Calendar', description: 'OAuth2 / Service Account' },
      outlook: { label: 'Microsoft Outlook', description: 'Azure AD OAuth2' },
      manual: { label: 'Manual Entry', description: 'Submit trip data at sync time' },
    },
  },
};

// ── Credential fields per platform ─────────────────────────
const PLATFORM_FIELDS: Record<string, { required: string[]; optional: string[] }> = {
  concur: { required: ['client_id', 'client_secret'], optional: [] },
  brex: { required: ['api_key'], optional: [] },
  navan: { required: ['api_key'], optional: [] },
  generic_rest: { required: ['api_url'], optional: ['bearer_token', 'api_key'] },
  egencia: { required: ['client_id', 'client_secret'], optional: [] },
  cwt: { required: ['api_key'], optional: [] },
  google: { required: ['client_id', 'client_secret', 'refresh_token'], optional: ['calendar_id', 'service_account_json'] },
  outlook: { required: ['tenant_id', 'client_id', 'client_secret'], optional: ['user_email'] },
  manual: { required: [], optional: [] },
};

const FIELD_LABELS: Record<string, { label: string; placeholder: string; sensitive: boolean; multiline?: boolean }> = {
  client_id: { label: 'Client ID', placeholder: 'OAuth2 Client ID', sensitive: false },
  client_secret: { label: 'Client Secret', placeholder: 'OAuth2 Client Secret', sensitive: true },
  api_key: { label: 'API Key', placeholder: 'Enter API key', sensitive: true },
  api_url: { label: 'API Endpoint URL', placeholder: 'https://api.example.com/trips', sensitive: false },
  bearer_token: { label: 'Bearer Token', placeholder: 'Enter bearer token', sensitive: true },
  refresh_token: { label: 'OAuth2 Refresh Token', placeholder: 'Enter refresh token', sensitive: true },
  calendar_id: { label: 'Calendar ID (optional)', placeholder: 'primary', sensitive: false },
  service_account_json: { label: 'Service Account JSON (optional)', placeholder: '{"type":"service_account",...}', sensitive: true, multiline: true },
  tenant_id: { label: 'Azure Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', sensitive: false },
  user_email: { label: 'User Email (optional)', placeholder: 'user@company.com', sensitive: false },
};

const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa', '#f59e0b'];

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */
interface Trip {
  travel_type: 'flight' | 'rail' | 'road' | 'accommodation';
  distance_km: number;
  passenger_count: number;
  flight_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  is_domestic?: boolean;
  vehicle_type?: string;
  nights?: number;
}

interface TravelIntegrationRecord {
  id: string;
  label: string;
  integration_type: string;
  connection_status: string;
  sync_enabled: boolean;
  last_sync_at: string | null;
  last_sync_error: string | null;
  last_trip_count: number | null;
  last_total_distance_km: number | null;
  last_total_emissions_kg: number | null;
  last_flight_count: number | null;
  last_hotel_nights: number | null;
  created_at: string;
}

const DEFAULT_TRIP: Trip = { travel_type: 'flight', distance_km: 1500, passenger_count: 1, flight_class: 'economy', is_domestic: false };

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */
function getTravelFactor(travelType: string, subtype?: string): number {
  if (travelType === 'flight') return TRAVEL_FACTORS[subtype || 'flight_intl_economy'] || TRAVEL_FACTORS.flight_intl_economy;
  if (travelType === 'rail') return TRAVEL_FACTORS[subtype || 'rail_electric'] || TRAVEL_FACTORS.rail_electric;
  if (travelType === 'road') return TRAVEL_FACTORS[subtype || 'car_petrol'] || TRAVEL_FACTORS.car_petrol;
  if (travelType === 'accommodation') return TRAVEL_FACTORS[subtype || 'hotel_avg'] || TRAVEL_FACTORS.hotel_avg;
  return 0;
}

function estimateTripEmissions(trip: Trip): number {
  if (trip.travel_type === 'flight') {
    const factorKey = trip.is_domestic ? 'flight_domestic' : `flight_intl_${trip.flight_class}`;
    return +(trip.distance_km * getTravelFactor('flight', factorKey) * trip.passenger_count * FLIGHT_RF).toFixed(3);
  }
  if (trip.travel_type === 'rail') return +(trip.distance_km * getTravelFactor('rail', trip.vehicle_type) * trip.passenger_count).toFixed(3);
  if (trip.travel_type === 'road') return +(trip.distance_km * getTravelFactor('road', trip.vehicle_type) * trip.passenger_count).toFixed(3);
  if (trip.travel_type === 'accommodation') return +(trip.nights! * getTravelFactor('accommodation', trip.vehicle_type)).toFixed(3);
  return 0;
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

function SensitiveInput({ value, onChange, placeholder, multiline }: {
  value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean;
}) {
  const [show, setShow] = useState(false);
  if (multiline) {
    return (
      <div className="relative">
        <textarea
          rows={3}
          className="w-full text-[12px] rounded-md border border-[#e5e7eb] focus:border-[#0f5c56] p-2 pr-8 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#0f5c56]"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ WebkitTextSecurity: show ? 'none' : 'disc' } as any}
        />
        <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-gray-600" onClick={() => setShow(!show)}>
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    );
  }
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
   Trip Dialog (manual config)
   ═══════════════════════════════════════════════════════════ */
function TripDialog({ initial, onSave, trigger }: {
  initial?: Trip; onSave: (t: Trip) => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Trip>(initial ?? { ...DEFAULT_TRIP });
  const est = estimateTripEmissions(form);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[460px] p-5 gap-5 rounded-xl border-[#e5e7eb] shadow-lg">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">{initial ? 'Edit' : 'Add'} Trip</h2>
          <p className="text-[12px] text-gray-500 mt-1">Configure business travel details for Scope 3 logging.</p>
        </div>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Travel Mode</label>
            <Select value={form.travel_type} onValueChange={v => setForm({ ...form, travel_type: v as any })}>
              <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flight" className="text-[12px]"><div className="flex items-center gap-2"><Plane className="h-3.5 w-3.5" /> Flight</div></SelectItem>
                <SelectItem value="rail" className="text-[12px]"><div className="flex items-center gap-2"><Train className="h-3.5 w-3.5" /> Rail</div></SelectItem>
                <SelectItem value="road" className="text-[12px]"><div className="flex items-center gap-2"><Car className="h-3.5 w-3.5" /> Road</div></SelectItem>
                <SelectItem value="accommodation" className="text-[12px]"><div className="flex items-center gap-2"><Hotel className="h-3.5 w-3.5" /> Hotel</div></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {form.travel_type === 'flight' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Class</label>
                  <Select value={form.flight_class} onValueChange={v => setForm({ ...form, flight_class: v as any })}>
                    <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy" className="text-[12px]">Economy</SelectItem>
                      <SelectItem value="premium_economy" className="text-[12px]">Premium Economy</SelectItem>
                      <SelectItem value="business" className="text-[12px]">Business</SelectItem>
                      <SelectItem value="first" className="text-[12px]">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="domestic" checked={form.is_domestic} onCheckedChange={c => setForm({ ...form, is_domestic: !!c })} />
                  <label htmlFor="domestic" className="text-[12px] font-medium text-gray-700 cursor-pointer">Domestic Flight</label>
                </div>
              </>
            )}
            {form.travel_type === 'rail' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Rail Type</label>
                <Select value={form.vehicle_type || 'rail_electric'} onValueChange={v => setForm({ ...form, vehicle_type: v })}>
                  <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rail_electric" className="text-[12px]">Electric Rail</SelectItem>
                    <SelectItem value="rail_diesel" className="text-[12px]">Diesel Rail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.travel_type === 'road' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Vehicle Type</label>
                <Select value={form.vehicle_type || 'car_petrol'} onValueChange={v => setForm({ ...form, vehicle_type: v })}>
                  <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car_petrol" className="text-[12px]">Petrol Car</SelectItem>
                    <SelectItem value="car_diesel" className="text-[12px]">Diesel Car</SelectItem>
                    <SelectItem value="car_hybrid" className="text-[12px]">Hybrid Car</SelectItem>
                    <SelectItem value="car_electric" className="text-[12px]">Electric Car</SelectItem>
                    <SelectItem value="bus" className="text-[12px]">Bus</SelectItem>
                    <SelectItem value="taxi" className="text-[12px]">Taxi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.travel_type === 'accommodation' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Hotel Type</label>
                  <Select value={form.vehicle_type || 'hotel_avg'} onValueChange={v => setForm({ ...form, vehicle_type: v })}>
                    <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel_budget" className="text-[12px]">Budget Hotel</SelectItem>
                      <SelectItem value="hotel_avg" className="text-[12px]">Average Hotel</SelectItem>
                      <SelectItem value="hotel_luxury" className="text-[12px]">Luxury Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nights</label>
                  <Input type="number" min="1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" value={form.nights || 1} onChange={e => setForm({ ...form, nights: +e.target.value })} />
                </div>
              </>
            )}
            {form.travel_type !== 'accommodation' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">One-way Distance (km)</label>
                <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" value={form.distance_km || ''} onChange={e => setForm({ ...form, distance_km: +e.target.value })} />
              </div>
            )}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Passengers / Occupants</label>
              <Input type="number" min="1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" value={form.passenger_count} onChange={e => setForm({ ...form, passenger_count: +e.target.value })} />
            </div>
          </div>

          <div className="bg-[#f9fafb] rounded-md p-3 border border-[#e5e7eb] flex items-center justify-between mt-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Est. Impact</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                {form.travel_type === 'flight' ? `RF ×${FLIGHT_RF} applied` : 'Standard Defra Factor'}
              </p>
            </div>
            <span className="text-[14px] font-bold text-[#0f5c56]">
              {est.toFixed(2)} <span className="text-[11px] font-medium text-gray-500">kg CO₂</span>
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="h-[32px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Trip</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   Integration Dialog  ← NEW
   ═══════════════════════════════════════════════════════════ */
function TravelIntegrationDialog({ onSaved, trigger }: {
  onSaved: () => void; trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [integrationType, setIntegrationType] = useState('expense_platform');
  const [platform, setPlatform] = useState('concur');
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'result'>('form');

  const typeMeta = INTEGRATION_TYPE_META[integrationType];
  const platformFields = PLATFORM_FIELDS[platform] || { required: [], optional: [] };

  const { data: guide } = useQuery({
    queryKey: ['travel-guide', integrationType],
    queryFn: () => travelApi.getGuide(integrationType),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: travelApi.createIntegration,
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

  const reset = () => { setStep('form'); setFields({}); setLabel(''); setPlatform('concur'); };

  // Switch platform when type changes
  const handleTypeChange = (type: string) => {
    setIntegrationType(type);
    setFields({});
    const firstPlatform = Object.keys(INTEGRATION_TYPE_META[type].platforms)[0];
    setPlatform(firstPlatform);
  };

  const handlePlatformChange = (p: string) => {
    setPlatform(p);
    setFields({});
  };

  const hasRequired =
    platform === 'manual'
      ? true
      : platformFields.required.every(f => (fields[f] || '').trim().length > 0);

  const handleSubmit = () => {
    createMutation.mutate({
      integration_type: integrationType,
      label: label || `${typeMeta.label} — ${typeMeta.platforms[platform]?.label}`,
      platform,
      ...fields,
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-xl border border-[#e5e7eb] shadow-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] shrink-0">
          <h2 className="text-[15px] font-semibold text-[#0f5c56]">Add Travel Integration</h2>
          <p className="text-[11px] text-gray-500 mt-1">Connect an expense, booking, or calendar source to automatically pull travel emissions.</p>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
          {step === 'form' && (
            <>
              {/* Integration Type Cards */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Source Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(INTEGRATION_TYPE_META).map(([key, m]) => (
                    <button
                      key={key}
                      onClick={() => handleTypeChange(key)}
                      className={`p-3 rounded-lg border-2 text-left transition-all flex flex-col gap-1.5 ${
                        integrationType === key
                          ? 'border-[#0f5c56] bg-[#e6f7f1]'
                          : 'border-[#e5e7eb] bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={integrationType === key ? 'text-[#0f5c56]' : 'text-gray-500'}>
                        {React.cloneElement(m.icon as React.ReactElement)}
                      </span>
                      <span className={`text-[11px] font-bold leading-tight ${integrationType === key ? 'text-[#0f5c56]' : 'text-gray-700'}`}>
                        {m.label}
                      </span>
                      <span className="text-[9px] text-gray-400 leading-tight">{m.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Platform</label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger className="h-[36px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeMeta.platforms).map(([key, pm]) => (
                      <SelectItem key={key} value={key} className="text-[12px]">
                        <div>
                          <span className="font-medium">{pm.label}</span>
                          <span className="text-gray-400 ml-2">— {pm.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Integration Label <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]"
                  placeholder={`e.g. ${typeMeta.platforms[platform]?.label}`}
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
                      {(guide as any).docs_url && (
                        <a href={(guide as any).docs_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 underline mt-2 inline-block">
                          View documentation →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Credential Fields */}
              {platform !== 'manual' && (
                <div className="space-y-3">
                  {platformFields.required.map(fk => {
                    const fm = FIELD_LABELS[fk];
                    if (!fm) return null;
                    return (
                      <div key={fk} className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          {fm.label} <span className="text-red-400 text-[9px]">*</span>
                        </label>
                        {fm.sensitive ? (
                          <SensitiveInput value={fields[fk] || ''} onChange={v => setFields({ ...fields, [fk]: v })} placeholder={fm.placeholder} multiline={fm.multiline} />
                        ) : (
                          <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono" placeholder={fm.placeholder} value={fields[fk] || ''} onChange={e => setFields({ ...fields, [fk]: e.target.value })} />
                        )}
                      </div>
                    );
                  })}

                  {platformFields.optional.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optional</span>
                        <div className="h-px flex-1 bg-[#e5e7eb]" />
                      </div>
                      {platformFields.optional.map(fk => {
                        const fm = FIELD_LABELS[fk];
                        if (!fm) return null;
                        return (
                          <div key={fk} className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{fm.label}</label>
                            {fm.sensitive ? (
                              <SensitiveInput value={fields[fk] || ''} onChange={v => setFields({ ...fields, [fk]: v })} placeholder={fm.placeholder} multiline={fm.multiline} />
                            ) : (
                              <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56] font-mono" placeholder={fm.placeholder} value={fields[fk] || ''} onChange={e => setFields({ ...fields, [fk]: e.target.value })} />
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              {/* Manual note */}
              {platform === 'manual' && (
                <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0f5c56] mt-0.5 shrink-0" />
                  <p className="text-[11px] text-[#0f5c56]">
                    No credentials needed for manual mode. After connecting, use the Sync button to submit trip data (total trips, distance, emissions) directly.
                  </p>
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

        {/* Footer */}
        {step !== 'result' && (
          <div className="px-6 py-3.5 border-t border-[#e5e7eb] bg-gray-50 flex justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb]" onClick={() => { setOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5"
              disabled={!hasRequired || createMutation.isPending}
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

/* ═══════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════ */
export default function TravelPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const config = useQuery({ queryKey: ['travel-config'], queryFn: travelApi.getConfig });
  const summary = useQuery({ queryKey: ['travel-summary', month, year], queryFn: () => travelApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['travel-analytics', month, year], queryFn: () => travelApi.getAnalytics(month, year) });
  const integrationsQuery = useQuery({ queryKey: ['travel-integrations'], queryFn: travelApi.getIntegrations });

  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (config.data?.travel_configs?.length) {
      const mapped = config.data.travel_configs.map((t: any) => ({
        travel_type: t.travel_type,
        distance_km: +t.distance_km,
        passenger_count: t.passenger_count || 1,
        flight_class: t.flight_class,
        is_domestic: t.is_domestic,
        vehicle_type: t.vehicle_type || t.metadata?.vehicle_type,
        nights: t.nights || t.metadata?.nights,
      }));
      setTrips(mapped);
    }
  }, [config.data]);

  const updateConfigMutation = useMutation({
    mutationFn: travelApi.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-config'] }),
  });

  const calcMutation = useMutation({
    mutationFn: travelApi.calculate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['travel-summary'] });
      qc.invalidateQueries({ queryKey: ['travel-analytics'] });
    },
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: travelApi.deleteIntegration,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-integrations'] }),
  });

  const syncMutation = useMutation({
    mutationFn: travelApi.syncIntegration,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['travel-integrations'] });
      qc.invalidateQueries({ queryKey: ['travel-summary'] });
      qc.invalidateQueries({ queryKey: ['travel-analytics'] });
    },
  });

  const syncAllMutation = useMutation({
    mutationFn: () => travelApi.syncIntegration({ month, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['travel-integrations'] });
      qc.invalidateQueries({ queryKey: ['travel-summary'] });
      qc.invalidateQueries({ queryKey: ['travel-analytics'] });
    },
  });

  const integrations: TravelIntegrationRecord[] = integrationsQuery.data || [];
  const connectedIntegrations = integrations.filter(i => i.connection_status === 'connected');

  const breakdown = trips.map(t => ({
    type: t.travel_type,
    distance: t.travel_type === 'accommodation' ? `${t.nights} nights` : `${t.distance_km} km`,
    passengers: t.passenger_count,
    subtype: t.travel_type === 'flight' ? `${t.flight_class} ${t.is_domestic ? '(dom)' : '(intl)'}` : t.vehicle_type || '',
    emissions: estimateTripEmissions(t),
  }));

  const totalEst = breakdown.reduce((a, b) => a + b.emissions, 0);

  const typeAgg: Record<string, number> = {};
  trips.forEach(t => { typeAgg[t.travel_type] = (typeAgg[t.travel_type] || 0) + estimateTripEmissions(t); });
  const pieData = Object.entries(typeAgg).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  const trendData = analytics.data?.monthly_trend ?? [];

  const handleAddTrip = (t: Trip) => { const u = [...trips, t]; setTrips(u); updateConfigMutation.mutate({ travel_configs: u }); };
  const handleEditTrip = (i: number, t: Trip) => { const u = trips.map((x, j) => j === i ? t : x); setTrips(u); updateConfigMutation.mutate({ travel_configs: u }); };
  const handleRemoveTrip = (i: number) => { const u = trips.filter((_, j) => j !== i); setTrips(u); updateConfigMutation.mutate({ travel_configs: u }); };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Business Travel</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track Scope 3 emissions from flights, ground transport, and accommodation</p>
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
            <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm" onClick={() => calcMutation.mutate({ trips, month, year })} disabled={trips.length === 0}>
              {calcMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Commit Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {calcMutation.isSuccess && calcMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Travel data processed and saved successfully.</p>
          </div>
        )}
        {syncMutation.isSuccess && syncMutation.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">
              Live sync complete —{' '}
              {syncMutation.data.data?.total_trips != null ? `${syncMutation.data.data.total_trips} trips, ` : ''}
              {syncMutation.data.data?.total_emissions_kg?.toFixed(3) ?? '0'} kg CO₂e recorded
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
            {['overview', 'config', 'integrations', 'calculate'].map((tab) => (
              <TabsTrigger
                key={tab} value={tab}
                className="capitalize text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none"
              >
                {tab}
                {tab === 'integrations' && connectedIntegrations.length > 0 && (
                  <span className="ml-1.5 bg-[#24d18f] text-[#0f5c56] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {connectedIntegrations.length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══════════ OVERVIEW ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Travel Emissions', value: summary.data?.travel_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Plane },
                { label: 'This Month Estimate', value: totalEst.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Live Integrations', value: connectedIntegrations.length, unit: `of ${integrations.length} connected`, icon: Wifi },
                { label: 'Logs', value: trips.length, unit: 'Trips Tracked', icon: Settings },
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
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[#0f5c56]" /> Historical Travel Footprint
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
                        <Tooltip cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="emissions" stroke="#0f5c56" strokeWidth={3} fill="url(#colorBrand)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Plane className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-[12px]">No trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-white">Impact by Type</h2>
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
                              <span className="text-[12px] font-semibold text-gray-700 capitalize">{d.name}</span>
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

          {/* ═══════════ CONFIG ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Trip Inventory</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage recorded travel for the current period.</p>
                </div>
                <TripDialog onSave={handleAddTrip} trigger={
                  <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Log Trip
                  </Button>
                } />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Type</span><span>Subtype</span><span>Dist / Nights</span><span>Pax</span><span>Est. Impact</span><span className="text-right">Actions</span>
                </div>
                <div className="space-y-2">
                  {trips.length > 0 ? breakdown.map((row, i) => {
                    const Icon = row.type === 'flight' ? Plane : row.type === 'rail' ? Train : row.type === 'road' ? Car : Hotel;
                    return (
                      <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_80px] items-center p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-white hover:bg-[#f9fafb] transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-1.5 rounded"><Icon className="h-3.5 w-3.5 text-gray-600" /></div>
                          <span className="text-[13px] font-bold text-gray-900 capitalize">{row.type}</span>
                        </div>
                        <span className="text-[12px] text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{row.subtype}</span>
                        <span className="text-[12px] font-medium text-gray-900">{row.distance}</span>
                        <span className="text-[12px] font-medium text-gray-900">{row.passengers}</span>
                        <p className="text-[13px] font-bold text-[#0f5c56]">{row.emissions.toFixed(2)} kg</p>
                        <div className="flex items-center justify-end gap-1">
                          <TripDialog initial={trips[i]} onSave={t => handleEditTrip(i, t)} trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>} />
                          <button onClick={() => handleRemoveTrip(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No trips configured for this period.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 flex items-start gap-4">
              <Info className="h-5 w-5 text-[#0f5c56] shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-gray-900">Conversion Factors & Methodology</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Flights (incl. RF ×1.9)</p>
                    <ul className="space-y-1.5">
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Domestic</span> <span className="font-mono">{TRAVEL_FACTORS.flight_domestic} kg/km</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Intl Economy</span> <span className="font-mono">{TRAVEL_FACTORS.flight_intl_economy} kg/km</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Ground Transport</p>
                    <ul className="space-y-1.5">
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Petrol Car</span> <span className="font-mono">{TRAVEL_FACTORS.car_petrol} kg/km</span></li>
                      <li className="text-[12px] text-gray-600 flex justify-between"><span>Electric Rail</span> <span className="font-mono">{TRAVEL_FACTORS.rail_electric} kg/km</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════ INTEGRATIONS ═══════════  ← NEW */}
          <TabsContent value="integrations" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Travel Integrations</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Connect expense platforms, booking tools, or calendars to auto-import trip data.
                  </p>
                </div>
                <TravelIntegrationDialog
                  onSaved={() => qc.invalidateQueries({ queryKey: ['travel-integrations'] })}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
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
                      const typeMeta = INTEGRATION_TYPE_META[intg.integration_type];
                      return (
                        <div key={intg.id} className="rounded-xl border border-[#e5e7eb] bg-white hover:border-[#0f5c56]/30 transition-colors overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div
                                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: (typeMeta?.color || '#6b7280') + '18' }}
                                >
                                  {typeMeta?.icon
                                    ? React.cloneElement(typeMeta.icon as React.ReactElement)
                                    : <Plane className="h-5 w-5 text-gray-400" />
                                  }
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-[14px] font-bold text-gray-900">
                                      {intg.label || typeMeta?.label || intg.integration_type}
                                    </h3>
                                    <StatusBadge status={intg.connection_status} />
                                  </div>
                                  <p className="text-[12px] text-gray-500 mt-0.5 capitalize">
                                    {typeMeta?.label || intg.integration_type}
                                  </p>

                                  {/* Live Metrics */}
                                  {(intg.last_trip_count != null || intg.last_total_emissions_kg != null) && (
                                    <div className="flex items-center gap-5 mt-3">
                                      {intg.last_trip_count != null && (
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <Plane className="h-3 w-3" /> Trips
                                          </p>
                                          <p className="text-[14px] font-bold text-gray-900">{intg.last_trip_count}</p>
                                        </div>
                                      )}
                                      {intg.last_total_distance_km != null && (
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> Distance
                                          </p>
                                          <p className="text-[14px] font-bold text-gray-900">{intg.last_total_distance_km.toFixed(0)} km</p>
                                        </div>
                                      )}
                                      {intg.last_flight_count != null && (
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase">Flights</p>
                                          <p className="text-[14px] font-bold text-gray-900">{intg.last_flight_count}</p>
                                        </div>
                                      )}
                                      {intg.last_hotel_nights != null && (
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <Hotel className="h-3 w-3" /> Nights
                                          </p>
                                          <p className="text-[14px] font-bold text-gray-900">{intg.last_hotel_nights}</p>
                                        </div>
                                      )}
                                      {intg.last_total_emissions_kg != null && (
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase">CO₂e</p>
                                          <p className="text-[14px] font-bold text-[#0f5c56]">{intg.last_total_emissions_kg.toFixed(2)} kg</p>
                                        </div>
                                      )}
                                    </div>
                                  )}

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
                            <span className="text-[10px] text-gray-400 capitalize">
                              Source: {intg.integration_type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Scope 3 — Business Travel
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                    <Plane className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-semibold text-gray-600">No travel integrations</p>
                    <p className="text-[12px] text-gray-400 mt-1 max-w-[380px] mx-auto">
                      Connect SAP Concur, Brex, Navan, Egencia, CWT, Google Calendar, or Outlook to automatically import trip data and calculate Scope 3 emissions.
                    </p>
                    <TravelIntegrationDialog
                      onSaved={() => qc.invalidateQueries({ queryKey: ['travel-integrations'] })}
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

          {/* ═══════════ CALCULATE ═══════════ */}
          <TabsContent value="calculate" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">Run Scope 3 Travel Calculation</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Review trip logs and commit emissions to the ledger for {month}/{year}.</p>
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