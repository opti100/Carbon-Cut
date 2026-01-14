"use client";

import React from "react";
import {
  AlertCircleIcon,
} from "lucide-react";
import FloatingInput from "../ui/FloatingInput";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CloudProviderData } from "@/types/onboarding";
import clsx from "clsx";

interface Props {
  data: CloudProviderData;
  onDataChange: (data: CloudProviderData) => void;
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canProceed: boolean;
}

export default function CloudProvider({
  data,
  onDataChange,
  onSkip,
  onBack,
  onNext,
  canProceed,
}: Props) {
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

  // Define regions for each cloud provider
  const cloudRegions: Record<string, { value: string; label: string }[]> = {
   aws: [
  // US
  { value: "us-east-1", label: "AWS US East (N. Virginia)" },
  { value: "us-east-2", label: "AWS US East (Ohio)" },
  { value: "us-west-1", label: "AWS US West (N. California)" },
  { value: "us-west-2", label: "AWS US West (Oregon)" },

  // Canada
  { value: "ca-central-1", label: "AWS Canada (Central)" },
  { value: "ca-west-1", label: "AWS Canada West (Calgary)" },

  // South America
  { value: "sa-east-1", label: "AWS South America (São Paulo)" },

  // Europe
  { value: "eu-west-1", label: "AWS Europe (Ireland)" },
  { value: "eu-west-2", label: "AWS Europe (London)" },
  { value: "eu-west-3", label: "AWS Europe (Paris)" },
  { value: "eu-central-1", label: "AWS Europe (Frankfurt)" },
  { value: "eu-central-2", label: "AWS Europe (Zurich)" },
  { value: "eu-north-1", label: "AWS Europe (Stockholm)" },
  { value: "eu-south-1", label: "AWS Europe (Milan)" },
  { value: "eu-south-2", label: "AWS Europe (Spain)" },

  // Middle East
  { value: "me-south-1", label: "AWS Middle East (Bahrain)" },
  { value: "me-central-1", label: "AWS Middle East (UAE)" },

  // Africa
  { value: "af-south-1", label: "AWS Africa (Cape Town)" },

  // Asia Pacific
  { value: "ap-south-1", label: "AWS Asia Pacific (Mumbai)" },
  { value: "ap-south-2", label: "AWS Asia Pacific (Hyderabad)" },
  { value: "ap-southeast-1", label: "AWS Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "AWS Asia Pacific (Sydney)" },
  { value: "ap-southeast-3", label: "AWS Asia Pacific (Jakarta)" },
  { value: "ap-southeast-5", label: "AWS Asia Pacific (Malaysia)" },
  { value: "ap-northeast-1", label: "AWS Asia Pacific (Tokyo)" },
  { value: "ap-northeast-2", label: "AWS Asia Pacific (Seoul)" },
  { value: "ap-northeast-3", label: "AWS Asia Pacific (Osaka)" },
  { value: "ap-east-1", label: "AWS Asia Pacific (Hong Kong)" },

  // China
  { value: "cn-north-1", label: "AWS China (Beijing)" },
  { value: "cn-northwest-1", label: "AWS China (Ningxia)" },

  // GovCloud
  { value: "us-gov-east-1", label: "AWS GovCloud (US-East)" },
  { value: "us-gov-west-1", label: "AWS GovCloud (US-West)" },
],
    azure: [
  // United States
  { value: "centralus", label: "Azure Central US" },
  { value: "eastus", label: "Azure East US" },
  { value: "eastus2", label: "Azure East US 2" },
  { value: "westus", label: "Azure West US" },
  { value: "westus2", label: "Azure West US 2" },
  { value: "westus3", label: "Azure West US 3" },
  { value: "northcentralus", label: "Azure North Central US" },
  { value: "southcentralus", label: "Azure South Central US" },

  // Canada
  { value: "canadacentral", label: "Azure Canada Central" },
  { value: "canadaeast", label: "Azure Canada East" },

  // Europe
  { value: "westeurope", label: "Azure West Europe" },
  { value: "northeurope", label: "Azure North Europe" },
  { value: "uksouth", label: "Azure UK South" },
  { value: "ukwest", label: "Azure UK West" },
  { value: "francecentral", label: "Azure France Central" },
  { value: "germanywestcentral", label: "Azure Germany West Central" },
  { value: "norwayeast", label: "Azure Norway East" },
  { value: "swedencentral", label: "Azure Sweden Central" },
  { value: "switzerlandnorth", label: "Azure Switzerland North" },

  // Asia Pacific
  { value: "southeastasia", label: "Azure Southeast Asia (Singapore)" },
  { value: "eastasia", label: "Azure East Asia (Hong Kong)" },
  { value: "japaneast", label: "Azure Japan East" },
  { value: "japanwest", label: "Azure Japan West" },
  { value: "koreacentral", label: "Azure Korea Central" },
  { value: "australiaeast", label: "Azure Australia East" },
  { value: "australiasoutheast", label: "Azure Australia Southeast" },
  { value: "centralindia", label: "Azure Central India" },
  { value: "southindia", label: "Azure South India" },

  // Middle East & Africa
  { value: "uaenorth", label: "Azure UAE North" },
  { value: "southafricanorth", label: "Azure South Africa North" },

  // South America
  { value: "brazilsouth", label: "Azure Brazil South" },
],
  gcp: [
  // North America
  { value: "us-central1", label: "GCP US Central (Iowa)" },
  { value: "us-east1", label: "GCP US East (South Carolina)" },
  { value: "us-east4", label: "GCP US East (Northern Virginia)" },
  { value: "us-west1", label: "GCP US West (Oregon)" },
  { value: "us-west2", label: "GCP US West (Los Angeles)" },
  { value: "us-west3", label: "GCP US West (Salt Lake City)" },
  { value: "us-west4", label: "GCP US West (Las Vegas)" },
  { value: "northamerica-northeast1", label: "GCP Canada (Montréal)" },
  { value: "northamerica-northeast2", label: "GCP Canada (Toronto)" },

  // South America
  { value: "southamerica-east1", label: "GCP South America (São Paulo)" },

  // Europe
  { value: "europe-west1", label: "GCP Europe West (Belgium)" },
  { value: "europe-west2", label: "GCP Europe West (London)" },
  { value: "europe-west3", label: "GCP Europe West (Frankfurt)" },
  { value: "europe-west4", label: "GCP Europe West (Netherlands)" },
  { value: "europe-west6", label: "GCP Europe West (Zurich)" },
  { value: "europe-west8", label: "GCP Europe West (Milan)" },
  { value: "europe-west9", label: "GCP Europe West (Paris)" },
  { value: "europe-north1", label: "GCP Europe North (Finland)" },
  { value: "europe-central2", label: "GCP Europe Central (Warsaw)" },

  // Asia Pacific
  { value: "asia-east1", label: "GCP Asia East (Taiwan)" },
  { value: "asia-east2", label: "GCP Asia East (Hong Kong)" },
  { value: "asia-northeast1", label: "GCP Asia Northeast (Tokyo)" },
  { value: "asia-northeast2", label: "GCP Asia Northeast (Osaka)" },
  { value: "asia-northeast3", label: "GCP Asia Northeast (Seoul)" },
  { value: "asia-south1", label: "GCP Asia South (Mumbai)" },
  { value: "asia-south2", label: "GCP Asia South (Delhi)" },
  { value: "asia-southeast1", label: "GCP Asia Southeast (Singapore)" },
  { value: "asia-southeast2", label: "GCP Asia Southeast (Jakarta)" },

  // Middle East
  { value: "me-west1", label: "GCP Middle East (Tel Aviv)" },

  // Australia
  { value: "australia-southeast1", label: "GCP Australia Southeast (Sydney)" },
  { value: "australia-southeast2", label: "GCP Australia Southeast (Melbourne)" },
]
  };

  return (
    <div className="w-full space-y-8">
      <Tabs value={data.tabType} onValueChange={handleTabChange}>
        <TabsList className="bg-[#fcfdf6] p-1 rounded-lg">
          <TabsTrigger
            value="Manual"
            className="px-6 py-2 rounded-md data-[state=active]:bg-[#6c5f31] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Manual
          </TabsTrigger>
          <TabsTrigger
            value="Upload"
            className="px-6 py-2 rounded-md data-[state=active]:bg-[#6c5f31] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Upload
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {/* MANUAL TAB */}
          <TabsContent value="Manual" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Cloud */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Cloud</label>
                <Select
                  value={data.cloud || ""}
                  onValueChange={(value) =>
                    onDataChange({
                      ...data,
                      cloud: value,
                      region: "", // Reset region when cloud changes
                    })
                  }
                >
                  <SelectTrigger className="h-14">
                    <SelectValue placeholder="eg) AWS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="azure">Azure</SelectItem>
                    <SelectItem value="gcp">GCP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select region</label>
                <Select
                  value={data.region || ""}
                  onValueChange={(value) =>
                    onDataChange({ ...data, region: value })
                  }
                  disabled={!data.cloud}
                >
                  <SelectTrigger className="h-14">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {(cloudRegions[data.cloud || "aws"] || []).map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actual Cost */}
              <FloatingInput
                type="number"
                placeholder="Actual cost (USD)"
                size="big"
                value={data.actualCost}
                onChange={(value) =>
                  onDataChange({ ...data, actualCost: value })
                }
              />

              {/* Monthly Hours Usage */}
              <FloatingInput
                type="number"
                placeholder="Monthly Hours Usage"
                size="big"
                value={data.monthlyHoursUsage}
                onChange={(value) =>
                  onDataChange({ ...data, monthlyHoursUsage: value })
                }
              />




            </div>

            <div className="mt-8">
              <Alert>
                <AlertCircleIcon />
                <AlertTitle>Cloud Provider Emissions</AlertTitle>
                <AlertDescription>
                  <ul className="list-inside list-disc text-sm">
                    <li>
                      Emissions generated by cloud data centers running workloads
                    </li>
                    <li>
                      Influenced by energy efficiency and renewable energy usage
                    </li>
                    <li>
                      Includes compute, storage, networking, and managed services
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* UPLOAD TAB */}
        <TabsContent value="Upload" className="mt-0">
  {/* Cloud */}
  <div className="space-y-2 my-5">
    <label className="text-sm font-medium">Select Cloud</label>
    <Select
      value={data.cloud || ""}
      onValueChange={(value) =>
        onDataChange({
          ...data,
          cloud: value,
          region: "", // Reset region when cloud changes
        })
      }
    >
      <SelectTrigger className="h-14">
        <SelectValue placeholder="eg) AWS" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aws">AWS</SelectItem>
        <SelectItem value="azure">Azure</SelectItem>
        <SelectItem value="gcp">GCP</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-lg border border-[#d1cebb] px-6 py-4">
      <span
        className={clsx(
          "text-base truncate",
          data.uploadedFile
            ? "text-neutral-900 font-medium"
            : "text-neutral-500"
        )}
      >
        {data.uploadedFile
          ? data.uploadedFile.name
          : "Upload your cloud provider CSV report here"}
      </span>

      <label className="cursor-pointer rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors whitespace-nowrap">
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

  {/* Cloud-specific alert */}
  {data.cloud === "aws" && (
    <Alert className="mt-8">
      <AlertCircleIcon />
      <AlertTitle>Steps to download AWS CCFT Report</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          <li>Sign in to the AWS Management Console</li>
          <li>Go to Billing → Customer Carbon Footprint Tool</li>
          <li>Select monthly or yearly date range</li>
          <li>Review emissions by service and region</li>
          <li>Download the CSV report</li>
        </ul>
      </AlertDescription>
    </Alert>
  )}
  {data.cloud === "azure" && (
    <Alert className="mt-8">
      <AlertCircleIcon />
      <AlertTitle>Steps to download Azure Emissions Report</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          <li>Sign in to the Azure Portal</li>
          <li>Go to Cost Management + Billing → Emissions Impact Dashboard</li>
          <li>Select the desired subscription and time range</li>
          <li>Review emissions by service and region</li>
          <li>Download the CSV report</li>
        </ul>
      </AlertDescription>
    </Alert>
  )}
  {data.cloud === "gcp" && (
    <Alert className="mt-8">
      <AlertCircleIcon />
      <AlertTitle>Steps to download GCP Carbon Footprint Report</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          <li>Sign in to the Google Cloud Console</li>
          <li>Go to Carbon Footprint under Billing</li>
          <li>Select the desired project and time range</li>
          <li>Review emissions by service and region</li>
          <li>Download the CSV report</li>
        </ul>
      </AlertDescription>
    </Alert>
  )}
  {!data.cloud && (
    <Alert className="mt-8">
      <AlertCircleIcon />
      <AlertTitle>Cloud Provider Report</AlertTitle>
      <AlertDescription>
        <span className="text-sm">
          Please select a cloud provider to see instructions for downloading your emissions report.
        </span>
      </AlertDescription>
    </Alert>
  )}
</TabsContent>
        </div>
      </Tabs>

      {/* ACTIONS */}
      <div className="flex items-center justify-end pt-6 border-t border-neutral-200">
       

        <div className="flex items-center gap-4">
         

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
    </div>
  );
}
