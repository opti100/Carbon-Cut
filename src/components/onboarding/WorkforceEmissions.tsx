"use client";

import React from "react";
import Dropdown, { Option } from "../ui/dropdown";
import FloatingInput from "../ui/FloatingInput";
import { Country, State, City } from "country-state-city";
import { WorkforceEmissionsData } from "@/types/onboarding";
import clsx from "clsx";

interface Props {
  data: WorkforceEmissionsData;
  onDataChange: (data: WorkforceEmissionsData) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function WorkforceEmissions({ data, onDataChange, onBack, onNext, canProceed }: Props) {
  /* Country options */
  const countryOptions: Option[] = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  /* State options (depends on country) */
  const stateOptions: Option[] = data.country
    ? State.getStatesOfCountry(data.country).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  /* City options (depends on country + state) */
  const cityOptions: Option[] =
    data.country && data.state
      ? City.getCitiesOfState(data.country, data.state).map((c) => ({
          label: c.name,
          value: c.name,
        }))
      : [];

  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8">
        Workforce emissions
      </h1>

      {/* Row 1: Workforce Type & Work Arrangement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Dropdown
          label="Workforce Type"
          placeholder="Select workforce type"
          options={[
            { label: "0%-25%", value: "0-25" },
            { label: "25%-50%", value: "25-50" },
            { label: "50%-75%", value: "50-75" },
            { label: "75%-100%", value: "75-100" },
          ]}
          value={data.workforceType}
          onChange={(value) => onDataChange({ ...data, workforceType: value })}
        />

        <Dropdown
          label="Work arrangement remote"
          placeholder="Select work arrangement"
          options={[
            { label: "0%", value: "0" },
            { label: "0-50%", value: "50" },
            { label: "50%-100%", value: "100" },
          ]}
          value={data.workArrangementRemote}
          onChange={(value) => onDataChange({ ...data, workArrangementRemote: value })}
        />
      </div>

      {/* Row 2: Country, State, City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <Dropdown
          label="Country"
          placeholder="Select country"
          options={countryOptions}
          value={data.country}
          onChange={(value) => onDataChange({ ...data, country: value, state: "", city: "" })}
        />

        <Dropdown
          label="State"
          placeholder={data.country ? "Select state" : "Select country first"}
          options={stateOptions}
          value={data.state}
          onChange={(value) => onDataChange({ ...data, state: value, city: "" })}
          disabled={!data.country}
        />

        <Dropdown
          label="City"
          placeholder={data.state ? "Select city" : "Select state first"}
          options={cityOptions}
          value={data.city}
          onChange={(value) => onDataChange({ ...data, city: value })}
          disabled={!data.state}
        />
      </div>

      {/* Row 3: Square meters (full width) */}
      <div className="mt-4 sm:mt-6">
        <FloatingInput
        type="number"
          placeholder="Square meters"
          size="medium"
          value={data.squareMeters}
          onChange={(value) => onDataChange({ ...data, squareMeters: value })}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto min-w-[120px] rounded-md border border-neutral-300 px-6 py-2.5 text-sm sm:text-base font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={clsx(
            "w-full sm:w-auto min-w-[120px] rounded-md px-6 py-2.5 text-sm sm:text-base font-medium text-white transition-colors",
            canProceed 
              ? "bg-black hover:bg-neutral-800 cursor-pointer" 
              : "bg-neutral-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
