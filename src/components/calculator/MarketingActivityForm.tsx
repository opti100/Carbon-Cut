import { ActivityData, ChannelUnits, CountryData } from '@/types/types';
import { useState } from 'react';

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
    <section className="mb-8 p-6 bg-black rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Marketing Activity</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Market</label>
          <select
            value={formData.market}
            onChange={(e) => handleChange('market', e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {loadingCountries ? (
              <option>Loading countries...</option>
            ) : (
              countries.map((country) => (
                <option key={country.code} value={country.name}>{country.name}</option>
              ))
            )}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Channel</label>
          <select
            value={formData.channel}
            onChange={(e) => handleChange('channel', e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.keys(channels).map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Activity type</label>
          <select
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableUnits.map(([label, key]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            step="0.000001"
            value={formData.qty}
            onChange={(e) => handleChange('qty', e.target.value)}
            placeholder="e.g., 5000000"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Scope</label>
          <select
            value={formData.scope}
            onChange={(e) => handleChange('scope', parseInt(e.target.value))}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Campaign name <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.campaign}
            onChange={(e) => handleChange('campaign', e.target.value)}
            placeholder="Spring Sale"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any context"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button>
          
        </button>
        <button
          onClick={handleSubmit}
          disabled={addingActivity}
          className="px-6 py-3 bg-[#1F4960] text-white rounded-none hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {addingActivity ? 'Adding...' : '+ Add to log'}
        </button>
      </div>
    </section>
  );
}