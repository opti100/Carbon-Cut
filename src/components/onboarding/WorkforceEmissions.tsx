"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FloatingInput from "../ui/FloatingInput";
import { Country, State, City } from "country-state-city";
import { WorkforceEmissionsData } from "@/types/onboarding";
import clsx from "clsx";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  data: WorkforceEmissionsData;
  onDataChange: (data: WorkforceEmissionsData) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function WorkforceEmissions({
  data,
  onDataChange,
  onBack,
  onNext,
  canProceed,
}: Props) {
  const countryOptions = Country.getAllCountries();
  const stateOptions = data.country
    ? State.getStatesOfCountry(data.country)
    : [];
  const cityOptions =
    data.country && data.state
      ? City.getCitiesOfState(data.country, data.state)
      : [];

  return (
    <div className="w-full space-y-8">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Workforce Type</label>
          <Select
            value={data.workforceType}
            onValueChange={(value) =>
              onDataChange({ ...data, workforceType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select workforce " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50">0-50</SelectItem>
              <SelectItem value="50-100">50-100</SelectItem>
              <SelectItem value="100-500">100-500</SelectItem>
              <SelectItem value="500-1000">500-1000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Work arrangement remote</label>
          <Select
            value={data.workArrangementRemote}
            onValueChange={(value) =>
              onDataChange({ ...data, workArrangementRemote: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work arrangement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="50">0–50%</SelectItem>
              <SelectItem value="100">50–100%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select
            value={data.country}
            onValueChange={(value) =>
              onDataChange({ ...data, country: value, state: "", city: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((c) => (
                <SelectItem key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select
            value={data.state}
            onValueChange={(value) =>
              onDataChange({ ...data, state: value, city: "" })
            }
            disabled={!data.country}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  data.country ? "Select state" : "Select country first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((s) => (
                <SelectItem key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Select
            value={data.city}
            onValueChange={(value) =>
              onDataChange({ ...data, city: value })
            }
            disabled={!data.state}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  data.state ? "Select city" : "Select state first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cityOptions.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3 */}
      <FloatingInput
        type="number"
        placeholder="Square meters"
        size="big"
        value={data.squareMeters}
        onChange={(value) =>
          onDataChange({ ...data, squareMeters: value })
        }
      />
        <Alert >
        <AlertCircleIcon />
        <AlertTitle>Workforce Emissions</AlertTitle>
        < AlertDescription>
          <p>Emissions from employee digital and work-related activities</p>
          <ul className="list-inside list-disc text-sm">
            <li>Includes energy use from laptops, monitors, and home office equipment</li>
            <li>Covers emissions from internet usage, video calls, and cloud tools</li>
            <li>Influenced by remote, hybrid, or office-based work models</li>
            <li>May include commuting-related digital enablement impacts</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={onBack}
          className="min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={clsx(
            "min-w-[140px] rounded-lg px-8 py-3 text-base font-medium text-white transition-all",
            canProceed
              ? "bg-black hover:bg-neutral-800 cursor-pointer shadow-sm hover:shadow"
              : "bg-neutral-300 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
