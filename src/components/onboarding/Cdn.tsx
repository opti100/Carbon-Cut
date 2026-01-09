"use client";

import FloatingInput from "../ui/FloatingInput";
import Dropdown from "../ui/dropdown";

export interface Props {
  onBack: () => void;
  onNext: () => void;
}



export default function Cdn({ onBack, onNext }: Props) {
  return (
    <>
      <h1 className="text-4xl font-semibold text-neutral-900">
        CDN
      </h1>

      <div className="flex flex-col gap-6">
        <Dropdown
          placeholder="CDN Provider"
          options={[
            { label: "Cloudflare", value: "cloudflare" },
            { label: "Fastly", value: "fastly" },
            { label: "Akamai", value: "akamai" },
          ]}
          size="medium"
        />

        <FloatingInput
          placeholder="Monthly GB Transferred"
          size="medium"
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
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-md border border-neutral-300 px-4 py-2 text-neutral-700 hover:bg-neutral-100"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
        >
          Continue
        </button>
      </div>
    </>
  );
}
