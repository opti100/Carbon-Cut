"use client";
import React, { useEffect, useRef, useState } from "react";
import { EncryptedText } from "../ui/encrypted-text";
import { FocusCards } from "@/components/ui/focus-cards";

export default function ScrollRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const stickyStart = 0;
      const stickyEnd = rect.height - viewportHeight;

      const scrolledInside =
        Math.min(Math.max(-rect.top, stickyStart), stickyEnd);

      const p = scrolledInside / stickyEnd;
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔐 HARD GUARANTEED ORDER
  const showTraditional = progress < 0.45;
  const showLeadsTo = progress >= 0.45;

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-[#fcfdf6] mb-10"
    >
      {/* Sticky */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative">
          {/* Header */}
          <div className="mb-2 md:mb-2 text-right text-[#d1cebb]">
            <p className="text-lg md:text-xl lg:text-2xl mt-4">
              Your CO₂e data is outdated, averaged, and full of blind spots
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.15] font-bold">
              The Lubricants Industry&apos;s Hidden Problem
            </h1>
          </div>

          {/* Content */}
          <div className="relative min-h-[500px] md:min-h-[600px]">
            {/* Traditional ESG */}
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                showTraditional
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-12 pointer-events-none"
              }`}
            >
              <div className="bg-[#fcfdf6] p-2 md:p-4 lg:p-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#080c04] mb-6 md:mb-8">
                  <EncryptedText text="Traditional ESG systems rely on:" />
                </h2>
                <div className="w-full">
                  <TraditionalCards />
                </div>
              </div>
            </div>

            {/* Leads to */}
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                showLeadsTo
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12 pointer-events-none"
              }`}
            >
              <div className="p-4 md:p-6 lg:p-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#080c04] mb-6 md:mb-8">
                  <EncryptedText text="This leads to:" />
                </h2>
                <div className="w-full">
                  <LeadsToCards />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TraditionalCards() {
  const cards = [
    {
      title: "Annual sustainability reporting",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Generic emission factors",
      src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Vendor PDFs and spreadsheets",
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "No product-level accuracy",
      src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "No real-time traceability",
      src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return <FocusCards cards={cards} />;
}

function LeadsToCards() {
  const cards = [
    {
      title: "Incorrect emission disclosures",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Higher carbon taxes",
      src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Poor ESG scores",
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Lost B2B contracts",
      src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "No Scope 1/2/3 clarity",
      src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return <FocusCards cards={cards} />;
}

