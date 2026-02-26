'use client'

import { useState, useCallback } from 'react'

export function usePeriodSelector(defaultMonth?: number, defaultYear?: number) {
  const now = new Date()
  const [year, setYear] = useState(defaultYear ?? now.getFullYear())
  const [month, setMonth] = useState(defaultMonth ?? now.getMonth() + 1)

  const goToPrevMonth = useCallback(() => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }, [month])

  const goToNextMonth = useCallback(() => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }, [month])

  const canGoNext = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)

  const label = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return {
    year,
    month,
    setYear,
    setMonth,
    goToPrevMonth,
    goToNextMonth,
    canGoNext,
    label,
  }
}