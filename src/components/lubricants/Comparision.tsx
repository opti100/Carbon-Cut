"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Comparison = () => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    rowRefs.current.forEach((row, index) => {
      if (!row) return;

      gsap.fromTo(
        row,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: index * 0.12,
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  return (
    <div>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <section className="py-10 sm:py-12 lg:py-20 bg-[#fcfdf6] text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-right">
            <h2
              ref={headingRef}
              className="
                text-3xl sm:text-5xl md:text-6xl lg:text-7xl
                font-semibold tracking-tight 
                text-[#d1cebb] mb-10 sm:mb-12
                opacity-0
              "
            >
              Why CarbonCut
            </h2>
          </div>

          {/* Table Block */}
          <div className="w-full overflow-x-auto sm:overflow-x-visible ">
            <table className="w-full min-w-[600px] sm:min-w-0 border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#fcfdf6]">
                  <th className="py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-black sticky left-0 bg-[#fcfdf6] z-10">
                    Feature
                  </th>
                  <th className="py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-black">
                    Traditional Consultants
                  </th>
                  <th className="py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-[#6c5f31]">
                    CarbonCut
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["Reporting", "Annual", "Real-time"],
                  ["Accuracy", "Averaged factors", "Input-level precision"],
                  ["Cost", "High", "Fractional"],
                  ["Visibility", "None", "SKU/product-level"],
                  ["Compliance", "Manual", "Auto-generated"],
                  ["Integrations", "None", "ERP, OEM, IoT, API"],
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    ref={(el) => { rowRefs.current[idx] = el; }}
                    className="border-b border-white/10 last:border-0 opacity-0"
                  >
                    <td className="py-5 text-black text-sm sm:text-base sticky left-0 bg-[#fcfdf6] z-10">
                      {row[0]}
                    </td>
                    <td className="py-5 text-black/50 text-sm sm:text-base whitespace-nowrap">
                      {row[1]}
                    </td>
                    <td className="py-5 text-[#6c5f31] font-medium text-sm sm:text-base whitespace-nowrap">
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Comparison;
