"use client";
import React, { useEffect, useRef, useState } from "react";
import UniversalHeading from "../UniversalHeading";

const services = [
  {
    title: "Streaming",
    description: "Real-time API ingestion",
    image: "/lubricants/TechnicalEngine/Streaming.png",
  },
  {
    title: "Inventorying",
    description: "Multi-stream OEM emissions tracking",
    image: "/lubricants/TechnicalEngine/Inventorying.png",
  },
  {
    title: "Attribution",
    description: "Automated LCI (Life Cycle Inventory) mapping",
    image: "/lubricants/TechnicalEngine/Attribution.png",
  },
  {
    title: "Harmonization",
    description: "Tiered supplier emission data modelling",
    image: "/lubricants/TechnicalEngine/Harmonization.png",
  },
  {
    title: "Forensics",
    description: "Dynamic emission factors from global datasets",
    image: "/lubricants/TechnicalEngine/Forensics.png",
  },
  {
    title: "Transparency",
    description: "AI-based anomaly detection",
    image: "/lubricants/TechnicalEngine/Transparency.png",
  },
  {
    title: "Assurance",
    description: "Internal & external audit-ready logs",
    image: "/lubricants/TechnicalEngine/Assurance.png",
  },
];

export default function TechnicalEngine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // DESKTOP SCROLL ANIMATION
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const scrollStart = containerTop - windowHeight;
      const scrollEnd = containerTop + containerHeight;
      const scrollRange = scrollEnd - scrollStart;

      const progress = Math.max(
        0,
        Math.min(1, (scrollY - scrollStart) / scrollRange)
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardsTranslateY = scrollProgress * -2000;

  return (
    <>
      <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>

      <div className="min-h-screen bg-[#fcfdf6] text-[#080c04] py-10 px-6">

        <UniversalHeading
          title="Technical Engine"
          align="right"
          description="Real-Time, Traceable & Assured Carbon Data Infrastructure"
        />

        {/* ===================== DESKTOP / TABLET ===================== */}
        <div
          ref={containerRef}
          className="relative pb-[60vh] hidden md:block"
          style={{ height: "400vh" }}
        >
          <div className="mx-auto max-w-7xl px-4 flex gap-10">

            {/* LEFT TEXT BLOCK */}
            <div className="w-1/2 sticky top-8 h-[600px] flex items-center">
              <div>
                <h3 className="text-5xl font-medium leading-tight text-[#080c04]">
                  Continuous Tracking.
                  <br />
                  <span className="text-[#b0ea1d]">Verified Outcomes.</span>
                </h3>

                <p className="mt-6 text-2xl text-[#6c5f31] max-w-md">
                  Enterprise-Scale Emissions Data, Normalized and Verified
                </p>
              </div>
            </div>

            {/* RIGHT — SCROLL CARDS WITH IMAGES */}
            <div className="w-1/2 relative">
              <div
                className="flex flex-col gap-8 pt-[600px]"
                style={{
                  transform: `translateY(${cardsTranslateY}px)`,
                  transition: "transform 0.1s linear",
                }}
              >
                {services.map((service, index) => (
                  <div key={index}>
                    <div className="group relative overflow-hidden min-h-[330px] rounded-xl bg-white p-10 shadow-sm hover:shadow-md transition-all">

                      {/* IMAGE (DESKTOP ONLY) */}
                      <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                      </div>

                      {/* TEXT */}
                      <div className="relative z-10">
                        <div className="text-3xl font-medium text-white">
                          {service.title}
                        </div>
                        <p className="mt-4 text-xl text-gray-200">
                          {service.description}
                        </p>
                      </div>
                    </div>
                   
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
           <div className="h-screen" />

        {/* ===================== MOBILE VERSION ===================== */}
        <div className="md:hidden mt-10 space-y-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="rounded-2xl  p-5 shadow-sm"
            >
              <p className="text-sm text-[#6c5f31]">Step {i + 1}</p>

              <h3 className="text-xl font-semibold text-[#080c04] mt-1">
                {service.title}
              </h3>

              <p className="text-gray-700 mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
