"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TimeSeriesData {
  date: string
  emissions: number
}

interface EmissionsTrendChartProps {
  data: TimeSeriesData[]
  totalEmissions: number
  dateRange: { start: string; end: string }
}

const chartConfig = {
  emissions: {
    label: "Emissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EmissionsTrendChart({ data, totalEmissions, dateRange }: EmissionsTrendChartProps) {
  return (
    <Card className="border bg-white rounded-sm">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Carbon Emissions Trend</CardTitle>
          <CardDescription>Daily emissions in kg CO₂e</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-emissions)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-emissions)" stopOpacity={0.1} />
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
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => [`${Number(value).toFixed(4)} kg`, "Emissions"]}
                  labelFormatter={(value) => value}
                />
              }
            />
            <Area
              dataKey="emissions"
              type="natural"
              fill="url(#fillEmissions)"
              stroke="var(--color-emissions)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
