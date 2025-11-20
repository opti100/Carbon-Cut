'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building2, FileCheck, TrendingUp, Globe, Zap, Activity } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import MarketingActivityForm from './MarketingActivityForm';
import ActivityLog from './ActivityLog';
import EmissionsBreakdown from './EmissionsBreakdown';
import ReportActions from './ReportActions';
import { loadCountriesFromScientificData, CHANNELS, DEFAULT_SCOPE, ACTIVITY_CONVERSIONS } from '@/constants/data';
import { CountryData, ActivityData } from '@/types/types';

const steps = [
  { id: 1, title: 'Organization', icon: Building2 },
  { id: 2, title: 'Campaign', icon: Calendar },
  { id: 3, title: 'Activities', icon: Activity },
  { id: 4, title: 'Details', icon: FileCheck },
];

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

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
  const [activityQuantities, setActivityQuantities] = useState<Record<string, string>>({});
  const [approximateEmissions, setApproximateEmissions] = useState(0);
  const [manuallyEditedUnits, setManuallyEditedUnits] = useState<Set<string>>(new Set());
  const isCalculatingRef = useRef(false);

  // Step 4 State
  const [emissionScope, setEmissionScope] = useState('3');
  const [campaignName, setCampaignName] = useState('');
  const [note, setNote] = useState('');

  // Activities and emissions
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [calculatingEmissions, setCalculatingEmissions] = useState<Record<number | string, boolean>>({});
  const [emissionResults, setEmissionResults] = useState<Record<number | string, number>>({});

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
    const uniqueChannels = new Set(activities.map(a => a.channel)).size;
    const uniqueMarkets = new Set(activities.map(a => a.market)).size;
    const totalCO2e = Object.values(emissionResults).reduce((sum, val) => sum + val, 0);

    setStats({
      totalActivities: activities.length,
      channels: uniqueChannels,
      markets: uniqueMarkets,
      totalCO2e,
    });
  }, [activities, emissionResults]);

  // Calculate approximate emissions for Step 3 preview
  useEffect(() => {
    if (channel && CHANNELS[channel]) {
      let approxTotal = 0;
      CHANNELS[channel].forEach(([label, unitKey]) => {
        const value = parseFloat(activityQuantities[unitKey] || '0');
        if (value > 0) {
          // Simple estimation: 0.5 kg CO2e per unit as baseline
          approxTotal += value * 0.5;
        }
      });
      setApproximateEmissions(approxTotal);
    } else {
      setApproximateEmissions(0);
    }
  }, [activityQuantities, channel]);

  // Calculate emissions
  const calcCO2AI = useCallback(async (activity: ActivityData): Promise<number> => {
    const activityId = activity.id;

    if (activity.quantities && Object.keys(activity.quantities).length > 0) {
      let totalEmissions = 0;

      for (const [unitKey, data] of Object.entries(activity.quantities)) {
        const individualActivityId = `${activityId}_${unitKey}`;
        
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
            }
          };

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/inventory/calculate-carbon/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) throw new Error('API request failed');

          const result = await response.json();
          const emission = result.data?.totalEmissions || 0;

          setEmissionResults(prev => ({ ...prev, [individualActivityId]: emission }));
          totalEmissions += emission;

        } catch (error) {
          console.error('Error calculating emissions:', error);
          const emission = data.value * 0.5;
          setEmissionResults(prev => ({ ...prev, [individualActivityId]: emission }));
          totalEmissions += emission;
        } finally {
          setCalculatingEmissions(prev => ({ ...prev, [individualActivityId]: false }));
        }
      }

      return totalEmissions;
    }

    return 0;
  }, [calculatingEmissions, emissionResults]);

  const addActivity = useCallback(async (activityData: Omit<ActivityData, 'id'>) => {
    const newActivity: ActivityData = {
      ...activityData,
      id: Date.now()
    };

    setActivities(prev => [...prev, newActivity]);
    await calcCO2AI(newActivity);
  }, [calcCO2AI]);

  const updateActivity = useCallback((id: number, updates: Partial<ActivityData>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  }, []);

  const getDisplayCO2 = useCallback((activity: ActivityData): number => {
    if (activity.quantities && Object.keys(activity.quantities).length > 0) {
      let total = 0;
      for (const unitKey of Object.keys(activity.quantities)) {
        const individualId = `${activity.id}_${unitKey}`;
        total += emissionResults[individualId] || 0;
      }
      return total;
    }
    return emissionResults[activity.id] || 0;
  }, [emissionResults]);

  const totals = useMemo(() => {
    const byChannel: Record<string, number> = {};
    const byMarket: Record<string, number> = {};
    const byScope: Record<number, number> = {};
    let total = 0;

    activities.forEach(activity => {
      const emission = getDisplayCO2(activity);
      
      // By channel
      byChannel[activity.channel] = (byChannel[activity.channel] || 0) + emission;
      
      // By market
      byMarket[activity.market] = (byMarket[activity.market] || 0) + emission;
      
      // By scope
      byScope[activity.scope] = (byScope[activity.scope] || 0) + emission;
      
      // Total
      total += emission;
    });

    return { total, byChannel, byMarket, byScope };
  }, [activities, getDisplayCO2]);

  // Calculate value for a target unit based on multiple source units (weighted average)
  const calculateFromMultipleSources = useCallback((
    targetUnit: string,
    sourceUnits: { unit: string; value: number }[]
  ): number | null => {
    const validConversions: number[] = [];

    sourceUnits.forEach(({ unit: sourceUnit, value: sourceValue }) => {
      if (sourceValue <= 0) return;

      // Try direct conversion
      const directFactor = ACTIVITY_CONVERSIONS[sourceUnit]?.[targetUnit];
      if (directFactor !== undefined) {
        validConversions.push(sourceValue * directFactor);
        return;
      }

      // Try reverse conversion
      const reverseFactor = ACTIVITY_CONVERSIONS[targetUnit]?.[sourceUnit];
      if (reverseFactor !== undefined && reverseFactor !== 0) {
        validConversions.push(sourceValue / reverseFactor);
        return;
      }
    });

    if (validConversions.length === 0) return null;

    // Return weighted average of all valid conversions
    const average = validConversions.reduce((sum, val) => sum + val, 0) / validConversions.length;
    return average;
  }, []);

  // Handle quantity change with auto-calculation
  const handleQuantityChange = (unitKey: string, value: string) => {
    const numValue = parseFloat(value);
    
    // Prevent calculation loop
    if (isCalculatingRef.current) return;
    isCalculatingRef.current = true;

    // Update the quantity immediately
    const newQuantities = { ...activityQuantities, [unitKey]: value };
    
    const newManuallyEditedUnits = new Set(manuallyEditedUnits);

    if (value === '' || isNaN(numValue) || numValue <= 0) {
      // User cleared the field - remove from manually edited set
      newManuallyEditedUnits.delete(unitKey);
      
      // If there are OTHER manually edited fields, recalculate this field
      if (newManuallyEditedUnits.size > 0) {
        const editedSources = Array.from(newManuallyEditedUnits)
          .map(key => ({
            unit: key,
            value: parseFloat(newQuantities[key] || '0')
          }))
          .filter(source => source.value > 0);

        // Calculate the cleared field based on other manual fields
        const calculatedValue = calculateFromMultipleSources(unitKey, editedSources);
        
        if (calculatedValue !== null) {
          newQuantities[unitKey] = calculatedValue.toFixed(2);
        } else {
          // If no conversion possible, leave it empty
          newQuantities[unitKey] = '';
        }
      } else {
        // No other fields filled, clear this field
        newQuantities[unitKey] = '';
      }
    } else {
      // User entered a value - add to manually edited set
      newManuallyEditedUnits.add(unitKey);
      
      // Calculate other fields immediately
      const editedSources = Array.from(newManuallyEditedUnits)
        .map(key => ({
          unit: key,
          value: parseFloat(newQuantities[key] || '0')
        }))
        .filter(source => source.value > 0);

      // Calculate non-manual fields
      if (channel && CHANNELS[channel]) {
        CHANNELS[channel].forEach(([label, targetKey]) => {
          if (newManuallyEditedUnits.has(targetKey)) {
            // Skip manually edited fields
            return;
          }

          const calculatedValue = calculateFromMultipleSources(targetKey, editedSources);
          
          if (calculatedValue !== null) {
            newQuantities[targetKey] = calculatedValue.toFixed(2);
          }
        });
      }
    }

    // Update state once
    setActivityQuantities(newQuantities);
    setManuallyEditedUnits(newManuallyEditedUnits);
    
    // Reset flag after state update
    setTimeout(() => {
      isCalculatingRef.current = false;
    }, 0);
  };

  const handleAddActivity = () => {
    // Check if any quantity was entered
    const hasQuantities = Object.values(activityQuantities).some(q => parseFloat(q) > 0);
    if (!hasQuantities) {
      alert('Please enter at least one activity quantity');
      return;
    }

    // Build quantities object from activityQuantities
    const quantities: Record<string, { label: string; value: number }> = {};
    if (channel && CHANNELS[channel]) {
      CHANNELS[channel].forEach(([label, unitKey]) => {
        const value = parseFloat(activityQuantities[unitKey] || '0');
        if (value > 0) {
          quantities[unitKey] = { label, value };
        }
      });
    }

    // Create activity with combined data
    const newActivity: Omit<ActivityData, 'id'> = {
      date: campaignPeriod?.from ? format(campaignPeriod.from, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      market: market || 'Unknown',
      channel: channel || 'Unknown',
      unit: '', // Placeholder when using quantities
      activityLabel: channel, // Use channel as label for combined activities
      qty: 0, // Placeholder when using quantities
      scope: parseInt(emissionScope) as 1 | 2 | 3,
      campaign: campaignName || undefined,
      notes: note || undefined,
      quantities
    };

    // Add the activity
    addActivity(newActivity);

    // Reset Step 3 & 4 fields for next activity
    setActivityQuantities({});
    setManuallyEditedUnits(new Set());
    setCampaignName('');
    setNote('');
    
    // Go back to step 1 to start fresh
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // All fields are optional in Step 1
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Only market and channel are required
      if (!market || !channel) {
        alert('Please select market and channel');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // No validation needed, user can proceed to details
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Add Activity button clicked - combine Step 3 quantities with Step 4 details
      handleAddActivity();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col mt-20" style={{ height: 'calc(100vh - 5rem)' }}>
        {/* Horizontal Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area - Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 overflow-y-auto flex flex-col">
            <AnimatePresence mode="wait">
              {/* Step 1: Organization + Reporting + Offsets */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 overflow-y-auto"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Organization Information
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-lg font-semibold text-gray-700">
                      1. Organization/Brand 
                    </Label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="e.g., Acme Corporation"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="text-lg p-6 border-2 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                      2. Reporting Period 
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left text-lg p-6 border-2 hover:border-green-500"
                        >
                          <Calendar className="mr-2 h-5 w-5" />
                          {reportingPeriod?.from ? (
                            reportingPeriod.to ? (
                              <>
                                {format(reportingPeriod.from, 'LLL dd, y')} -{' '}
                                {format(reportingPeriod.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(reportingPeriod.from, 'LLL dd, y')
                            )
                          ) : (
                            <span className="text-gray-400">Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={reportingPeriod?.from}
                          selected={reportingPeriod}
                          onSelect={setReportingPeriod}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offsets" className="text-lg font-semibold text-gray-700">
                      3. Offsets to Disclose Separately (Optional)
                    </Label>
                    <Input
                      id="offsets"
                      type="text"
                      placeholder="e.g., Carbon credits, tree planting, etc."
                      value={separateOffsets}
                      onChange={(e) => setSeparateOffsets(e.target.value)}
                      className="text-lg p-6 border-2 focus:border-green-500 focus:ring-green-500/20"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Specify any carbon offsets you want to disclose separately from total emissions
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Campaign Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 overflow-y-auto"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Campaign Details
                  </h2>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                      1. Campaign Period
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left text-lg p-6 border-2 hover:border-green-500"
                        >
                          <Calendar className="mr-2 h-5 w-5" />
                          {campaignPeriod?.from ? (
                            campaignPeriod.to ? (
                              <>
                                {format(campaignPeriod.from, 'LLL dd, y')} -{' '}
                                {format(campaignPeriod.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(campaignPeriod.from, 'LLL dd, y')
                            )
                          ) : (
                            <span className="text-gray-400">Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={campaignPeriod?.from}
                          selected={campaignPeriod}
                          onSelect={setCampaignPeriod}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market" className="text-lg font-semibold text-gray-700">
                      2. Market
                    </Label>
                    <Select value={market} onValueChange={setMarket} disabled={loadingCountries}>
                      <SelectTrigger className="text-lg p-6 border-2 focus:border-green-500">
                        <SelectValue placeholder={loadingCountries ? "Loading markets..." : "Select market"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.name} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channel" className="text-lg font-semibold text-gray-700">
                      3. Channel
                    </Label>
                    <Select value={channel} onValueChange={setChannel}>
                      <SelectTrigger className="text-lg p-6 border-2 focus:border-green-500">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CHANNELS).map((channelKey) => (
                          <SelectItem key={channelKey} value={channelKey}>
                            {channelKey}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Activity Quantities Only */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 overflow-y-auto"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Activity Quantities
                  </h2>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700">
                      Enter quantities for activity types
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      {channel && CHANNELS[channel] && CHANNELS[channel].map(([label, unitKey]) => (
                        <div key={unitKey} className="space-y-2">
                          <Label htmlFor={unitKey} className="text-sm font-medium text-gray-700">
                            {label}
                          </Label>
                          <Input
                            id={unitKey}
                            type="number"
                            step="0.01"
                            placeholder={`Enter ${label.toLowerCase()}`}
                            value={activityQuantities[unitKey] || ''}
                            onChange={(e) => handleQuantityChange(unitKey, e.target.value)}
                            className="text-base p-4"
                          />
                        </div>
                      ))}
                      {!channel && (
                        <div className="col-span-full text-center text-gray-500 py-8">
                          Please select a channel in Step 2 to see available activity types
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approximate Emissions Preview */}
                  {/* {approximateEmissions > 0 && (
                    <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Approximate Emissions</h3>
                          <p className="text-sm text-gray-600 mt-1">Estimated based on activity quantities</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">
                            {approximateEmissions.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">kg CO2e</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        ⓘ This is a rough estimate. Actual emissions will be calculated when you add the activity.
                      </p>
                    </div>
                  )} */}
                </motion.div>
              )}

              {/* Step 4: Additional Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 overflow-y-auto"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Additional Details
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="scope" className="text-lg font-semibold text-gray-700">
                      1. Emission Scope
                    </Label>
                    <Select value={emissionScope} onValueChange={setEmissionScope}>
                      <SelectTrigger className="text-lg p-6 border-2 focus:border-green-500">
                        <SelectValue placeholder="Select emission scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Scope 1 - Direct Emissions</SelectItem>
                        <SelectItem value="2">Scope 2 - Indirect Energy Emissions</SelectItem>
                        <SelectItem value="3">Scope 3 - Other Indirect Emissions</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-2">
                      Categorize your emissions according to GHG Protocol standards (Optional)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignName" className="text-lg font-semibold text-gray-700">
                      2. Campaign Name (Optional)
                    </Label>
                    <Input
                      id="campaignName"
                      type="text"
                      placeholder="e.g., Summer Sale 2025"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="text-lg p-6 border-2 focus:border-green-500 focus:ring-green-500/20"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Give your campaign a memorable name for easy tracking
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-lg font-semibold text-gray-700">
                      3. Note (Optional)
                    </Label>
                    <textarea
                      id="note"
                      placeholder="Add any additional notes or context about your campaign..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      className="w-full text-lg p-4 border-2 rounded-md focus:border-green-500 focus:ring-green-500/20 focus:outline-none resize-none"
                    />
                 
                  </div>

                  {/* <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mt-8">
                    <div className="flex items-start gap-4">
                      <Activity className="w-6 h-6 text-green-600 mt-1 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 text-lg mb-2">
                          Ready to Add Activities
                        </h3>
                        <p className="text-green-700 mb-4">
                          Click "Add Activity" below to start tracking your marketing activities with the configured settings.
                        </p>
                        <ul className="space-y-1 text-sm text-green-600">
                          <li>✓ Organization: <strong>{organization}</strong></li>
                          <li>✓ Reporting: {reportingPeriod?.from && format(reportingPeriod.from, 'MMM dd, yyyy')} - {reportingPeriod?.to && format(reportingPeriod.to, 'MMM dd, yyyy')}</li>
                          <li>✓ Campaign: {campaignPeriod?.from && format(campaignPeriod.from, 'MMM dd, yyyy')} - {campaignPeriod?.to && format(campaignPeriod.to, 'MMM dd, yyyy')}</li>
                          <li>✓ Market: <strong>{market}</strong></li>
                          <li>✓ Channel: <strong>{channel}</strong></li>
                          {campaignName && <li>✓ Campaign Name: <strong>{campaignName}</strong></li>}
                          <li>✓ Scope: <strong>Scope {emissionScope}</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t mt-auto">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
                className="px-8"
              >
                Back
              </Button>
            
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                {currentStep === 4 ? 'Add Activity' : 'Next Step'}
              </Button>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="lg:col-span-1 h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Image src="/impact-overview/total-activites.svg" alt="Total activities" width={60} height={60} />
                </div>
                <div className="text-xs text-gray-600">
                  Total Activities <span className="text-gray-400">-</span> <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.totalActivities}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Image src="/impact-overview/channels.svg" alt="Channels" width={60} height={60} />
                </div>
                <div className="text-xs text-gray-600">
                  Channels <span className="text-gray-400">-</span> <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.channels}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Image src="/impact-overview/markets.svg" alt="Markets" width={60} height={60} />
                </div>
                <div className="text-xs text-gray-600">
                  Markets <span className="text-gray-400">-</span> <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.markets}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Image src="/impact-overview/total-coe2.svg" alt="total CO₂e" width={60} height={60} />
                </div>
                <div className="text-xs text-gray-600">
                  Total CO₂e <span className="text-gray-400">-</span> <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.totalCO2e.toFixed(5)} kg</span>
                </div>
              </motion.div>
            </div>

            {/* <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Live Dashboard</h3>
              <p className="text-sm text-gray-600">
                These metrics will update in real-time as you add activities to your carbon footprint log.
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Activity Log Section - Only show when activities exist */}
      {activities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">Activity Log</h2>
            
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
                period: reportingPeriod?.from && reportingPeriod?.to 
                  ? `${format(reportingPeriod.from, 'LLL dd, y')} - ${format(reportingPeriod.to, 'LLL dd, y')}`
                  : 'Not specified',
                offsets: separateOffsets || 'None specified'
              }}
              activities={activities}
              getDisplayCO2={getDisplayCO2}
              totals={totals}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
