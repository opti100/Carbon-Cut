import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface OrganizationStepProps {
  organization: string;
  setOrganization: (value: string) => void;
  reportingPeriod: DateRange | undefined;
  setReportingPeriod: (value: DateRange | undefined) => void;
  separateOffsets: string;
  setSeparateOffsets: (value: string) => void;
}

export default function OrganizationStep({
  organization,
  setOrganization,
  reportingPeriod,
  setReportingPeriod,
  separateOffsets,
  setSeparateOffsets,
}: OrganizationStepProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 flex-1 overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Organization Information</h2>

      <div className="space-y-2">
        <Label htmlFor="organization" className="text-lg font-semibold text-gray-700">
          Organization/Brand
        </Label>
        <Input
          id="organization"
          type="text"
          placeholder="e.g., Acme Corporation"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="text-lg p-6 border-2 focus:border-green-500 focus:ring-green-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold text-gray-700">Reporting Period</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-lg p-6 border-2 hover:border-green-500"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {reportingPeriod?.from ? (
                reportingPeriod.to ? (
                  <>
                    {format(reportingPeriod.from, 'LLL dd, y')} - {format(reportingPeriod.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(reportingPeriod.from, 'LLL dd, y')
                )
              ) : (
                <span className="text-gray-400">Select reporting period</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={reportingPeriod?.from}
              selected={reportingPeriod}
              onSelect={setReportingPeriod}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offsets" className="text-lg font-semibold text-gray-700">
          Offsets to Disclose Separately
        </Label>
        <Input
          id="offsets"
          type="text"
          placeholder="Enter your offset amount"
          value={separateOffsets}
          onChange={(e) => setSeparateOffsets(e.target.value)}
          className="text-lg p-6 border-2 focus:border-green-500 focus:ring-green-500/20"
        />
        <p className="text-sm text-gray-500 mt-2">
          Specify any carbon offsets you want to disclose separately from total emissions
        </p>
      </div>
    </motion.div>
  );
}
