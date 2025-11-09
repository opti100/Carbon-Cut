"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Leaf } from "lucide-react"
import { format } from "date-fns"

interface EmissionsData {
  date: string
  fullDate: string
  emissions: number
}

interface EmissionsTrendChartProps {
  data: EmissionsData[]
  totalEmissions: number
  dateRange: {
    start: string
    end: string
  }
}

const chartConfig = {
  emissions: {
    label: "Emissions (kg)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function EmissionsTrendChart({ data, totalEmissions, dateRange }: EmissionsTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>Carbon Emissions Trend</CardTitle>
          <CardDescription>No emissions data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No emissions data to display
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>Carbon Emissions Trend</CardTitle>
        <CardDescription>Daily emissions in kg CO₂e</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
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
                  labelFormatter={(value) => value}
                  formatter={(value) => [`${Number(value).toFixed(4)} kg`, "Emissions"]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="emissions"
              type="natural"
              fill="url(#fillEmissions)"
              stroke="var(--color-emissions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <Leaf className="h-4 w-4 text-green-600" />
              Total emissions: {totalEmissions.toFixed(4)} kg CO₂e
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground text-xs">
              {format(new Date(dateRange.start), "MMM dd")} - {format(new Date(dateRange.end), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
