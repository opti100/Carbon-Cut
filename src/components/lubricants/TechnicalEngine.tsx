"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { LinkPreview } from "../ui/link-preview";

gsap.registerPlugin(ScrollTrigger);

const TechnicalEngine = () => {
  const headingRef = useRef<HTMLParagraphElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
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

    // Items animation
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(
        item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: index * 0.12,
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const items = [
    { title: "Real-time API ingestion", image: "/abstract-gray.jpg" },
    { title: "Multi-stream OEM emissions tracking", image: "/auth-hero.jpg" },
    { title: "Automated LCI (Life Cycle Inventory) mapping", image: "/article-2/article6.jpg" },
    { title: "Tiered supplier emission data modelling", image: "/lava-fire.jpg" },
    { title: "Dynamic emission factors from global datasets", image: "/article-2/article4.jpg" },
    { title: "AI-based anomaly detection", image: "/article-2/article1.jpg" },
    { title: "Internal & external audit-ready logs", image: "/green-moss.jpg" },
  ];

  return (
    <div>
      <div className="w-full border-t border-dashed border-text/10 mb-8"></div>

      <section className="py-32 bg-[#fcfdf6] text-[#746e45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mb-10">
            <p
              ref={headingRef}
              className="text-xl text-[#080c04]/70 text-right opacity-0"
            >
              The CarbonCut Engine
            </p>
          </div>

          {/* Items */}
          <div className="divide-y divide-black/10">
            {items.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => { itemRefs.current[idx] = el; }}
                className="pb-2 pt-10 opacity-0"
              >
                {/* Wrapper that forces image to appear on right */}
                <div className="relative group flex items-center w-full">

                  {/* Left side text */}
                  <div className="flex-1">
                    <LinkPreview isStatic={true} imageSrc={item.image}>
                      <p className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                        {item.title}
                      </p>
                    </LinkPreview>
                  </div>

                  {/* Invisible anchor telling preview to appear at RIGHT SIDE */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[1px] group-hover:w-[1px]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default TechnicalEngine;
