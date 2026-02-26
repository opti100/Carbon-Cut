'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

interface Props {
  month: number
  year: number
  setMonth: (m: number) => void
  setYear: (y: number) => void
}

export default function PeriodSelector({ month, year, setMonth, setYear }: Props) {
  return (
    <div className="flex items-center gap-2">
      
      {/* Month Select */}
      <Select
        value={month.toString()}
        onValueChange={(value) => setMonth(Number(value))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={i} value={(i + 1).toString()}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Select */}
      <Select
        value={year.toString()}
        onValueChange={(value) => setYear(Number(value))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {[2024, 2025, 2026].map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  )
}
