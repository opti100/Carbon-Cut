"use client";
import React, { useEffect, useRef, useState } from "react";
import { BlurFade } from "../ui/blur-fade";

const services = [
  {
    title: "Streaming",
    description: "Real-time API ingestion",
    image: "/abstract-gray.jpg",
  },
  {
    title: "Inventorying",
    description: "Multi-stream OEM emissions tracking",
    image: "/auth-hero.jpg",
  },
  {
    title: "Attribution",
    description: "Automated LCI (Life Cycle Inventory) mapping",
    image: "/article-2/article6.jpg",
  },
  {
    title: "Harmonization",
    description: "Tiered supplier emission data modelling",
    image: "/lava-fire.jpg",
  },
  {
    title: "Forensics",
    description: "Dynamic emission factors from global datasets",
    image: "/article-2/article4.jpg",
  },
  {
    title: "Transparency",
    description: "AI-based anomaly detection",
    image: "/article-2/article1.jpg",
  },
  {
    title: "Assurance",
    description: "Internal & external audit-ready logs",
    image: "/green-moss.jpg",
  },

];

export default function ScrollingCardsUI() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-[#fcfdf6] text-[#080c04] py-20 px-6">
      <div ref={containerRef} className="relative pb-[60vh]" style={{ height: "400vh" }}>
        <div className="mx-auto max-w-7xl px-4">

           <BlurFade delay={0.1} inView className="mb-2 md:mb-4 lg:mb-6 text-right">
                    <p className="text-[#d1cebb] text-sm sm:text-base md:text-lg font-normal tracking-tight text-right mb-4 leading-relaxed">
                      Real-Time, Traceable & Assured Carbon Data Infrastructure
                    </p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#d1cebb] text-right leading-[1.15]">
                      The CarbonCut Engine
                      </h2>
                    </BlurFade>
          {/* Heading */}
     

          <div className="hidden md:flex gap-8 lg:gap-12">
            {/* LEFT — TEXT ONLY (NO VIDEO) */}
            <div className="w-full lg:w-1/2 sticky top-8 h-[600px] flex items-center">
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

            {/* RIGHT — SCROLLING CARDS */}
            <div className="w-full lg:w-1/2 relative">
              <div
                className="flex flex-col gap-6 lg:gap-8 pt-[600px]"
                style={{
                  transform: `translateY(${cardsTranslateY}px)`,
                  transition: "transform 0.1s linear",
                }}
              >
                {services.map((service, index) => (
                  <div key={index} className="w-full max-w-7xl ml-auto">
                    <div className="group relative overflow-hidden min-h-[330px] rounded-xl bg-white p-10 shadow-sm hover:shadow-md transition-all">
                      {/* Hover Image */}
                      <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-none" />
                      </div>

                      {/* Text */}
                      <div className="relative z-10">
                        <div className="text-3xl font-medium text-[#ffffff] group-hover:text-white transition-colors">
                          {service.title}
                        </div>
                        <p className="mt-4 text-2xl text-white group-hover:text-gray-100 transition-colors">
                          {service.description}
                        </p>
                      </div>

                   
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile unchanged */}
        </div>
      </div>

      {/* <div className="h-screen" /> */}
    </div>
     </>
  );
}
