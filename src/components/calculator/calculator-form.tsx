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

export default function MarketingCalculator() {
  const [organization, setOrganization] = useState<OrganizationData>({
    name: '',
    period: '',
    offsets: ''
  });

  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [calculatingEmissions, setCalculatingEmissions] = useState<Record<number, boolean>>({});
  const [emissionResults, setEmissionResults] = useState<Record<number, number>>({});
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

  // Memoize calcCO2AI to prevent it from changing on every render
  const calcCO2AI = useCallback(async (activity: ActivityData): Promise<number> => {
    const activityId = activity.id;

    if (calculatingEmissions[activityId]) return 0;
    if (emissionResults[activityId] !== undefined) return emissionResults[activityId];

    try {
      setCalculatingEmissions(prev => ({ ...prev, [activityId]: true }));

      // Get the auth token from cookies
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
  }, [calculatingEmissions, emissionResults]); // Add dependencies

  // Memoize the recalculation function
  const recalculateAllActivities = useCallback(() => {
    activities.forEach(activity => {
      const shouldRecalculate =
        emissionResults[activity.id] === undefined ||
        !calculatingEmissions[activity.id];

      if (shouldRecalculate) {
        calcCO2AI(activity);
      }
    });
  }, [activities, emissionResults, calculatingEmissions, calcCO2AI]);

  const getDisplayCO2 = useCallback((activity: ActivityData): number => {
    // If we have a cached result, return it
    if (emissionResults[activity.id] !== undefined) {
      return emissionResults[activity.id];
    }

    // If currently calculating, return fallback
    if (calculatingEmissions[activity.id]) {
      return FALLBACK_CALCULATION.getBasicEmission(activity);
    }

    // If no result and not calculating, trigger calculation and return fallback
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
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" >
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      <Card className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 mt-28 mb-16 shadow-lg ">
        <div className="pb-8">
          <OrganizationForm
            organization={organization}
            onOrganizationChange={setOrganization}
          />
        </div>

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
            emissionResults={emissionResults}          />
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