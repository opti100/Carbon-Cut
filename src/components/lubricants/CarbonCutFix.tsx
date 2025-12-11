"use client";

import React, { useId } from "react";
import {
  BarChart3,
  Globe,
  Target,
  LayoutDashboard,
  Blocks,
} from "lucide-react";
import { BlurFade } from "../ui/blur-fade";

export default function CarbonCutFix() {
  return (
    <>
      {/* Divider */}
      <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>

      <div className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-[#fcfdf6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Text */}
          <p className="text-[#d1cebb] text-sm sm:text-base md:text-lg font-normal tracking-tight text-right mb-4 leading-relaxed">
            CarbonCut: Accurate Real-Time Lubricant CO₂e Measurement 
            {/* We transform every activity in your lubricant operations into live CO₂e insights, including: */}
          </p>

          {/* Title */}
          <BlurFade delay={0.1} inView className="mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#d1cebb] text-right leading-[1.15]">
              Here's How CarbonCut Fixes This
            </h2>
          </BlurFade>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {grid.map((feature, index) => (
              <BlurFade
                key={feature.title}
                delay={index * 0.15}
                inView
                className="group relative bg-gradient-to-b from-gray-100 to-gray-200 p-6 rounded-3xl overflow-hidden border border-green-100 hover:border-[#b0ea1d] transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10"
              >
                {/* Grid BG Pattern */}
                <Grid size={20} />

                {/* Icon */}
                <div className="relative z-20 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f8fceb] flex items-center justify-center group-hover:bg-[#f8fceb] transition">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 relative z-20 group-hover:text-black transition">
                  {feature.title}
                </h3>

                {/* Metric */}
                {feature.metric && (
                  <div className="relative z-20 mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8fceb] text-black text-xs font-medium">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-[#b0ea1d]" />
                    {feature.metric}
                  </div>
                )}

                {/* Hover Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl bg-gradient-to-r from-green-400/5 to-green-700/5"></div>
              </BlurFade>
            ))}
          </div>

        </div>
      </div>
      
      {/* Bottom Divider */}
      <div className="w-full border-t border-dashed border-text/10 mt-4 sm:mt-6 md:mt-8"></div>
    </>
  );
}

/* ------- GRID ITEMS ------- */

const grid = [
  {
    title: "Base oil extraction",
    metric: "Crude sourcing & refinery energy consumption",
    icon: BarChart3,
  },
  {
    title: "Additives & blends",
    icon: Globe,
    metric: "Chemical inventory & sourcing emissions",
  },
  {
    title: "Manufacturing",
    icon: Target,
    metric: "Blending, bottling, energy mix & utilities",
  },
  {
    title: "Packaging",
    icon: LayoutDashboard,
    metric: "Container materials, recycling %, suppliers",
  },
  {
    title: "Logistics",
    icon: Blocks,
    metric: "Fleet type, fuel, distance, warehousing",
  },
  {
    title: "Distribution",
    icon: Blocks,
    metric: "Port → distributor → retailer emissions",
  },
  {
    title: "End-use emissions",
    icon: Blocks,
    metric: "Lubricant performance vs lifecycle",
  },
];

/* ------- GRID BACKGROUND PATTERN ------- */

export const Grid = ({ pattern, size }: { pattern?: any; size?: any }) => {
  const p =
    pattern ??
    Array.from({ length: 5 }, () => [
      Math.floor(Math.random() * 4) + 7,
      Math.floor(Math.random() * 6) + 1,
    ]);

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

export function GridPattern({ width, height, x, y, squares, ...props }: { width: number; height: number; x: string; y: string; squares?: number[][]; className?: string; [key: string]: any }) {
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

      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />

      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy]) => (
            <rect
              key={`${sx}-${sy}-${Math.random()}`}
              width={width + 1}
              height={height + 1}
              x={sx * width}
              y={sy * height}
              strokeWidth="0"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
