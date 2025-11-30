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
    "#688b0d",
    "#80ad10",
    "#99ce13",
    "#afe91c",
    "#bbed3d",
    "#c7f05f",
    "#d2f380",
    "#def6a1"

  ]

  const marketPalette = [
    "#574d27",
    "#706333",
    "#89793e",
    "#a28f49",
    "#b5a15c",
    "#c0af75",
    "#cbbe8e",
    "#d7cca7"

  ]

  const scopePalette: Record<number, string> = {
    1: "#8f8209", // Dark Orange (Scope 1 - Direct)
    2: "#efd90f", // Orange (Scope 2 - Indirect Energy)
    3: "#f5e86f", // Light Orange (Scope 3 - Other Indirect)
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
    <div className="bg-[#fcfdf6] px-6 py-8 space-y-8">
      {/* Header */}
      <div>
         <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 " style={{ color: '#080c04' }}>Emissions Breakdown</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Breakdown of your marketing-related CO₂e emissions across different channels, markets, and scopes.
          Calculated using <strong className="text-[#080c04]">verified emission factors</strong>.
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
            icon={<TrendingUp className="h-5 w-5 text-gray-600 " />}
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