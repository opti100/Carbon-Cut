"use client"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Leaf } from "lucide-react"

interface EmissionsBreakdownData {
  category: string
  emissions: number
  fill: string
}

interface EmissionsBreakdownChartProps {
  data: EmissionsBreakdownData[]
  totalEmissions: number
}

const chartConfig = {
  emissions: { label: "Emissions (kg)" },
  impressions: {
    label: "Impressions",
    color: "#10b981",
  },
  pageviews: {
    label: "Page Views",
    color: "#3b82f6",
  },
  clicks: {
    label: "Clicks",
    color: "#f59e0b",
  },
  conversions: {
    label: "Conversions",
    color: "#ec4899",
  },
} satisfies ChartConfig

export function EmissionsBreakdownChart({ data, totalEmissions }: EmissionsBreakdownChartProps) {
  const coloredData = data.map((item) => {
    const cfg = chartConfig[item.category as keyof typeof chartConfig] as {
      label: string
      color?: string
    }
    return {
      ...item,
      fill: cfg?.color ?? item.fill,
    }
  })

  if (!data || data.length === 0) {
    return (
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>No emissions data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No emissions data to display
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border bg-white rounded-md">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b  sm:flex-row  ">
        <div className="grid flex-1 gap-1">
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>Carbon footprint by activity type</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-64">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{name}:</span>
                      <span className="font-semibold">{Number(value).toFixed(4)} kg</span>
                      <span className="text-xs text-muted-foreground">
                        ({((Number(value) / totalEmissions) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie data={coloredData} dataKey="emissions" nameKey="category" innerRadius={50} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {totalEmissions.toFixed(3)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                          kg CO₂e
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <Leaf className="h-4 w-4 text-green-600" />
          Total carbon footprint
        </div>
        <div className="leading-none text-muted-foreground text-xs">Showing breakdown for the selected period</div>
      </CardFooter>
    </Card>
  )
}
