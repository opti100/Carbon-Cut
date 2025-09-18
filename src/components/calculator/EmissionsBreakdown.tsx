import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      case 2: return { icon: Globe, color: "text-yellow-600", bg: "bg-yellow-50" };
      case 3: return { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" };
      default: return { icon: BarChart3, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getScopeBadgeStyle = (scope: number) => {
    switch (scope) {
      case 1: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3: return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Format emissions with up to 5 decimal places
  const formatEmissions = (value: number) => {
    return value.toFixed(5);
  };

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-2xl text-gray-900 font-semibold flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          Emissions Breakdown
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Detailed analysis of your carbon footprint across channels, markets, and scopes.
        </p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* By Channel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">By Channel</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {Object.entries(totals.byChannel).length > 0 ? (
                Object.entries(totals.byChannel)
                  .sort(([, a], [, b]) => b - a)
                  .map(([channel, co2]) => (
                    <div key={channel} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 truncate">{channel}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatEmissions(co2)} kg
                          </span>
                          <div className="text-xs text-gray-500">
                            {getPercentage(co2, totals.total)}%
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={getPercentage(co2, totals.total)} 
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No channel data available
                </div>
              )}
            </div>
          </div>
          
          {/* By Market */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">By Market</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {Object.entries(totals.byMarket).length > 0 ? (
                Object.entries(totals.byMarket)
                  .sort(([, a], [, b]) => b - a)
                  .map(([market, co2]) => (
                    <div key={market} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 truncate">{market}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatEmissions(co2)} kg
                          </span>
                          <div className="text-xs text-gray-500">
                            {getPercentage(co2, totals.total)}%
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={getPercentage(co2, totals.total)} 
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No market data available
                </div>
              )}
            </div>
          </div>
          
          {/* By Scope */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-4 w-4 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">By Scope</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {Object.entries(totals.byScope)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([scope, co2]) => {
                  const scopeNum = parseInt(scope);
                  const scopeConfig = getScopeIcon(scopeNum);
                  const IconComponent = scopeConfig.icon;
                  
                  return (
                    <div key={scope} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${scopeConfig.bg}`}>
                            <IconComponent className={`h-3 w-3 ${scopeConfig.color}`} />
                          </div>
                          <Badge variant="outline" className={getScopeBadgeStyle(scopeNum)}>
                            Scope {scope}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatEmissions(co2)} kg
                          </span>
                          <div className="text-xs text-gray-500">
                            {getPercentage(co2, totals.total)}%
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={getPercentage(co2, totals.total)} 
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}