"use client";

import { CHANNELS, DEFAULT_SCOPE, FALLBACK_CALCULATION, loadCountriesFromScientificData } from '@/constants/data';
import { ActivityData, CountryData, OrganizationData } from '@/types/types';
import { useState, useEffect } from 'react';
import OrganizationForm from './organizationForm';
import StatsOverview from './StatsOverview';
import MarketingActivityForm from './MarketingActivityForm';
import ActivityLog from './ActivityLog';
import EmissionsBreakdown from './EmissionsBreakdown';
import ReportActions from './ReportActions';

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

  useEffect(() => {
    activities.forEach(activity => {
      const shouldRecalculate = 
        emissionResults[activity.id] === undefined || 
        !calculatingEmissions[activity.id];
      
      if (shouldRecalculate) {
        calcCO2AI(activity);
      }
    });
  }, [activities]);

  const calcCO2AI = async (activity: ActivityData): Promise<number> => {
    const activityId = activity.id;
    
    if (calculatingEmissions[activityId]) return 0;
    if (emissionResults[activityId] !== undefined) return emissionResults[activityId];

    try {
      setCalculatingEmissions(prev => ({ ...prev, [activityId]: true }));

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

      const response = await fetch('/api/calculate-carbon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error('API response not OK');

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
  };

  const getDisplayCO2 = (activity: ActivityData): number => {
    if (emissionResults[activity.id] !== undefined) {
      return emissionResults[activity.id];
    }
    
    if (calculatingEmissions[activity.id]) {
      return FALLBACK_CALCULATION.getBasicEmission(activity);
    }
    
    if (emissionResults[activity.id] === undefined) {
      calcCO2AI(activity);
      return FALLBACK_CALCULATION.getBasicEmission(activity);
    }
    
    return 0;
  };

  const updateActivity = (activityId: number, updates: Partial<ActivityData>) => {
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
  };

  const addActivity = async (activityData: Omit<ActivityData, 'id'>) => {
    const newActivity: ActivityData = {
      ...activityData,
      id: activities.length + 1
    };

    setActivities([...activities, newActivity]);
    await calcCO2AI(newActivity);
  };

  const calculateTotals = () => {
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
  };

  const totals = calculateTotals();

  return (
    <div className="py-16 px-8 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-400">Organization and Reporting Details</span> 
          </h1>
          <p className="text-gray-400">Provide your company details and reporting preferences to set the foundation for accurate CO₂e calculations.</p>
        </header>

        <OrganizationForm 
          organization={organization} 
          onOrganizationChange={setOrganization} 
        />

        <StatsOverview totals={totals} />

        <MarketingActivityForm 
          channels={CHANNELS}
          defaultScope={DEFAULT_SCOPE}
          countries={availableCountries}
          loadingCountries={loadingCountries}
          onAddActivity={addActivity}
        />

        {activities.length > 0 && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}