import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DetailsStepProps {
  emissionScope: string;
  setEmissionScope: (value: string) => void;
  campaignName: string;
  setCampaignName: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
}

export default function DetailsStep({
  emissionScope,
  setEmissionScope,
  campaignName,
  setCampaignName,
  note,
  setNote,
}: DetailsStepProps) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 flex-1"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Additional Details</h2>

      <div className="space-y-2">
        <Label htmlFor="scope" className="text-lg font-semibold text-gray-700">
          Emission Scope
        </Label>
        <Select value={emissionScope} onValueChange={setEmissionScope}>
          <SelectTrigger className="text-lg p-6 border-2  hover:border-[#b0ea1d] focus:border-[#b0ea1d] bg-[#fcfdf6]">
            <SelectValue placeholder="Select emission scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Scope 1 - Direct emissions</SelectItem>
            <SelectItem value="2">Scope 2 - Indirect energy</SelectItem>
            <SelectItem value="3">Scope 3 - Value chain</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-2">
          Categorize your emissions according to GHG Protocol standards (Optional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaignName" className="text-lg font-semibold text-gray-700">
          Campaign Name 
        </Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="e.g., Summer Sale 2025"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="text-lg p-6 border-2 hover:border-[#b0ea1d] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20 bg-[#fcfdf6]"
        />
        <p className="text-sm text-gray-500 mt-2">Give your campaign a memorable name for easy tracking</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-lg font-semibold text-gray-700">
          Note 
        </Label>
        <textarea
          id="note"
          placeholder="Add any additional notes or context about your campaign..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full text-lg p-4 border-2 rounded-md hover:border-[#b0ea1d] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20 bg-[#fcfdf6]"
        />
      </div>
    </motion.div>
  );
}
