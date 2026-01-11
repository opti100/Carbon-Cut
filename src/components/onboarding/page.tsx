"use client";

import { useState } from "react";
import CloudProvider from "./CloudProvider";
import Cdn from "./Cdn";
import { StepProgress } from "./stepProgress";
import WorkforceEmissions from "./WorkforceEmissions";
import OnPrem from "./OnPrem";
import {
  CloudProviderData,
  CdnData,
  WorkforceEmissionsData,
  OnPremData,
  TravelData,
  TravelItem,
} from "@/types/onboarding";
import TravellingDetails from "./TravelDetails";

const TOTAL_STEPS = 5;

export default function VTwoFlow() {
    const [step, setStep] = useState(1);

    // Form state for all steps
    const [cloudProviderData, setCloudProviderData] = useState<CloudProviderData>({
      tabType: "Manual",
      monthlyCost: "",
      actualCost: "",
      monthlyHoursUsage: "",
      region: "",
      uploadedFile: null,
    });

    const [cdnData, setCdnData] = useState<CdnData>({
      cdnProvider: "",
      monthlyGBTransferred: "",
      regions: "",
    });

    const [workforceEmissionsData, setWorkforceEmissionsData] = useState<WorkforceEmissionsData>({
      workforceType: "",
      workArrangementRemote: "",
      country: "",
      state: "",
      city: "",
      squareMeters: "",
    });

    const [onPremData, setOnPremData] = useState<OnPremData>({
      name: "",
      cpuCores: "",
      ramGB: "",
      storageTB: "",
      avgCpuUtilization: "",
      hoursPerDay: "",
    });

    const [travelData, setTravelData] = useState<TravelData>({
      travels: [{ travel_type: "", isOpen: true }],
    });

    // Validation functions
    const isStep1Valid = () => {
      if (cloudProviderData.tabType === "Manual") {
        return (
          cloudProviderData.monthlyCost !== "" &&
          cloudProviderData.actualCost !== "" &&
          cloudProviderData.monthlyHoursUsage !== "" &&
          cloudProviderData.region !== ""
        );
      } else {
        return cloudProviderData.uploadedFile !== null;
      }
    };

    const isStep2Valid = () => {
      return (
        cdnData.cdnProvider !== "" &&
        cdnData.monthlyGBTransferred !== "" &&
        cdnData.regions !== ""
      );
    };

    const isStep3Valid = () => {
      return (
        workforceEmissionsData.workforceType !== "" &&
        workforceEmissionsData.workArrangementRemote !== "" &&
        workforceEmissionsData.country !== "" &&
        workforceEmissionsData.state !== "" &&
        workforceEmissionsData.city !== "" &&
        workforceEmissionsData.squareMeters !== ""
      );
    };

    const isStep4Valid = () => {
      return (
        onPremData.name !== "" &&
        onPremData.cpuCores !== "" &&
        onPremData.ramGB !== "" &&
        onPremData.storageTB !== "" &&
        onPremData.avgCpuUtilization !== "" &&
        onPremData.hoursPerDay !== ""
      );
    };

    const isStep5Valid = () => {
      // Each travel item must have at least travel_type, distance_km, and passenger_count
      // If it's a flight, flight_class and is_domestic are also required
      if (travelData.travels.length === 0) return false;
      
      return travelData.travels.every((travel: TravelItem) => {
        const baseValid = 
          travel.travel_type !== "" &&
          travel.distance_km !== undefined &&
          travel.distance_km !== "" &&
          travel.passenger_count !== undefined &&
          travel.passenger_count !== "";
        
        if (travel.travel_type === "flight") {
          return baseValid && 
                 travel.flight_class !== undefined && 
                 travel.flight_class !== "" &&
                 travel.is_domestic !== undefined && 
                 travel.is_domestic !== "";
        }
        
        return baseValid;
      });
    };

    const canProceed = () => {
      switch (step) {
        case 1: return isStep1Valid();
        case 2: return isStep2Valid();
        case 3: return isStep3Valid();
        case 4: return isStep4Valid();
        case 5: return isStep5Valid();
        default: return true;
      }
    };

    const handleNext = () => {
      if (canProceed()) {
        setStep(step + 1);
      }
    };

    const handleStepChange = (newStep: number) => {
      // Allow going back anytime
      if (newStep < step) {
        setStep(newStep);
        return;
      }
      
      // Allow going forward only to the next step if current step is valid
      if (newStep === step + 1 && canProceed()) {
        setStep(newStep);
        return;
      }
      
      // Don't allow skipping steps or going forward if current step is invalid
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#fcfdf6] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex w-full max-w-6xl flex-col gap-6 sm:gap-8 rounded-xl p-4 sm:p-6 lg:p-8">

                {/* Progress bar */}
                <StepProgress
                    total={TOTAL_STEPS}
                    current={step}
                    onChange={handleStepChange}
                />

                {/* Step content */}
                {step === 1 && (
                  <CloudProvider 
                    data={cloudProviderData}
                    onDataChange={setCloudProviderData}
                    onNext={handleNext}
                    canProceed={isStep1Valid()}
                  />
                )}

                {step === 2 && (
                    <Cdn
                        data={cdnData}
                        onDataChange={setCdnData}
                        onBack={() => setStep(1)}
                        onNext={handleNext}
                        canProceed={isStep2Valid()}
                    />
                )}

                {step === 3 && (
                    <WorkforceEmissions
                        data={workforceEmissionsData}
                        onDataChange={setWorkforceEmissionsData}
                        onBack={() => setStep(2)}
                        onNext={handleNext}
                        canProceed={isStep3Valid()}
                    />
                )}
                
                {step === 4 && (
                    <OnPrem 
                        data={onPremData}
                        onDataChange={setOnPremData}
                        onBack={() => setStep(3)}
                        onNext={handleNext}
                        canProceed={isStep4Valid()}
                    />
                )}

                {step === 5 && (
                    <TravellingDetails 
                        data={travelData}
                        onDataChange={setTravelData}
                        onBack={() => setStep(4)}
                        onNext={handleNext}
                        canProceed={isStep5Valid()}
                    />
                )}
            </div>
        </main>
    );
}
