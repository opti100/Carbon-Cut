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
}: CampaignStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 flex-1 overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Campaign Details</h2>

      <div className="space-y-2">
        <Label className="text-lg font-semibold text-gray-700">Campaign Period</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-lg p-6 border-2 hover:border-green-500"
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
                <span className="text-gray-400">Select campaign period</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={campaignPeriod?.from}
              selected={campaignPeriod}
              onSelect={setCampaignPeriod}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="market" className="text-lg font-semibold text-gray-700">
          Market
        </Label>
        <Select value={market} onValueChange={setMarket} disabled={loadingCountries}>
          <SelectTrigger className="text-lg p-6 border-2 focus:border-green-500">
            <SelectValue placeholder={loadingCountries ? 'Loading markets...' : 'Select market'} />
          </SelectTrigger>
          <SelectContent>
            {availableCountries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel" className="text-lg font-semibold text-gray-700">
          Channel
        </Label>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="text-lg p-6 border-2 focus:border-green-500">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
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
