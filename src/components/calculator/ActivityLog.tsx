import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Edit3, Calendar, Globe, Target, Activity, Hash } from "lucide-react";

interface ActivityLogProps {
  activities: ActivityData[];
  countries: CountryData[];
  channels: ChannelUnits;
  calculatingEmissions: Record<number, boolean>;
  getDisplayCO2: (activity: ActivityData) => number;
  onUpdateActivity: (activityId: number, updates: Partial<ActivityData>) => void;
}

export default function ActivityLog({ 
  activities, 
  countries, 
  channels, 
  calculatingEmissions, 
  getDisplayCO2, 
  onUpdateActivity 
}: ActivityLogProps) {
  const getScopeColor = (scope: number) => {
    switch (scope) {
      case 1: return "bg-red-50 text-red-700 border-red-200";
      case 2: return "bg-orange-50 text-orange-700 border-orange-200"; // Changed to orange
      case 3: return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getScopeIcon = (scope: number) => {
    switch (scope) {
      case 1: return "🔥";
      case 2: return "⚡";
      case 3: return "🌐";
      default: return "📊";
    }
  };

  const formatEmissions = (value: number) => {
    return value.toFixed(5);
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white px-6 py-8">
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-tertiary/20 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-tertiary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No activities yet</h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Add your first marketing activity using the form above to see it appear in this comprehensive activity log.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Activity Log
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Review and edit your marketing activities. Changes are automatically saved. 
          We use <strong className="text-orange-500">verified emission factors</strong> for accurate calculations.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-tertiary/10 rounded-lg p-4 border border-tertiary/20">
          <div className="text-sm text-tertiary font-medium">Total Activities</div>
          <div className="text-2xl font-bold text-gray-900">{activities.length}</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-orange-600 font-medium">Channels</div>
          <div className="text-2xl font-bold text-gray-900">{new Set(activities.map(a => a.channel)).size}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Markets</div>
          <div className="text-2xl font-bold text-gray-900">{new Set(activities.map(a => a.market)).size}</div>
        </div>

        <div className="bg-gradient-to-br from-tertiary/10 to-orange-50 rounded-lg p-4 border border-tertiary/30">
          <div className="text-sm text-tertiary font-medium">Total CO₂e</div>
          <div className="text-xl font-bold text-orange-600">
            {formatEmissions(activities.reduce((sum, activity) => sum + getDisplayCO2(activity), 0))} kg
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="border border-gray-200 rounded-lg p-6 hover:border-tertiary/30 transition-colors duration-200">
            {/* Activity Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index % 2 === 0 
                    ? 'bg-tertiary/10 border border-tertiary/20' 
                    : 'bg-orange-100 border border-orange-200'
                }`}>
                  <span className={`text-sm font-bold ${
                    index % 2 === 0 ? 'text-tertiary' : 'text-orange-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {activity.campaign || `Activity ${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">{activity.channel} • {activity.market}</p>
                </div>
              </div>
              
              <div className="text-right">
                {calculatingEmissions[activity.id] ? (
                  <div className="flex items-center gap-2 text-tertiary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Calculating...</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {formatEmissions(getDisplayCO2(activity))} kg CO₂e
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ {(getDisplayCO2(activity) / 1000).toFixed(6)} tCO₂e
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Date</Label>
                <Input
                  type="date" 
                  value={activity.date} 
                  onChange={(e) => onUpdateActivity(activity.id, { date: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 focus:border-tertiary focus:ring-tertiary/20"
                />
              </div>

              {/* Market */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Market</Label>
                <Select
                  value={activity.market}
                  onValueChange={(value) => onUpdateActivity(activity.id, { market: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-tertiary focus:ring-tertiary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country, idx) => (
                      <SelectItem key={idx} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campaign */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Campaign name</Label>
                <Input
                  type="text" 
                  value={activity.campaign || ""} 
                  onChange={(e) => onUpdateActivity(activity.id, { campaign: e.target.value })}
                  placeholder="Campaign name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Channel */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Channel</Label>
                <Select
                  value={activity.channel}
                  onValueChange={(newChannel) => {
                    const newUnits = channels[newChannel];
                    const newUnit = newUnits ? newUnits[0][1] : activity.unit;
                    onUpdateActivity(activity.id, { 
                      channel: newChannel, 
                      unit: newUnit,
                      activityLabel: newUnits ? newUnits[0][0] : activity.activityLabel
                    });
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-tertiary focus:ring-tertiary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(channels).map(channel => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scope */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Emission Scope</Label>
                <Select
                  value={activity.scope.toString()}
                  onValueChange={(value) => onUpdateActivity(activity.id, { scope: parseInt(value) })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <span>{getScopeIcon(1)}</span>
                        <span>Scope 1 - Direct emissions</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <span>{getScopeIcon(2)}</span>
                        <span>Scope 2 - Indirect energy</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <span>{getScopeIcon(3)}</span>
                        <span>Scope 3 - Value chain</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-start">
                  <Badge variant="outline" className={getScopeColor(activity.scope)}>
                    <span className="mr-2">{getScopeIcon(activity.scope)}</span>
                    Scope {activity.scope}
                  </Badge>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Quantity</Label>
                <Input
                  type="number" 
                  value={activity.qty} 
                  onChange={(e) => onUpdateActivity(activity.id, { qty: parseFloat(e.target.value) || 0 })}
                  className="bg-white border-gray-300 text-gray-900 focus:border-tertiary focus:ring-tertiary/20"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-gray-500">
                  Unit: <span className="text-orange-600 font-medium">{activity.activityLabel}</span> ({activity.unit})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}