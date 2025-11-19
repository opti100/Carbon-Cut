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
    scope: 3,
    campaign: '',
    notes: ''
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  // Store quantities for each activity type
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  // Track which units have been manually edited by the user
  const [manuallyEditedUnits, setManuallyEditedUnits] = useState<Set<string>>(new Set());
  const [addingActivity, setAddingActivity] = useState(false);

  // Use ref to prevent infinite loops
  const isCalculatingRef = useRef(false);

  // Use useMemo to stabilize the availableUnits array
  const availableUnits = useMemo(() => {
    return channels[formData.channel] || [];
  }, [channels, formData.channel]);

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

  // Handle quantity change for a specific unit
  const handleQuantityChange = (unitKey: string, value: string) => {
    const numValue = parseFloat(value);
    
    // Prevent calculation loop
    if (isCalculatingRef.current) return;
    isCalculatingRef.current = true;

    // Update the quantity immediately
    const newQuantities = { ...quantities, [unitKey]: value };
    
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
      availableUnits.forEach(([label, targetKey]) => {
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

    // Update state once
    setQuantities(newQuantities);
    setManuallyEditedUnits(newManuallyEditedUnits);
    
    // Reset flag after state update
    setTimeout(() => {
      isCalculatingRef.current = false;
    }, 0);
  };

  const handleChange = (field: string, value: string | number) => {
    if (field === 'channel') {
      // Clear quantities when channel changes
      setQuantities({});
      setManuallyEditedUnits(new Set());
      
      // Update channel and scope
      setFormData(prev => ({
        ...prev,
        channel: value as string,
        scope: defaultScope[value as string] || 3
      }));
      
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Check if at least one quantity is entered
    const hasQuantity = Object.values(quantities).some(q => q && parseFloat(q) > 0);
    if (!hasQuantity) {
      alert('Please enter at least one quantity.');
      return;
    }

    if (!dateRange?.from) {
      alert('Please select a date range.');
      return;
    }

    setAddingActivity(true);

    try {
      // Get all non-zero quantities
      const filledActivities = availableUnits
        .filter(([label, unitKey]) => quantities[unitKey] && parseFloat(quantities[unitKey]) > 0)
        .map(([label, unitKey]) => ({
          label,
          unitKey,
          value: parseFloat(quantities[unitKey])
        }));

      // ✅ Create ONE combined activity with all quantities
      const combinedActivity = {
        date: dateRange.from!.toISOString().slice(0, 10),
        market: formData.market,
        channel: formData.channel,
        // Use channel as the unit identifier
        unit: formData.channel,
        activityLabel: formData.channel,
        // Use 1 for display purposes (actual quantities are in the quantities object)
        qty: 1,
        scope: formData.scope,
        campaign: formData.campaign,
        notes: formData.notes,
        // Store all quantities as additional data
        quantities: Object.fromEntries(
          filledActivities.map(({ label, unitKey, value }) => [
            unitKey, 
            { label, value }
          ])
        )
      };

      console.log('✅ Adding Combined Activity:', combinedActivity);
      
      // ✅ Add ONLY ONE combined activity (not multiple)
      onAddActivity(combinedActivity);

      // Reset form fields
      setQuantities({});
      setManuallyEditedUnits(new Set());
      setFormData(prev => ({
        ...prev,
        campaign: '',
        notes: ''
      }));
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity. Please try again.');
    } finally {
      setAddingActivity(false);
    }
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
    <div className="bg-gray-50 px-6 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Add Marketing <span className="text-tertiary">Activity</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-4xl">
          Enter the details of your marketing activity to estimate its{" "}
          <strong className="text-orange-400">Carbon Footprint</strong>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Activity Type Quantities */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 font-medium ">Activity Type </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
          {availableUnits.map(([label, unitKey]) => {
            const isManuallyEdited = manuallyEditedUnits.has(unitKey);
            const hasValue = quantities[unitKey] && parseFloat(quantities[unitKey]) > 0;
            const isAutoCalculated = hasValue && !isManuallyEdited;
            
            return (
              <div key={unitKey} className="space-y-2">
                <Label 
                  htmlFor={unitKey} 
                  className={`text-sm font-medium `}
                >
                  {label}
                
                </Label>
                <Input
                  id={unitKey}
                  type="number"
                  step="0.01"
                  value={quantities[unitKey] || ''}
                  onChange={(e) => handleQuantityChange(unitKey, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 `}
                />
              
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={addingActivity || !Object.values(quantities).some(q => q && parseFloat(q) > 0) || !dateRange?.from}
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