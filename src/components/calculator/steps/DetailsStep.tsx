import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DetailsStepProps {
  emissionScope: string
  setEmissionScope: (value: string) => void
  campaignName: string
  setCampaignName: (value: string) => void
  note: string
  setNote: (value: string) => void
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
      className="space-y-4 sm:space-y-6 flex-1"
    >
      <h2
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8"
        style={{ color: '#080c04' }}
      >
        Additional Details
      </h2>

      <div className="space-y-2">
        <Label
          htmlFor="scope"
          className="text-base sm:text-lg font-semibold"
          style={{ color: '#6c5f31' }}
        >
          Emission Scope
        </Label>
        <Select value={emissionScope} onValueChange={setEmissionScope}>
          <SelectTrigger className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] focus:border-[#b0ea1d] bg-[#fcfdf6]">
            <SelectValue placeholder="Select emission scope" />
          </SelectTrigger>
          <SelectContent className="bg-[#fcfdf6]">
            <SelectItem value="1">Scope 1 - Direct emissions</SelectItem>
            <SelectItem value="2">Scope 2 - Indirect energy</SelectItem>
            <SelectItem value="3">Scope 3 - Value chain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="campaignName"
          className="text-base sm:text-lg font-semibold"
          style={{ color: '#6c5f31' }}
        >
          Campaign Name
        </Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="e.g., Summer Sale 2025"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20 bg-[#fcfdf6]"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="note"
          className="text-base sm:text-lg font-semibold"
          style={{ color: '#6c5f31' }}
        >
          Notes
        </Label>
        <textarea
          id="note"
          placeholder="Add any additional notes or context about your campaign..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full text-base sm:text-lg p-4 sm:p-6 border-2 rounded-md hover:border-[#F0db18] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20 bg-[#fcfdf6]"
        />
      </div>
    </motion.div>
  )
}
