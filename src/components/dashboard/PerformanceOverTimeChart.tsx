'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimeSeriesData {
  date: string
  fullDate: string
  impressions: number
  sessions: number
  conversions: number
}

interface PerformanceOverTimeChartProps {
  data: TimeSeriesData[]
  dateRange: {
    start: string
    end: string
  }
}

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'hsl(var(--chart-1))',
  },
  sessions: {
    label: 'Sessions',
    color: 'hsl(var(--chart-2))',
  },
  conversions: {
    label: 'Conversions',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function PerformanceOverTimeChart({
  data,
  dateRange,
}: PerformanceOverTimeChartProps) {
  const [timeRange, setTimeRange] = React.useState('90d')
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('impressions')

  const filteredData = data.slice(-Number.parseInt(timeRange, 10))

  return (
    <Card className="border bg-white rounded-sm">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Impressions, sessions, and conversions trend</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-impressions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-impressions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />
              }
            />
            <Area
              dataKey="impressions"
              type="natural"
              fill="url(#fillImpressions)"
              stroke="var(--color-impressions)"
              stackId="a"
            />
            <Area
              dataKey="sessions"
              type="natural"
              fill="url(#fillSessions)"
              stroke="var(--color-sessions)"
              stackId="a"
            />
            <Area
              dataKey="conversions"
              type="natural"
              fill="url(#fillConversions)"
              stroke="var(--color-conversions)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
