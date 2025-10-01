"use client"
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ComplianceMarketCountries } from '@/types/market';

const Page = () => {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  // Extract market options from the ComplianceMarketCountries enum
  const marketOptions = Object.entries(ComplianceMarketCountries);

  return (
    <BlurFade className="flex items-center justify-center min-h-screen" delay={0.3}>
      <div className="p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Select Your Market</h1>
        <div className="mb-4">
          <Select
            onValueChange={(value) => {
              localStorage.setItem('selectedMarket', value);
              setSelectedMarket(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select a market --" />
            </SelectTrigger>
            <SelectContent>
              {marketOptions.map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedMarket && (
          <BlurFade className="mt-4" delay={0.2}>
            <p className="text-sm text-gray-700 text-center mb-4">
              You have selected: <span className="font-medium">{selectedMarket}</span>
            </p>
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = '/projects';
              }}
            >
              Proceed
              <ArrowRight className="hover:ml-2" />
            </Button>
          </BlurFade>
        )}
      </div>
    </BlurFade>
  );
};

export default Page;