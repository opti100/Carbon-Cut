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
  Activity, MapPin
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const travelApi = {
  getConfig: () => api.get('/web/config/').then(r => r.data.data),
  updateConfig: (payload: any) => api.post('/web/config/', payload).then(r => r.data),
  calculate: (payload: any) => api.post('/web/travel/', payload).then(r => r.data),
  getSummary: (month: number, year: number) =>
    api.get('/web/summary/', { params: { month, year } }).then(r => r.data.data),
  getAnalytics: (month: number, year: number) =>
    api.get('/web/analytics/', { params: { month, year } }).then(r => r.data.data),
};

const TRAVEL_FACTORS: Record<string, number> = {
  flight_domestic: 0.255, flight_intl_economy: 0.195, flight_intl_premium_economy: 0.293, flight_intl_business: 0.585, flight_intl_first: 0.975,
  rail_electric: 0.041, rail_diesel: 0.065,
  car_petrol: 0.192, car_diesel: 0.171, car_hybrid: 0.109, car_electric: 0.053, bus: 0.089, taxi: 0.211, motorcycle: 0.113,
  hotel_avg: 30.0, hotel_luxury: 72.0, hotel_budget: 18.0,
};

const FLIGHT_RF = 1.9;

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
    const factor = getTravelFactor('flight', factorKey);
    return +(trip.distance_km * factor * trip.passenger_count * FLIGHT_RF).toFixed(3);
  }
  if (trip.travel_type === 'rail') {
    return +(trip.distance_km * getTravelFactor('rail', trip.vehicle_type) * trip.passenger_count).toFixed(3);
  }
  if (trip.travel_type === 'road') {
    return +(trip.distance_km * getTravelFactor('road', trip.vehicle_type) * trip.passenger_count).toFixed(3);
  }
  if (trip.travel_type === 'accommodation') {
    return +(trip.nights! * getTravelFactor('accommodation', trip.vehicle_type)).toFixed(3);
  }
  return 0;
}

/* ─────────────── Types ─────────────── */
interface Trip {
  travel_type: 'flight' | 'rail' | 'road' | 'accommodation';
  distance_km: number;
  passenger_count: number;
  flight_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  is_domestic?: boolean;
  vehicle_type?: string;
  nights?: number;
}

const DEFAULT_TRIP: Trip = { travel_type: 'flight', distance_km: 1500, passenger_count: 1, flight_class: 'economy', is_domestic: false };

/* ─────────────── Trip Dialog ─────────────── */
function TripDialog({
  initial, onSave, trigger,
}: {
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
              <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]">
                <SelectValue />
              </SelectTrigger>
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
                    <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
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
                  <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
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
                  <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
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
                    <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel_budget" className="text-[12px]">Budget Hotel</SelectItem>
                      <SelectItem value="hotel_avg" className="text-[12px]">Average Hotel</SelectItem>
                      <SelectItem value="hotel_luxury" className="text-[12px]">Luxury Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nights</label>
                  <Input type="number" min="1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.nights || 1} onChange={e => setForm({ ...form, nights: +e.target.value })} />
                </div>
              </>
            )}

            {form.travel_type !== 'accommodation' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">One-way Distance (km)</label>
                <Input type="number" min="0" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.distance_km || ''} onChange={e => setForm({ ...form, distance_km: +e.target.value })} />
              </div>
            )}

            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Passengers / Occupants</label>
              <Input type="number" min="1" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={form.passenger_count} onChange={e => setForm({ ...form, passenger_count: +e.target.value })} />
            </div>
          </div>

          <div className="bg-[#f9fafb] rounded-md p-3 border border-[#e5e7eb] flex items-center justify-between mt-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Est. Impact</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                {form.travel_type === 'flight' && `RF ×${FLIGHT_RF} applied`}
                {form.travel_type !== 'flight' && `Standard Defra Factor`}
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
          <Button size="sm" className="h-[32px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" onClick={() => { onSave(form); setOpen(false); }}>Save Trip</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PIE_COLORS = ['#0f5c56', '#24d18f', '#60a5fa', '#f59e0b'];

/* ─────────────── Main Page ─────────────── */
export default function TravelPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const qc = useQueryClient();

  const config = useQuery({ queryKey: ['travel-config'], queryFn: travelApi.getConfig });
  const summary = useQuery({ queryKey: ['travel-summary', month, year], queryFn: () => travelApi.getSummary(month, year) });
  const analytics = useQuery({ queryKey: ['travel-analytics', month, year], queryFn: () => travelApi.getAnalytics(month, year) });

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
                { label: 'Travel Emissions', value: summary.data?.travel_emissions_kg?.toFixed(2) ?? summary.data?.total_emissions_kg?.toFixed(2) ?? '0.00', unit: 'kg CO₂', icon: Plane },
                { label: 'This Month Estimate', value: totalEst.toFixed(2), unit: 'kg CO₂', icon: Activity },
                { label: 'Primary Scope', value: 'Scope 3', unit: 'Corporate Travel', icon: MapPin },
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
              {/* Trend Chart */}
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
                        <Tooltip cursor={{ stroke: '#24d18f', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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

              {/* Green Header Card: Type Breakdown */}
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

          {/* ═══════════ CONFIGURATION ═══════════ */}
          <TabsContent value="config" className="space-y-5">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#f0f1f5] flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Trip Inventory</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">Manage recorded travel for the current period.</p>
                </div>
                <TripDialog
                  onSave={handleAddTrip}
                  trigger={
                    <Button size="sm" className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] shadow-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Log Trip
                    </Button>
                  }
                />
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_80px] text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-3">
                  <span>Type</span>
                  <span>Subtype</span>
                  <span>Dist / Nights</span>
                  <span>Pax</span>
                  <span>Est. Impact</span>
                  <span className="text-right">Actions</span>
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
                        <div>
                          <p className="text-[13px] font-bold text-[#0f5c56]">{row.emissions.toFixed(2)} kg</p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <TripDialog
                            initial={trips[i]} onSave={t => handleEditTrip(i, t)}
                            trigger={<button className="p-1.5 text-gray-400 hover:text-[#0f5c56]"><Pencil className="h-4 w-4" /></button>}
                          />
                          <button onClick={() => handleRemoveTrip(i)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="py-10 text-center text-[13px] text-gray-500 border border-dashed border-[#e5e7eb] rounded-xl bg-gray-50/50">
                      No trips configured for this period.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
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