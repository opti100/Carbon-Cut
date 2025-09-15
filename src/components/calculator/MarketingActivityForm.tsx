import { ActivityData, ChannelUnits, CountryData } from '@/types/types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';

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

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-2xl text-gray-900 font-semibold flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Plus className="h-5 w-5 text-green-600" />
          </div>
          Add Marketing Activity
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Enter the details of your marketing activity to calculate its carbon footprint.
        </p>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="activity-date" className="text-gray-700 font-medium">Date</Label>
            <Input
              id="activity-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="market" className="text-gray-700 font-medium">Market</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="channel" className="text-gray-700 font-medium">Channel</Label>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="activity-type" className="text-gray-700 font-medium">Activity type</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-gray-700 font-medium">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.000001"
              value={formData.qty}
              onChange={(e) => handleChange('qty', e.target.value)}
              placeholder="e.g., 5000000"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope" className="text-gray-700 font-medium">Scope</Label>
            <Select
              value={formData.scope.toString()}
              onValueChange={(value) => handleChange('scope', parseInt(value))}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="1" className="text-gray-900">Scope 1</SelectItem>
                <SelectItem value="2" className="text-gray-900">Scope 2</SelectItem>
                <SelectItem value="3" className="text-gray-900">Scope 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="campaign" className="text-gray-700 font-medium">
              Campaign name <span className="text-gray-500">(optional)</span>
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
              Notes <span className="text-gray-500">(optional)</span>
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
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            onClick={handleSubmit}
            disabled={addingActivity || !formData.qty}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {addingActivity ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add to log
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}