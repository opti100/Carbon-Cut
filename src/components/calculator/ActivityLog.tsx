import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Input } from "@/components/ui/input";
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
      case 2: return "bg-yellow-50 text-yellow-700 border-yellow-200";
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-gray-400" />
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
            <p className="text-gray-600 text-sm mt-1">
              Review and edit your marketing activities. Changes are automatically saved.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1">
          {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Activities</p>
              <p className="text-2xl font-bold text-blue-900">{activities.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Channels</p>
              <p className="text-2xl font-bold text-green-900">{new Set(activities.map(a => a.channel)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700 font-medium">Markets</p>
              <p className="text-2xl font-bold text-purple-900">{new Set(activities.map(a => a.market)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-emerald-700 font-medium">Total CO₂e</p>
              <p className="text-lg font-bold text-emerald-900">
                {formatEmissions(activities.reduce((sum, activity) => sum + getDisplayCO2(activity), 0))} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-600" />
            Activity Details
          </h3>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-gray-500" />
                    #
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    Date
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-gray-500" />
                    Market
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-gray-500" />
                    Campaign
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Channel
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Scope
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-gray-500" />
                    Activity
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CO₂e (kg)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <tr key={activity.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200 group">
                  {/* Row Number */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-700">{index + 1}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Input
                      type="date" 
                      value={activity.date} 
                      onChange={(e) => onUpdateActivity(activity.id, { date: e.target.value })}
                      className="w-full min-w-[140px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm"
                    />
                  </td>

                  {/* Market */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Select
                      value={activity.market}
                      onValueChange={(value) => onUpdateActivity(activity.id, { market: value })}
                    >
                      <SelectTrigger className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                        {countries.map((country, idx) => (
                          <SelectItem key={idx} value={country.name} className="text-gray-900 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country.gridIntensity}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Campaign */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="relative">
                      <Input
                        type="text" 
                        value={activity.campaign || ""} 
                        onChange={(e) => onUpdateActivity(activity.id, { campaign: e.target.value })}
                        placeholder="Campaign name"
                        className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm"
                      />
                      <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-4 whitespace-nowrap">
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
                      <SelectTrigger className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                        {Object.keys(channels).map(channel => (
                          <SelectItem key={channel} value={channel} className="text-gray-900 hover:bg-gray-50 rounded">
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Scope */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Select
                      value={activity.scope.toString()}
                      onValueChange={(value) => onUpdateActivity(activity.id, { scope: parseInt(value) })}
                    >
                      <SelectTrigger className="w-full min-w-[100px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-lg">
                        <SelectItem value="1" className="text-gray-900 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getScopeIcon(1)}</span>
                            <Badge variant="outline" className={getScopeColor(1)}>
                              Scope 1
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="2" className="text-gray-900 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getScopeIcon(2)}</span>
                            <Badge variant="outline" className={getScopeColor(2)}>
                              Scope 2
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="3" className="text-gray-900 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getScopeIcon(3)}</span>
                            <Badge variant="outline" className={getScopeColor(3)}>
                              Scope 3
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Activity */}
                  <td className="px-4 py-4">
                    <div className="max-w-[150px]">
                      <div className="text-sm text-gray-700 font-medium truncate bg-gray-50 px-3 py-2 rounded-lg border" 
                           title={activity.activityLabel}>
                        {activity.activityLabel}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Unit: {activity.unit}
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="relative">
                      <Input
                        type="number" 
                        value={activity.qty} 
                        onChange={(e) => onUpdateActivity(activity.id, { qty: parseFloat(e.target.value) || 0 })}
                        className="w-full min-w-[100px] bg-white border-gray-300 text-gray-900 text-right focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm text-sm font-mono"
                        min="0"
                        step="0.01"
                      />
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {activity.unit}
                      </div>
                    </div>
                  </td>

                  {/* CO2e */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-right">
                      {calculatingEmissions[activity.id] ? (
                        <div className="flex items-center justify-end gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">Calculating...</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-200">
                            <div className="text-sm font-bold text-green-700" 
                                 title={`Precise calculation: ${formatEmissions(getDisplayCO2(activity))} kg CO₂e`}>
                              {formatEmissions(getDisplayCO2(activity))}
                            </div>
                            <div className="text-xs text-green-600 font-medium">kg CO₂e</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            ≈ {(getDisplayCO2(activity) / 1000).toFixed(6)} tCO₂e
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}