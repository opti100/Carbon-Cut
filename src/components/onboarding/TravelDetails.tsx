"use client";

import React from "react";
import FloatingInput from "../ui/FloatingInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircleIcon, ChevronDown, Trash2 } from "lucide-react";
import { TravelData, TravelItem } from "@/types/onboarding";
import clsx from "clsx";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  data: TravelData;
  onDataChange: (data: TravelData) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canProceed: boolean;
}

const travelTypeOptions = [
  { label: "Flight", value: "flight" },
  { label: "Train", value: "train" },
  { label: "Car", value: "car" },
  { label: "Bus", value: "bus" },
];

const flightClassOptions = [
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium_economy" },
  { label: "Business", value: "business" },
  { label: "First Class", value: "first" },
];

const domesticOptions = [
  { label: "Domestic", value: "domestic" },
  { label: "International", value: "international" },
];

export default function TravellingDetails({
  data,
  onDataChange,
  onBack,
  onNext,
  onSkip,
  canProceed,
}: Props) {
  const travels = data.travels;

  const updateTravel = (
    index: number,
    key: keyof TravelItem,
    value: any
  ) => {
    onDataChange({
      travels: travels.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    });
  };

  const addTravel = () => {
    onDataChange({
      travels: [
        ...travels.map((t) => ({ ...t, isOpen: false })),
        { travel_type: "", isOpen: true },
      ],
    });
  };

  const removeTravel = (index: number) => {
    if (travels.length <= 1) return;
    onDataChange({
      travels: travels.filter((_, i) => i !== index),
    });
  };

  const toggleAccordion = (index: number) => {
    onDataChange({
      travels: travels.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      ),
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {travels.map((travel, index) => (
          <div key={index} className="rounded-lg overflow-auto">
            {/* Accordion Header */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer bg-[#d1cebb] transition-colors"
              onClick={() => toggleAccordion(index)}
            >
              <p className="font-semibold text-base text-neutral-900">
                Travel {index + 1}
              </p>

              <div className="flex items-center gap-4">
                {travels.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTravel(index);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <ChevronDown
                  size={20}
                  className={`transition-transform text-neutral-400 ${
                    travel.isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Accordion Content */}
            {travel.isOpen && (
              <div className="px-6 pb-6 pt-2 space-y-5">
                {/* Travel Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel type</label>
                  <Select
                    value={travel.travel_type}
                    onValueChange={(val) =>
                      updateTravel(index, "travel_type", val)
                    }
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue placeholder="Select travel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance */}
                <FloatingInput
                  placeholder="Distance (km)"
                  size="big"
                  type="number"
                  value={travel.distance_km || ""}
                  onChange={(value) =>
                    updateTravel(index, "distance_km", value)
                  }
                />

                {/* Passenger Count */}
                <FloatingInput
                  placeholder="Passenger Count"
                  size="big"
                  type="number"
                  value={travel.passenger_count || ""}
                  onChange={(value) =>
                    updateTravel(index, "passenger_count", value)
                  }
                />

                {/* Travel Date */}
                <FloatingInput
                  placeholder="Travel Date"
                  size="big"
                  type="date"
                  value={travel.travel_date || ""}
                  onChange={(value) =>
                    updateTravel(index, "travel_date", value)
                  }
                />

                {/* Flight-only fields */}
                {travel.travel_type === "flight" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Flight Class */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Flight Class
                      </label>
                      <Select
                        value={travel.flight_class || ""}
                        onValueChange={(val) =>
                          updateTravel(index, "flight_class", val)
                        }
                      >
                        <SelectTrigger className="h-14">
                          <SelectValue placeholder="Select flight class" />
                        </SelectTrigger>
                        <SelectContent>
                          {flightClassOptions.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Domestic / International */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Travel Type
                      </label>
                      <Select
                        value={travel.is_domestic || ""}
                        onValueChange={(val) =>
                          updateTravel(index, "is_domestic", val)
                        }
                      >
                        <SelectTrigger className="h-14">
                          <SelectValue placeholder="Select travel scope" />
                        </SelectTrigger>
                        <SelectContent>
                          {domesticOptions.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add More */}
        <button
          onClick={addTravel}
          className="w-full rounded-lg border-2 border-dashed border-neutral-300 py-4 text-base font-medium text-neutral-600 hover:text-black  transition-colors"
        >
          + Add another travel segment
        </button>
      </div>

      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Travel-Related Emissions</AlertTitle>
        <AlertDescription>
          <ul className="list-inside list-disc text-sm">
            <li>Includes flights, trains, taxis, rental cars, and hotels</li>
            <li>One of the highest-impact emission sources per activity</li>
            <li>Strongly influenced by travel frequency and distance</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={onBack}
          className="min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 hover:bg-[#d1cebb] transition-colors"
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
