import { ActivityData, ChannelUnits, CountryData } from '@/types/types';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ACTIVITY_CONVERSIONS } from '@/constants/data';

interface MarketingActivityFormProps {
  activities: ActivityData[];
  getDisplayCO2: (activity: ActivityData) => number;
  channels: ChannelUnits;
  defaultScope: Record<string, number>;
  countries: CountryData[];
  loadingCountries: boolean;
  onAddActivity: (activity: Omit<ActivityData, 'id'>) => void;
  calculatingEmissions: Record<number, boolean>;
  emissionResults: Record<number, number>;
}

export default function MarketingActivityForm({
  channels,
  activities,
  getDisplayCO2,
  calculatingEmissions,
  defaultScope,
  countries,
  loadingCountries,
  onAddActivity,
  emissionResults
}: MarketingActivityFormProps) {
  const [formData, setFormData] = useState({
    market: 'United Kingdom',
    channel: 'Ad Production',
    unit: 'travel_km',
    qty: '',
    scope: 3,
    campaign: '',
    notes: ''
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const [addingActivity, setAddingActivity] = useState(false);
  const [unitEmissions, setUnitEmissions] = useState<Record<string, number>>({});
  const [unitCalculating, setUnitCalculating] = useState<Record<string, boolean>>({});
  const [unitIds, setUnitIds] = useState<Record<string, number>>({});
  const [isCalculatingAll, setIsCalculatingAll] = useState(false);
  const [selectKey, setSelectKey] = useState(0);

  // Use useMemo to stabilize the availableUnits array
  const availableUnits = useMemo(() => {
    return channels[formData.channel] || [];
  }, [channels, formData.channel]);

  const getDisplayCO2Ref = useRef(getDisplayCO2);
  const calculatingEmissionsRef = useRef(calculatingEmissions);
  const emissionResultsRef = useRef(emissionResults);

  // Update refs
  useEffect(() => {
    getDisplayCO2Ref.current = getDisplayCO2;
    calculatingEmissionsRef.current = calculatingEmissions;
    emissionResultsRef.current = emissionResults;
  });

  // Watch for emission results updates for all units
  useEffect(() => {
    const newUnitEmissions = { ...unitEmissions };
    const newUnitCalculating = { ...unitCalculating };
    let hasUpdates = false;
    
    Object.entries(unitIds).forEach(([unitKey, id]) => {
      if (emissionResults[id] !== undefined && newUnitEmissions[unitKey] !== emissionResults[id]) {
        newUnitEmissions[unitKey] = emissionResults[id];
        newUnitCalculating[unitKey] = false;
        hasUpdates = true;
      } else if (calculatingEmissions[id] && !newUnitCalculating[unitKey]) {
        newUnitCalculating[unitKey] = true;
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      setUnitEmissions(newUnitEmissions);
      setUnitCalculating(newUnitCalculating);
    }
  }, [emissionResults, calculatingEmissions, unitIds]);

  // Calculate emissions for all available units when form data changes
  useEffect(() => {
    console.log('🔄 Effect triggered');
    console.log('📋 Channel:', formData.channel);
    console.log('📋 Available units:', availableUnits);
    console.log('📊 Form data:', { market: formData.market, channel: formData.channel, unit: formData.unit, qty: formData.qty });

    // Changed from AND to OR - calculate if we have quantity OR if channel/market changes
    const shouldCalculate = formData.qty && parseFloat(formData.qty) > 0;
    
    if (!shouldCalculate) {
      // Only clear if there's no quantity at all
      if (!formData.qty || parseFloat(formData.qty) <= 0) {
        setUnitEmissions({});
        setUnitCalculating({});
        setUnitIds({});
        setIsCalculatingAll(false);
      }
      return;
    }

    setIsCalculatingAll(true);

    // Debounce the calculation - removed to make it instant
    const timeoutId = setTimeout(() => {
      const newUnitIds: Record<string, number> = {};
      const newUnitEmissions: Record<string, number> = {};
      const newUnitCalculating: Record<string, boolean> = {};

      const baseId = Date.now() * -1;

      console.log(`🚀 Starting calculation for ${availableUnits.length} units in channel: ${formData.channel}`);

      availableUnits.forEach(([label, unitKey], index) => {
        const uniqueId = baseId - index;
        newUnitIds[unitKey] = uniqueId;

        const activityToCalculate: ActivityData = {
          id: uniqueId,
          date: dateRange?.from?.toISOString().slice(0, 10) || new Date().toISOString().slice(0, 10),
          market: formData.market,
          channel: formData.channel,
          unit: unitKey,
          activityLabel: label,
          qty: parseFloat(formData.qty) || 0,
          scope: formData.scope,
          campaign: formData.campaign,
          notes: formData.notes
        };

        console.log(`🔍 Calculating for ${label} (${unitKey}) in ${formData.channel}:`, {
          id: activityToCalculate.id,
          market: activityToCalculate.market,
          channel: activityToCalculate.channel,
          unit: activityToCalculate.unit,
          activityLabel: activityToCalculate.activityLabel,
          qty: activityToCalculate.qty,
          scope: activityToCalculate.scope
        });

        const emission = getDisplayCO2Ref.current(activityToCalculate);
        console.log(`📊 Result for ${label} (unit: ${unitKey}):`, emission);
        console.log(`📊 Type of emission:`, typeof emission);
        newUnitEmissions[unitKey] = emission;
        newUnitCalculating[unitKey] = calculatingEmissionsRef.current[uniqueId] || false;
      });

      console.log('✅ Setting new emissions:', newUnitEmissions);
      console.log('✅ Emissions keys:', Object.keys(newUnitEmissions));
      console.log('✅ Emissions values:', Object.values(newUnitEmissions));

      setUnitIds(newUnitIds);
      setUnitEmissions(newUnitEmissions);
      setUnitCalculating(newUnitCalculating);
      setIsCalculatingAll(false);
      setSelectKey(prev => prev + 1);
    }, 100); // Reduced debounce from 300ms to 100ms for faster response

    return () => {
      clearTimeout(timeoutId);
      setIsCalculatingAll(false);
    };
  }, [
    formData.market, 
    formData.channel,
    formData.qty, 
    formData.scope, 
    dateRange?.from,
    availableUnits
  ]);

  const handleChange = (field: string, value: string | number) => {
    if (field === 'channel') {
      const newUnits = channels[value as string];
      console.log('🔄 Channel changed to:', value);
      console.log('🔄 New units:', newUnits);
      
      // Clear emissions when channel changes
      setUnitEmissions({});
      setUnitCalculating({});
      setUnitIds({});
      setSelectKey(prev => prev + 1);
      
      // Update all related state together
      setFormData(prev => ({
        ...prev,
        channel: value as string,
        unit: newUnits && newUnits.length > 0 ? newUnits[0][1] : '',
        scope: defaultScope[value as string] || 3
      }));
      
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const qty = parseFloat(formData.qty);
    if (!qty || qty < 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (!dateRange?.from) {
      alert('Please select a date range.');
      return;
    }

    setAddingActivity(true);

    try {
      const activityLabel = availableUnits.find(([, key]) => key === formData.unit)?.[0] || formData.unit;

      const activityData: Omit<ActivityData, 'id'> = {
        date: dateRange.from.toISOString().slice(0, 10),
        market: formData.market,
        channel: formData.channel,
        unit: formData.unit,
        activityLabel,
        qty,
        scope: formData.scope,
        campaign: formData.campaign,
        notes: formData.notes
      };

      console.log('✅ Adding Activity:', activityData);
      onAddActivity(activityData);

      // Reset form fields and preview
      setFormData(prev => ({
        ...prev,
        qty: '',
        campaign: '',
        notes: ''
      }));
      setUnitEmissions({});
      setUnitCalculating({});
      setUnitIds({});
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity. Please try again.');
    } finally {
      setAddingActivity(false);
    }
  };

  // Memoize the conversion function
  const getApproximateQuantities = useCallback((selectedUnit: string, quantity: number) => {
    if (!quantity || quantity <= 0) return {};
    
    const approximations: Record<string, number> = {};
    
    availableUnits.forEach(([label, unitKey]) => {
      if (unitKey === selectedUnit) {
        // Same unit, same quantity
        approximations[unitKey] = quantity;
      } else {
        // Use conversion factors from ACTIVITY_CONVERSIONS
        const conversionFactor = ACTIVITY_CONVERSIONS[selectedUnit]?.[unitKey];
        
        if (conversionFactor !== undefined) {
          // Direct conversion exists
          approximations[unitKey] = quantity * conversionFactor;
        } else {
          // Try reverse conversion
          const reverseConversion = ACTIVITY_CONVERSIONS[unitKey]?.[selectedUnit];
          if (reverseConversion !== undefined && reverseConversion !== 0) {
            approximations[unitKey] = quantity / reverseConversion;
          } else {
            // No conversion available, use proportional estimate based on emission factors
            // This provides a reasonable fallback
            approximations[unitKey] = quantity * 0.5;
          }
        }
      }
    });
    
    return approximations;
  }, [availableUnits]);

  const approximateQuantities = useMemo(() => {
    return getApproximateQuantities(formData.unit, parseFloat(formData.qty) || 0);
  }, [formData.unit, formData.qty, getApproximateQuantities]);

  const formatEmissions = (value: number) => {
    return value.toFixed(5);
  };

  const getScopeColor = (scope: number) => {
    switch (scope) {
      case 1: return "bg-red-50 text-red-700 border-red-200";
      case 2: return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 3: return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-gray-50 px-6  space-y-6 ">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Add Marketing {" "}<span className="text-tertiary"> Activity</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-4xl">
          Enter the details of your marketing activity to estimate its {" "} <strong className="text-orange-400">Carbon Footprint</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Campaign Period</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900 focus-visible:border-orange-500 focus-visible:ring-orange-500/50 focus-visible:ring-[3px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span className="text-gray-400">Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="market" className="text-gray-700 font-medium">Market</Label>
          <Select
            value={formData.market}
            onValueChange={(value) => handleChange('market', value)}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              {loadingCountries ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-600">Loading countries...</span>
                  </div>
                </SelectItem>
              ) : (
                countries.map((country, index) => (
                  <SelectItem key={index} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel" className="text-gray-700 font-medium">Channel</Label>
          <Select
            value={formData.channel}
            onValueChange={(value) => handleChange('channel', value)}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(channels).map(channel => (
                <SelectItem key={channel} value={channel}>
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity-type" className="text-gray-700 font-medium">Activity type</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => handleChange('unit', value)}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.map(([label, key]) => {
                return (
                  <SelectItem key={key} value={key}>
                    <div className='flex justify-between items-center w-full gap-4'>
                      <div className="flex-1">
                        {label}
                      </div>
                      <div className="flex-shrink-0 min-w-[120px] text-right flex items-center justify-end gap-2">
                        {formData.qty && parseFloat(formData.qty) > 0 ? (
                          <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                            ≈ {approximateQuantities[key]?.toFixed(2) || '-'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {/* Show approximate conversions below */}
          {formData.qty && parseFloat(formData.qty) > 0 && availableUnits.length > 1 && (
            <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-blue-900">
                  Equivalent Activity Conversions
                </p>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Based on {formData.qty} {availableUnits.find(([, k]) => k === formData.unit)?.[0]}
                </span>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableUnits.map(([label, key]) => {
                  const approxQty = approximateQuantities[key];
                  const isSelected = key === formData.unit;
                  
                  return (
                    <div 
                      key={key} 
                      onClick={() => handleChange('unit', key)}
                      className={`flex justify-between items-center text-sm py-2 px-3 rounded-md transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-100 border-2 border-blue-400 shadow-sm' 
                          : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <span className={`flex-1 ${isSelected ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
                        {label}
                        {isSelected && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                            Selected
                          </span>
                        )}
                      </span>
                      <span className={`ml-4 ${isSelected ? 'text-blue-700 font-bold text-base' : 'text-gray-600'}`}>
                        ≈ {approxQty?.toFixed(2) || '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Click any activity type to switch and compare equivalent quantities
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="quantity" className="text-gray-700 font-medium">
              Quantity
            </Label>
          </div>
          <Input
            id="quantity"
            type="number"
            step="0.000001"
            value={formData.qty}
            onChange={(e) => handleChange('qty', e.target.value)}
            placeholder="e.g., 5000000"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
          {formData.unit && (
            <p className="text-sm text-gray-500">
              Unit: {availableUnits.find(([, key]) => key === formData.unit)?.[0] || formData.unit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Emission Scope</Label>
          <Select
            value={formData.scope.toString()}
            onValueChange={(value) => handleChange('scope', parseInt(value))}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center gap-2">
                  <span>Scope 1 - Direct emissions</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-2">
                  <span>Scope 2 - Indirect energy</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-2">
                  <span>Scope 3 - Value chain</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-start">
            <Badge variant="outline" className={getScopeColor(formData.scope)}>
              Scope {formData.scope}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign" className="text-gray-700 font-medium">
            Campaign name <span className="text-gray-400">(optional)</span>
          </Label>
          <Input
            id="campaign"
            type="text"
            value={formData.campaign}
            onChange={(e) => handleChange('campaign', e.target.value)}
            placeholder="Spring Sale"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-gray-700 font-medium">
          Notes <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="notes"
          type="text"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional context or details"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
        />
      </div>

      <div className="flex justify-end ">
        <Button
          onClick={handleSubmit}
          disabled={addingActivity || !formData.qty || !dateRange?.from}
          size="lg"
          className="bg-tertiary text-white shadow-lg hover:shadow-xl rounded-sm hover:bg-green-600 transition-all duration-200"
        >
          {addingActivity ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Adding Activity...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Activity
            </>
          )}
        </Button>
      </div>
    </div>
  );
}