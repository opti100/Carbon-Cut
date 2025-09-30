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
  // Orange-themed color palettes for all charts
  const channelPalette = [
    "#FF6B35", // Bright Orange
    "#FF8C42", // Light Orange
    "#FFAA5C", // Peach
    "#FFC679", // Light Peach
    "#FFD89C", // Pale Orange
    "#FFE4B5", // Moccasin
    "#F4A261", // Sandy Orange
    "#E76F51", // Burnt Orange
  ]

  const marketPalette = [
    "#F97316", // Orange 500
    "#FB923C", // Orange 400
    "#FDBA74", // Orange 300
    "#FED7AA", // Orange 200
    "#FF8C42", // Light Orange
    "#FFAA5C", // Peach
    "#FFC679", // Light Peach
    "#F4A261", // Sandy Orange
  ]

  const scopePalette: Record<number, string> = {
    1: "#EA580C", // Dark Orange (Scope 1 - Direct)
    2: "#F97316", // Orange (Scope 2 - Indirect Energy)
    3: "#FB923C", // Light Orange (Scope 3 - Other Indirect)
  }

  // Transform data for charts
  const channelData = Object.entries(totals.byChannel)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      fill: channelPalette[index % channelPalette.length],
    }))

  const marketData = Object.entries(totals.byMarket)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      fill: marketPalette[index % marketPalette.length],
    }))

  const scopeData = Object.entries(totals.byScope)
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

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* By Channel */}
        {channelData.length > 0 ? (
          <EmissionsPieChart
            title="By Channel"
            data={channelData}
            totalLabel="Total"
            icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          />
        ) : (
          <div className="flex items-center justify-center p-8 border rounded-lg bg-white">
            <p className="text-sm text-gray-500">No channel data available.</p>
          </div>
        )}

        {/* By Market */}
        {marketData.length > 0 ? (
          <EmissionsPieChart
            title="By Market"
            data={marketData}
            totalLabel="Total"
            icon={<Globe className="h-5 w-5 text-orange-600" />}
          />
        ) : (
          <div className="flex items-center justify-center p-8 border rounded-lg bg-white">
            <p className="text-sm text-gray-500">No market data available.</p>
          </div>
        )}

        {/* By Scope */}
        {scopeData.length > 0 ? (
          <EmissionsPieChart
            title="By Scope"
            data={scopeData}
            totalLabel="Total"
            icon={<Zap className="h-5 w-5 text-orange-600" />}
          />
        ) : (
          <div className="flex items-center justify-center p-8 border rounded-lg bg-white">
            <p className="text-sm text-gray-500">No scope data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}