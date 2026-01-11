"use client";

import FloatingInput from "../ui/FloatingInput";
import Dropdown from "../ui/dropdown";
import { ChevronDown, Trash2 } from "lucide-react";
import { TravelData, TravelItem } from "@/types/onboarding";
import clsx from "clsx";

interface Props {
  data: TravelData;
  onDataChange: (data: TravelData) => void;
  onBack: () => void;
  onNext: () => void;
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

export default function TravellingDetails({ data, onDataChange, onBack, onNext, canProceed }: Props) {
  const travels = data.travels;

  const updateTravel = (index: number, key: keyof TravelItem, value: any) => {
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
    if (travels.length <= 1) return; // Don't allow removing the last travel
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
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8">
        Travel details
      </h1>

      <div className="space-y-4">
        {travels.map((travel, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white shadow-sm"
          >
            {/* Accordion Header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <p className="font-medium text-sm sm:text-base">
                Travel {index + 1}
              </p>

              <div className="flex items-center gap-3">
                {travels.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTravel(index);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    travel.isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Accordion Content */}
            {travel.isOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Travel Type */}
                <Dropdown
                  label="Travel type"
                  placeholder="eg) Train"
                  options={travelTypeOptions}
                  size="medium"
                  value={travel.travel_type}
                  onChange={(val) =>
                    updateTravel(index, "travel_type", val)
                  }
                />

                {/* Distance */}
                <FloatingInput
                  placeholder="Distance (km)"
                  size="medium"
                  type="number"
                  value={travel.distance_km || ""}
                  onChange={(value) =>
                    updateTravel(index, "distance_km", value)
                  }
                />

                {/* Passenger Count */}
                <FloatingInput
                  placeholder="Passenger Count"
                  size="medium"
                  type="number"
                  value={travel.passenger_count || ""}
                  onChange={(value) =>
                    updateTravel(index, "passenger_count", value)
                  }
                />

                {/* Travel Date */}
                <FloatingInput
                  size="medium"
                  type="date"
                  value={travel.travel_date || ""}
                  onChange={(value) =>
                    updateTravel(index, "travel_date", value)
                  }
                />

                {/* Flight-only fields */}
                {travel.travel_type === "flight" && (
                  <>
                    <Dropdown
                      placeholder="Flight Class"
                      options={flightClassOptions}
                      size="medium"
                      value={travel.flight_class || ""}
                      onChange={(val) =>
                        updateTravel(index, "flight_class", val)
                      }
                    />

                    <Dropdown
                      placeholder="Travel Type"
                      options={domesticOptions}
                      size="medium"
                      value={travel.is_domestic || ""}
                      onChange={(val) =>
                        updateTravel(index, "is_domestic", val)
                      }
                    />
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add More */}
        <button
          onClick={addTravel}
          className="w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm sm:text-base font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          + Add another travel segment
        </button>
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
