"use client"

import React from "react";
import { useId } from "react";
import { Calculator, LayoutDashboard, BarChart3, Leaf, Award, Target, Globe, FileCheck, Zap, Shield, TrendingDown, Users, Blocks } from "lucide-react";
import { BlurFade } from "../ui/blur-fade";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CarbonCutFix() {
  // const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['me'],
  //   queryFn: async () => {
  //     const response = await axios.get(`${BASE_URL}/auth/me/`, {
  //       withCredentials: true,
  //     })
  //     return response.data;
  //   }
  // })
  // console.log(data);
  return (
    <div className="pb-20  bg-[#fcfdf6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <BlurFade delay={0.1} inView className=" mb-16">
          <h2 className="text-3xl lg:text-6xl lg:leading-tight max-w-7xl mx-auto  tracking-tight font-bold  text-[#d1cebb] text-end mb-6">
          Here's How CarbonCut  Fixes this
          </h2>
          {/* {JSON.stringify(data)} */}
          <span>
            <span className="text-[#d1cebb] mb-6  max-w-7xl mx-auto text-end">
             CarbonCut: Accurate Real-Time,Lubricant  CO₂e Measurement <br />
               We transform every activity in your lubricant operations into live CO₂e insights, including:
            </span>
          </span>

        
        </BlurFade>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4">
          {grid.map((feature, index) => (
            <BlurFade
              key={feature.title}
              delay={index * 0.2}
              inView
              className="group relative bg-gradient-to-b from-gray-100 to-gray-200 p-6 rounded-3xl overflow-hidden border border-green-100 hover:border-[#b0ea1d] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <Grid size={20} />

              <div className="relative z-20 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${index === 2 || index === 7 // Automated Carbon Calculations & Optimization Recommendations
                  ? 'bg-[#f8fceb] group-hover:bg-[#f8fceb]'
                  : 'bg-[#f8fceb] group-hover:bg-[#f8fceb]'
                  }`}>
                  <feature.icon className={`w-6 h-6 ${index === 2 || index === 7
                    ? 'text-black'
                    : 'text-black'
                    }`} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 relative z-20 mb-3 group-hover:text-black transition-colors">
                {feature.title}
              </h3>
             
              {feature.metric && (
                <div className={`relative z-20 mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${index === 2 || index === 7
                  ? 'bg-[#f8fceb] text-black'
                  : 'bg-[#f8fceb] text-black'
                  }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${index === 2 || index === 7
                    ? 'bg-[#b0ea1d]'
                    : 'bg-[#6c5f31]'
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


//  { title: 'Base oil extraction', desc: 'crude sourcing, refinery energy consumption' },
//               { title: 'Additives & blends', desc: 'chemical inventory & sourcing emissions' },
//               { title: 'Manufacturing', desc: 'blending, bottling, energy mix, utilities' },
//               { title: 'Packaging', desc: 'container materials, recycling %, suppliers' },
//               { title: 'Logistics', desc: 'fleet type, fuel, distance, warehousing' },
//               { title: 'Distribution', desc: 'port → distributor → retailer emissions' },
//               { title: 'End-use emissions', desc: 'lubricant performance vs lifecycle' }

const grid = [
  {
    title: "Base oil extraction",
    metric: "crude sourcing, refinery energy consumption",
    icon: BarChart3,
    
  },
  {
    title: "Additives & blends",
    icon: Globe,
    metric: "Chemical inventory & sourcing emissions"
  },
  {
    title: "Manufacturing",
    icon: Target,
    metric: "Blending, bottling, energy mix, utilities"
  },
  {
    title: "Packaging",
    icon: LayoutDashboard,
    metric: "Container materials, recycling %, suppliers"
  },
  {
    title: "Logistics",
    icon: Blocks,
    metric: "Fleet type, fuel, distance, warehousing"
  },
   {
    title: "Distribution",
    icon: Blocks,
    metric: "port → distributor → retailer emissions"
  },
  {
    title: "End-use emissions",
    icon: Blocks,
    metric: " Lubricant performance vs lifecycle"
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