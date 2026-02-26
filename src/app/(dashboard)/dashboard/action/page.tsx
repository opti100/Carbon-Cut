'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, Clock, DollarSign, TrendingDown, AlertCircle,
  Loader2, Zap, Users, ArrowRight, ChevronDown, ChevronUp,
  ListTodo, BarChart3, Cpu, Wrench, Leaf, Ban, RefreshCcw,
  XCircle, Wand2, Sparkles, Plus,
} from 'lucide-react';
import { api } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// ── API ───────────────────────────────────────────────────────────────────
const actApi = {
  getTasks: (params?: { status?: string; action_type?: string; execution_type?: string }) =>
    api.get('/act/tasks/', { params }).then(r => r.data.data ?? []),

  getStats: () =>
    api.get('/act/stats/').then(r => r.data.data),

  createFromRec: (recommendation_id: string) =>
    api.post('/act/tasks/from-recommendation/', { recommendation_id }).then(r => r.data),

  createFromRun: (run_id: string, only_accepted = true) =>
    api.post('/act/tasks/from-run/', { run_id, only_accepted }).then(r => r.data),

  updateTask: (task_id: string, data: Partial<ActTask>) =>
    api.patch(`/act/tasks/${task_id}/`, data).then(r => r.data.data),
};

const decideApi = {
  getRecommendations: (status?: string) =>
    api.get('/decide/recommendations/', { params: status ? { status } : {} })
      .then(r => r.data.data ?? []),
  getRuns: () =>
    api.get('/decide/runs/').then(r => r.data.data ?? []),
};

// ── Types ─────────────────────────────────────────────────────────────────
interface ActTask {
  id: string;
  recommendation_id: string;
  user_id: string;
  action_type: 'avoidance' | 'reduction' | 'substitution' | 'removal' | 'compensation';
  execution_type: 'manual' | 'machine';
  title: string;
  description: string;
  steps: string[];
  assigned_to: string | null;
  assigned_at: string | null;
  due_date: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  actual_reduction_kg: number | null;
  notes: string | null;
  metadata: {
    priority?: string;
    estimated_reduction_kg?: number | null;
    estimated_cost_usd?: number | null;
    timeframe_weeks?: number | null;
    scope?: string;
    source_type?: string;
  };
  created_at: string;
  updated_at: string;
}

interface Recommendation {
  id: string;
  title: string;
  status: string;
  category: string;
  priority: string;
}

interface AnalysisRun {
  id: string;
  status: string;
  created_at: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_TRANSITIONS: Record<string, { label: string; next: string; icon: React.ReactNode; variant: string }[]> = {
  pending: [
    { label: 'Assign', next: 'assigned', icon: <Users className="h-3.5 w-3.5" />, variant: 'default' },
    { label: 'Cancel', next: 'cancelled', icon: <Ban className="h-3.5 w-3.5" />, variant: 'destructive' },
  ],
  assigned: [
    { label: 'Start Task', next: 'in_progress', icon: <ArrowRight className="h-3.5 w-3.5" />, variant: 'default' },
    { label: 'Cancel', next: 'cancelled', icon: <Ban className="h-3.5 w-3.5" />, variant: 'destructive' },
  ],
  in_progress: [
    { label: 'Mark Complete', next: 'completed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, variant: 'default' },
    { label: 'Mark Failed', next: 'failed', icon: <XCircle className="h-3.5 w-3.5" />, variant: 'destructive' },
  ],
  completed: [],
  cancelled: [
    { label: 'Reopen', next: 'pending', icon: <RefreshCcw className="h-3.5 w-3.5" />, variant: 'outline' },
  ],
  failed: [
    { label: 'Retry', next: 'pending', icon: <RefreshCcw className="h-3.5 w-3.5" />, variant: 'outline' },
  ],
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600 border-transparent',
  assigned: 'bg-blue-50 text-blue-600 border-blue-200',
  in_progress: 'bg-[#e6f7f1] text-[#0f5c56] border-[#24d18f]/30',
  completed: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  failed: 'bg-red-50 text-red-600 border-red-200',
};

const ACTION_TYPE_COLORS: Record<string, string> = {
  avoidance:    'bg-gray-100 text-gray-700',
  reduction:    'bg-[#0f5c56]/10 text-[#0f5c56]',
  substitution: 'bg-blue-50 text-blue-600',
  removal:      'bg-amber-50 text-amber-600',
  compensation: 'bg-purple-50 text-purple-600',
};

const ACTION_TYPE_ICONS: Record<string, React.ReactNode> = {
  avoidance:    <Ban className="h-4 w-4" />,
  reduction:    <TrendingDown className="h-4 w-4" />,
  substitution: <RefreshCcw className="h-4 w-4" />,
  removal:      <Leaf className="h-4 w-4" />,
  compensation: <Zap className="h-4 w-4" />,
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-amber-100 text-amber-700',
  medium:   'bg-blue-100 text-blue-700',
  low:      'bg-gray-100 text-gray-600',
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function ActPage() {
  const [tab, setTab] = useState<'tasks' | 'generate' | 'stats'>('tasks');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [executionFilter, setExecutionFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [generateFeedback, setGenerateFeedback] = useState<string | null>(null);

  const qc = useQueryClient();

  // Queries
  const tasks = useQuery({
    queryKey: ['act-tasks', statusFilter, actionFilter, executionFilter],
    queryFn: () => actApi.getTasks({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      action_type: actionFilter !== 'all' ? actionFilter : undefined,
      execution_type: executionFilter !== 'all' ? executionFilter : undefined,
    }),
  });

  const stats = useQuery({
    queryKey: ['act-stats'],
    queryFn: actApi.getStats,
  });

  const recommendations = useQuery({
    queryKey: ['decide-recommendations-accepted'],
    queryFn: () => decideApi.getRecommendations('accepted'),
    enabled: tab === 'generate',
  });

  const runs = useQuery({
    queryKey: ['decide-runs'],
    queryFn: decideApi.getRuns,
    enabled: tab === 'generate',
  });

  // Mutations
  const updateTaskMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActTask> }) => actApi.updateTask(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['act-tasks'] }); qc.invalidateQueries({ queryKey: ['act-stats'] }); },
  });

  const createFromRecMut = useMutation({
    mutationFn: (rec_id: string) => actApi.createFromRec(rec_id),
    onSuccess: (data) => {
      setGenerateFeedback(`Task created: ${data.data?.title ?? 'Done'}`);
      qc.invalidateQueries({ queryKey: ['act-tasks'] }); qc.invalidateQueries({ queryKey: ['act-stats'] }); qc.invalidateQueries({ queryKey: ['decide-recommendations-accepted'] });
    },
    onError: (err: any) => { setGenerateFeedback(err?.response?.data?.error ?? 'Failed to create task'); },
  });

  const createFromRunMut = useMutation({
    mutationFn: (run_id: string) => actApi.createFromRun(run_id, true),
    onSuccess: (data) => {
      setGenerateFeedback(`${data.count ?? 0} task(s) generated from run`);
      qc.invalidateQueries({ queryKey: ['act-tasks'] }); qc.invalidateQueries({ queryKey: ['act-stats'] }); qc.invalidateQueries({ queryKey: ['decide-recommendations-accepted'] });
    },
    onError: (err: any) => { setGenerateFeedback(err?.response?.data?.error ?? 'Failed to generate tasks'); },
  });

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTaskMut.mutate({ id: taskId, data: { status: newStatus as ActTask['status'] } });
  };

  const latestRun: AnalysisRun | undefined = (runs.data ?? []).find((r: AnalysisRun) => r.status === 'completed');
  const existingRecIds = new Set((tasks.data ?? []).map((t: ActTask) => t.recommendation_id));

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] font-sans pb-10">
      <div className="mx-auto max-w-[1300px] px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">ACT Manager</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Track and execute generated reduction tasks</p>
          </div>
          {latestRun && (
            <Button
              onClick={() => { setTab('generate'); createFromRunMut.mutate(latestRun.id); }}
              disabled={createFromRunMut.isPending}
              size="sm"
              className="h-[34px] text-[12px] rounded-md bg-[#0f5c56] text-white hover:bg-[#0a3f3b] gap-1.5 shadow-sm shrink-0"
            >
              {createFromRunMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Generate from Latest Run
            </Button>
          )}
        </div>

        {/* Alerts */}
        {updateTaskMut.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[12px] text-red-600 font-medium">Failed to update task. Please try again.</p>
          </div>
        )}
        {updateTaskMut.isSuccess && (
          <div className="bg-[#e6f7f1] border border-[#24d18f]/30 rounded-lg p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#0f5c56]" />
            <p className="text-[12px] text-[#0f5c56] font-medium">Task updated successfully.</p>
          </div>
        )}

        <Tabs value={tab} onValueChange={v => setTab(v as any)} className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 rounded-lg h-auto gap-1 border border-[#e5e7eb]">
            <TabsTrigger value="tasks" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none flex items-center gap-2">
              <ListTodo className="h-3.5 w-3.5" /> Tasks
            </TabsTrigger>
            <TabsTrigger value="generate" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none flex items-center gap-2">
              <Wand2 className="h-3.5 w-3.5" /> Generate
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-[13px] font-semibold text-gray-600 data-[state=active]:bg-[#0f5c56] data-[state=active]:text-white rounded-md px-5 py-1.5 transition-all shadow-none flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" /> Statistics
            </TabsTrigger>
          </TabsList>

          {/* ═══════ TASKS TAB ═══════════════════════════════════════════════ */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[12px]">All Statuses</SelectItem>
                  <SelectItem value="pending" className="text-[12px]">Pending</SelectItem>
                  <SelectItem value="assigned" className="text-[12px]">Assigned</SelectItem>
                  <SelectItem value="in_progress" className="text-[12px]">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-[12px]">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px] h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue placeholder="All Action Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[12px]">All Actions</SelectItem>
                  <SelectItem value="avoidance" className="text-[12px]">Avoidance</SelectItem>
                  <SelectItem value="reduction" className="text-[12px]">Reduction</SelectItem>
                  <SelectItem value="substitution" className="text-[12px]">Substitution</SelectItem>
                </SelectContent>
              </Select>

              <Select value={executionFilter} onValueChange={setExecutionFilter}>
                <SelectTrigger className="w-[140px] h-[34px] text-[12px] rounded-md border-[#e5e7eb] focus:ring-[#0f5c56]"><SelectValue placeholder="All Execution" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[12px]">All Execution</SelectItem>
                  <SelectItem value="manual" className="text-[12px]">Manual</SelectItem>
                  <SelectItem value="machine" className="text-[12px]">Machine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tasks.isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0f5c56]" /></div>
            ) : (tasks.data ?? []).length === 0 ? (
              <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <ListTodo className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-gray-900">No active tasks</p>
                <p className="text-[12px] text-gray-500 mt-1">Switch to the <button onClick={() => setTab('generate')} className="text-[#0f5c56] font-medium hover:underline">Generate tab</button> to create tasks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(tasks.data ?? []).map((task: ActTask) => (
                  <TaskCard
                    key={task.id} task={task} expanded={expandedTask === task.id}
                    onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    onStatusChange={handleStatusChange} isPending={updateTaskMut.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ═══════ GENERATE TAB ════════════════════════════════════════════ */}
          <TabsContent value="generate" className="space-y-6">

            {generateFeedback && (
              <div className={cn(
                "border rounded-lg p-3 flex items-center gap-2.5 shadow-sm",
                generateFeedback.startsWith('Failed') || generateFeedback.startsWith('Task') ? 'bg-red-50 border-red-200 text-red-600' : 'bg-[#e6f7f1] border-[#24d18f]/30 text-[#0f5c56]'
              )}>
                {generateFeedback.startsWith('Failed') || generateFeedback.startsWith('Task') ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <p className="text-[12px] font-medium">{generateFeedback}</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              
              {/* Individual Recs */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                <div className="bg-[#0f5c56] px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-white" />
                    <h2 className="text-[14px] font-semibold text-white">Convert Recommendations</h2>
                  </div>
                </div>
                
                <div className="p-5">
                  {recommendations.isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0f5c56]" /></div>
                  ) : (recommendations.data ?? []).length === 0 ? (
                    <div className="text-center py-10">
                      <CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-[12px] text-gray-500">No accepted recommendations found.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(recommendations.data as Recommendation[]).map(rec => {
                        const exists = existingRecIds.has(rec.id);
                        return (
                          <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb] hover:border-[#0f5c56]/30 bg-gray-50/50 transition-colors gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-gray-900 truncate">{rec.title}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", PRIORITY_STYLES[rec.priority] || 'bg-gray-100 text-gray-600')}>{rec.priority}</span>
                                <span className="text-[10px] text-gray-500 font-mono bg-white border border-[#e5e7eb] px-1.5 py-0.5 rounded capitalize">{rec.category}</span>
                                {exists && <span className="text-[10px] text-[#0f5c56] font-medium bg-[#e6f7f1] px-1.5 py-0.5 rounded">Task Created</span>}
                              </div>
                            </div>
                            <Button
                              size="sm" variant={exists ? 'outline' : 'default'}
                              onClick={() => createFromRecMut.mutate(rec.id)}
                              disabled={exists || createFromRecMut.isPending}
                              className={cn("h-[30px] text-[11px] gap-1.5 shrink-0", !exists && "bg-[#0f5c56] hover:bg-[#0a3f3b] text-white")}
                            >
                              {createFromRecMut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                              {exists ? 'Added' : 'Create Task'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Bulk Run Card */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-fit">
                <div className="p-5 border-b border-[#f0f1f5]">
                  <h2 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#0f5c56]" /> Bulk Generate</h2>
                  <p className="text-[12px] text-gray-500 mt-1">Convert all accepted recommendations from a recent run into tasks instantly.</p>
                </div>
                <div className="p-5">
                  {runs.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0f5c56]" />
                  ) : (runs.data ?? []).length === 0 ? (
                    <p className="text-[12px] text-gray-500">No analysis runs found.</p>
                  ) : (
                    <div className="space-y-3">
                      {(runs.data as AnalysisRun[]).filter(r => r.status === 'completed').slice(0, 3).map(run => (
                        <div key={run.id} className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3">
                          <p className="text-[12px] font-semibold text-gray-900">
                            Run • {new Date(run.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{run.id}</p>
                          <Button
                            size="sm" onClick={() => createFromRunMut.mutate(run.id)} disabled={createFromRunMut.isPending}
                            className="w-full mt-3 h-[30px] text-[11px] bg-white border border-[#e5e7eb] text-gray-700 hover:bg-gray-50 shadow-sm gap-1.5"
                          >
                            {createFromRunMut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                            Generate Tasks
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </TabsContent>

          {/* ═══════ STATS TAB ═══════════════════════════════════════════════ */}
          <TabsContent value="stats" className="space-y-6">
            {stats.isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0f5c56]" /></div>
            ) : stats.data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Tasks', value: stats.data.total, icon: ListTodo },
                    { label: 'In Progress', value: stats.data.by_status?.in_progress ?? 0, icon: ArrowRight },
                    { label: 'Completed', value: stats.data.by_status?.completed ?? 0, icon: CheckCircle2 },
                    { label: 'Actual Reduction', value: `${(stats.data.actual_reduction_kg / 1000).toFixed(1)}`, unit: 't CO₂', icon: TrendingDown },
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
                        {stat.unit && <span className="text-[12px] font-medium text-gray-500">{stat.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                    <h2 className="text-[14px] font-semibold text-gray-900 mb-5 flex items-center gap-2"><Clock className="h-4 w-4 text-[#0f5c56]" /> Status Distribution</h2>
                    <div className="space-y-4">
                      {Object.entries(stats.data.by_status || {}).map(([status, count]) => {
                        const pct = stats.data.total > 0 ? ((count as number) / stats.data.total) * 100 : 0;
                        return (
                          <div key={status} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-medium text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                              <span className="text-[12px] font-bold text-gray-900">{count as number} <span className="text-[10px] font-normal text-gray-400 ml-1">({pct.toFixed(0)}%)</span></span>
                            </div>
                            <div className="w-full bg-[#f0f1f5] rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#24d18f] h-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                    <h2 className="text-[14px] font-semibold text-gray-900 mb-5 flex items-center gap-2"><Zap className="h-4 w-4 text-[#0f5c56]" /> Action Types</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(stats.data.by_action_type || {}).map(([type, count]) => (
                        <div key={type} className={cn("rounded-lg p-3 border", ACTION_TYPE_COLORS[type] ? `border-${ACTION_TYPE_COLORS[type].split(' ')[1]}/20 ${ACTION_TYPE_COLORS[type].split(' ')[0]}` : 'bg-gray-50 border-[#e5e7eb]')}>
                          <div className={cn("flex items-center gap-1.5 mb-1", ACTION_TYPE_COLORS[type] ? ACTION_TYPE_COLORS[type].split(' ')[1] : 'text-gray-500')}>
                            {ACTION_TYPE_ICONS[type]}
                            <p className="text-[11px] font-bold uppercase tracking-wider">{type}</p>
                          </div>
                          <p className="text-[20px] font-bold text-gray-900">{count as number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── TaskCard ───────────────────────────────────────────────────────────────
function TaskCard({ task, expanded, onToggle, onStatusChange, isPending }: {
  task: ActTask; expanded: boolean; onToggle: () => void; onStatusChange: (id: string, status: string) => void; isPending: boolean;
}) {
  const transitions = STATUS_TRANSITIONS[task.status] ?? [];
  return (
    <div className={cn("bg-white border rounded-xl overflow-hidden transition-all duration-200", expanded ? "border-[#0f5c56] shadow-[0_2px_8px_rgba(15,92,86,0.08)]" : "border-[#e5e7eb] hover:border-[#0f5c56]/30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]")}>
      <div className="p-4 cursor-pointer flex items-start justify-between gap-4" onClick={onToggle}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5", ACTION_TYPE_COLORS[task.action_type] ?? 'bg-gray-100 text-gray-500')}>
            {ACTION_TYPE_ICONS[task.action_type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-[14px] font-semibold text-gray-900 truncate max-w-[60%]">{task.title}</h3>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", STATUS_STYLES[task.status])}>
                {task.status.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-gray-500 bg-gray-50 border border-[#e5e7eb] px-1.5 py-0.5 rounded capitalize">{task.execution_type}</span>
              {task.metadata?.priority && (
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", PRIORITY_STYLES[task.metadata.priority] || 'bg-gray-100 text-gray-600')}>
                  {task.metadata.priority}
                </span>
              )}
            </div>
            <p className="text-[12px] text-gray-500 line-clamp-1">{task.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
          <div className="flex items-center gap-4 text-[12px] font-medium">
            {task.metadata?.estimated_reduction_kg && (
              <span className="text-[#0f5c56] flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5" /> {(task.metadata.estimated_reduction_kg / 1000).toFixed(1)}t</span>
            )}
            {task.metadata?.estimated_cost_usd && (
              <span className="text-gray-500 flex items-center gap-1"><DollarSign className="h-3 w-3" /> {task.metadata.estimated_cost_usd.toLocaleString()}</span>
            )}
          </div>
          <div className="p-1 rounded hover:bg-gray-100 text-gray-400">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-5 border-t border-[#f0f1f5] bg-gray-50/30 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricBox label="Timeframe" value={task.metadata?.timeframe_weeks ? `${task.metadata.timeframe_weeks} weeks` : 'N/A'} icon={<Clock className="h-3.5 w-3.5" />} />
            <MetricBox label="Est. Cost" value={task.metadata?.estimated_cost_usd ? `$${task.metadata.estimated_cost_usd.toLocaleString()}` : 'N/A'} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <MetricBox label="Scope" value={task.metadata?.scope ?? 'General'} icon={<Zap className="h-3.5 w-3.5" />} />
            <MetricBox label="Source" value={task.metadata?.source_type ?? 'N/A'} icon={<Leaf className="h-3.5 w-3.5" />} />
          </div>

          {task.steps?.length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-4">
              <p className="text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-3">Implementation Steps</p>
              <ul className="space-y-2">
                {task.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-[13px] text-gray-700">
                    <span className="text-gray-400 font-mono mt-0.5">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.notes && (
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Notes</p>
              <p className="text-[12px] text-gray-600">{task.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3 text-[11px] text-gray-400 font-mono">
              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              {task.completed_at && <span>Completed: {new Date(task.completed_at).toLocaleDateString()}</span>}
            </div>
            
            {transitions.length > 0 && (
              <div className="flex gap-2">
                {transitions.map(t => (
                  <Button
                    key={t.next} onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, t.next); }}
                    disabled={isPending} size="sm"
                    className={cn("h-[30px] text-[11px] gap-1.5 shadow-sm", 
                      t.variant === 'default' ? "bg-[#0f5c56] text-white hover:bg-[#0a3f3b]" : 
                      t.variant === 'destructive' ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : 
                      "bg-white border border-[#e5e7eb] text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {t.icon}{t.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1">{icon}<p className="text-[11px] font-bold uppercase tracking-wider">{label}</p></div>
      <p className="font-semibold text-[13px] text-gray-900">{value}</p>
    </div>
  );
}