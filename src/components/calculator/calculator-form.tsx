"use client";

import { CHANNELS, DEFAULT_SCOPE, FALLBACK_CALCULATION, loadCountriesFromScientificData } from '@/constants/data';
import { ActivityData, CountryData, OrganizationData } from '@/types/types';
import { useState, useEffect, useCallback } from 'react';
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
  useCallback(() => {
    activities.forEach(activity => {
      const shouldRecalculate = 
        emissionResults[activity.id] === undefined || 
        !calculatingEmissions[activity.id];
      
      if (shouldRecalculate) {
        calcCO2AI(activity);
      }
    });
  }, [activities, emissionResults, calculatingEmissions ,calcCO2AI]);

 

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Patch.io inspired clean header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Rebalance your
              <span className="block bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                marketing impact
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Calculate and track your marketing activities&apos; carbon emissions with precision. 
              Get insights into your environmental impact and build a sustainable marketing strategy.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>GHG Protocol compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>2025 emission factors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicators */}
        <div className="py-8 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="text-gray-700 font-medium">Organization Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <span className="text-gray-500">Add Activities</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <span className="text-gray-500">Review & Export</span>
            </div>
          </div>
        </div>

        {/* Stats Overview - Always visible at top */}
        <div className="py-8">
          <StatsOverview totals={totals} />
        </div>

        {/* Organization Form */}
        <div className="pb-8">
          <OrganizationForm 
            organization={organization} 
            onOrganizationChange={setOrganization} 
          />
        </div>

        {/* Activity Form */}
        <div className="pb-8">
          <MarketingActivityForm 
            channels={CHANNELS}
            defaultScope={DEFAULT_SCOPE}
            countries={availableCountries}
            loadingCountries={loadingCountries}
            onAddActivity={addActivity}
          />
        </div>

        {/* Results Section */}
        {activities.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to calculate your impact?</h3>
              <p className="text-gray-600 mb-6">
                Add your first marketing activity above to start calculating your carbon footprint.
              </p>
              <div className="text-sm text-gray-500">
                Start by filling out your organization details and then add activities to track.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}