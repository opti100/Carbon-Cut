"use client";

import { CHANNELS, DEFAULT_SCOPE, FALLBACK_CALCULATION, loadCountriesFromScientificData } from '@/constants/data';
import { ActivityData, CountryData, OrganizationData } from '@/types/types';
import { useState, useEffect, useCallback } from 'react';
import OrganizationForm from './organizationForm';
import MarketingActivityForm from './MarketingActivityForm';
import ActivityLog from './ActivityLog';
import EmissionsBreakdown from './EmissionsBreakdown';
import ReportActions from './ReportActions';
import { Card } from '../ui/card';

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  console.log('All cookies:', value);
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

interface MarketingCalculatorProps {
  onStatsUpdate?: (stats: {
    totalActivities: number;
    channels: number;
    markets: number;
    totalCO2e: number;
  }) => void;
  initialData?: {
    organization: string;
    reportingPeriod?: any;
    separateOffsets: boolean;
    campaignPeriod?: any;
    market: string;
    channel: string;
    emissionScope: number;
    campaignName: string;
    note: string;
  };
}

export default function MarketingCalculator({ onStatsUpdate, initialData }: MarketingCalculatorProps = {}) {
  const [organization, setOrganization] = useState<OrganizationData>({
    name: initialData?.organization || '',
    period: initialData?.reportingPeriod ? 
      `${initialData.reportingPeriod.from ? new Date(initialData.reportingPeriod.from).toLocaleDateString() : ''} - ${initialData.reportingPeriod.to ? new Date(initialData.reportingPeriod.to).toLocaleDateString() : ''}` : '',
    offsets: initialData?.separateOffsets ? 'Yes' : 'No'
  });

  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [calculatingEmissions, setCalculatingEmissions] = useState<Record<number | string, boolean>>({});
  const [emissionResults, setEmissionResults] = useState<Record<number | string, number>>({});
  const [availableCountries, setAvailableCountries] = useState<CountryData[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const countries = await loadCountriesFromScientificData();
        setAvailableCountries(countries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Update stats whenever activities or emissions change
  useEffect(() => {
    if (onStatsUpdate) {
      const uniqueChannels = new Set(activities.map(a => a.channel)).size;
      const uniqueMarkets = new Set(activities.map(a => a.market)).size;
      const totalCO2e = Object.values(emissionResults).reduce((sum, val) => sum + val, 0);

      onStatsUpdate({
        totalActivities: activities.length,
        channels: uniqueChannels,
        markets: uniqueMarkets,
        totalCO2e,
      });
    }
  }, [activities, emissionResults, onStatsUpdate]);

  // Update calcCO2AI to handle combined activities
  const calcCO2AI = useCallback(async (activity: ActivityData): Promise<number> => {
    const activityId = activity.id;

    // ✅ NEW: Handle combined activities with multiple quantities
    if (activity.quantities && Object.keys(activity.quantities).length > 0) {
      let totalEmissions = 0;

      // Calculate emissions for each quantity type
      for (const [unitKey, data] of Object.entries(activity.quantities)) {
        const individualActivityId = `${activityId}_${unitKey}`;
        
        // Skip if already calculating or already have result
        if (calculatingEmissions[individualActivityId] || emissionResults[individualActivityId] !== undefined) {
          if (emissionResults[individualActivityId] !== undefined) {
            totalEmissions += emissionResults[individualActivityId];
          }
          continue;
        }

        try {
          setCalculatingEmissions(prev => ({ ...prev, [individualActivityId]: true }));

          const authToken = getCookie('auth-token');
          if (!authToken) {
            throw new Error('Authentication required');
          }

          // Create individual activity data for this specific unit
          const requestBody = {
            userInput: {
              activityType: data.label,
              channel: activity.channel,
              market: activity.market,
              quantity: data.value,
              unit: unitKey,
              scope: activity.scope || 3,
              date: activity.date || new Date().toISOString().split('T')[0],
              campaign: activity.campaign,
              electricity: unitKey.includes('kWh') ? data.value : undefined,
              transport: unitKey.includes('km') ? {
                mode: unitKey.replace('_km', ''),
                distance: data.value,
                country: activity.market,
                date: activity.date
              } : undefined,
              digital: {
                type: unitKey,
                quantity: data.value,
                channel: activity.channel,
                market: activity.market,
                activityType: data.label,
                scope: activity.scope,
                date: activity.date
              },
              country: activity.market,
              includeDeviceEnergy: false,
              description: `Calculate carbon emissions for ${data.label} activity in ${activity.market} market using ${activity.channel} channel with quantity ${data.value} ${unitKey} on ${activity.date} (Scope ${activity.scope})`
            },
            useAI: true,
            realTimeData: true,
            requirePrecision: true
          };

          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
          const response = await fetch(`${BASE_URL}/inventory/calculate-carbon/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Authentication failed. Please log in again.');
            }
            throw new Error(`API error: ${response.status}`);
          }

          const result = await response.json();
          const emissions = result.success ? result.data.totalEmissions : 0;

          console.log(`✅ API Result for ${unitKey} (${data.label}):`, emissions, 'kg CO₂e');

          // Cache individual unit emissions
          setEmissionResults(prev => ({ ...prev, [individualActivityId]: emissions }));
          totalEmissions += emissions;

        } catch (error) {
          console.error(`❌ Error calculating ${unitKey}:`, error);
          const fallbackEmission = FALLBACK_CALCULATION.getBasicEmission({
            ...activity,
            unit: unitKey,
            qty: data.value
          });
          setEmissionResults(prev => ({ ...prev, [individualActivityId]: fallbackEmission }));
          totalEmissions += fallbackEmission;
        } finally {
          setCalculatingEmissions(prev => ({ ...prev, [individualActivityId]: false }));
        }
      }

      // Store total emissions for the combined activity
      console.log(`✅ Total emissions for activity #${activityId}:`, totalEmissions, 'kg CO₂e');
      setEmissionResults(prev => ({ ...prev, [activityId]: totalEmissions }));
      return totalEmissions;
    }

    // ✅ EXISTING: Original single activity code
    if (calculatingEmissions[activityId]) return 0;
    if (emissionResults[activityId] !== undefined) return emissionResults[activityId];

    try {
      setCalculatingEmissions(prev => ({ ...prev, [activityId]: true }));

      const authToken = getCookie('auth-token');
      if (!authToken) {
        console.warn('No auth token found in cookies');
        throw new Error('Authentication required');
      }

      const requestBody = {
        userInput: {
          activityType: activity.activityLabel,
          channel: activity.channel,
          market: activity.market,
          quantity: activity.qty,
          unit: activity.unit,
          scope: activity.scope || 3,
          date: activity.date || new Date().toISOString().split('T')[0],
          campaign: activity.campaign,
          electricity: activity.unit.includes('kWh') ? activity.qty : undefined,
          transport: activity.unit.includes('km') ? {
            mode: activity.unit.replace('_km', ''),
            distance: activity.qty,
            country: activity.market,
            date: activity.date
          } : undefined,
          digital: {
            type: activity.unit,
            quantity: activity.qty,
            channel: activity.channel,
            market: activity.market,
            activityType: activity.activityLabel,
            scope: activity.scope,
            date: activity.date
          },
          country: activity.market,
          includeDeviceEnergy: false,
          description: `Calculate carbon emissions for ${activity.activityLabel} activity in ${activity.market} market using ${activity.channel} channel with quantity ${activity.qty} ${activity.unit} on ${activity.date} (Scope ${activity.scope})`
        },
        useAI: true,
        realTimeData: true,
        requirePrecision: true
      };

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${BASE_URL}/inventory/calculate-carbon/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('API response not OK');
      }

      const result = await response.json();
      const emissions = result.success ? result.data.totalEmissions : 0;

      setEmissionResults(prev => ({ ...prev, [activityId]: emissions }));
      return emissions;
    } catch (error) {
      console.error('AI calculation failed:', error);
      const fallbackEmission = FALLBACK_CALCULATION.getBasicEmission(activity);
      setEmissionResults(prev => ({ ...prev, [activityId]: fallbackEmission }));
      return fallbackEmission;
    } finally {
      setCalculatingEmissions(prev => ({ ...prev, [activityId]: false }));
    }
  }, [calculatingEmissions, emissionResults]);

  // Update getDisplayCO2 to handle combined activities
  const getDisplayCO2 = useCallback((activity: ActivityData): number => {
    // Check if this is a combined activity with multiple quantities
    if (activity.quantities && Object.keys(activity.quantities).length > 0) {
      // Return cached total if available
      if (emissionResults[activity.id] !== undefined) {
        return emissionResults[activity.id];
      }

      // If calculating any part, return current total or fallback
      const isCalculating = Object.keys(activity.quantities).some(
        unitKey => calculatingEmissions[`${activity.id}_${unitKey}`]
      );

      if (isCalculating) {
        // Return sum of calculated parts + fallback for rest
        let total = 0;
        Object.entries(activity.quantities).forEach(([unitKey, data]) => {
          const individualId = `${activity.id}_${unitKey}`;
          if (emissionResults[individualId] !== undefined) {
            total += emissionResults[individualId];
          } else {
            total += FALLBACK_CALCULATION.getBasicEmission({
              ...activity,
              unit: unitKey,
              qty: data.value
            });
          }
        });
        return total;
      }

      // Trigger calculation if not started
      if (!calculatingEmissions[activity.id]) {
        calcCO2AI(activity);
      }

      // Return fallback total while calculating
      return Object.entries(activity.quantities).reduce((sum, [unitKey, data]) => {
        return sum + FALLBACK_CALCULATION.getBasicEmission({
          ...activity,
          unit: unitKey,
          qty: data.value
        });
      }, 0);
    }

    // Single activity (original behavior)
    if (emissionResults[activity.id] !== undefined) {
      return emissionResults[activity.id];
    }

    if (calculatingEmissions[activity.id]) {
      return FALLBACK_CALCULATION.getBasicEmission(activity);
    }

    if (emissionResults[activity.id] === undefined && !calculatingEmissions[activity.id]) {
      calcCO2AI(activity);
      return FALLBACK_CALCULATION.getBasicEmission(activity);
    }

    return 0;
  }, [emissionResults, calculatingEmissions, calcCO2AI]);

  const updateActivity = useCallback((activityId: number, updates: Partial<ActivityData>) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const updatedActivity = { ...activity, ...updates };

        setEmissionResults(prevResults => {
          const newResults = { ...prevResults };
          delete newResults[activityId];
          return newResults;
        });

        setTimeout(() => calcCO2AI(updatedActivity), 200);
        return updatedActivity;
      }
      return activity;
    }));
  }, [calcCO2AI]);

  const addActivity = useCallback(async (activityData: Omit<ActivityData, 'id'>) => {
    const newActivity: ActivityData = {
      ...activityData,
      id: activities.length + 1
    };

    setActivities(prev => [...prev, newActivity]);
    await calcCO2AI(newActivity);
  }, [activities.length, calcCO2AI]);

  const calculateTotals = useCallback(() => {
    let total = 0;
    const byChannel: Record<string, number> = {};
    const byMarket: Record<string, number> = {};
    const byScope = { 1: 0, 2: 0, 3: 0 };

    activities.forEach(activity => {
      const co2 = getDisplayCO2(activity);
      total += co2;

      byChannel[activity.channel] = (byChannel[activity.channel] || 0) + co2;
      byMarket[activity.market] = (byMarket[activity.market] || 0) + co2;
      byScope[activity.scope as keyof typeof byScope] = (byScope[activity.scope as keyof typeof byScope] || 0) + co2;
    });

    return {
      total: Math.round(total * 100) / 100,
      byChannel,
      byMarket,
      byScope
    };
  }, [activities, getDisplayCO2]);

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-white" >
      {!initialData && (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" >
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
      )}

      <Card className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 mt-28 mb-16 shadow-lg ">
        {/* Only show OrganizationForm if no initialData */}
        {!initialData && (
          <div className="pb-8">
            <OrganizationForm
              organization={organization}
              onOrganizationChange={setOrganization}
            />
          </div>
        )}

        {/* Show summary if initialData is provided */}
        {initialData && (
          <div className="pb-8 pt-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Organization:</span>
                  <p className="text-gray-900">{initialData.organization}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Market:</span>
                  <p className="text-gray-900">{initialData.market}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Channel:</span>
                  <p className="text-gray-900">{initialData.channel}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Scope:</span>
                  <p className="text-gray-900">Scope {initialData.emissionScope}</p>
                </div>
                {initialData.campaignName && (
                  <div>
                    <span className="font-semibold text-gray-700">Campaign:</span>
                    <p className="text-gray-900">{initialData.campaignName}</p>
                  </div>
                )}
                {initialData.note && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-gray-700">Note:</span>
                    <p className="text-gray-900">{initialData.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pb-8">
          <MarketingActivityForm
            channels={CHANNELS}
            defaultScope={DEFAULT_SCOPE}
            countries={availableCountries}
            loadingCountries={loadingCountries}
            onAddActivity={addActivity}
            getDisplayCO2={getDisplayCO2}
            activities={activities}
            calculatingEmissions={calculatingEmissions} 
            emissionResults={emissionResults}
            prefilledMarket={initialData?.market}
            prefilledChannel={initialData?.channel}
          />
        </div>

        <div className="space-y-8 pb-16">
          <ActivityLog
            activities={activities}
            countries={availableCountries}
            channels={CHANNELS}
            calculatingEmissions={calculatingEmissions}
            getDisplayCO2={getDisplayCO2}
            onUpdateActivity={updateActivity}
          />

          <EmissionsBreakdown totals={totals} />

          <ReportActions
            organization={organization}
            activities={activities}
            getDisplayCO2={getDisplayCO2}
            totals={totals}
          />
        </div>
      </Card>
    </div>
  );
}