"use client";

import FloatingInput from "../ui/FloatingInput";
import Dropdown from "../ui/dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CloudProviderData } from "@/types/onboarding";
import clsx from "clsx";

interface Props {
  data: CloudProviderData;
  onDataChange: (data: CloudProviderData) => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function CloudProvider({ data, onDataChange, onNext, canProceed }: Props) {
  const handleTabChange = (value: string) => {
    onDataChange({
      ...data,
      tabType: value as "Manual" | "Upload",
      uploadedFile: value === "Manual" ? null : data.uploadedFile,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onDataChange({
      ...data,
      uploadedFile: file,
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8">
        Cloud Provider
      </h1>

      <Tabs value={data.tabType} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="Manual">Manual</TabsTrigger>
          <TabsTrigger value="Upload">Upload</TabsTrigger>
        </TabsList>

        <div className="min-h-[280px] mt-6">
          <TabsContent value="Manual">
            <div className="flex flex-col gap-4 sm:gap-6">
              <Dropdown
                placeholder="Monthly cost"
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Annual", value: "annual" },
                ]}
                size="medium"
                value={data.monthlyCost}
                onChange={(value) => onDataChange({ ...data, monthlyCost: value })}
              />

              <FloatingInput
              type="number"
                placeholder="Actual cost (USD)"
                size="medium"
                value={data.actualCost}
                onChange={(value) => onDataChange({ ...data, actualCost: value })}
              />

              <FloatingInput
              type="number"
                placeholder="Monthly Hours Usage"
                size="medium"
                value={data.monthlyHoursUsage}
                onChange={(value) => onDataChange({ ...data, monthlyHoursUsage: value })}
              />

              <Dropdown
                placeholder="Region"
                options={[
                  { label: "AWS US EAST (N. Virginia)", value: "east" },
                  { label: "AWS US WEST (California)", value: "west" },
                  { label: "AWS EU WEST (Ireland)", value: "eu" },
                  { label: "AWS APAC (Singapore)", value: "apac" },
                ]}
                size="medium"
                value={data.region}
                onChange={(value) => onDataChange({ ...data, region: value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="Upload">
            <div className="flex flex-col gap-3">
              <label className="font-medium text-neutral-700">
                Upload file
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-md border border-[#d1cebb] bg-[#fcfdf6] px-4 py-3">
                <span className={clsx("text-sm sm:text-base truncate", data.uploadedFile ? "text-black" : "text-neutral-500")}>
                  {data.uploadedFile ? data.uploadedFile.name : "Choose file"}
                </span>

                <label className="cursor-pointer rounded-md bg-[#b0ea1d] px-4 py-2 text-sm sm:text-base font-medium text-black whitespace-nowrap">
                  Browse
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* ACTIONS */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
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
