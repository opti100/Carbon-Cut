'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Target, Loader2, ArrowRight, Leaf } from 'lucide-react'
import { api } from '@/contexts/AuthContext'

const goalsApi = {
  createGoal: (data: any) => api.post('/decide/goals/', data).then(r => r.data),
}

interface Props {
  onComplete: () => void
}

const DEFAULT_FORM = {
  name: '',
  goal_type: 'reduction_pct',
  baseline_year: new Date().getFullYear() - 1,
  target_year: new Date().getFullYear() + 5,
  target_reduction_pct: 50,
  annual_budget_usd: '',
  scopes_included: ['scope_1', 'scope_2', 'scope_3'],
}

export default function WebsiteGoalSetup({ onComplete }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState(DEFAULT_FORM)

  const createGoalMut = useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decide-goals'] })
      qc.invalidateQueries({ queryKey: ['decide-dashboard'] })
      onComplete()
    },
  })

  const handleSubmit = () => {
    if (!form.name.trim()) return
    createGoalMut.mutate(form)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[520px]">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* <div className="h-14 w-14 rounded-2xl bg-[#0f5c56] flex items-center justify-center mb-4 shadow-md">
            <Target className="h-7 w-7 text-white" />
          </div> */}
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Set Your Carbon Goal</h1>
          <p className="text-[13px] text-gray-500 mt-2 max-w-sm">
            Define a reduction target before exploring your emissions dashboard. This helps track your progress and generate AI recommendations.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 space-y-5">

          {/* Goal Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Goal Name</label>
            <Input
              className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus-visible:ring-[#0f5c56]"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Net Zero by 2030"
            />
          </div>

          {/* Goal Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Goal Type</label>
            <Select value={form.goal_type} onValueChange={v => setForm({ ...form, goal_type: v })}>
              <SelectTrigger className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus:ring-[#0f5c56]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reduction_pct" className="text-[13px]">Percentage Reduction</SelectItem>
                <SelectItem value="net_zero" className="text-[13px]">Net Zero</SelectItem>
                <SelectItem value="absolute_target" className="text-[13px]">Absolute Target</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reduction Target */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Reduction Target (%)</label>
              <Input
                type="number"
                className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus-visible:ring-[#0f5c56]"
                value={form.target_reduction_pct}
                onChange={e => setForm({ ...form, target_reduction_pct: +e.target.value })}
              />
            </div>

            {/* Target Year */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Target Year</label>
              <Input
                type="number"
                className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus-visible:ring-[#0f5c56]"
                value={form.target_year}
                onChange={e => setForm({ ...form, target_year: +e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Baseline Year */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Baseline Year</label>
              <Input
                type="number"
                className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus-visible:ring-[#0f5c56]"
                value={form.baseline_year}
                onChange={e => setForm({ ...form, baseline_year: +e.target.value })}
              />
            </div>

            {/* Annual Budget */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Budget / yr (USD) <span className="normal-case font-normal text-gray-400">optional</span></label>
              <Input
                type="number"
                className="h-[38px] text-[13px] rounded-lg border-[#e5e7eb] focus-visible:ring-[#0f5c56]"
                value={form.annual_budget_usd}
                onChange={e => setForm({ ...form, annual_budget_usd: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>

          {/* Error */}
          {createGoalMut.isError && (
            <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              Failed to create goal. Please try again.
            </p>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={createGoalMut.isPending || !form.name.trim()}
            className="w-full h-[42px] rounded-lg bg-[#0f5c56] hover:bg-[#0a3f3b] text-white text-[13px] font-semibold gap-2"
          >
            {createGoalMut.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Target className="h-4 w-4" />}
            {createGoalMut.isPending ? 'Creating Goal…' : 'Create Goal & Continue'}
            {!createGoalMut.isPending && <ArrowRight className="h-4 w-4 ml-auto" />}
          </Button>

          {/* Skip hint */}
          <p className="text-center text-[11px] text-gray-400">
            You can manage and update goals anytime from the{' '}
            <span className="font-medium text-[#0f5c56]">Decide</span> section.
          </p>
        </div>

        {/* Footer badge */}
        {/* <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-gray-400">
          <Leaf className="h-3.5 w-3.5 text-[#24d18f]" />
          Science-based targets aligned with GHG Protocol
        </div> */}
      </div>
    </div>
  )
}
