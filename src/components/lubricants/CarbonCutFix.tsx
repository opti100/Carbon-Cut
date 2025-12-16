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
import Carousel from "../ui/carousel";

export default function CarbonCutFix() {
  return (
    <>
      {/* Divider */}
      <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>

      <div className="py-4 sm:py-6 md:py-4 lg:py-4 xl:py-4 bg-[#fcfdf6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
          <BlurFade delay={0.1} inView className="mb-2 md:mb-4 lg:mb-6 text-right font-mono">
          <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg font-normal tracking-tight text-right leading-relaxed">
            CarbonCut: Accurate Real-Time Lubricant CO₂e Measurement
          </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] text-right leading-[1.15]">
              Here's How CarbonCut Fixes This
            </h2>
          </BlurFade>

          {/* Responsive Grid */}
        <Carousel slides={grid.map((item) => ({
            title: item.title,
            button: item.button,
            src: item.src,
          }))} />
         


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
    button: "Crude sourcing & refinery energy consumption",
    src: "/lubricants/Base-oil-extraction.png",
 
  },
  {
    title: "Additives & blends",
       src: "/lubricants/Additives&Blends.png",
    button: "Chemical inventory & sourcing emissions",
  },
  {
    title: "Manufacturing",
    src: "/lubricants/Manufacturing.png",
    button: "Blending, bottling, energy mix & utilities",
  },
  {
    title: "Packaging",
    src: "/lubricants/Packaging.png",
    button: "Container materials, recycling %, suppliers",
  },
  {
    title: "Logistics",
    src: "/lubricants/Logistics.png",
    button: "Fleet type, fuel, distance, warehousing",
  },
  {
    title: "Distribution",
    src: "/lubricants/Distributors.png",
    button: "Port → distributor → retailer emissions",
  },
  {
    title: "End-use emissions",
    src: "/lubricants/End-Use-Emissions.png",
    button: "Lubricant performance vs lifecycle",
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

export function GridPattern({ width, height, x, y, squares, ...props }: { width: number; height: number; x: string; y: string; squares?: number[][]; className?: string;[key: string]: any }) {
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
