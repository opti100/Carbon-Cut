"use client";

import React from "react";
import { Compare } from "../ui/compare";

export default function Problem() {
  return (
    <div className="bg-[#fcfdf6] text-[#080c04] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="text-center mb-14">
          <p className="text-[#d1cebb] text-lg mb-2">
            Your CO₂e data is outdated, averaged, and full of blind spots.
          </p>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-[#080c04]">
            The Lubricants Industry’s Hidden Problem
          </h2>
        </div>

        {/* COMPARE SLIDER */}
        <div className="flex justify-center">
          <Compare
            slideMode="drag"
            showHandlebar={true}
            autoplay={false}
            className="w-full max-w-4xl h-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
