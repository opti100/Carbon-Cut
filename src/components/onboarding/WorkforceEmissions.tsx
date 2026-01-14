"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FloatingInput from "../ui/FloatingInput";
import { Country } from "country-state-city";
import { WorkforceEmissionsData, WorkforceItem } from "@/types/onboarding";
import clsx from "clsx";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, ChevronDown, Trash2 } from "lucide-react";

interface Props {
  data: WorkforceEmissionsData;
  onDataChange: (data: WorkforceEmissionsData) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canProceed: boolean;
}

const workforceRangeOptions = [
  { label: "0-50", value: "0-50" },
  { label: "50-100", value: "50-100" },
  { label: "100-500", value: "100-500" },
  { label: "500-1000", value: "500-1000" },
  { label: "1000+", value: "1000+" },
];

const workArrangementOptions = [
  { label: "0%", value: "0" },
  { label: "0–25%", value: "0-25" },
  { label: "25%–50%", value: "25-50" },
  { label: "50–75%", value: "50-75" },
  { label: "75–100%", value: "75-100" },
];

export default function WorkforceEmissions({
  data,
  onDataChange,
  onBack,
  onNext,
  onSkip,
  canProceed,
}: Props) {
  const countryOptions = Country.getAllCountries();
  const workforceLocations = data.workforceLocations || [];

  // Initialize with default workforce location if empty
  useEffect(() => {
    if (workforceLocations.length === 0) {
      onDataChange({
        ...data,
        workforceLocations: [{
          workforceType: "",
          workArrangementRemote: "",
          country: "",
          squareMeters: "",
          isOpen: true
        }],
      });
    }
  }, []);

  const updateWorkforce = (
    index: number,
    key: keyof WorkforceItem,
    value: any
  ) => {
    onDataChange({
      ...data,
      workforceLocations: workforceLocations.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    });
  };

  const addWorkforce = () => {
    onDataChange({
      ...data,
      workforceLocations: [
        ...workforceLocations.map((w) => ({ ...w, isOpen: false })),
        { 
          workforceType: "",
          workArrangementRemote: "",
          country: "",
          squareMeters: "",
          isOpen: true 
        },
      ],
    });
  };

  const removeWorkforce = (index: number) => {
    if (workforceLocations.length <= 1) return;
    onDataChange({
      ...data,
      workforceLocations: workforceLocations.filter((_, i) => i !== index),
    });
  };

  const toggleAccordion = (index: number) => {
    onDataChange({
      ...data,
      workforceLocations: workforceLocations.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      ),
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {workforceLocations.map((workforce, index) => (
          <div key={index} className="rounded-lg  overflow-auto">
            {/* Accordion Header */}
            <div
              className=" flex items-center justify-between px-6 py-4 bg-[#d1cebb] cursor-pointer hover:bg-[#d1cebb] transition-colors"
              onClick={() => toggleAccordion(index)}
            >
              <p className="font-semibold text-base text-neutral-900">
                Workforce Location {index + 1}
              </p>

              <div className="flex items-center gap-4">
                {workforceLocations.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWorkforce(index);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <ChevronDown
                  size={20}
                  className={`transition-transform text-neutral-400 ${
                    workforce.isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Accordion Content */}
            {workforce.isOpen && (
              <div className="px-6 pb-6 pt-2 space-y-5 ">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workforce Range</label>
                    <Select
                      value={workforce.workforceType || ""}
                      onValueChange={(value) =>
                        updateWorkforce(index, "workforceType", value)
                      }
                    >
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Select workforce range" />
                      </SelectTrigger>
                      <SelectContent>
                        {workforceRangeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Remote Work %</label>
                    <Select
                      value={workforce.workArrangementRemote || ""}
                      onValueChange={(value) =>
                        updateWorkforce(index, "workArrangementRemote", value)
                      }
                    >
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Select remote work %" />
                      </SelectTrigger>
                      <SelectContent>
                        {workArrangementOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Select
                      value={workforce.country || ""}
                      onValueChange={(value) =>
                        updateWorkforce(index, "country", value)
                      }
                    >
                      <SelectTrigger className="h-14">
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
                    <FloatingInput
                      type="number"
                      placeholder="Office size in Square meters"
                      size="big"
                      value={workforce.squareMeters || ""}
                      onChange={(value) =>
                        updateWorkforce(index, "squareMeters", value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add More */}
        <button
          onClick={addWorkforce}
          className="w-full rounded-lg border-2 border-dashed border-neutral-300 py-4 text-base font-medium text-neutral-600 hover:text-black  transition-colors"
        >
          + Add another workforce location
        </button>
      </div>

      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Workforce Emissions</AlertTitle>
        <AlertDescription>
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
          className="min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 hover:bg-[#d1cebb] transition-colors"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={onSkip}
            className="min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 hover:bg-[#d1cebb] transition-colors"
          >
            Skip
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
    </div>
  );
}