import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../NewLanding/Navbar";
import Link from "next/link";

export default function HeroSectionOne() {
  return (
    <div className="min-h-screen bg-[#fcfdf6] p-6">
      {/* Navbar */}
      <Navbar />

      {/* Main Grid */}
      <div className="mt-40 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto">
        {/* Left Hero Card */}
        <div className="lg:col-span-2 bg-[#d1cebb] rounded-3xl p-10 relative overflow-hidden flex items-end">
          {/* Background Image */}
          <img
            src="/LandingGroup.svg"
            alt="Net zero illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          {/* Content */}
          <h1 className="relative z-10 text-4xl md:text-5xl font-bold leading-tight max-w-xl">
            Net-zero digital experience
          </h1>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Card 1 */}
          <div className="bg-[#6c5f31] text-white rounded-3xl p-6 h-48 relative overflow-hidden flex items-end">
            <img
              src="/LandingGroup.svg"
              alt="Measure reduce offset"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            <div className="relative z-10 text-xl font-semibold">
              Measure. Reduce. Offset. <br /> In Real Time.
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-black text-white rounded-3xl p-6 h-40 relative overflow-hidden flex flex-col justify-between">
            <img
              src="/LandingGroup.svg"
              alt="Carbon intelligence"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            <div className="relative z-10 text-lg font-medium">
              Real-Time Carbon Intelligence for the Internet
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs">
           <Link href="/" className="flex items-center ">Learn more  <ArrowRight className="ml-2" size={14} /> </Link> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
