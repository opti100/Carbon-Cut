"use client";

import React, { useState } from "react";
import { AlertCircleIcon, Loader2, CheckCircle2 } from "lucide-react";
import FloatingInput from "../ui/FloatingInput";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CdnData } from "@/types/onboarding";
import { onboardingApi } from "@/services/onboarding/onboarding";
import clsx from "clsx";

export interface Props {
  data: CdnData;
  onDataChange: (data: CdnData) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  canProceed: boolean;
}

export default function Cdn({
  data,
  onDataChange,
  onSkip,
  onBack,
  onNext,
  canProceed,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await onboardingApi.submitCDN(data);

      if (response.success) {
        setSubmitSuccess(
          response.message ||
            `Successfully calculated ${response.data.total_emissions_kg.toFixed(
              2
            )} kg CO₂e for CDN data transfer`
        );
        // Proceed to next step after short delay
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        throw new Error("Failed to submit CDN data");
      }
    } catch (error: any) {
      console.error("Error submitting CDN data:", error);
      setSubmitError(
        error.error ||
          error.message ||
          "Failed to submit CDN data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipClick = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    onSkip();
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* CDN Provider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">CDN Provider</label>
          <Select
            value={data.cdnProvider}
            onValueChange={(value) => {
              onDataChange({ ...data, cdnProvider: value });
              setSubmitError(null);
              setSubmitSuccess(null);
            }}
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select CDN provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloudflare">Cloudflare</SelectItem>
              <SelectItem value="aws">AWS CloudFront</SelectItem>
              <SelectItem value="azure">Azure CDN</SelectItem>
              <SelectItem value="google">Google Cloud CDN</SelectItem>
              <SelectItem value="akamai">Akamai</SelectItem>
              <SelectItem value="fastly">Fastly</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Regions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Regions</label>
          <Select
            value={data.regions}
            onValueChange={(value) => {
              onDataChange({ ...data, regions: value });
              setSubmitError(null);
              setSubmitSuccess(null);
            }}
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WORLD">Global</SelectItem>
              <SelectItem value="US">North America</SelectItem>
              <SelectItem value="EU">Europe</SelectItem>
              <SelectItem value="APAC">Asia Pacific</SelectItem>
              <SelectItem value="SA">South America</SelectItem>
              <SelectItem value="AF">Africa</SelectItem>
              <SelectItem value="ME">Middle East</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Monthly GB Transferred */}
        <FloatingInput
          type="number"
          placeholder="Monthly GB Transferred"
          size="big"
          value={data.monthlyGBTransferred}
          onChange={(value) => {
            onDataChange({ ...data, monthlyGBTransferred: value });
            setSubmitError(null);
            setSubmitSuccess(null);
          }}
        />
      </div>

      {/* Information Alert */}
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Content Delivery Network (CDN) Emissions</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Emissions from global content distribution and data transfer
          </p>
          <ul className="list-inside list-disc text-sm space-y-1">
            <li>Generated by delivering digital content closer to end users</li>
            <li>Includes edge servers, caching, and high-volume data transmission</li>
            <li>Calculated based on data transfer volume and regional energy mix</li>
            <li>Typically categorized as Scope 3 emissions</li>
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
            onClick={handleSkipClick}
            disabled={isSubmitting}
            className={clsx(
              "min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium transition-colors",
              isSubmitting
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "text-neutral-700 hover:bg-[#d1cebb]"
            )}
          >
            Skip
          </button>

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
}
