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
      className="space-y-6 flex-1 overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Select Activities & Enter Quantities</h2>

      {/* Step 3a: Select Known Activities */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Which activities do you have data for?
          </Label>
          <p className="text-sm text-gray-600 mb-4">Select the activities you know the quantities for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {channel &&
            CHANNELS[channel] &&
            CHANNELS[channel].map(([label, unitKey]) => (
              <div
                key={unitKey}
                onClick={() => {
                  const newSelected = new Set(selectedActivities);
                  if (newSelected.has(unitKey)) {
                    newSelected.delete(unitKey);
                    // Clear the quantity when deselecting
                    const newQuantities = { ...activityQuantities };
                    delete newQuantities[unitKey];
                  } else {
                    newSelected.add(unitKey);
                  }
                  setSelectedActivities(newSelected);
                }}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${
                    selectedActivities.has(unitKey)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedActivities.has(unitKey) ? 'border-green-500 bg-green-500' : 'border-gray-300'}
                    `}
                  >
                    {selectedActivities.has(unitKey) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {!channel && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Please select a channel in Step 2 to see available activity types
            </div>
          )}
        </div>
      </div>

      {/* Step 3b: Enter Quantities for Selected Activities */}
      {selectedActivities.size > 0 && (
        <div className="space-y-4 pt-6 border-t">
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-2 block">
              Enter quantities for selected activities
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              Fill in the quantities you know. Other values will be calculated automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg  ">
            {channel &&
              CHANNELS[channel] &&
              CHANNELS[channel]
                .filter(([label, unitKey]) => selectedActivities.has(unitKey))
                .map(([label, unitKey]) => (
                  <div key={unitKey} className="space-y-2">
                    <Label htmlFor={unitKey} className="text-sm font-medium text-gray-700">
                      {label}
                    </Label>
                    <Input
                      id={unitKey}
                      type="number"
                      step="0.01"
                      placeholder={`${label.toLowerCase()}`}
                      value={activityQuantities[unitKey] || ''}
                      onChange={(e) => handleQuantityChange(unitKey, e.target.value)}
                      className="text-base p-4"
                    />
                  </div>
                ))}
          </div>
        </div>
      )}

     
    </motion.div>
  );
}
