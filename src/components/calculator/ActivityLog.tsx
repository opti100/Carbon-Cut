import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Label } from "@/components/ui/label";
import { Circle, Loader2, SquareEqual } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

interface ActivityLogProps {
  activities: ActivityData[];
  countries: CountryData[];
  channels: ChannelUnits;
  calculatingEmissions: Record<number, boolean>;
  getDisplayCO2: (activity: ActivityData) => number;
  onUpdateActivity: (activityId: number, updates: Partial<ActivityData>) => void;
  latestActivityId?: number | null;
}

const CHART_COLORS = [
  "hsl(77, 83%, 35%)",
  "hsl(77, 83%, 41%)",
  "hsl(77, 83%, 46%)",
  "hsl(77, 83%, 52%)",
  "hsl(77, 83%, 57%)",
  "hsl(77, 83%, 63%)",
  "hsl(77, 83%, 68%)",
  "hsl(77, 83%, 74%)",
  "hsl(77, 83%, 79%)",
  "hsl(77, 83%, 85%)"
];

export default function ActivityLog({
  activities,
  countries,
  channels,
  calculatingEmissions,
  getDisplayCO2,
  onUpdateActivity,
  latestActivityId
}: ActivityLogProps) {

  const formatEmissions = (value: number) => value.toFixed(5);

  // Controlled accordion value that updates when latestActivityId changes
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    latestActivityId ? `activity-${latestActivityId}` : undefined
  );

  // Update open accordion when latestActivityId changes
  useEffect(() => {
    if (latestActivityId) {
      setOpenAccordion(`activity-${latestActivityId}`);
    }
  }, [latestActivityId]);

  if (activities.length === 0) return <div></div>;

  return (
    <div className="px-6 py-8 space-y-6" style={{ backgroundColor: '#fcfdf6' }}>

      {/* Header */}
      <div>
         <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 " style={{ color: '#080c04' }}>Activity Log</h1>
        <h2 className="text-2xl lg:text-3xl font-semibold " style={{ color: '#080c04' }}>
          Impact Overview
        </h2>
        <p className="mt-2 max-w-3xl mb-4 sm:mb-6" style={{ color: '#6c5f31' }}>
          Review and edit your marketing activities. Changes are automatically saved.
          We use <strong style={{ color: '#080c04' }}>verified emission factors</strong> for accurate calculations.
        </p>
      </div>

      {/* Activities Accordion */}
      <Accordion
        type="single"
        className="space-y-4"
        collapsible
        value={openAccordion}
        onValueChange={setOpenAccordion}
      >
        {activities.map((activity, index) => {

          const pieChartData =
            activity.quantities
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
              value={`activity-${activity.id}`}
              className="rounded-lg overflow-hidden transition-colors duration-200"
              style={{ border: '1px solid #d1cebb', backgroundColor: '#fcfdf6' }}
            >
              <AccordionTrigger
                className="hover:no-underline px-6 py-4"
                style={{ backgroundColor: '#d1cebb' }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-6 h-6  flex items-center justify-center" >
                    {/* <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffffff' }}></div> */}
                    <SquareEqual  className="text-[#080c04]" />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#080c04' }}>
                    #{String(index + 1).padStart(3, '0')}: {activity.campaign || 'Log'}
                  </h3>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 flex" style={{ backgroundColor: '#fcfdf620' }}>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 items-stretch flex-1">

                  {/* Column 1 – Activity Details */}
                  <div className="flex flex-col h-full space-y-6">
                    <div>
                      <Label className="text-2xl font-semibold mb-2 block" style={{ color: '#6c5f31' }}>
                        Activity Details
                      </Label>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Date</Label>
                          <p className="text-sm" style={{ color: '#080c04' }}>
                            {new Date(activity.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Country</Label>
                          <p className="text-sm" style={{ color: '#080c04' }}>
                            {activity.market}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Channel</Label>
                          <p className="text-sm" style={{ color: '#080c04' }}>
                            {activity.channel}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Scope</Label>
                          <p className="text-sm" style={{ color: '#080c04' }}>
                            Scope {activity.scope} (
                            {activity.scope === 1 ? 'direct emissions' :
                              activity.scope === 2 ? 'indirect energy' : 'value chain'}
                            )
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Campaign</Label>
                          <p className="text-sm" style={{ color: '#080c04' }}>
                            {activity.campaign || '-'}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block" style={{ color: '#6c5f31' }}>Notes</Label>
                          <p className="text-sm leading-relaxed" style={{ color: '#6c5f31' }}>
                            {activity.notes || 'No notes available'}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Column 2 – Fixed Pie Chart */}
                  <div className="flex flex-col h-full items-center justify-start overflow-visible">
                    {/* <Label className="text-sm font-semibold mb-4 block" style={{ color: '#6c5f31' }}>
                      Activity Type Distribution
                    </Label> */}

                    {pieChartData.length > 0 ? (
                      <div className="overflow-visible w-full flex items-center justify-center min-h-[360px]">

                        <ChartContainer
                          config={chartConfig}
                          className="overflow-visible flex items-center justify-center"
                          style={{ width: "100%", height: "360px" }}
                        >
                          <PieChart width={360} height={360}>
                            <ChartTooltip content={<ChartTooltipContent />} />

                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}   // FIXED → NO CUTTING
                              dataKey="value"
                              labelLine={false}
                            >
                              {pieChartData.map((entry, idx) => (
                                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ChartContainer>

                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-10 text-gray-400">
                        <p>No activity data available</p>
                      </div>
                    )}
                  </div>

                  {/* Column 3 – Emissions */}
                  <div className="flex flex-col h-full items-center justify-start">
                    {/* <Label className="text-sm font-semibold mb-4 block" style={{ color: '#6c5f31' }}>
                      Carbon Emissions
                    </Label> */}

                    {calculatingEmissions[activity.id] ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-10">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Calculating emissions...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-start space-y-6 py-10">
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-2" style={{ color: '#b0ea1d' }}>
                            {formatEmissions(getDisplayCO2(activity))}
                          </div>
                          <div className="text-lg" style={{ color: '#6c5f31' }}>
                            kg CO₂e
                          </div>
                        </div>

                        <div className="text-center pt-4 w-full" style={{ borderTop: '1px solid #d1cebb' }}>
                          <div className="text-sm mb-1" style={{ color: '#6c5f31' }}>Equivalent to</div>
                          <div className="text-2xl font-semibold" style={{ color: '#6c5f31' }}>
                            {(getDisplayCO2(activity) / 1000).toFixed(6)}
                          </div>
                          <div className="text-sm" style={{ color: '#6c5f31' }}>tCO₂e</div>
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
