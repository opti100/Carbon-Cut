"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DeviceData {
  device: string
  sessions: number
  conversions: number
  emissions: number
}

interface DevicePerformanceChartProps {
  data: DeviceData[]
}

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-1))",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DevicePerformanceChart({ data }: DevicePerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>Performance by Device</CardTitle>
          <CardDescription>No device data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No device data to display
        </CardContent>
      </Card>
    )
  }

  const totalDevices = data.length
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0)
  const totalEmissions = data.reduce((sum, item) => sum + item.emissions, 0)

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>Performance by Device</CardTitle>
        <CardDescription>Sessions and conversions by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
            <XAxis dataKey="device" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value, name) => {
                    if (name === "emissions") {
                      return [`${Number(value).toFixed(4)} kg`, "Emissions"]
                    }
                    return [value, name]
                  }}
                />
              }
            />
            <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[8, 8, 0, 0]} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Device performance comparison</div>
        <div className="leading-none text-muted-foreground text-xs">
          {totalDevices} device type{totalDevices !== 1 ? "s" : ""} • {totalConversions} conversions •{" "}
          {totalEmissions.toFixed(4)} kg CO₂e
        </div>
      </CardFooter>
    </Card>
  )
}
