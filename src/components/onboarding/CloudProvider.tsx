"use client";

import FloatingInput from "../ui/FloatingInput";
import Dropdown from "../ui/dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  onNext: () => void;
}

export default function CloudProvider({ onNext }: Props) {
  return (
    <>
  
      <h1 className="text-4xl font-semibold text-neutral-900">
        Cloud Provider
      </h1>

      <Tabs defaultValue="Manual">
        <TabsList>
          <TabsTrigger value="Manual">Manual</TabsTrigger>
          <TabsTrigger value="Upload">Upload</TabsTrigger>
        </TabsList>

        <div className="min-h-[280px] mt-6">
          <TabsContent value="Manual">
            <div className="flex flex-col gap-6">
              <Dropdown
                placeholder="Monthly cost"
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Annual", value: "annual" },
                ]}
                size="medium"
              />

              <FloatingInput
                placeholder="Actual cost (USD)"
                size="medium"
              />

              <FloatingInput
                placeholder="Monthly Hours Usage"
                size="medium"
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
              />
            </div>
          </TabsContent>

          <TabsContent value="Upload">
            <div className="flex flex-col gap-3">
              <label className="font-medium text-neutral-700">
                Upload file
              </label>

              <div className="flex items-center justify-between rounded-md border border-[#d1cebb] bg-[#fcfdf6] px-4 py-2">
                <span className="text-neutral-500">Choose file</span>

                <label className="cursor-pointer rounded-md bg-[#b0ea1d] px-3 py-1.5 text-black">
                  Browse
                  <input type="file" accept=".csv" className="hidden" />
                </label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <button
        onClick={onNext}
        className="mt-4 rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
      >
        Next
      </button>
    
    </>
  );
}
