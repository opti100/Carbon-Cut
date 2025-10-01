import { TrendingUp, Globe, Zap } from "lucide-react"
import { EmissionsPieChart } from "../PieChart"

interface EmissionsBreakdownProps {
  totals: {
    total: number
    byChannel: Record<string, number>
    byMarket: Record<string, number>
    byScope: Record<number, number>
  }
}

export default function EmissionsBreakdown({ totals }: EmissionsBreakdownProps) {
  // Check if there's any data to display
  const hasChannelData = Object.values(totals.byChannel).some(value => value > 0)
  const hasMarketData = Object.values(totals.byMarket).some(value => value > 0)
  const hasScopeData = Object.values(totals.byScope).some(value => value > 0)
  
  // If no data exists, render nothing
  if (!hasChannelData && !hasMarketData && !hasScopeData) {
    return null
  }

  // Color palettes for each chart type
  const channelPalette = [
    "#374151", // Gray 700 - Dark Gray
    "#4B5563", // Gray 600 - Medium Dark Gray
    "#6B7280", // Gray 500 - Medium Gray
    "#9CA3AF", // Gray 400 - Light Gray
    "#D1D5DB", // Gray 300 - Very Light Gray
    "#E5E7EB", // Gray 200 - Pale Gray
    "#F3F4F6", // Gray 100 - Very Pale Gray
    "#111827", // Gray 900 - Very Dark Gray
  ]

  const marketPalette = [
    "#059669", // Green 600 - Dark Green
    "#10B981", // Green 500 - Medium Green
    "#34D399", // Green 400 - Light Green
    "#6EE7B7", // Green 300 - Very Light Green
    "#A7F3D0", // Green 200 - Pale Green
    "#D1FAE5", // Green 100 - Very Pale Green
    "#047857", // Green 700 - Very Dark Green
    "#065F46", // Green 800 - Darkest Green
  ]

  const scopePalette: Record<number, string> = {
    1: "#EA580C", // Dark Orange (Scope 1 - Direct)
    2: "#F97316", // Orange (Scope 2 - Indirect Energy)
    3: "#FB923C", // Light Orange (Scope 3 - Other Indirect)
  }

  // Transform data for charts - only include data with values > 0
  const channelData = Object.entries(totals.byChannel)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      fill: channelPalette[index % channelPalette.length],
    }))

  const marketData = Object.entries(totals.byMarket)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      fill: marketPalette[index % marketPalette.length],
    }))

  const scopeData = Object.entries(totals.byScope)
    .filter(([, value]) => value > 0)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([scope, value]) => ({
      name: `Scope ${scope}`,
      value,
      fill: scopePalette[parseInt(scope)] || "#F97316",
    }))

  return (
    <div className="bg-gray-50 px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Emissions Breakdown
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Breakdown of your marketing-related CO₂e emissions across different channels, markets, and scopes.
          Calculated using <strong className="text-orange-500">verified emission factors</strong>.
        </p>
      </div>

      {/* Pie Charts Grid - Only show charts that have data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* By Channel - Only render if there's channel data */}
        {hasChannelData && (
          <EmissionsPieChart
            title="By Channel"
            data={channelData}
            totalLabel="Total"
            icon={<TrendingUp className="h-5 w-5 text-gray-600" />}
          />
        )}

        {/* By Market - Only render if there's market data */}
        {hasMarketData && (
          <EmissionsPieChart
            title="By Market"
            data={marketData}
            totalLabel="Total"
            icon={<Globe className="h-5 w-5 text-green-600" />}
          />
        )}

        {/* By Scope - Only render if there's scope data */}
        {hasScopeData && (
          <EmissionsPieChart
            title="By Scope"
            data={scopeData}
            totalLabel="Total"
            icon={<Zap className="h-5 w-5 text-orange-600" />}
          />
        )}
      </div>
    </div>
  )
}