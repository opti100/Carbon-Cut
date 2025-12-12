"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LubricantHowWorks = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      title: "Integrate once — get real-time emission data forever.",
      description: `OEM, ERP, refinery systems, IoT sensors, and partner APIs.`,
    },
    {
      title: "CarbonCut Engine automatically calculates",
      description: `CO₂  
CH₄  
N₂O  
CO₂e per product  
Scope-wise breakdown  
Emission hotspots`,
    },
    {
      title: "One-click ESG reports",
      description: `For:  
ESRS • CSRD • SEC Climate • UK ETS • CDP • GRI • ISO`,
    },
    {
      title: "Product-level CO₂e labels",
      description: `Live, accurate numbers for every SKU.`,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.set(itemsRef.current, { opacity: 0, y: 50 });

    gsap.to(itemsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.25,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", // start when container reaches 75% of viewport
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className="py-32 bg-[#fcfdf6] text-black" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <h2
          className="
            text-3xl sm:text-5xl md:text-6xl lg:text-7xl
            font-semibold tracking-tight 
            text-[#d1cebb] mb-12 text-end
          "
        >
          How it works
        </h2>

        {/* Steps */}
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex flex-col gap-2"
            >
              <p className="text-2xl text-black font-semibold tracking-tight">
                {step.title}
              </p>

              <p className="text-lg text-black/80 font-light whitespace-pre-line leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LubricantHowWorks;
