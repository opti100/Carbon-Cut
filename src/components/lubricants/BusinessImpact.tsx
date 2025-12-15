"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function BusinessImpact() {
  const items = [
    "Reduce carbon taxes by up to 17%",
    "Low cost, low effort activity",
    "Double your accuracy and quality of CO₂e reporting",
    "Win ESG-driven tenders",
    "Increase stakeholder confidence",
    "Improve supply chain transparency",
    "Eliminate manual carbon reporting",
    "Track progress toward Net-Zero 2030/2050",
  ];

  return (
    <>
      <div className="bg-[#fcfdf6] text-[#080c04] min-h-screen py-10 px-6 max-w-7xl mx-auto">
        <div className="text-right  text-[#d1cebb]">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Business Impact</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 py-10 gap-4 max-w-7xl mx-auto w-full">





          {/* LEFT LARGE CARD */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-[#6c5f31] min-h-[500px] lg:min-h-[320px]"
            className=""
          >
            <div className="max-w-xl space-y-4">
              <h2 className="text-left text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Highlights
              </h2>

              <ul className="mt-4 space-y-2 text-neutral-200">
                {items.slice(0, 4).map((text, idx) => (
                  <li key={idx} className="text-base md:text-lg leading-relaxed">
                    • {text}
                  </li>
                ))}
              </ul>
            </div>
          </WobbleCard>

          {/* SMALL RIGHT CARD */}
          <WobbleCard containerClassName="col-span-1 bg-[#080c04] min-h-[300px]">
            <h2 className="text-left text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4">
              More Advantages
            </h2>

            <ul className="space-y-2 text-neutral-200">
              {items.slice(4, 6).map((text, idx) => (
                <li key={idx} className="text-base md:text-lg leading-relaxed">
                  • {text}
                </li>
              ))}
            </ul>
          </WobbleCard>

          {/* FULL-WIDTH CARD */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-3 bg-[#4a5744] min-h-[400px] lg:min-h-[350px]"
          >
            <div className="max-w-xl space-y-4">
              <h2 className="text-left text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Long-Term Results
              </h2>

              <ul className="space-y-2 text-neutral-200">
                {items.slice(6, 8).map((text, idx) => (
                  <li key={idx} className="text-base md:text-lg leading-relaxed">
                    • {text}
                  </li>
                ))}
              </ul>
            </div>
          </WobbleCard>
        </div>
      </div>
    </>
  );
}
