"use client";

import FloatingInput from "../ui/FloatingInput";
import Dropdown from "../ui/dropdown";
import { CdnData } from "@/types/onboarding";
import clsx from "clsx";

export interface Props {
  data: CdnData;
  onDataChange: (data: CdnData) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function Cdn({ data, onDataChange, onBack, onNext, canProceed }: Props) {
  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8">
        CDN
      </h1>

      <div className="flex flex-col gap-4 sm:gap-6">
        <Dropdown
          placeholder="CDN Provider"
          options={[
            { label: "Cloudflare", value: "cloudflare" },
            { label: "Fastly", value: "fastly" },
            { label: "Akamai", value: "akamai" },
          ]}
          size="medium"
          value={data.cdnProvider}
          onChange={(value) => onDataChange({ ...data, cdnProvider: value })}
        />

        <FloatingInput
        type="number"
          placeholder="Monthly GB Transferred"
          size="medium"
          value={data.monthlyGBTransferred}
          onChange={(value) => onDataChange({ ...data, monthlyGBTransferred: value })}
        />

        <Dropdown
          placeholder="Regions"
          options={[
            { label: "Global", value: "global" },
            { label: "North America", value: "na" },
            { label: "Europe", value: "eu" },
            { label: "Asia Pacific", value: "apac" },
          ]}
          size="medium"
          value={data.regions}
          onChange={(value) => onDataChange({ ...data, regions: value })}
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
