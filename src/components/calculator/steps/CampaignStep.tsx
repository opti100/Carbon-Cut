import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { CountryData } from '@/types/types';

interface CampaignStepProps {
  campaignPeriod: DateRange | undefined;
  setCampaignPeriod: (value: DateRange | undefined) => void;
  market: string;
  setMarket: (value: string) => void;
  channel: string;
  setChannel: (value: string) => void;
  availableCountries: CountryData[];
  loadingCountries: boolean;
  channels: Record<string, Array<[string, string]>>;
  reportingPeriod?: DateRange | undefined;
  showErrors?: boolean;
}

export default function CampaignStep({
  campaignPeriod,
  setCampaignPeriod,
  market,
  setMarket,
  channel,
  setChannel,
  availableCountries,
  loadingCountries,
  channels,
  reportingPeriod,
  showErrors = false,
}: CampaignStepProps) {
  // Set default date to today if not already set
  React.useEffect(() => {
    if (!campaignPeriod) {
      const today = new Date();
      setCampaignPeriod({ from: today, to: today });
    }
  }, [campaignPeriod, setCampaignPeriod]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 flex-1"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: '#080c04' }}>Campaign Details</h2>

      <div className="space-y-2">
        <Label className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>Campaign Period</Label>
        {showErrors && (!campaignPeriod?.from || !campaignPeriod?.to) && (
          <div className="py-2 flex items-center gap-2" style={{ color: '#dc2626' }}>
          
            <span>Please select a date range to proceed to next step</span>
          </div>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18]  bg-[#fcfdf6]"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {campaignPeriod?.from ? (
                campaignPeriod.to ? (
                  <>
                    {format(campaignPeriod.from, 'LLL dd, y')} - {format(campaignPeriod.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(campaignPeriod.from, 'LLL dd, y')
                )
              ) : (
                <span className="text-[#d1cebb] font-normal">e.g., jan 2024 - mar 2024</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#fcfdf6]" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={campaignPeriod?.from}
              selected={campaignPeriod}
              onSelect={setCampaignPeriod}
              numberOfMonths={2}
              className=''
              disabled={(date) => {
                if (!reportingPeriod?.from || !reportingPeriod?.to) return false;
                return date < reportingPeriod.from || date > reportingPeriod.to;
              }}
              fromDate={reportingPeriod?.from}
              toDate={reportingPeriod?.to}
              fixedWeeks
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="market" className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Market
        </Label>
        {showErrors && !market && (
          <div className="py-2 flex items-center gap-2" style={{ color: '#dc2626' }}>
           
            <span>Please select a market to proceed to next step</span>
          </div>
        )}
        <Select value={market} onValueChange={setMarket} disabled={loadingCountries}>
          <SelectTrigger className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18]">
            <SelectValue placeholder={loadingCountries ? 'Loading markets...' : 'Select market'} />
          </SelectTrigger>
          <SelectContent  className='bg-[#fcfdf6]'>
            {availableCountries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel" className="text-base sm:text-lg font-semibold" style={{ color: '#6c5f31' }}>
          Channel
        </Label>
        {showErrors && !channel && (
          <div className="py-2 flex items-center gap-2" style={{ color: '#dc2626' }}>
           
            <span>Please select a channel to proceed to next step</span>
          </div>
        )}
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="text-base sm:text-lg p-4 sm:p-6 border-2 hover:border-[#F0db18] " >
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent className='bg-[#fcfdf6]'>
            {Object.keys(channels).map((channelKey) => (
              <SelectItem key={channelKey} value={channelKey}>
                {channelKey}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
