"use client";
import React from "react";
import { BlurFade } from "../ui/blur-fade";

export function BusinessImpact() {
  const cards = [
    {
      id: "01",
      title: "Reduce carbon taxes by up to 17%",
      points: [
        " Identify emission hotspots",
        "Avoid overpayment penalties",
        "Maximize tax incentives"
      ],
    },
    {
      id: "02",
      title: "Low cost, low effort activity",
      points: [
        "  Quick, simple onboarding",
        "Minimal operational disruption",
        "Scales with business"
      ],
    },
    {
      id: "03",
      title: "Double your accuracy and quality of CO₂e reporting",
      points: [
        "Primary activity-based data",
        "Real-time emission calculations",
        "Audit-ready standardized reports"
      ],
    },
    {
      id: "04",
      title: "Win ESG-driven tenders and contracts",
      points: [
        "Meet ESG compliance standards",
        "Strengthen sustainability bids",
        "Stand out competitively"
      ],
    },
    {
      id: "05",
      title: "Increase stakeholder confidence",
      points: [
        "  Transparent sustainability reporting",
        "Build investor trust",
        "Demonstrate climate leadership"
      ],
    },
    {
      id: "06",
      title: "Improve supply chain transparency",
      points: [
        "Track supplier emissions",
        "Identify high-impact vendors",
        "Enable supplier collaboration"
      ],
    },
    {
      id: "07",
      title: "Eliminate manual carbon reporting",
      points: [
        "Automate carbon calculations",
        "Remove spreadsheet dependency",
        "Generate reports instantly"
      ],
    },
    {
      id: "08",
      title: "Track progress toward Net-Zero 2030/2050",
      points: [
        "Monitor reduction milestones",
        "Align with science-based targets",
        "Measure long-term progress"
      ],
    },
  ];

  return (
    <section className="h-screen bg-[#fcfdf6] px-6 flex items-center">
      <div className="max-w-7xl mx-auto w-full">

        {/* Heading */}
        <div className="mb-10">
          <BlurFade delay={0.1} inView className="mb-6 text-right font-mono">

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
              Business Impact
            </h2>
          </BlurFade>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl border border-[#6c5f31] p-8  transition"
            >
              {/* Number */}
              <div className="text-sm font-semibold text-[#b0ea1d] mb-4">
                {card.id}
              </div>

              {/* Title */}
              <h3 className="text-[#6c5f31] text-xl font-semibold mb-4 leading-snug">
                {card.title}
              </h3>

              {/* Content */}
              <ul className="space-y-3 text-sm leading-relaxed text-black">
                {card.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
