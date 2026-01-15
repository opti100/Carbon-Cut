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
import { StepsSidebar } from "./StepSidebar";
import CardNav from "../CardNav";
import { navData } from "../NavData";
import Sdk from "./Sdk";

const TOTAL_STEPS = 5;

const STEP_TITLES: Record<number, string> = {
  1: "Tell us about your cloud usage",
  2: "Configure your CDN traffic",
  3: "Describe your on‑prem infrastructure",
  4: "How many employees do you have?",
  5: "Add your company travel details",
};

const STEP_SUBTITLES: Record<number, string> = {
  1: "We'll use this to estimate the emissions from your cloud providers.",
  2: "Traffic and regions help us understand your delivery footprint.",
  3: "Servers and utilisation levels drive on‑prem energy consumption.",
  4: "Employee count and workspace size shape your workforce emissions profile.",
  5: "Business trips and commutes contribute to your overall footprint.",
};

export default function VTwoFlow() {
  const [step, setStep] = useState(1);

  const [cloudProviderData, setCloudProviderData] =
    useState<CloudProviderData>({
      tabType: "Manual",
      actualCost: "",
      monthlyHoursUsage: "",
      region: "",
      uploadedFile: null,
      cloud: "",
      isManualOpen:false,
      isUploadOpen:false,
    });

  const [cdnData, setCdnData] = useState<CdnData>({
    cdnProvider: "",
    monthlyGBTransferred: "",
    regions: "",
  });

  const [workforceEmissionsData, setWorkforceEmissionsData] =
    useState<WorkforceEmissionsData>({
      workforceLocations: [],
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

  const isStep1Valid = () => {
    if (cloudProviderData.tabType === "Manual") {
      return (
        cloudProviderData.cloud !== "" &&
        cloudProviderData.region !== "" &&
        cloudProviderData.actualCost !== "" &&
        cloudProviderData.monthlyHoursUsage !== ""
      );
    } else if (cloudProviderData.tabType === "Upload") {
      return (
        cloudProviderData.cloud !== "" &&
        cloudProviderData.uploadedFile !== null
      );
    }
    return false;
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
      onPremData.cpuCores !== "" &&
      onPremData.ramGB !== "" &&
      onPremData.storageTB !== ""
    );
  };

  const isStep4Valid = () => {
    if (!workforceEmissionsData.workforceLocations || workforceEmissionsData.workforceLocations.length === 0) {
      return false;
    }
    return workforceEmissionsData.workforceLocations.every((location) => 
      location.workforceType !== "" &&
      location.workArrangementRemote !== "" &&
      location.country !== "" &&
      location.squareMeters !== ""
    );
  };

  const isStep5Valid = () => {
    if (travelData.travels.length === 0) return false;

    return travelData.travels.every((travel: TravelItem) => {
      const baseValid =
        travel.travel_type !== "" &&
        travel.distance_km !== undefined &&
        travel.distance_km !== "" &&
        travel.passenger_count !== undefined &&
        travel.passenger_count !== "";

      if (travel.travel_type === "flight") {
        return (
          baseValid &&
          travel.flight_class !== undefined &&
          travel.flight_class !== "" &&
          travel.is_domestic !== undefined &&
          travel.is_domestic !== ""
        );
      }

      return baseValid;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      case 5:
        return isStep5Valid();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const handleStepChange = (newStep: number) => {
    if (newStep < step) {
      setStep(newStep);
      return;
    }
    
    if (newStep === step + 1 && canProceed()) {
      setStep(newStep);
      return;
    }
  };

  const title = STEP_TITLES[step];
  const subtitle = STEP_SUBTITLES[step];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 w-full">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>
      <main className="flex min-h-screen justify-center bg-[#fcfdf6] px-2 sm:px-4 lg:px-6 xl:px-12 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-16 lg:pb-20">
        <div className="flex w-full max-w-7xl gap-4 sm:gap-6 lg:gap-12 xl:gap-20">
          <div className="hidden xl:block w-48 2xl:w-56 shrink-0">
            <StepsSidebar currentStep={step} />
          </div>
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <div className="flex-1 min-w-0">
                <StepProgress
                  total={TOTAL_STEPS}
                  current={step}
                  onChange={handleStepChange}
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 whitespace-nowrap">
                {step}/{TOTAL_STEPS}
              </span>
            </div>
            <div className="my-6 sm:my-8 lg:my-10 flex flex-col gap-4 sm:gap-6 lg:gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
                  {title}
                </h1>
                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-full sm:max-w-2xl">
                  {subtitle}
                </p>
              </div>
            </div>
            <section className="w-full">

              {step === 1 && (
                <CloudProvider
                  data={cloudProviderData}
                  onDataChange={setCloudProviderData}
                  onNext={handleNext}
                  onBack={() => setStep(0)} 
                  canProceed={isStep1Valid()}
                  
                />
              )}

              {step === 2 && (
                <Cdn
                  data={cdnData}
                  onSkip={handleSkip} 
                  onDataChange={setCdnData}
                  onBack={() => setStep(1)}
                  onNext={handleNext}
                  canProceed={isStep2Valid()}
                />
              )}

              {step === 3 && (
                <OnPrem
                  data={onPremData}
                  onDataChange={setOnPremData}
                  onBack={() => setStep(2)} 
                  onNext={handleNext}
                  canProceed={isStep3Valid()} 
                />
              )}

              {step === 4 && (
                <WorkforceEmissions
                  data={workforceEmissionsData}
                  onDataChange={setWorkforceEmissionsData}
                  onBack={() => setStep(3)} 
                  onNext={handleNext}
                  onSkip={handleSkip}
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
                  onSkip={handleSkip} 
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
