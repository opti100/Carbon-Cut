import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database } from "lucide-react";


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
  // const getScopeColor = (scope: number) => {
  //   switch (scope) {
  //     case 1: return "bg-red-100 text-red-800 border-red-200";
  //     case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case 3: return "bg-blue-100 text-blue-800 border-blue-200";
  //     default: return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-2xl text-gray-900 font-semibold flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          Activity Log
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Review and edit your marketing activities. Click on any field to make changes.
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">#</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Market</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Campaign</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Channel</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Scope</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Activity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">CO₂e (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      type="date" 
                      value={activity.date} 
                      onChange={(e) => onUpdateActivity(activity.id, { date: e.target.value })}
                      className="w-full min-w-[140px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Select
                      value={activity.market}
                      onValueChange={(value) => onUpdateActivity(activity.id, { market: value })}
                    >
                      <SelectTrigger className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {countries.map((country, idx) => (
                          <SelectItem key={idx} value={country.name} className="text-gray-900">
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      type="text" 
                      value={activity.campaign || ""} 
                      onChange={(e) => onUpdateActivity(activity.id, { campaign: e.target.value })}
                      placeholder="Campaign name"
                      className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </td>
                  <td className="py-4 px-6">
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
                      <SelectTrigger className="w-full min-w-[120px] bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {Object.keys(channels).map(channel => (
                          <SelectItem key={channel} value={channel} className="text-gray-900">
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-6">
                    <Select
                      value={activity.scope.toString()}
                      onValueChange={(value) => onUpdateActivity(activity.id, { scope: parseInt(value) })}
                    >
                      <SelectTrigger className="w-full min-w-[90px] bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="1" className="text-gray-900">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Scope 1
                          </Badge>
                        </SelectItem>
                        <SelectItem value="2" className="text-gray-900">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Scope 2
                          </Badge>
                        </SelectItem>
                        <SelectItem value="3" className="text-gray-900">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Scope 3
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700 font-medium max-w-[150px] truncate" title={activity.activityLabel}>
                      {activity.activityLabel}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      type="number" 
                      value={activity.qty} 
                      onChange={(e) => onUpdateActivity(activity.id, { qty: parseFloat(e.target.value) || 0 })}
                      className="w-full min-w-[100px] bg-white border-gray-300 text-gray-900 text-right focus:border-blue-500 focus:ring-blue-500/20"
                      min="0"
                      step="1"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {calculatingEmissions[activity.id] ? (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Calculating...</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900" 
                               title={`Precise calculation: ${getDisplayCO2(activity).toFixed(6)} kg CO₂e`}>
                            {Math.round(getDisplayCO2(activity) * 10000) / 10000}
                          </div>
                          <div className="text-xs text-gray-500">kg CO₂e</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-500">
              Add your first marketing activity above to see it appear in this log.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}