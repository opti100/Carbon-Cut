import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface ActivityLogProps {
  activities: ActivityData[];
  countries: CountryData[];
  channels: ChannelUnits;
  calculatingEmissions: Record<number, boolean>;
  getDisplayCO2: (activity: ActivityData) => number;
  onUpdateActivity: (activityId: number, updates: Partial<ActivityData>) => void;
}

// Color palette for pie chart
const CHART_COLORS = [
  "hsl(142, 76%, 36%)", // green-600
  "hsl(142, 71%, 45%)", // green-500
  "hsl(142, 76%, 55%)", // green-400
  "hsl(142, 77%, 73%)", // green-300
  "hsl(39, 100%, 57%)", // orange-500
  "hsl(33, 100%, 50%)", // orange-600
  "hsl(24, 95%, 53%)", // orange-700
  "hsl(217, 91%, 60%)", // blue-500
];

export default function ActivityLog({
  activities,
  countries,
  channels,
  calculatingEmissions,
  getDisplayCO2,
  onUpdateActivity
}: ActivityLogProps) {
  
  const formatEmissions = (value: number) => {
    return value.toFixed(5);
  };

  if (activities.length === 0) {
    return (
      <div> </div>
    );
  }

  return (
    <div className="bg-gray-50 px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Impact Overview
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Review and edit your marketing activities. Changes are automatically saved.
          We use <strong className="text-orange-500">verified emission factors</strong> for accurate calculations.
        </p>
      </div>

      {/* Activities Accordion */}
      <Accordion type="single" className="space-y-4" collapsible>
        {activities.map((activity, index) => {
          // Prepare pie chart data from activity quantities
          const pieChartData = activity.quantities 
            ? Object.entries(activity.quantities).map(([key, data]: [string, any]) => ({
                name: data.label,
                value: data.value,
              }))
            : [];

          const chartConfig = pieChartData.reduce((acc, item, idx) => ({
            ...acc,
            [item.name]: {
              label: item.name,
              color: CHART_COLORS[idx % CHART_COLORS.length],
            }
          }), {});

          return (
            <AccordionItem
              key={activity.id}
              value={Math.random().toString()}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden hover:border-tertiary/30 transition-colors duration-200"
            >
              <AccordionTrigger className="hover:no-underline px-6 py-4 bg-white border-b border-gray-200 [&[data-state=closed]]:border-b-0">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border-2 border-green-600"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    #{String(index + 1).padStart(3, '0')}: {activity.campaign || 'Log'}
                  </h3>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 bg-gray-50/50">
                {/* 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                  
                  {/* Column 1: Activity Details */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Activity Details</Label>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Date</Label>
                          <p className="text-sm text-gray-900">
                            {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
                          <p className="text-sm text-gray-900">{activity.market}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Channel</Label>
                          <p className="text-sm text-gray-900">{activity.channel}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Scope</Label>
                          <p className="text-sm text-gray-900">
                            Scope {activity.scope} ({activity.scope === 1 ? 'direct emissions' : activity.scope === 2 ? 'indirect energy' : 'value chain'})
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Campaign</Label>
                          <p className="text-sm text-gray-900">{activity.campaign || '-'}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Notes</Label>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {activity.notes || 'No notes available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">Activity Type Distribution</Label>
                    
                    {pieChartData.length > 0 ? (
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell- ${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                        
                        </PieChart>
                      </ChartContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-400">
                        <p>No activity data available</p>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Emissions */}
                  <div className="flex flex-col items-center justify-center">
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">Carbon Emissions</Label>
                    
                    {calculatingEmissions[activity.id] ? (
                      <div className="flex flex-col items-center justify-center gap-3 text-tertiary h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Calculating emissions...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] space-y-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-orange-600 mb-2">
                            {formatEmissions(getDisplayCO2(activity))}
                          </div>
                          <div className="text-lg text-gray-600">kg CO₂e</div>
                        </div>
                        
                        <div className="text-center pt-4 border-t border-gray-200 w-full">
                          <div className="text-xs text-gray-500 mb-1">Equivalent to</div>
                          <div className="text-2xl font-semibold text-gray-700">
                            {(getDisplayCO2(activity) / 1000).toFixed(6)}
                          </div>
                          <div className="text-sm text-gray-500">tCO₂e</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}