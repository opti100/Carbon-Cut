"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Title animation
      if (titleRef.current) {
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      }

      // Left box animation
      if (leftBoxRef.current) {
        tl.fromTo(leftBoxRef.current,
          { opacity: 0, x: -100, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power3.out" },
          "-=0.4"
        );
      }

      // Right boxes staggered animation
      const rightBoxes = rightBoxesRef.current.filter(Boolean);
      if (rightBoxes.length) {
        tl.fromTo(rightBoxes,
          { opacity: 0, y: 60, rotationX: 10 },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            duration: 0.6, 
            ease: "power3.out",
            stagger: 0.1
          },
          "-=0.6"
        );
      }

      // Add subtle hover animations
      rightBoxes.forEach((box, index) => {
        if (box) {
          box.addEventListener('mouseenter', () => {
            gsap.to(box, { 
              scale: 1.05, 
              duration: 0.3, 
              ease: "power2.out",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            });
          });
          
          box.addEventListener('mouseleave', () => {
            gsap.to(box, { 
              scale: 1, 
              duration: 0.3, 
              ease: "power2.out",
              boxShadow: "0 0 0 rgba(0,0,0,0)"
            });
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const problemItems = [
    "Annual sustainability reporting",
    "Generic emission factors", 
    "Vendor PDFs and manual spreadsheets",
    "No product-level accuracy",
    "No real-time traceability",
  ];

  const consequences = [
    { title: "Incorrect emission disclosures" },
    { title: "Higher carbon taxes" },
    { title: "Poor ESG scores" },
    { title: "Lost B2B contracts" },
    { title: "Zero visibility on scope 1/2/3 breakdown" },
  ];

  return (
    <>
      {/* Top Divider */}
      <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>

      <div ref={containerRef} className="bg-[#fcfdf6] text-[#080c04] w-full">
        <section className="py-4 sm:py-8 md:py-12 lg:py-16 xl:py-20 w-full text-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Title */}
            <div 
              ref={titleRef}
              className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-[#d1cebb] text-center lg:text-end"
            >
              <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-2 sm:mb-3">
                Your CO₂e data is outdated, averaged, and full of blind spots.
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2 sm:mt-3 mb-3 sm:mb-4 leading-[1.1] sm:leading-[1.15]">
                The Lubricants Industry&apos;s Hidden Problem
              </h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14">

              {/* LEFT LARGE BOX */}
              <div 
                ref={leftBoxRef}
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 backdrop-blur-sm"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#6c5f31] mb-2">
                  Traditional ESG systems rely on:
                </h3>

                {problemItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base md:text-lg leading-relaxed"
                  >
                 
                    <span className="text-[#080c04]">{item}</span>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE SMALL BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {consequences.map((box, idx) => (
                  <div
                    key={idx}
                    ref={(el) => { rightBoxesRef.current[idx] = el; }}
                    className="border border-[#d1cebb] rounded-2xl sm:rounded-3xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 transition-all duration-300  flex items-center backdrop-blur-sm cursor-pointer"
                  >
                    <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#6c5f31] leading-snug">
                      {box.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
      
      {/* Bottom Divider */}
      <div className="w-full border-t border-dashed border-text/10 mt-4 sm:mt-6 md:mt-8"></div>
    </>
  );
}