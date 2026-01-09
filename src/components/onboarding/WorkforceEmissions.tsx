"use client";

import React, { useEffect, useState } from "react";
import Dropdown, { Option } from "../ui/dropdown";
import FloatingInput from "../ui/FloatingInput";
import { Country, State, City } from "country-state-city";
import { Props } from "./Cdn";

export default function WorkforceEmissions({ onBack, onNext }: Props) {
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  /* Country options */
  const countryOptions: Option[] = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  /* State options (depends on country) */
  const stateOptions: Option[] = country
    ? State.getStatesOfCountry(country).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  /* City options (depends on country + state) */
  const cityOptions: Option[] =
    country && state
      ? City.getCitiesOfState(country, state).map((c) => ({
          label: c.name,
          value: c.name,
        }))
      : [];

  /* Reset state & city when country changes */
  useEffect(() => {
    setState("");
    setCity("");
  }, [country]);

  /* Reset city when state changes */
  useEffect(() => {
    setCity("");
  }, [state]);

  return (
   <div className=" w-full  ">
  <h1 className="text-4xl my-5 font-semibold text-neutral-900">
    Workforce emissions
  </h1>

  {/* Row 1: Workforce Type & Work Arrangement */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <Dropdown
      label="Workforce Type"
      placeholder="Select workforce type"
      options={[
        { label: "0%-25%", value: "0-25" },
        { label: "25%-50%", value: "25-50" },
        { label: "50%-75%", value: "50-75" },
        { label: "75%-100%", value: "75-100" },
      ]}
    />

    <Dropdown
      label="Work arrangement remote"
      placeholder="Select work arrangement"
      options={[
        { label: "0%", value: "0" },
        { label: "0-50%", value: "50" },
        { label: "50%-100%", value: "100" },
      ]}
    />
  </div>

  {/* Row 2: Country, State, City */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
    <Dropdown
      label="Country"
      placeholder="Select country"
      options={countryOptions}
      value={country}
      onChange={setCountry}
    />

    <Dropdown
      label="State"
      placeholder={country ? "Select state" : "Select country first"}
      options={stateOptions}
      value={state}
      onChange={setState}
    />

    <Dropdown
      label="City"
      placeholder={state ? "Select city" : "Select state first"}
      options={cityOptions}
      value={city}
      onChange={setCity}
    />
  </div>

  {/* Row 3: Square meters (full width) */}
  <div className="mt-6">
    <FloatingInput
      placeholder="Square meters"
      size="medium"
    />
  </div>
</div>
  );
}
