'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Target, TrendingDown, AlertCircle, CheckCircle2, Clock, DollarSign,
  Leaf, Zap, Cloud, Globe, Users, Plane, Server, Lightbulb, ChevronDown,
  ChevronUp, Loader2, Sparkles, Plus, Database, Play,
  Trash2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { api } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const decideApi = {
  getDashboard: () => api.get('/decide/dashboard/').then(r => r.data.data),
  getGoals: () => api.get('/decide/goals/').then(r => r.data.data),
  createGoal: (data: any) => api.post('/decide/goals/', data).then(r => r.data),
  updateGoal: (id: string, data: any) => api.put(`/decide/goals/${id}/`, data).then(r => r.data),
  deleteGoal: (id: string) => api.delete(`/decide/goals/${id}/`).then(r => r.data),
  runAnalysis: (data: any) => api.post('/decide/analyze/', data).then(r => r.data),
  getRuns: () => api.get('/decide/runs/').then(r => r.data.data),
  getsugggestions: (params?: any) => api.get('/decide/recommendations/', { params }).then(r => r.data.data),
  updateRecStatus: (id: string, status: string) =>
    api.post(`/decide/recommendations/${id}/`, { status }).then(r => r.data),  
};

interface Goal {
  id: string; name: string; goal_type: string; baseline_year: number; baseline_emissions_kg: number;
  target_year: number; target_reduction_pct: number | null; target_emissions_kg: number | null;
  annual_budget_usd: number | null; scopes_included: string[]; status: string;
}

interface Recommendation {
  id: string; title: string; description: string; category: string; priority: string;
  estimated_reduction_kg: number | null; estimated_reduction_pct: number | null; estimated_cost_usd: number | null;
  estimated_savings_usd: number | null; payback_months: number | null; implementation_steps: string[];
  timeframe_weeks: number | null; difficulty: string; source_type: string; scope: string; status: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
  accepted: 'bg-[#e6f7f1] text-[#0f5c56] border-[#24d18f]/30',
  in_progress: 'bg-blue-50 text-blue-600 border-blue-200',
  completed: 'bg-green-50 text-green-600 border-green-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  deferred: 'bg-gray-100 text-gray-600 border-gray-200',
};

const CATEGORY_ICONS: Record<string, any> = {
  cloud: Cloud, cdn: Globe, onprem: Server, workforce: Users,
  travel: Plane, energy: Zap, offset: Leaf, general: Lightbulb,
};

// ── Helpers ──────────────────────────────────────────────────────────────
function kgToTonne(kg: number) { return (kg / 1000).toFixed(1); }
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function sourceLabel(source_type: string) { return source_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

// ── Skeleton Components ─────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

function GoalCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
      </div>
    </div>
  );
}

function RecommendationCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex gap-4">
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function DecidePage() {
  const [tab, setTab] = useState<'dashboard' | 'goals' | 'recommendations' | 'history'>('dashboard');
  const qc = useQueryClient();

  const dashboard = useQuery({ queryKey: ['decide-dashboard'], queryFn: decideApi.getDashboard });
  const goals = useQuery({ queryKey: ['decide-goals'], queryFn: decideApi.getGoals });
  const recommendations = useQuery({ queryKey: ['decide-recs'], queryFn: () => decideApi.getsugggestions() });
  const runs = useQuery({ queryKey: ['decide-runs'], queryFn: decideApi.getRuns });

  const analyzeMut = useMutation({
    mutationFn: decideApi.runAnalysis,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['decide-dashboard'] }); qc.invalidateQueries({ queryKey: ['decide-recs'] }); qc.invalidateQueries({ queryKey: ['decide-runs'] }); },
  });

  const createGoalMut = useMutation({
    mutationFn: decideApi.createGoal,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['decide-goals'] }); qc.invalidateQueries({ queryKey: ['decide-dashboard'] }); setShowGoalForm(false); },
  });

  const updateRecMut = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => decideApi.updateRecStatus(id, action),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['decide-recs'] }); qc.invalidateQueries({ queryKey: ['decide-dashboard'] });
      if (variables.action === 'accepted') { qc.invalidateQueries({ queryKey: ['act-tasks'] }); qc.invalidateQueries({ queryKey: ['act-stats'] }); }
    },
  });

  const deleteGoalMut = useMutation({
    mutationFn: decideApi.deleteGoal,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['decide-goals'] }); qc.invalidateQueries({ queryKey: ['decide-dashboard'] }); },
  });

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', goal_type: 'reduction_pct', baseline_year: new Date().getFullYear() - 1, target_year: new Date().getFullYear() + 5, target_reduction_pct: 50, annual_budget_usd: '', scopes_included: ['scope_1', 'scope_2', 'scope_3'] });
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string>('all');

  const filteredRecs = catFilter === 'all' ? (recommendations.data || []) : (recommendations.data || []).filter((r: Recommendation) => r.category === catFilter);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
             AI Carbon Intelligence
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Deep research of your emission data to generate science-based strategies</p>
          </div>
          <Button
            onClick={() => analyzeMut.mutate({ goal_id: goals.data?.[0]?.id || null })}
            disabled={analyzeMut.isPending || goals.isLoading}
            size="sm"
            className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm"
          >
            {analyzeMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Run Analysis
          </Button>
        </div>

        {/* Success Banner */}
        {analyzeMut.data?.success && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#0f5c56] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900">Analysis Complete</h3>
                <p className="text-[12px] text-gray-600 mt-0.5">{analyzeMut.data.data.analysis_summary}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-white px-2 py-1 rounded border border-[#e5e7eb] w-fit">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[11px] font-medium text-gray-700">{analyzeMut.data.data.top_insight}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-[11px] text-gray-500 font-mono shrink-0">
              <div className="bg-white px-2.5 py-1 rounded border border-[#e5e7eb] text-center">
                <p className="font-bold text-gray-900">{analyzeMut.data.data.recommendation_count}</p>
                <p>Recommendations</p>
              </div>
              <div className="bg-white px-2.5 py-1 rounded border border-[#e5e7eb] text-center">
                <p className="font-bold text-[#0f5c56]">{analyzeMut.data.data.reduction_potential_pct?.toFixed(1)}%</p>
                <p>Potential</p>
              </div>
            </div>
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            <TabsTrigger value="dashboard" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">Dashboard</TabsTrigger>
            <TabsTrigger value="goals" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">Goals</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">Recommendations</TabsTrigger>
            <TabsTrigger value="history" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none">History</TabsTrigger>
          </TabsList>

          {/* ═══════════ DASHBOARD TAB ═══════════ */}
          <TabsContent value="dashboard" className="space-y-6">
            {dashboard.isLoading ? (
              <>
                <GoalCardSkeleton />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
                </div>
              </>
            ) : (
              <>
                {dashboard.data?.goal_progress?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2"><Target className="h-4 w-4 text-[#0f5c56]" /> Active Tracking</h3>
                    {dashboard.data?.goal_progress?.map((gp: any) => <GoalDetailCard key={gp.goal_id} gp={gp} />)}
                  </div>
                )}

                {dashboard.data?.recommendation_stats && (
                  <div className="space-y-4">
                    <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-[#0f5c56]" /> Opportunity Pipeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <StatCard title="Identified Strategies" value={dashboard.data.recommendation_stats.total} icon={Database} />
                      <StatCard title="Active Implementation" value={`${dashboard.data.recommendation_stats.accepted + dashboard.data.recommendation_stats.in_progress}`} icon={CheckCircle2} />
                      <StatCard title="Est. Reduction" value={`${(dashboard.data.recommendation_stats.total_estimated_reduction_kg / 1000).toFixed(1)}`} unit="t CO₂" icon={TrendingDown} />
                      <StatCard title="Est. Savings" value={`$${dashboard.data.recommendation_stats.total_estimated_savings_usd.toLocaleString()}`} icon={DollarSign} />
                    </div>
                  </div>
                )}

                {!dashboard.data?.goal_progress?.length && (
                  <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <Target className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-[15px] font-semibold text-gray-900">Define Your Carbon Target</h3>
                    <p className="text-[12px] text-gray-500 mt-1 max-w-sm mx-auto mb-4">Set a baseline and target reduction to receive personalized AI recommendations.</p>
                    <Button onClick={() => { setTab('goals'); setShowGoalForm(true); }} className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-2"><Plus className="h-3.5 w-3.5" /> Create Goal</Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ═══════════ GOALS TAB ═══════════ */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">Strategic Targets</h3>
                <p className="text-[12px] text-gray-500">Manage organizational reduction goals</p>
              </div>
              <Button onClick={() => setShowGoalForm(!showGoalForm)} variant={showGoalForm ? 'outline' : 'default'} size="sm" className="h-[30px] text-[12px]">
                {showGoalForm ? 'Cancel' : '+ New Target'}
              </Button>
            </div>

            {showGoalForm && (
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                <div className="mb-6">
                  <h2 className="text-[16px] font-semibold text-gray-900">Configure Goal Parameters</h2>
                  <p className="text-[12px] text-gray-500 mt-1">Baseline data is auto-extracted from historical logs.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Goal Name</label>
                    <Input className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={goalForm.name} onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} placeholder="e.g. Net Zero by 2030" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Goal Type</label>
                    <Select value={goalForm.goal_type} onValueChange={v => setGoalForm({ ...goalForm, goal_type: v })}>
                      <SelectTrigger className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reduction_pct" className="text-[12px]">Percentage Reduction</SelectItem>
                        <SelectItem value="net_zero" className="text-[12px]">Net Zero</SelectItem>
                        <SelectItem value="absolute_target" className="text-[12px]">Absolute Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Reduction Target (%)</label>
                    <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={goalForm.target_reduction_pct} onChange={e => setGoalForm({ ...goalForm, target_reduction_pct: +e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Baseline Year</label>
                    <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={goalForm.baseline_year} onChange={e => setGoalForm({ ...goalForm, baseline_year: +e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Target Year</label>
                    <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={goalForm.target_year} onChange={e => setGoalForm({ ...goalForm, target_year: +e.target.value })} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Annual Budget (USD) — optional</label>
                    <Input type="number" className="h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:border-[#0f5c56]" value={goalForm.annual_budget_usd} onChange={e => setGoalForm({ ...goalForm, annual_budget_usd: e.target.value })} placeholder="50000" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={()=>createGoalMut.mutate(goalForm)} disabled={createGoalMut.isPending || !goalForm.name} className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-2">
                    {createGoalMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Target className="h-3.5 w-3.5" />} Create Target
                  </Button>
                </div>
              </div>
            )}

            {goals.isLoading ? (
              <div className="space-y-4">{[1, 2].map(i => <GoalCardSkeleton key={i} />)}</div>
            ) : (
              <div className="space-y-4">
                {(goals.data || []).map((goal: Goal) => (
                  <div key={goal.id} className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                    <div className="flex justify-between items-start mb-4 border-b border-[#f0f1f5] pb-4">
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900">{goal.name}</h3>
                        <p className="text-[12px] text-gray-500 mt-0.5 capitalize">
                          {goal.goal_type.replace('_', ' ')} • {goal.baseline_year} → {goal.target_year} {goal.target_reduction_pct && `(${goal.target_reduction_pct}% decrease)`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", goal.status === 'active' ? "bg-[#e6f7f1] text-[#0f5c56] border-[#24d18f]/30" : "bg-gray-100 text-gray-500 border-gray-200")}>{goal.status}</span>
                        <Button onClick={() => deleteGoalMut.mutate(goal.id)} variant="ghost" size="sm" className="h-[26px] w-[26px] p-0 text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Baseline Measured</p>
                        <p className="text-[14px] font-bold text-gray-900 mt-0.5">{(goal.baseline_emissions_kg / 1000).toFixed(1)} <span className="text-[11px] font-medium text-gray-500">t CO₂</span></p>
                      </div>
                      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget Allocated</p>
                        <p className="text-[14px] font-bold text-gray-900 mt-0.5">{goal.annual_budget_usd ? `$${goal.annual_budget_usd.toLocaleString()}/yr` : 'Not Set'}</p>
                      </div>
                      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Scope Coverage</p>
                        <p className="text-[13px] font-medium text-gray-900 mt-0.5">{goal.scopes_included?.join(', ').replace(/_/g, ' ') || 'All Scopes'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ═══════════ RECOMMENDATIONS TAB ═══════════ */}
          <TabsContent value="recommendations" className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-[#0f5c56]" /> Strategy Pipeline</h3>
                <p className="text-[12px] text-gray-500">AI-generated tasks to hit your target.</p>
              </div>
              <Select value={catFilter} onValueChange={setCatFilter} disabled={recommendations.isLoading}>
                <SelectTrigger className="w-full md:w-[180px] h-8 text-[12px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[12px]">All Sources</SelectItem>
                  <SelectItem value="cloud" className="text-[12px]">Cloud</SelectItem>
                  <SelectItem value="onprem" className="text-[12px]">On-Prem</SelectItem>
                  <SelectItem value="travel" className="text-[12px]">Travel</SelectItem>
                  <SelectItem value="workforce" className="text-[12px]">Workforce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recommendations.isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <RecommendationCardSkeleton key={i} />)}</div>
            ) : (
              <div className="space-y-3">
                {filteredRecs.length === 0 && (
                  <div className="py-16 text-center bg-white border border-[#e5e7eb] border-dashed rounded-xl">
                    <Lightbulb className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-[13px] text-gray-500">No recommendations. Run an analysis to generate strategies.</p>
                  </div>
                )}

                {filteredRecs.map((rec: Recommendation) => {
                  const CategoryIcon = CATEGORY_ICONS[rec.category] || Lightbulb;
                  return (
                    <div key={rec.id} className={cn("bg-white border rounded-xl overflow-hidden transition-all duration-200", expandedRec === rec.id ? "border-[#0f5c56] shadow-[0_2px_8px_rgba(15,92,86,0.08)]" : "border-[#e5e7eb] hover:border-[#0f5c56]/30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]")}>
                      <div className="p-4 cursor-pointer flex items-start justify-between gap-4" onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}>
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-[#f0f9f6] text-[#0f5c56] shrink-0 mt-0.5">
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-[14px] font-semibold text-gray-900 truncate max-w-[60%]">{rec.title}</h3>
                              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded", PRIORITY_STYLES[rec.priority])}>{rec.priority}</span>
                              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", STATUS_STYLES[rec.status])}>{rec.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-[12px] text-gray-500 font-mono capitalize">{rec.category} • {rec.scope.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                          <div className="flex items-center gap-4 text-[12px] font-medium">
                            {rec.estimated_reduction_kg && <span className="text-[#0f5c56] flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5" /> {(rec.estimated_reduction_kg / 1000).toFixed(1)}t</span>}
                            {rec.estimated_savings_usd && <span className="text-gray-500 flex items-center gap-1"><DollarSign className="h-3 w-3" /> {rec.estimated_savings_usd.toLocaleString()}</span>}
                          </div>
                          <div className="p-1 rounded hover:bg-gray-100 text-gray-400">
                            {expandedRec === rec.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>
                      </div>

                      {expandedRec === rec.id && (
                        <div className="p-5 border-t border-[#f0f1f5] bg-gray-50/30 space-y-5">
                          <p className="text-[13px] text-gray-700 leading-relaxed">{rec.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <MetricBox label="Difficulty" value={rec.difficulty} icon={<AlertCircle className="h-3.5 w-3.5" />} />
                            <MetricBox label="Cost" value={rec.estimated_cost_usd ? `$${rec.estimated_cost_usd.toLocaleString()}` : 'N/A'} icon={<DollarSign className="h-3.5 w-3.5" />} />
                            <MetricBox label="Timeframe" value={rec.timeframe_weeks ? `${rec.timeframe_weeks}w` : 'N/A'} icon={<Clock className="h-3.5 w-3.5" />} />
                            <MetricBox label="Payback" value={rec.payback_months ? `${rec.payback_months}mo` : 'N/A'} icon={<TrendingUp className="h-3.5 w-3.5" />} />
                            <MetricBox label="Impact" value={rec.estimated_reduction_pct ? `${rec.estimated_reduction_pct.toFixed(1)}%` : 'N/A'} icon={<TrendingDown className="h-3.5 w-3.5" />} />
                          </div>

                          {rec.implementation_steps?.length > 0 && (
                            <div className="bg-white border border-[#e5e7eb] rounded-lg p-4">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">Implementation Plan</p>
                              <ul className="space-y-2">
                                {rec.implementation_steps.map((step, idx) => (
                                  <li key={idx} className="flex gap-3 text-[13px] text-gray-700"><span className="text-gray-400 font-mono mt-0.5">{idx + 1}.</span><span>{step}</span></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            {rec.status === 'pending' && (
                              <>
                                <Button onClick={() => updateRecMut.mutate({ id: rec.id, action: 'accepted' })} disabled={updateRecMut.isPending} size="sm" className="h-[30px] text-[11px] bg-[#0f5c56] text-white hover:bg-[#0a3f3b]"><CheckCircle2 className="h-3 w-3 mr-1.5" /> Accept to Tasks</Button>
                                <Button onClick={() => updateRecMut.mutate({ id: rec.id, action: 'deferred' })} disabled={updateRecMut.isPending} variant="outline" size="sm" className="h-[30px] text-[11px]">Defer</Button>
                                <Button onClick={() => updateRecMut.mutate({ id: rec.id, action: 'rejected' })} disabled={updateRecMut.isPending} variant="destructive" size="sm" className="h-[30px] text-[11px]">Reject</Button>
                              </>
                            )}
                            {rec.status === 'accepted' && (
                              <Button onClick={() => updateRecMut.mutate({ id: rec.id, action: 'in_progress' })} disabled={updateRecMut.isPending} size="sm" className="h-[30px] text-[11px] bg-[#0f5c56] text-white hover:bg-[#0a3f3b]"><ArrowRight className="h-3 w-3 mr-1.5" /> Start</Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ═══════════ HISTORY TAB ═══════════ */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="bg-[#0f5c56] px-5 py-4">
                <h2 className="text-[14px] font-semibold text-white">Execution Logs</h2>
              </div>
              <div className="p-5">
                {runs.isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#0f5c56]" />
                ) : (runs.data || []).length === 0 ? (
                  <p className="text-[12px] text-gray-500">No runs executed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(runs.data || []).map((run: any) => (
                      <div key={run.id} className="flex flex-col md:flex-row justify-between md:items-center p-3 border border-[#e5e7eb] rounded-lg bg-gray-50/50">
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900">Analysis • {new Date(run.created_at).toLocaleDateString()}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{run.llm_model}</p>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", run.status === 'completed' ? "bg-[#e6f7f1] text-[#0f5c56] border-[#24d18f]/30" : "bg-red-50 text-red-600 border-red-200")}>{run.status}</span>
                          <p className="text-[11px] text-gray-500 mt-1">{run.recommendation_count} recs • {run.duration_seconds?.toFixed(1)}s</p>
                        </div>
                      </div>
                    ))}
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

// ── Components ────────────────────────────────────────────────────────
function StatCard({ title, value, unit, icon: Icon }: any) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 relative overflow-hidden group hover:border-[#24d18f]/50 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-[#0f5c56] flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-[13px] font-semibold text-gray-600">{title}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[26px] font-bold text-gray-900 tracking-tight">{value ?? '—'}</span>
        {unit && <span className="text-[12px] font-medium text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: any) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1">{icon}<p className="text-[10px] font-bold uppercase tracking-wider">{label}</p></div>
      <p className="font-semibold text-[13px] text-gray-900">{value}</p>
    </div>
  );
}

function GoalDetailCard({ gp }: { gp: any }) {
  const [expanded, setExpanded] = useState(false);
  const maxSourceKg = Math.max(...gp.source_breakdown.map((s:any) => s.total_kg), 1);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-5 border-b border-[#f0f1f5] flex justify-between items-start">
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">{gp.goal_name}</h3>
          <p className="text-[12px] text-gray-500 mt-0.5 capitalize">{gp.goal_type.replace('_', ' ')} • Target {gp.target_year}</p>
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded", gp.on_track ? "bg-[#e6f7f1] text-[#0f5c56]" : "bg-red-100 text-red-700")}>
          {gp.on_track ? 'On Track' : 'Off Track'}
        </span>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            <span>Reduction Progress</span>
            <span className="text-[#0f5c56]">{gp.completion_pct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#f0f1f5] rounded-full h-2">
            <div className={cn("h-2 rounded-full", gp.on_track ? "bg-[#24d18f]" : "bg-red-500")} style={{ width: `${Math.min(gp.completion_pct, 100)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Current YTD', value: `${kgToTonne(gp.current_kg)}t` },
            { label: 'Target Pathway', value: `${kgToTonne(gp.estimated_target_kg_this_year)}t` },
            { label: 'Variance', value: `${gp.gap_kg > 0 ? '+' : ''}${kgToTonne(gp.gap_kg)}t`, highlight: gp.gap_kg > 0 },
            { label: 'Time Left', value: `${gp.years_remaining} yrs` },
          ].map(k => (
            <div key={k.label} className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{k.label}</p>
              <p className={cn("text-[16px] font-bold mt-0.5", k.highlight ? "text-red-500" : "text-gray-900")}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-[#e5e7eb]">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Pace</p>
              <p className="text-[14px] font-semibold text-gray-900 mt-0.5">{kgToTonne(gp.current_annual_pace_kg)}t / yr</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Required Pace</p>
              <p className="text-[14px] font-semibold text-gray-900 mt-0.5">{kgToTonne(gp.annual_reduction_needed_kg)}t / yr</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider", gp.pace_status === 'ahead' ? "bg-[#e6f7f1] text-[#0f5c56]" : gp.pace_status === 'on_pace' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600")}>
            {gp.pace_status === 'ahead' && <TrendingDown className="h-3.5 w-3.5" />}
            {gp.pace_status === 'on_pace' && <CheckCircle2 className="h-3.5 w-3.5" />}
            {gp.pace_status === 'behind' && <AlertCircle className="h-3.5 w-3.5" />}
            <span>{gp.pace_status.replace('_', ' ')}</span>
          </div>
        </div>

        <button onClick={() => setExpanded(v => !v)} className="w-full text-center text-[12px] font-medium text-[#0f5c56] hover:underline">
          {expanded ? 'Hide Breakdowns' : 'View Scope & Source Breakdowns'}
        </button>

        {expanded && (
          <div className="space-y-6 pt-4 border-t border-[#f0f1f5]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[13px] font-semibold text-gray-900">By Source</p>
                {gp.source_breakdown.map((s:any) => (
                  <div key={s.source_type} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-medium text-gray-600">
                      <span className="capitalize">{s.source_type.replace('_', ' ')}</span>
                      <span>{kgToTonne(s.total_kg)}t ({s.percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-[#f0f1f5] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[#0f5c56]" style={{ width: `${(s.total_kg / maxSourceKg) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <p className="text-[13px] font-semibold text-gray-900">By Scope</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(gp.scope_breakdown).map(([scope, kg]) => (
                    <div key={scope} className="bg-white border border-[#e5e7eb] rounded-lg p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{scope.replace('_', ' ')}</p>
                      <p className="text-[14px] font-semibold text-gray-900 mt-0.5">{kgToTonne(kg as number)}t</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}