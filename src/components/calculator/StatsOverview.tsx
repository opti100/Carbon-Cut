"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Factory, Zap, Globe, LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatsOverviewProps {
  totals: {
    total: number;
    byScope: Record<number, number>;
  };
}

export default function StatsOverview({ totals }: StatsOverviewProps) {
  const router = useRouter();

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

  const handleLogin = () => {
    router.push('/login');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <section className="mb-8">
      <div className="mb-6 text-center relative">
        {/* Login/Dashboard Button - Positioned absolutely on the right */}
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button
            onClick={handleDashboard}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Carbon Footprint Calculator</h2>
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