import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Globe, Zap, BarChart3 } from "lucide-react";

interface EmissionsBreakdownProps {
  totals: {
    total: number;
    byChannel: Record<string, number>;
    byMarket: Record<string, number>;
    byScope: Record<number, number>;
  };
}

export default function EmissionsBreakdown({ totals }: EmissionsBreakdownProps) {
  const getScopeIcon = (scope: number) => {
    switch (scope) {
      case 1: return { icon: Zap, color: "text-red-600", bg: "bg-red-50" };
      case 2: return { icon: Globe, color: "text-orange-600", bg: "bg-orange-50" };
      case 3: return { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" };
      default: return { icon: BarChart3, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getScopeBadgeStyle = (scope: number) => {
    switch (scope) {
      case 1: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-orange-100 text-orange-800 border-orange-200";
      case 3: return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const formatEmissions = (value: number) => value.toFixed(5);

  return (
    <div className="bg-gray-50 px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Emissions Breakdown</h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Breakdown of your marketing-related CO₂e emissions across different channels, markets, and scopes. 
          Calculated using <strong className="text-orange-500">verified emission factors</strong>.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* By Channel */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-tertiary" />
            By Channel
          </h3>
          <div className="space-y-4">
            {Object.entries(totals.byChannel).length > 0 ? (
              Object.entries(totals.byChannel)
                .sort(([, a], [, b]) => b - a)
                .map(([channel, co2], index) => (
                  <div key={channel} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 truncate">{channel}</span>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${index === 0 ? 'text-tertiary' : 'text-gray-900'}`}>
                          {formatEmissions(co2)} kg
                        </span>
                        <div className="text-xs text-gray-500">{getPercentage(co2, totals.total)}%</div>
                      </div>
                    </div>
                    <Progress
                      value={getPercentage(co2, totals.total)}
                      className="h-2 bg-gray-200"
                      style={{
                        '--progress-foreground': index === 0
                          ? 'hsl(var(--tertiary))'
                          : index === 1
                          ? 'hsl(var(--orange-500))'
                          : 'hsl(var(--gray-400))'
                      } as React.CSSProperties}
                    />
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">No channel data available.</p>
            )}
          </div>
        </div>

        {/* By Market */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-orange-600" />
            By Market
          </h3>
          <div className="space-y-4">
            {Object.entries(totals.byMarket).length > 0 ? (
              Object.entries(totals.byMarket)
                .sort(([, a], [, b]) => b - a)
                .map(([market, co2], index) => (
                  <div key={market} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 truncate">{market}</span>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${index === 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {formatEmissions(co2)} kg
                        </span>
                        <div className="text-xs text-gray-500">{getPercentage(co2, totals.total)}%</div>
                      </div>
                    </div>
                    <Progress
                      value={getPercentage(co2, totals.total)}
                      className="h-2 bg-gray-200"
                      style={{
                        '--progress-foreground': index === 0
                          ? 'hsl(var(--orange-500))'
                          : index === 1
                          ? 'hsl(var(--tertiary))'
                          : 'hsl(var(--gray-400))'
                      } as React.CSSProperties}
                    />
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">No market data available.</p>
            )}
          </div>
        </div>

        {/* By Scope */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-600" />
            By Scope
          </h3>
          <div className="space-y-4">
            {Object.entries(totals.byScope)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([scope, co2]) => {
                const scopeNum = parseInt(scope);
                const { icon: Icon, color, bg } = getScopeIcon(scopeNum);
                return (
                  <div key={scope} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded border ${bg} border-gray-200`}>
                          <Icon className={`h-3 w-3 ${color}`} />
                        </div>
                        <Badge variant="outline" className={getScopeBadgeStyle(scopeNum)}>
                          Scope {scope}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${color}`}>
                          {formatEmissions(co2)} kg
                        </span>
                        <div className="text-xs text-gray-500">{getPercentage(co2, totals.total)}%</div>
                      </div>
                    </div>
                    <Progress
                      value={getPercentage(co2, totals.total)}
                      className="h-2 bg-gray-200"
                      style={{
                        '--progress-foreground':
                          scopeNum === 1
                            ? 'hsl(var(--red-500))'
                            : scopeNum === 2
                            ? 'hsl(var(--orange-500))'
                            : 'hsl(var(--blue-500))'
                      } as React.CSSProperties}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
