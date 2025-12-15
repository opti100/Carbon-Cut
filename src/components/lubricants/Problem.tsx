"use client";
import React, { useEffect, useRef, useState } from "react";
import { BlurFade } from "../ui/blur-fade";

export default function StackedCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;

      const cards = Array.from(
        containerRef.current.children
      ) as HTMLDivElement[];

      if (cards.length < 2) return;

      const secondCardTop = cards[1].getBoundingClientRect().top;

      const start = window.innerHeight * 0.7;
      const end = window.innerHeight * 0.3;

      const raw = (start - secondCardTop) / (start - end);
      const clamped = Math.min(Math.max(raw, 0), 1);

      setProgress(clamped);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mt-20">
        <BlurFade delay={0.1} inView className="mb-6 text-right">
          <p className="text-[#d1cebb] text-sm sm:text-base md:text-lg leading-relaxed">
            Your CO₂e data is outdated, averaged, and full of blind spots.
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#d1cebb] leading-[1.15]">
            The Lubricants Industry’s Hidden Problem
          </h2>
        </BlurFade>
      </div>


      {/* Cards */}
<div
  ref={containerRef}
  className="relative min-h-[300vh] bg-[#fcfdf6] px-6"
>
  {/* Card 1 */}
  <div
    className="
      sticky top-24
      rounded-[32px]
      bg-[#d1cebb]
      shadow-lg
      p-12
      m-10 mb-40
    "
    style={{
      //  zIndex: 2
       transform: `scale(${1 - progress * 0.08})`,
      transformOrigin: "top center",
      zIndex: 1,
       }}
  >
    {/* Title */}
    <h2 className="font-serif text-5xl text-[#6c5f31] mb-10">
     Traditional ESG systems rely on:
    </h2>

    <hr className="border-[#3a2626]/40 mb-10" />

    {/* Content */}
    <div className="flex justify-between gap-10">
      <div className="text-6xl font-serif text-[#6c5f31]">
        Problems
      </div>

      <ul className="space-y-3 text-lg text-[#6c5f31] max-w-md">
        <li>Generic emission factors</li>
        <li>Vendor PDFs and manual spreadsheets</li>
        <li>No product-level accuracy</li>
        <li>No real-time traceability</li>
        <li> Annual sustainability reporting</li>
      </ul>
    </div>

  

 
  </div>

  {/* Card 2 */}
  <div
    className="
      sticky top-24
      rounded-[32px]
      bg-[#d1cebb]
      shadow-lg
      p-12
      m-10 mb-40
    "
    style={{ zIndex: 2 }}
  >
    {/* Title */}
    <h2 className="font-serif text-5xl text-[#6c5f31] mb-10">
      This Leads To
    </h2>

    <hr className="border-[#3a2626]/40 mb-10" />

    {/* Content */}
    <div className="flex justify-between gap-10">
      <div className="text-6xl font-serif text-[#6c5f31]">
        Impact
      </div>

      <ul className="space-y-3 text-lg text-[#6c5f31] max-w-md">
        <li>Incorrect emission disclosures</li>
        <li>Higher carbon taxes</li>
        <li>Poor ESG scores</li>
        <li>Lost B2B contracts</li>
        <li>No Scope 1 / 2 / 3 visibility</li>
      </ul>
    </div>

  

 
  </div>
</div>

     
    </div>
  );
}
