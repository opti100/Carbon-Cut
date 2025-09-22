import { ActivityData, ChannelUnits, CountryData } from '@/types/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Plus, Calendar as CalendarIcon, Globe, Target, Activity, Hash, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface MarketingActivityFormProps {
  channels: ChannelUnits;
  defaultScope: Record<string, number>;
  countries: CountryData[];
  loadingCountries: boolean;
  onAddActivity: (activity: Omit<ActivityData, 'id'>) => void;
}

export default function MarketingActivityForm({ 
  channels, 
  defaultScope, 
  countries, 
  loadingCountries, 
  onAddActivity 
}: MarketingActivityFormProps) {
  const [formData, setFormData] = useState({
    market: 'United Kingdom',
    channel: 'Digital Ads',
    unit: 'adtech_impression',
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
  const availableUnits = channels[formData.channel] || [];

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update scope and unit when channel changes
      if (field === 'channel') {
        const newUnits = channels[value as string];
        return {
          ...updated,
          unit: newUnits ? newUnits[0][1] : prev.unit,
          scope: defaultScope[value as string] || 3
        };
      }
      
      return updated;
    });
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

      onAddActivity(activityData);
      
      // Reset form fields
      setFormData(prev => ({
        ...prev,
        qty: '',
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

  const getScopeIcon = (scope: number) => {
    switch (scope) {
      case 1: return "🔥";
      case 2: return "⚡";
      case 3: return "🌐";
      default: return "📊";
    }
  };

  return (
    <div className="bg-white px-6  space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Add Marketing Activity
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Enter the details of your marketing activity to calculate its carbon footprint. 
          We use <strong className="text-orange-400">verified emission factors</strong> and real-time data for accurate calculations.
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

        {/* Channel */}
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

        {/* Activity Type */}
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
              {availableUnits.map(([label, key]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-gray-700 font-medium">
            Quantity
          </Label>
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

        {/* Emission Scope */}
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
                  <span className="text-lg">{getScopeIcon(1)}</span>
                  <span>Scope 1 - Direct emissions</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getScopeIcon(2)}</span>
                  <span>Scope 2 - Indirect energy</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getScopeIcon(3)}</span>
                  <span>Scope 3 - Value chain</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-start">
            <Badge variant="outline" className={getScopeColor(formData.scope)}>
              <span className="mr-2">{getScopeIcon(formData.scope)}</span>
              Scope {formData.scope}
            </Badge>
          </div>
        </div>

        {/* Campaign Name */}
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

      {/* Notes - Full Width */}
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
          className="bg-tertiary text-white shadow-lg hover:shadow-xl rounded-xl hover:bg-green-600 transition-all duration-200"
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