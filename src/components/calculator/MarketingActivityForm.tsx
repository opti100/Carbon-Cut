import { ActivityData, ChannelUnits, CountryData } from '@/types/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Calendar, Globe, Target, Activity, Hash, FileText } from 'lucide-react';

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
    date: new Date().toISOString().slice(0, 10),
    market: 'United Kingdom',
    channel: 'Digital Ads',
    unit: 'adtech_impression',
    qty: '',
    scope: 3,
    campaign: '',
    notes: ''
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

    setAddingActivity(true);

    try {
      const activityLabel = availableUnits.find(([, key]) => key === formData.unit)?.[0] || formData.unit;

      const activityData: Omit<ActivityData, 'id'> = {
        date: formData.date,
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Plus className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Marketing Activity</h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter the details of your marketing activity to calculate its carbon footprint.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1">
          New Activity
        </Badge>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date & Location Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Date & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-date" className="text-gray-700 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Date
                </Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="market" className="text-gray-700 font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  Market
                </Label>
                <Select
                  value={formData.market}
                  onValueChange={(value) => handleChange('market', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {loadingCountries ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          <span className="text-gray-600">Loading countries...</span>
                        </div>
                      </SelectItem>
                    ) : (
                      countries.map((country, index) => (
                        <SelectItem key={index} value={country.name} className="text-gray-900">
                          {country.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Channel & Activity Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Channel & Activity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel" className="text-gray-700 font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  Channel
                </Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => handleChange('channel', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {Object.keys(channels).map(channel => (
                      <SelectItem key={channel} value={channel} className="text-gray-900">
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-type" className="text-gray-700 font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  Activity type
                </Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange('unit', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {availableUnits.map(([label, key]) => (
                      <SelectItem key={key} value={key} className="text-gray-900">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Campaign Details Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
              <Badge variant="outline" className="ml-auto text-xs text-gray-500">
                Optional
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign" className="text-gray-700 font-medium">
                  Campaign name
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
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Notes
                </Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any context"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quantity & Scope */}
        <div className="space-y-6">
          {/* Quantity Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Hash className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-gray-700 font-medium">
                  Amount
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.000001"
                  value={formData.qty}
                  onChange={(e) => handleChange('qty', e.target.value)}
                  placeholder="e.g., 5000000"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg font-mono text-center"
                />
              </div>
              
              {formData.unit && (
                <div className="text-center">
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded-lg border">
                    <span className="text-sm text-gray-600 font-medium">
                      Unit: {availableUnits.find(([, key]) => key === formData.unit)?.[0] || formData.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scope Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Emission Scope</h3>
            </div>
            
            <div className="space-y-3">
              <Select
                value={formData.scope.toString()}
                onValueChange={(value) => handleChange('scope', parseInt(value))}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="1" className="text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getScopeIcon(1)}</span>
                      <Badge variant="outline" className={getScopeColor(1)}>
                        Scope 1
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="2" className="text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getScopeIcon(2)}</span>
                      <Badge variant="outline" className={getScopeColor(2)}>
                        Scope 2
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="3" className="text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getScopeIcon(3)}</span>
                      <Badge variant="outline" className={getScopeColor(3)}>
                        Scope 3
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-center">
                <Badge variant="outline" className={getScopeColor(formData.scope)}>
                  <span className="mr-2">{getScopeIcon(formData.scope)}</span>
                  Scope {formData.scope}
                </Badge>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky top-6">
            <Button
              onClick={handleSubmit}
              disabled={addingActivity || !formData.qty}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-4"
            >
              {addingActivity ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Adding Activity...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Activity Log
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}