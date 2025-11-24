"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface EmissionsPieChartProps {
  title: string
  data: Array<{
    name: string
    value: number
    fill: string
  }>
  totalLabel: string
  icon?: React.ReactNode
}

export function EmissionsPieChart({
  title,
  data,
  totalLabel,
  icon,
}: EmissionsPieChartProps) {
  const totalEmissions = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const formatEmission = (value: number) => {
    if (value > 999) {
      return {
        value: (value / 1000).toFixed(4),
        unit: 't'
      };
    }
    return {
      value: value.toFixed(2),
      unit: 'kg'
    };
  };

  const formattedTotal = formatEmission(totalEmissions);

  // Create dynamic chart config based on data
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color?: string }> = {
      value: { label: "Emissions" },
    }
    
    data.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    
    return config
  }, [data])

  return (
    <Card className="flex flex-col   bg-[#fcfdf6]">
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => {
                    const val = Number(value);
                    const formatted = formatEmission(val);
                    return (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{name}:</span>
                        <span className="font-semibold">{formatted.value} {formatted.unit}</span>
                        <span className="text-xs text-muted-foreground">
                          ({((val / totalEmissions) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              strokeWidth={0}
              stroke="none"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formattedTotal.value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          {formattedTotal.unit} CO₂e
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 34}
                          className="fill-muted-foreground text-xs"
                        >
                          {totalLabel}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          {data.map((item) => {
            const formatted = formatEmission(item.value);
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {formatted.value} {formatted.unit}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({((item.value / totalEmissions) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}