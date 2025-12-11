"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BusinessImpact = () => {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <section className="py-32 bg-[#fcfdf6] text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-right">
            <h2
              className="
                text-3xl sm:text-5xl md:text-6xl lg:text-7xl
                font-semibold tracking-tight 
                text-[#d1cebb] mb-12
              "
            >
              Business Impact
            </h2>
          </div>

          {/* List */}
          <div className="mt-20 grid md:grid-cols-2 gap-10">
            {[
              "Reduce carbon taxes by up to 17%",
              "Low cost, low effort activity",
              "Double your accuracy and quality of CO₂e reporting",
              "Win ESG-driven tenders",
              "Increase stakeholder confidence",
              "Improve supply chain transparency",
              "Eliminate manual carbon reporting",
              "Track progress toward Net-Zero 2030/2050",
            ].map((item, idx) => (
              <div
                key={idx}
                ref={(el) => { itemsRef.current[idx] = el; }}
                className="flex items-start gap-4 opacity-0"
              >
                <p className="text-xl text-black font-light tracking-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessImpact;
