"use client"

import React from "react";
import { useId } from "react";
import { Calculator, BarChart3, Leaf, Award, Target, Globe, FileCheck, Zap, Shield, TrendingDown, Users, Blocks } from "lucide-react";
import { BlurFade } from "./ui/blur-fade";

export default function WhatCarbonCutProvides() {
  return (
    <div className="py-20  bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <BlurFade delay={0.1} inView className="text-center mb-16">
          <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto text-center tracking-tight font-bold text-gray-800 mb-6">
            Powerful Features for{" "}
            <span className="text-tertiary">Carbon Reduction</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to{" "}
            <span className="text-orange-500 font-semibold">measure, analyze</span>, and{" "}
            <span className="text-orange-500 font-semibold">reduce</span> your marketing
            emissions with precision and confidence.
          </p>
        </BlurFade>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-4">
          {grid.map((feature, index) => (
            <BlurFade
              key={feature.title}
              delay={index * 0.2}
              inView
              className="group relative bg-gradient-to-b from-gray-100 to-gray-200 p-6 rounded-3xl overflow-hidden border border-green-100 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <Grid size={20} />

              <div className="relative z-20 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${index === 2 || index === 7 // Automated Carbon Calculations & Optimization Recommendations
                  ? 'bg-orange-500/10 group-hover:bg-orange-500/20'
                  : 'bg-tertiary/10 group-hover:bg-tertiary/20'
                  }`}>
                  <feature.icon className={`w-6 h-6 ${index === 2 || index === 7
                    ? 'text-orange-500'
                    : 'text-tertiary'
                    }`} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 relative z-20 mb-3 group-hover:text-black transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm font-normal relative z-20 leading-relaxed group-hover:text-gray-700 transition-colors">
                {feature.description}
              </p>
              {feature.metric && (
                <div className={`relative z-20 mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${index === 2 || index === 7
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'bg-tertiary/10 text-tertiary'
                  }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${index === 2 || index === 7
                    ? 'bg-orange-500'
                    : 'bg-tertiary'
                    }`}></div>
                  {feature.metric}
                </div>
              )}

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl ${index === 2 || index === 7
                ? 'bg-gradient-to-r from-orange-500/5 to-orange-400/5'
                : 'bg-gradient-to-r from-tertiary/5 to-green-500/5'
                }`}></div>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
}
const grid = [
  {
    title: "Real-Time Carbon Tracking",
    description: "Monitor your marketing emissions across all channels in real-time with our advanced tracking algorithms and automated data collection.",
    icon: BarChart3,
    metric: "99.9% Accuracy"
  },
  {
    title: "Campaign Emission Analytics",
    description: "Get detailed breakdowns of carbon footprint by campaign, channel, and creative assets to identify your biggest impact areas.",
    icon: Target,
    metric: "47% Avg Reduction"
  },
  {
    title: "Blockchain Carbon Credits",
    description: "Tokenize and trade verified carbon credits on our secure blockchain platform with full transparency and immutable records.",
    icon: Blocks,
    metric: "Web3 Enabled"
  },
  {
    title: "Verified Offset Projects",
    description: "Choose from a curated selection of verified carbon offset projects to balance your footprint and support climate action worldwide.",
    icon: Leaf,
    metric: "500+ Projects"
  },
  {
    title: "Compliance Certification",
    description: "Generate industry-standard reports and certifications including SECR, CSRD, and SEC compliance for stakeholder transparency.",
    icon: Award,
    metric: "ISO 14064 Compliant"
  },
  {
    title: "Multi-Channel Integration",
    description: "Seamlessly integrate with major advertising platforms, CMS systems, and marketing tools for comprehensive emission tracking.",
    icon: Globe,
    metric: "50+ Integrations"
  },
];


export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-gray-100/30 to-gray-300/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay stroke-tertiary/10 fill-tertiary/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={Math.random()}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}