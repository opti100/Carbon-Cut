import React from "react";
import { BlurFade } from "../ui/blur-fade";

const ImpactSection = () => {
  return (
    <section className="bg-[#fcfdf6] py-32">
      <div className="max-w-7xl mx-auto px-8">

        {/* Top Heading */}
        <div className="font-mono mb-20">
          <BlurFade delay={0.1} inView className="text-right max-w-4xl ml-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-tight">
              How We Calculate Your Emissions
            </h2>
            <p className="mt-4 text-[#6c5f31] text-sm sm:text-base md:text-lg leading-relaxed">
              We've built the most comprehensive digital emission tracking methodology
              that actually reflects reality.
            </p>
          </BlurFade>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

          {/* Column 1 */}
          <div className="flex flex-col">
            <h3 className="text-4xl font-medium text-[#6c5f31] mb-8">
              80–85% Digital Operations
            </h3>

            <div className="h-px bg-[#6c5f31]/40 mb-8" />

            <p className="text-black mb-6">
              This is where your real footprint lives:
            </p>

            <ul className="text-black leading-relaxed space-y-3 list-disc list-inside">
              <li>Website & App Traffic: every visit and transaction</li>
              <li>User Duration: time spent on your platform</li>
              <li>Data Transfer: bandwidth consumption</li>
              <li>Server Infrastructure: hosting & energy source</li>
              <li>Backend Operations: APIs & cloud computing</li>
              <li>Content Delivery Networks</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h3 className="text-4xl font-medium text-[#6c5f31] mb-8">
              15–20% Physical Operations
            </h3>

            <div className="h-px bg-[#6c5f31]/40 mb-8" />

            <p className="text-black mb-6">
              Your traditional footprint still matters:
            </p>

            <ul className="text-black leading-relaxed space-y-3 list-disc list-inside">
              <li>Office electricity consumption</li>
              <li>Workspace infrastructure</li>
              <li>Employee commutes & travel</li>
              <li>Physical hardware & equipment</li>
              <li>Cooling & facilities management</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h3 className="text-4xl font-medium text-[#6c5f31] mb-8">
              100% Reporting Accuracy
            </h3>

            <div className="h-px bg-[#6c5f31]/40 mb-8" />

            <p className="text-black leading-relaxed">
              Unlike traditional methods that rely on estimates, we track real,
              measurable data from your digital operations. This results in
              audit-ready, credible emission reports trusted by regulators,
              investors, and customers.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
