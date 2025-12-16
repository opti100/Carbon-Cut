"use client";
import React, { useState, useEffect, useRef } from "react";
import { BlurFade } from "../ui/blur-fade";

export default function CarbonCutHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      number: "01",
      title: "Integrate once — get real-time emission data forever.",
      description:
        "OEM, ERP, refinery systems, IoT sensors, and partner APIs.",
      side: "left",
    },
    {
      number: "02",
      title: "CarbonCut Engine automatically calculates",
      description: `CO₂, CH₄,N₂O,CO₂e per product,Scope-wise breakdown,Emission hotspots`,
      side: "right",
    },
    {
      number: "03",
      title: "One-click ESG reports",
      description: "ESRS | CSRD | SEC Climate | UK ETS | CDP | GRI | ISO",
      side: "left",
    },
    {
      number: "04",
      title: "Product-level CO₂e labels",
      description: "Live, accurate numbers for every SKU.",
      side: "right",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const viewHeight = window.innerHeight;

      stepsRef.current.forEach((step, index) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();

        if (rect.top < viewHeight * 0.55 && rect.top > viewHeight * 0.1) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#fcfdf6] text-[#080c04] min-h-screen py-20 px-6 max-w-7xl mx-auto">

      {/* Title */}
     <BlurFade delay={0.1} inView>
      <div className="text-right mb-20 text-[#6c5f31] font-mono">
           <p className="  mx-auto">
          A streamlined process for accurate and automated carbon intelligence.
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How CarbonCut Works</h1>
      </div>
      </BlurFade>

      {/* Timeline Wrapper */}
      <div ref={sectionRef} className="relative max-w-6xl mx-auto">

        {/* Center Vertical Line */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[2px] bg-[#d1cebb] h-full"></div>

        {/* Animated Progress Line */}
        <div
          className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#6c5f31] to-white rounded-full transition-all duration-700"
          style={{ height: `${(activeStep + 1) * 25}%` }}
        ></div>

        {/* Steps */}
        <div className="space-y-40">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepsRef.current[i] = el; }}
              className={`relative transition-all duration-700 ${activeStep >= i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                {/* LEFT SIDE CONTENT */}
                <div className={step.side === "left" ? "md:pr-16 text-right" : "md:col-start-1"}>
                  {step.side === "left" && (
                    <>
                      <span className="text-[#6c5f31] font-semibold text-sm">Step {step.number}</span>
                      <h2 className="text-3xl font-bold mt-2 mb-4 text-[#6c5f31]">{step.title}</h2>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{step.description}</p>
                    </>
                  )}
                </div>

                {/* RIGHT SIDE CONTENT */}
                <div className={step.side === "right" ? "md:pl-16 text-left" : "md:col-start-2"}>
                  {step.side === "right" && (
                    <>
                      <span className="text-[#6c5f31] font-semibold text-sm">Step {step.number}</span>
                      <h2 className="text-3xl font-bold mt-2 mb-4 text-[#6c5f31]">{step.title}</h2>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{step.description}</p>
                    </>
                  )}
                </div>

              </div>

              {/* CENTER DOT (Perfectly Centered) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${activeStep >= i ? "border-[#b0ea1d] bg-[#b0ea1d]" : "border-gray-400 bg-white"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}
