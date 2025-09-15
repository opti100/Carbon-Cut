import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Factory, Zap, Globe } from "lucide-react";

interface StatsOverviewProps {
  totals: {
    total: number;
    byScope: Record<number, number>;
  };
}

export default function StatsOverview({ totals }: StatsOverviewProps) {
  const stats = [
    {
      label: "Total CO₂e",
      value: totals.total,
      unit: "kg",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      description: "Total carbon footprint"
    },
    {
      label: "Scope 1",
      value: Math.round(totals.byScope[1] * 100) / 100,
      unit: "kg",
      icon: Factory,
      gradient: "from-red-500 to-orange-600",
      description: "Direct emissions"
    },
    {
      label: "Scope 2", 
      value: Math.round(totals.byScope[2] * 100) / 100,
      unit: "kg",
      icon: Zap,
      gradient: "from-yellow-500 to-amber-600",
      description: "Energy indirect"
    },
    {
      label: "Scope 3",
      value: Math.round(totals.byScope[3] * 100) / 100,
      unit: "kg", 
      icon: Globe,
      gradient: "from-blue-500 to-cyan-600",
      description: "Other indirect"
    }
  ];

  return (
    <section className="mb-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Carbon Footprint Overview</h2>
        <p className="text-gray-600">Real-time calculations based on your marketing activities</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">{stat.unit}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</h3>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}