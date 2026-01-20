"use client";

import React, { useState } from "react";
import FloatingInput from "../ui/FloatingInput";
import { OnPremData } from "@/types/onboarding";
import { onboardingApi } from "@/services/onboarding/onboarding";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, Loader2, CheckCircle2 } from "lucide-react";
import { CommandHelper } from "./Command";

interface Props {
  data: OnPremData;
  onDataChange: (data: OnPremData) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canProceed: boolean;
}

const OnPrem = ({
  data,
  onDataChange,
  onBack,
  onNext,
  onSkip,
  canProceed,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await onboardingApi.submitOnPrem(data);

      if (response.success) {
        setSubmitSuccess(
          response.message ||
            `Successfully calculated ${response.data.total_emissions_kg.toFixed(
              2
            )} kg CO₂e for on-premises servers`
        );
        // Proceed to next step after short delay
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        throw new Error("Failed to submit on-premises server data");
      }
    } catch (error: any) {
      console.error("Error submitting on-prem data:", error);
      setSubmitError(
        error.error ||
          error.message ||
          "Failed to submit on-premises server data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Success Message */}
      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {submitSuccess}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircleIcon className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      <CommandHelper />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">CPU Cores</label>
          <Select
            value={data.cpuCores}
            onValueChange={(value) => {
              onDataChange({ ...data, cpuCores: value });
              setSubmitError(null);
              setSubmitSuccess(null);
            }}
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select CPU cores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="32">32</SelectItem>
              <SelectItem value="64">64</SelectItem>
              <SelectItem value="128">128</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">RAM (GB)</label>
          <Select
            value={data.ramGB}
            onValueChange={(value) => {
              onDataChange({ ...data, ramGB: value });
              setSubmitError(null);
              setSubmitSuccess(null);
            }}
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select RAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="32">32</SelectItem>
              <SelectItem value="64">64</SelectItem>
              <SelectItem value="128">128</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FloatingInput
          type="number"
          placeholder="Storage (TB)"
          size="big"
          value={data.storageTB}
          onChange={(value) => {
            onDataChange({ ...data, storageTB: value });
            setSubmitError(null);
            setSubmitSuccess(null);
          }}
        />
      </div>

      {/* Information Alert */}
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>On-Premise Infrastructure Emissions</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Emissions from self-managed IT and data center operations
          </p>
          <ul className="list-inside list-disc text-sm space-y-1">
            <li>Generated by servers, storage, and networking equipment</li>
            <li>Includes cooling, power distribution, and backup systems</li>
            <li>Depends heavily on hardware efficiency and utilization</li>
            <li>Often less efficient than hyperscale cloud data centers</li>
            <li>Requires direct electricity consumption tracking</li>
            <li>Typically categorized as Scope 2 emissions</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className={clsx(
            "min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium transition-colors",
            isSubmitting
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "text-neutral-700 hover:bg-[#d1cebb]"
          )}
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmitting}
            className={clsx(
              "min-w-[140px] rounded-lg px-8 py-3 text-base font-medium text-white transition-all flex items-center justify-center gap-2",
              canProceed && !isSubmitting
                ? "bg-black hover:bg-neutral-800 cursor-pointer shadow-sm hover:shadow"
                : "bg-neutral-300 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnPrem;
