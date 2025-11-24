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
  showErrors?: boolean;
}

export default function OrganizationStep({
  organization,
  setOrganization,
  reportingPeriod,
  setReportingPeriod,
  separateOffsets,
  setSeparateOffsets,
  showErrors = false,
}: OrganizationStepProps) {
  // Set default date to today if not already set
  React.useEffect(() => {
    if (!reportingPeriod) {
      const today = new Date();
      setReportingPeriod({ from: today, to: today });
    }
  }, [reportingPeriod, setReportingPeriod]);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 flex-1"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: '#080c04' }}>Organization Information</h2>

      <div className="space-y-2">
        <Label htmlFor="organization" className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Organization/Brand
        </Label>
        {showErrors && !organization && (
          <div className="py-2 flex items-center gap-2" style={{ color: '#dc2626' }}>
            
            <span>Please fill this field to proceed to next step</span>
          </div>
        )}
        <Input
          id="organization"
          type="text"
          placeholder="e.g., Acme Corporation"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>Reporting Period</Label>
        {showErrors && (!reportingPeriod?.from || !reportingPeriod?.to) && (
          <div className="py-2 flex items-center gap-2" style={{ color: '#dc2626' }}>
          
            <span>Please select a date range to proceed to next step</span>
          </div>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] bg-[#fcfdf6] text-[#6c5f31] hover:bg-[#fcfdf6] hover:text-[#6c5f31]"
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
                <span className="text-[#d1cebb] font-normal">e.g., jan 2024 - dec 2024</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#fcfdf6]" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={reportingPeriod?.from}
              selected={reportingPeriod}
              onSelect={setReportingPeriod}
              numberOfMonths={2}
              fixedWeeks
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offsets" className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Offsets to Disclose Separately (kg CO₂e)
        </Label>
        <Input
          id="offsets"
          type="text"
          placeholder="Enter your offset amount in kg"
          value={separateOffsets}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              setSeparateOffsets(value);
            }
          }}
          onKeyPress={(e) => {
            if (!/[0-9.]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] focus:border-[#b0ea1d] focus:ring-[#b0ea1d]/20"
        />
        <p className="text-sm mt-2" style={{ color: '#6c5f31', opacity: 0.7 }}>
          Specify any carbon offsets you want to disclose separately from total emissions
        </p>
      </div>
    </motion.div>
  );
}
