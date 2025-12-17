"use client";

import React from "react";
import Navbar from "../NewLanding/Navbar";
import FormSection from "./form";
import { PixelatedCanvas } from "../ui/pixelated-canvas";
import { BlurFade } from "../ui/blur-fade";

export default function HeroSectionOne() {
  return (
    <div className="min-h-screen bg-[#fcfdf6] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full max-w-7xl mx-auto px-6">

          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center h-full font-mono">
            <BlurFade delay={0.1} inView className="mt-20">
            

              <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#6c5f31] leading-tight mb-8">
              Digital carbon emissions
              </h1>

                <p className="text-[#6c5f31] text-sm sm:text-base md:text-base mb-4 leading-relaxed">
                CarbonCut helps your platform measure, reduce, and offset
                emissions in real time — creating a net-zero digital experience.
              </p>
            </BlurFade>

            <div className="max-w-lg">
              <PixelatedCanvas
                src="/CarbonCut-fe/CC.svg"
                width={500}
                height={600}
                cellSize={3}
                dotScale={0.9}
                shape="square"
                backgroundColor="#fcfdf6"
                dropoutStrength={0.4}
                interactive
                distortionStrength={3}
                distortionRadius={80}
                distortionMode="swirl"
                followSpeed={0.2}
                jitterStrength={4}
                jitterSpeed={4}
                sampleAverage
                tintColor="#FFFFFF"
                tintStrength={0.2}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex items-center justify-center h-full mt-5">
            <div className="w-full ">
              <FormSection />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
