"use client";
import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { BlurFade } from '../ui/blur-fade';

const comparisonData = {
  title: "Why CarbonCut?",
  features: [
    { name: "Reporting", traditional: "Annual", carboncut: "Real-time" },
    { name: "Accuracy", traditional: "Averaged factors", carboncut: "Input-level precision" },
    { name: "Cost", traditional: "High", carboncut: "Fractional" },
    { name: "Visibility", traditional: "None", carboncut: "SKU/product-level" },
    { name: "Compliance", traditional: "Manual", carboncut: "Auto-generated" },
    { name: "Integrations", traditional: "None", carboncut: "ERP, OEM, IoT, API" },
  ],
};

export default function CarbonCutComparison() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <>

      <div className="w-full border-t border-dashed border-text/10 mt-4 sm:mt-6 md:mt-8"></div>
      <div className="min-h-screen bg-[#fcfdf6] text-[#080c04] font-mono p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between border-b border-[#d1cebb] pb-4">
            <div className="flex items-center gap-8 text-xs">
              <div>COMPARISON = <span className="text-[#080c04]">"FEATURES"</span></div>
              <div>STATUS: <span className="text-[#080c04]">ACTIVE</span></div>
              <div>VERSION: <span className="text-[#080c04]">2.0</span></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="  text-[#d1cebb] mx-auto mb-10 ">
            <div className="text-xs ">01 // Advancement</div>
            <BlurFade delay={0.1} inView>
            <div className="text-5xl md:text-6xl font-bold mb-4 font-sans text-end">{comparisonData.title}</div> </BlurFade>
          </div>

          {/* Comparison Grid */}
          <div className="border border-[#d1cebb] overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-px bg-[#d1cebb]">
              <div className="bg-[#fcfdf6] p-6">
                <div className="text-xs text-[#6c5f31] mb-2">CATEGORY</div>
                <div className="text-sm font-bold text-[#080c04]">Feature</div>
              </div>
              <div className="bg-[#fcfdf6] p-6">
                <div className="text-xs text-[#6c5f31] mb-2">LEGACY_SYSTEMS</div>
                <div className="text-sm font-bold text-[#6c5f31]">Traditional Consultants</div>
              </div>
              <div className="bg-[#fcfdf6] p-6">
                <div className="text-xs text-[#6c5f31] mb-2">MODERN_SOLUTION</div>
                <div className="text-sm font-bold text-[#b0ea1d]">CarbonCut</div>
              </div>
            </div>
            <div className='border border-[#d1cebb] overflow-hidden' />

            {/* Data Rows */}
            <div className="grid grid-cols-3 gap-px bg-[#d1cebb]">
              {comparisonData.features.map((feature, idx) => (
                <React.Fragment key={idx}>
                  {/* Feature Name */}
                  <div
                    className={`bg-[#fcfdf6] p-6 transition-all ${hoveredRow === idx ? 'bg-[#f0f0d8]' : ''}`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-[#d1cebb] flex items-center justify-center text-xs text-[#6c5f31]">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="text-sm font-bold text-[#080c04]">{feature.name}</div>
                    </div>
                  </div>

                  {/* Traditional Value */}
                  <div
                    className={`bg-[#fcfdf6] p-6 transition-all ${hoveredRow === idx ? 'bg-[#f0f0d8]' : ''}`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div className="flex items-center gap-3">
                      <X className="w-4 h-4 text-[#F0db18]" />
                      <div className="text-sm text-[#6c5f31]">{feature.traditional}</div>
                    </div>
                  </div>

                  {/* CarbonCut Value */}
                  <div
                    className={`bg-[#fcfdf6] p-6 transition-all ${hoveredRow === idx ? 'bg-[#f0f0d8]' : ''}`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#b0ea1d]" />
                      <div className="text-sm text-[#6c5f31]">{feature.carboncut}</div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Code Implementation Section */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="border border-[#d1cebb] p-8 bg-[#fcfdf6]">
              <div className="text-xs text-[#6c5f31] mb-4">02 // traditional_approach</div>
              <pre className="text-sm text-[#6c5f31]">
                <code>
                  <span className="text-[#b0ea1d]">class</span> <span className="text-[#080c04]">LegacySystem</span> {"{\n"}
                  {"  "}reporting: <span className="text-[#080c04]">'annual'</span>,{"\n"}
                  {"  "}accuracy: <span className="text-[#080c04]">'averaged'</span>,{"\n"}
                  {"  "}cost: <span className="text-[#080c04]">'high'</span>,{"\n"}
                  {"  "}integrations: <span className="text-[#080c04]">null</span>{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>

            <div className="border border-[#d1cebb] p-8 bg-[#fcfdf6]">
              <div className="text-xs text-[#6c5f31] mb-4">03 // carboncut_approach</div>
              <pre className="text-sm">
                <code>
                  <span className="text-[#b0ea1d]">const</span> <span className="text-[#080c04]">CarbonCut</span> = {"{\n"}
                  {"  "}reporting: <span className="text-[#6c5f31]">'real-time'</span>,{"\n"}
                  {"  "}accuracy: <span className="text-[#6c5f31]">'precision'</span>,{"\n"}
                  {"  "}cost: <span className="text-[#6c5f31]">'fractional'</span>,{"\n"}
                  {"  "}integrations: [<span className="text-[#6c5f31]">'ERP'</span>, <span className="text-[#6c5f31]">'OEM'</span>, <span className="text-[#6c5f31]">'IoT'</span>, <span className="text-[#6c5f31]">'API'</span>,]{"\n"}
                  {"}"};</code>
              </pre>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 border border-[#d1cebb] p-8 bg-[#fcfdf6]">
            <div className="text-xs text-[#6c5f31] mb-6">04 // performance_metrics</div>
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className="text-3xl text-[#080c04] mb-2">10x</div>
                <div className="text-xs text-[#6c5f31]">FASTER REPORTING</div>
              </div>
              <div>
               <div className="text-3xl text-[#b0ea1d] mb-2">&lt;75%</div>
                <div className="text-xs text-[#6c5f31]">ACCURACY</div>
              </div>
              <div>
                <div className="text-3xl text-[#080c04] mb-2">80%</div>
                <div className="text-xs text-[#6c5f31]">COST REDUCTION</div>
              </div>
              <div>
                <div className="text-3xl text-[#b0ea1d] mb-2">24/7</div>
                <div className="text-xs text-[#6c5f31]">MONITORING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
