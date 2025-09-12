import { ActivityData, ChannelUnits, CountryData } from "@/types/types";


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
  return (
    <section className="mb-8 p-6 bg-black rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Activity Log</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Market</th>
              <th className="text-left p-3">Campaign</th>
              <th className="text-left p-3">Channel</th>
              <th className="text-left p-3">Scope</th>
              <th className="text-left p-3">Activity</th>
              <th className="text-left p-3">Quantity</th>
              <th className="text-left p-3">CO₂e (kg)</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id} className="border-b border-gray-800">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <input 
                    type="date" 
                    value={activity.date} 
                    onChange={(e) => onUpdateActivity(activity.id, { date: e.target.value })}
                    className="w-full p-1 bg-black border border-gray-700 rounded"
                  />
                </td>
                <td className="p-3">
                  <select 
                    value={activity.market} 
                    onChange={(e) => onUpdateActivity(activity.id, { market: e.target.value })}
                    className="w-full p-1 bg-black border border-gray-700 rounded"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={activity.campaign || ""} 
                    onChange={(e) => onUpdateActivity(activity.id, { campaign: e.target.value })}
                    placeholder="Campaign name"
                    className="w-full p-1 bg-black border border-gray-700 rounded"
                  />
                </td>
                <td className="p-3">
                  <select 
                    value={activity.channel} 
                    onChange={(e) => {
                      const newChannel = e.target.value;
                      const newUnits = channels[newChannel];
                      const newUnit = newUnits ? newUnits[0][1] : activity.unit;
                      onUpdateActivity(activity.id, { 
                        channel: newChannel, 
                        unit: newUnit,
                        activityLabel: newUnits ? newUnits[0][0] : activity.activityLabel
                      });
                    }}
                    className="w-full p-1 bg-black border border-gray-700 rounded"
                  >
                    {Object.keys(channels).map(channel => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select 
                    value={activity.scope} 
                    onChange={(e) => onUpdateActivity(activity.id, { scope: parseInt(e.target.value) })}
                    className="w-full p-1 bg-black border border-gray-700 rounded"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </td>
                <td className="p-3">{activity.activityLabel}</td>
                <td className="p-3">
                  <input 
                    type="number" 
                    value={activity.qty} 
                    onChange={(e) => onUpdateActivity(activity.id, { qty: parseFloat(e.target.value) || 0 })}
                    className="w-full p-1 bg-black border border-gray-700 rounded text-right"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="p-3">
                  {calculatingEmissions[activity.id] ? (
                    <span className="text-gray-400">Calculating...</span>
                  ) : (
                    <span title={`Precise calculation: ${getDisplayCO2(activity).toFixed(6)} kg CO₂e`}>
                      {Math.round(getDisplayCO2(activity) * 10000) / 10000}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}