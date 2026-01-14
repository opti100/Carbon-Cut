"use client";

import React, { useState } from "react";
import FloatingInput from "../ui/FloatingInput";
import { OnPremData } from "@/types/onboarding";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, Copy, MonitorCog } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Dialog, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
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

  type OS = "linux" | "mac" | "windows";
  const commands: Record<OS, string> = {
    linux:
      'echo "CPU: $(nproc) cores | RAM: $(awk \'/MemTotal/ {printf \\"%.0f\\", $2/1024/1024}\') GB | Storage: $(df -B1 --total | awk \'/total/ {printf \\"%.2f\\", $2/1024/1024/1024/1024}\') TB"',
    mac:
      'echo "CPU: $(sysctl -n hw.logicalcpu) cores | RAM: $(($(sysctl -n hw.memsize)/1024/1024/1024)) GB | Storage: $(df -k / | awk \'NR==2 {printf \\"%.2f\\", $2/1000/1000}\') TB"',
    windows:
      `Write-Output ("CPU: {0} cores | RAM: {1} GB | Storage: {2} TB" -f `
      + `(Get-CimInstance Win32_Processor | Measure-Object NumberOfLogicalProcessors -Sum).Sum, `
      + `[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB), `
      + `[math]::Round((Get-CimInstance Win32_LogicalDisk | Where-Object DriveType -eq 3 | Measure-Object Size -Sum).Sum / 1TB, 2))`,
  };


  const [os, setOs] = useState<OS>("linux");
  const command = commands[os];
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // reset after 2s
  };

  return (
    <div className="w-full space-y-8">

      <CommandHelper />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">CPU Cores</label>
          <Select
            value={data.cpuCores}
            onValueChange={(value) =>
              onDataChange({ ...data, cpuCores: value })
            }
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
            onValueChange={(value) =>
              onDataChange({ ...data, ramGB: value })
            }
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
        <FloatingInput type="number"
          placeholder="Storage (TB)"
          size="big"
          value={data.storageTB}
          onChange={(value) =>
            onDataChange({ ...data, storageTB: value })
          }
        />
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={onBack}
          className="min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 hover:bg-[#d1cebb] transition-colors"
        >
          Back
        </button>

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
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>On-Premise Infrastructure Emissions</AlertTitle>
        <AlertDescription>
          <p>Emissions from self-managed IT and data center operations</p>
          <ul className="list-inside list-disc text-sm">
            <li>Generated by servers, storage, and networking equipment</li>
            <li>Includes cooling, power distribution, and backup systems</li>
            <li>Depends heavily on hardware efficiency and utilization</li>
            <li>Often less efficient than hyperscale cloud data centers</li>
            <li>Requires direct electricity consumption tracking</li>
          </ul>
        </AlertDescription>
      </Alert>


    </div>
  );
};

export default OnPrem;
