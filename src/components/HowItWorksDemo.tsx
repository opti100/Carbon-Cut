"use client"
import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Calculator, BarChart3, Zap, Award, TrendingDown, Target, CheckCircle, Leaf, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Calculate",
      subtitle: "Get the full picture",
      description: "CarbonCut quantifies emissions across all marketing channels, producing campaign-level CO₂e with channel attribution.",
      metrics: { value: "", label: "Campaign CO₂e - made audit-ready." },
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r border-tertiary/20",
    },
    {
      step: 2,
      title: "Report", 
      subtitle: "Find what matters most",
      description: (
    <>
      CarbonCut produces campaign-level reports that slot directly into compliance frameworks — from{" "}
      <strong>SECR (UK)</strong> to <strong>SEC climate rules (US)</strong> and <strong>CSRD (EU)</strong>. 
      Results are structured for both marketing reviews and sustainability disclosures, giving teams and auditors the same, defensible dataset.
    </>
  ) ,

      metrics: { value: "", label: "Board-ready outputs." },
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 border-tertiary/20",
    },
    {
      step: 3,
      title: "Offset",
      subtitle: "Cut where it counts",
      description: "Residual tonnes can be retired through a curated portfolio of verified projects (nature, energy, waste and more). Every action generates an immutable smart-contract record.",
      metrics: { value: "", label: "Verified credits only." },
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r border-tertiary/20",
    },
    {
      step: 4,
      title: "Certification",
      subtitle: "Show your commitment", 
      description: "Once campaign offsets are complete, CarbonCut issues a certificate of climate accountability. Each certificate is backed by a transparent audit trail — linking the campaign's calculated footprint to the verified credits retired on its behalf. To guarantee integrity, every retirement is also logged on a smart contract, creating an immutable record that shows what was retired, when, and against which campaign. This ensures proof that can be trusted by finance teams, auditors, and external stakeholders.",
      metrics: { value: "98%", label: "Trust you can show." },
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none border-tertiary/20",
    },
  ];

  return (
    <div className="relative z-20 py-10 max-w-7xl mx-auto">
      <div className="px-8">
        <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
          <span>How CarbonCut Works in{" "}
          <span className="text-orange-500">4 Simple Steps</span></span>
        </h2>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-gray-600 text-center font-normal">
          CarbonCut turns campaign emissions into clear CO₂e numbers and verified credit retirements giving marketing teams clarity and auditors the documentation they expect.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-tertiary/30 bg-white/50 backdrop-blur-sm">
          {steps.map((step) => (
            <FeatureCard key={step.title} className={step.className}>
              <FeatureTitle>
                <span>Step {step.step}:</span>
                <span className="text-tertiary"> {step.title}</span>
              </FeatureTitle>
              <FeatureSubtitle>
                <span className="text-orange-500">{step.subtitle}</span>
              </FeatureSubtitle>
              <FeatureDescription>{step.description}</FeatureDescription>
              <FeatureMetrics metrics={step.metrics} />
              <div className="h-full w-full">{step.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden hover:bg-green-50/50 transition-colors duration-300`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl text-left tracking-tight text-black text-xl md:text-2xl md:leading-snug font-bold mb-2">
      {children}
    </p>
  );
};

const FeatureSubtitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-tertiary font-semibold text-sm mb-3">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className={cn(
      "text-sm md:text-base",
      "text-gray-600 font-normal",
      "text-left max-w-full md:text-sm my-2 leading-relaxed"
    )}>
      {children}
    </p>
  );
};

const FeatureMetrics = ({ metrics }: { metrics: { value: string; label: string } }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-tertiary/10 px-3 py-1 rounded-full mb-4">
      <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
      <span className="text-tertiary font-bold text-sm">{metrics.value}</span>
      <span className="text-gray-600 text-xs">{metrics.label}</span>
    </div>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-gradient-to-br from-green-50 to-white shadow-2xl group h-full rounded-lg border border-tertiary/20">
        <div className="flex flex-1 w-full h-full flex-col space-y-4">
          {/* Carbon Calculator Dashboard */}
          <div className="bg-tertiary/10 rounded-lg p-4 border border-tertiary/20">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-tertiary" />
              <span className="font-semibold text-gray-800">Live Carbon Tracking</span>
            </div>
            <div className="space-y-3">
              {[
                { channel: "Digital Ads", emissions: "1.2", width: "w-16" },
                { channel: "Print Collateral", emissions: "0.9", width: "w-12" },
                { channel: "Video Production", emissions: "2.1", width: "w-20" },
                { channel: "Events", emissions: "0.7", width: "w-10" },
              ].map((item, idx) => (
                <motion.div 
                  key={item.channel}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`h-2 ${item.width} bg-orange-500 rounded-full`}></div>
                  <span className="text-sm text-gray-600 flex-1">{item.channel}</span>
                  <span className="text-sm font-bold text-tertiary">{item.emissions} tCO₂e</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total Campaign Footprint</span>
                <span className="font-bold text-lg text-tertiary">4.9 tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonTwo = () => {
  const campaigns = [
    { name: "Summer Launch", reduction: 3.2, color: "bg-orange-500" },
    { name: "Always-On Digital", reduction: 2.5, color: "bg-orange-500" },
    { name: "Product Launch", reduction: 1.8, color: "bg-orange-500" },
  ];

  const maxReduction = Math.max(...campaigns.map(c => c.reduction));

  return (
    <div className="relative flex flex-col items-start p-6 gap-4 h-full overflow-hidden">
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-tertiary" />
          <span className="font-semibold text-gray-800">Campaign Analysis</span>
        </div>
        
        {campaigns.map((campaign, idx) => {
          const barWidth = (campaign.reduction / maxReduction) * 100;

          return (
            <motion.div
              key={campaign.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 border border-tertiary/20 shadow-sm hover:shadow-md transition-all duration-200 hover:border-tertiary/40"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800 text-sm">{campaign.name}</span>
                <span className="text-sm font-bold text-tertiary">-{campaign.reduction}tCO₂e</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${campaign.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full py-8 px-2">
      <div className="w-full mx-auto bg-gradient-to-br from-green-50 via-white to-green-50/30 group h-full rounded-xl border border-green-200 shadow-lg p-6">
        <div className="flex flex-1 w-full  flex-col justify-center space-y-4">
          {/* Header */}
          <div className="text-center pb-4 border-b border-green-200">
            
            <h3 className="text-lg font-bold text-gray-800">Campaign: Brand Awareness (Q3)</h3>
          </div>

          {/* Project Details Card */}
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm space-y-3">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600 font-medium">Offset Project:</span>
                <span className="text-sm font-semibold text-gray-800 text-right leading-relaxed">
                  Kenya Clean Cookstoves<br/>
                  <span className="text-xs text-green-600">Gold Standard, Vintage 2023</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Credits Retired:</span>
                <span className="text-xl font-bold text-green-600">4.9 tCO₂e</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Retirement ID:</span>
                <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-50 px-3 py-1.5 rounded">
                  GS-123-456-789
                </span>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="pt-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <Download className="w-4 h-4" />
                Download Certificate (PDF)
              </button>
            
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-gradient-to-br from-green-50 to-white shadow-2xl group h-full rounded-lg border border-tertiary/20">
        <div className="flex flex-1 w-full h-full flex-col space-y-4">
          {/* Certification Dashboard */}
          <div className="bg-white rounded-lg p-4 border border-tertiary/20">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-tertiary" />
              <span className="font-semibold text-gray-800">Certified Campaign </span>
            </div>
            
            {/* Certificate Content */}
            <div className="space-y-4">
              {/* Certified Campaign */}
              <div className="flex justify-center  items-center pb-3 border-b ">
                
                <span className="text-2xl font-bold text-gray-800">Brand Awareness Q3</span>
              </div>
              
              {/* Total CO₂e Neutralised */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Total CO₂e Neutralised:</span>
                <span className="text-lg font-bold text-green-600">4.9 tCO₂e</span>
              </div>
              
              {/* Issued Date */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Issued:</span>
                <span className="text-sm font-semibold text-gray-800">15 October 2025</span>
              </div>
              
              {/* Certificate ID */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Certificate ID:</span>
                <span className="text-sm font-mono font-bold text-gray-800">CC-BAQ3-2025</span>
              </div>
              
              {/* On-Chain Reference */}
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">On-Chain Reference:</span>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Smart Contract Hash</p>
                  <p className="text-sm font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded">
                    #0x8aF9…D12
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white to-transparent w-full pointer-events-none" />
    </div>
  );
};

