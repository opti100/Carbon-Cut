import { ActivityData, ChannelUnits, CountryData } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Edit3, Calendar, Globe, Target, Activity, Hash, Edit2, Trash2, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* <div className="bg-gray-50 rounded-lg p-6 text-center relative">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image src="\impact-overview\total-activites.svg" alt="Total activities" width={70} height={70} />
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Total Activities <span className="text-gray-400">-</span> <span className="text-2xl font-semibold text-gray-900">{activities.length}</span>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-200"></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center relative">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image src="\impact-overview\channels.svg" alt="Channels" width={70} height={70} />
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Channels <span className="text-gray-400">-</span> <span className="text-2xl font-semibold text-gray-900">{new Set(activities.map(a => a.channel)).size}</span>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-200"></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center relative">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image src="\impact-overview\markets.svg" alt="Markets" width={70} height={70} />
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Markets <span className="text-gray-400">-</span> <span className="text-2xl font-semibold text-gray-900">{new Set(activities.map(a => a.market)).size}</span>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-200"></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image src="\impact-overview\total-coe2.svg" alt="total CO₂e" width={70} height={70} />
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Total CO₂e <span className="text-gray-400">-</span> <span className="text-2xl font-semibold text-gray-900">{formatEmissions(activities.reduce((sum, activity) => sum + getDisplayCO2(activity), 0))} kg</span>
          </div>
        </div> */}
      </div>

      {/* Activities Table */}
      
      <Accordion type="single" className="space-y-4" collapsible>
        {activities.map((activity, index) => (
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
              {/* First Row - 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pt-6">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Activity date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Marketing country</Label>
                  <p className="text-sm text-gray-900">{activity.market}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Market channel</Label>
                  <p className="text-sm text-gray-900">{activity.channel}</p>
                </div>
              </div>

              {/* Activity Type Quantities Section */}
              {activity.quantities && Object.keys(activity.quantities).length > 0 && (
                <div className="mb-8">
                  <Label className="text-sm text-gray-600 mb-3 block">Activity Type Quantities</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(activity.quantities).map(([unitKey, data]: [string, any]) => (
                      <div key={unitKey} className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">{data.label}</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {data.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Second Row - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Scope</Label>
                  <p className="text-sm text-gray-900">
                    Scope {activity.scope} ({activity.scope === 1 ? 'direct emissions' : activity.scope === 2 ? 'indirect energy' : 'value chain'})
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Campaign name</Label>
                  <p className="text-sm text-gray-900">{activity.campaign || '-'}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <Label className="text-sm text-gray-600 mb-1 block">Notes</Label>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {activity.notes || 'No notes available'}
                </p>
              </div>

              {/* CO2 Emissions - Right aligned at bottom */}
              {calculatingEmissions[activity.id] ? (
                <div className="flex items-center justify-end gap-2 text-tertiary mt-6 pt-6 border-t border-gray-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Calculating...</span>
                </div>
              ) : (
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">
                      {formatEmissions(getDisplayCO2(activity))} kg CO₂e
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ {(getDisplayCO2(activity) / 1000).toFixed(6)} tCO₂e
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}