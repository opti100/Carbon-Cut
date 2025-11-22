import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CHANNELS } from '@/constants/data';

interface ActivitiesStepProps {
  channel: string;
  selectedActivities: Set<string>;
  setSelectedActivities: (value: Set<string>) => void;
  activityQuantities: Record<string, string>;
  handleQuantityChange: (unitKey: string, value: string) => void;
}

export default function ActivitiesStep({
  channel,
  selectedActivities,
  setSelectedActivities,
  activityQuantities,
  handleQuantityChange,
}: ActivitiesStepProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4 flex-1"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{ color: '#080c04' }}>Select Activities & Enter Quantities</h2>

      {/* Step 3a: Select Known Activities */}
      <div className="space-y-2">
        <Label className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Which activities do you have data for?
        </Label>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {channel &&
            CHANNELS[channel] &&
            CHANNELS[channel].map(([label, unitKey]) => (
              <button
                key={unitKey}
                type="button"
                onClick={() => {
                  const newSelected = new Set(selectedActivities);
                  if (newSelected.has(unitKey)) {
                    newSelected.delete(unitKey);
                  } else {
                    newSelected.add(unitKey);
                  }
                  setSelectedActivities(newSelected);
                }}
                className="px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm font-medium hover:border-[#F0db18]"
                style={{
                  borderColor: selectedActivities.has(unitKey) ? '#F0db18' : '#d1cebb',
                  color: selectedActivities.has(unitKey) ? '#080c04' : '#6c5f31'
                }}
              >
                {label}
              </button>
            ))}
          {!channel && (
            <div className="py-4" style={{ color: '#6c5f31', opacity: 0.7 }}>
              Please select a channel in Step 2 to see available activity types
            </div>
          )}
        </div>
      </div>

      {/* Step 3b: Enter Quantities for Selected Activities */}
      <div className="space-y-2">
        <Label className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Enter quantities for selected activities
        </Label>
        
        <div className="h-48 sm:h-56">
          {selectedActivities.size > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
              {channel &&
                CHANNELS[channel] &&
                CHANNELS[channel]
                  .filter(([label, unitKey]) => selectedActivities.has(unitKey))
                  .map(([label, unitKey]) => (
                    <div key={unitKey} className="space-y-1">
                      <Label htmlFor={unitKey} className="text-base font-semibold" style={{ color: '#6c5f31' }}>
                        {label}
                      </Label>
                      <Input
                        id={unitKey}
                        type="number"
                        step="0.01"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={activityQuantities[unitKey] || ''}
                        onChange={(e) => handleQuantityChange(unitKey, e.target.value)}
                        className="text-sm sm:text-base p-3 sm:p-4 border-2 hover:border-[#F0db18] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20"
                      />
                    </div>
                  ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm" style={{ color: '#d1cebb' }}>
              Select activities above to enter quantities
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
