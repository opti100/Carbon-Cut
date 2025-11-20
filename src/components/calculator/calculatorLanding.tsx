'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import ActivityLog from './ActivityLog';
import EmissionsBreakdown from './EmissionsBreakdown';
import ReportActions from './ReportActions';
import { loadCountriesFromScientificData, CHANNELS } from '@/constants/data';
import { CountryData, ActivityData } from '@/types/types';
import CalculatorFAQ from './CalculatorFAQ';
import PreFooter from '@/components/main/PreFooter';
import Footer from '@/components/main/Footer';
import StepperProgress from './StepperProgress';
import StatsCards from './StatsCards';
import OrganizationStep from './steps/OrganizationStep';
import CampaignStep from './steps/CampaignStep';
import ActivitiesStep from './steps/ActivitiesStep';
import DetailsStep from './steps/DetailsStep';
import { useEmissionsCalculator } from './hooks/useEmissionsCalculator';

export default function CalculatorLanding() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [organization, setOrganization] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<DateRange | undefined>();
  const [separateOffsets, setSeparateOffsets] = useState('');

  // Step 2 State
  const [campaignPeriod, setCampaignPeriod] = useState<DateRange | undefined>();
  const [market, setMarket] = useState('United Kingdom');
  const [channel, setChannel] = useState('Ad Production');

  // Step 3 State
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [activityQuantities, setActivityQuantities] = useState<Record<string, string>>({});

  // Step 4 State
  const [emissionScope, setEmissionScope] = useState('3');
  const [campaignName, setCampaignName] = useState('');
  const [note, setNote] = useState('');

  // Activities and emissions
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const { calculatingEmissions, emissionResults, calcCO2AI, getDisplayCO2 } = useEmissionsCalculator();

  // Available data
  const [availableCountries, setAvailableCountries] = useState<CountryData[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalActivities: 0,
    channels: 0,
    markets: 0,
    totalCO2e: 0,
  });

  // Load countries
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

  // Update stats
  useEffect(() => {
    const uniqueChannels = new Set(activities.map((a) => a.channel)).size;
    const uniqueMarkets = new Set(activities.map((a) => a.market)).size;
    const totalCO2e = Object.values(emissionResults).reduce((sum, val) => sum + val, 0);

    setStats({
      totalActivities: activities.length,
      channels: uniqueChannels,
      markets: uniqueMarkets,
      totalCO2e,
    });
  }, [activities, emissionResults]);

  const addActivity = useCallback(
    async (activityData: Omit<ActivityData, 'id'>) => {
      const newActivity: ActivityData = {
        ...activityData,
        id: Date.now(),
      };

      setActivities((prev) => [...prev, newActivity]);
      await calcCO2AI(newActivity);
    },
    [calcCO2AI]
  );

  const updateActivity = useCallback((id: number, updates: Partial<ActivityData>) => {
    setActivities((prev) => prev.map((activity) => (activity.id === id ? { ...activity, ...updates } : activity)));
  }, []);

  const totals = useMemo(() => {
    const byChannel: Record<string, number> = {};
    const byMarket: Record<string, number> = {};
    const byScope: Record<number, number> = {};
    let total = 0;

    activities.forEach((activity) => {
      const emission = getDisplayCO2(activity);

      byChannel[activity.channel] = (byChannel[activity.channel] || 0) + emission;
      byMarket[activity.market] = (byMarket[activity.market] || 0) + emission;
      byScope[activity.scope] = (byScope[activity.scope] || 0) + emission;

      total += emission;
    });

    return { total, byChannel, byMarket, byScope };
  }, [activities, getDisplayCO2]);

  const handleQuantityChange = (unitKey: string, value: string) => {
    setActivityQuantities((prev) => ({
      ...prev,
      [unitKey]: value,
    }));
  };

  const handleAddActivity = () => {
    const hasQuantities = Object.values(activityQuantities).some((q) => parseFloat(q) > 0);
    if (!hasQuantities) {
      alert('Please enter at least one activity quantity');
      return;
    }

    const quantities: Record<string, { label: string; value: number }> = {};
    if (channel && CHANNELS[channel]) {
      CHANNELS[channel].forEach(([label, unitKey]) => {
        const value = parseFloat(activityQuantities[unitKey] || '0');
        if (value > 0) {
          quantities[unitKey] = { label, value };
        }
      });
    }

    const newActivity: Omit<ActivityData, 'id'> = {
      date: campaignPeriod?.from ? format(campaignPeriod.from, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      market: market || 'Unknown',
      channel: channel || 'Unknown',
      unit: '',
      activityLabel: channel,
      qty: 0,
      scope: parseInt(emissionScope) as 1 | 2 | 3,
      campaign: campaignName || undefined,
      notes: note || undefined,
      quantities,
    };

    addActivity(newActivity);

    setSelectedActivities(new Set());
    setActivityQuantities({});
    setCampaignName('');
    setNote('');

    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!market || !channel) {
        alert('Please select market and channel');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedActivities.size === 0) {
        alert('Please select at least one activity you have data for');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleAddActivity();

      setTimeout(() => {
        const activityLogSection = document.getElementById('activity-log-section');
        if (activityLogSection) {
          activityLogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleAddActivityAndReset = () => {
    handleAddActivity();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col mt-20"
        style={{ height: 'calc(100vh - 5rem)' }}
      >
        <StepperProgress currentStep={currentStep} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
          <div className="lg:col-span-2  rounded-xl  p-8 overflow-y-auto flex flex-col">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <OrganizationStep
                  organization={organization}
                  setOrganization={setOrganization}
                  reportingPeriod={reportingPeriod}
                  setReportingPeriod={setReportingPeriod}
                  separateOffsets={separateOffsets}
                  setSeparateOffsets={setSeparateOffsets}
                />
              )}

              {currentStep === 2 && (
                <CampaignStep
                  campaignPeriod={campaignPeriod}
                  setCampaignPeriod={setCampaignPeriod}
                  market={market}
                  setMarket={setMarket}
                  channel={channel}
                  setChannel={setChannel}
                  availableCountries={availableCountries}
                  loadingCountries={loadingCountries}
                  channels={CHANNELS}
                />
              )}

              {currentStep === 3 && (
                <ActivitiesStep
                  channel={channel}
                  selectedActivities={selectedActivities}
                  setSelectedActivities={setSelectedActivities}
                  activityQuantities={activityQuantities}
                  handleQuantityChange={handleQuantityChange}
                />
              )}

              {currentStep === 4 && (
                <DetailsStep
                  emissionScope={emissionScope}
                  setEmissionScope={setEmissionScope}
                  campaignName={campaignName}
                  setCampaignName={setCampaignName}
                  note={note}
                  setNote={setNote}
                />
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-6 border-t mt-auto">
              <Button onClick={handleBack} variant="outline" disabled={currentStep === 1} className="px-8">
                Back
              </Button>

              {currentStep === 4 ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddActivityAndReset}
                    variant="outline"
                    className="px-8 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Add Activity
                  </Button>
                  <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white px-8">
                    Next Step
                  </Button>
                </div>
              ) : (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Next Step
                </Button>
              )}
            </div>
          </div>

          <StatsCards stats={stats} />
        </div>
      </div>

      {activities.length > 0 && (
        <div id="activity-log-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Activity Log</h2>

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
            organization={{
              name: organization,
              period:
                reportingPeriod?.from && reportingPeriod?.to
                  ? `${format(reportingPeriod.from, 'LLL dd, y')} - ${format(reportingPeriod.to, 'LLL dd, y')}`
                  : 'Not specified',
              offsets: separateOffsets || 'None specified',
            }}
            activities={activities}
            getDisplayCO2={getDisplayCO2}
            totals={totals}
          />
        </div>
      )}

     
    </div>
  );
}
