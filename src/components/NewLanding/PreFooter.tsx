"use client"
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DOT_COLORS = ["#ff3b30", "#34c759", "#ffcc00", "#af52de", "#0fb9b1"];

const PreFooter = () => {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth dot animation for desktop only using ScrollTrigger
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const dots = dotsRef.current.filter(Boolean) as HTMLDivElement[];
    if (dots.length === 0) return;

    // Set initial state - dots slightly transparent
    gsap.set(dots, {
      opacity: 0.6,
      scale: 0.8,
    });

    // Create animation for each dot with stagger
    dots.forEach((dot, index) => {
      const staggerDelay = index * 0.1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1, // Smooth scrubbing
          toggleActions: "play none none reverse",
        },
      });

      // Animate dot properties smoothly
      tl.to(dot, {
        x: () => (index % 2 === 0 ? -25 : 25), // Alternate directions
        y: () => (index % 3 === 0 ? -20 : 15), // Different Y movements
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: staggerDelay,
      });

      // Add subtle rotation for some dots
      if (index % 4 === 0) {
        tl.to(dot, {
          rotation: 360,
          duration: 2,
          ease: "power2.inOut",
        }, "-=1");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  const totalDots = 8;
  const curveHeight = 350;

  // Create a proper upward curve (parabolic curve)
  const getCurvePosition = (index: number, total: number) => {
    const t = index / (total - 1);
    // Parabolic curve: y = a(x - h)² + k
    // We want an upward opening parabola
    const x = t; // 0 to 1
    const y = 4 * (x - 0.5) ** 2; // Creates upward curve with vertex at center
    
    const xPercent = t * 100;
    const yPosition = curveHeight * y;
    
    return { xPercent, yPosition };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#fcfdf6]"
    >

      {/* ================= UPWARD ARC DOTS (Desktop Only) ================= */}
      {!isMobile && (
        <div className="absolute top-[12%] w-full left-0 pointer-events-none">
          {Array.from({ length: totalDots }).map((_, i) => {
            const { xPercent, yPosition } = getCurvePosition(i, totalDots);

            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) dotsRef.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: `${xPercent}%`,
                  top: `${yPosition}px`,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: DOT_COLORS[i % DOT_COLORS.length],
                  transform: "translateX(-50%)",
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ================= CENTER CONTENT ================= */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center px-4 sm:px-6 md:px-8 py-12 md:py-16">

        <h2 className='text-6xl md:text-7xl font-semibold tracking-tight text-[#080c04] mb-12'>
          Get in Contact with <br />
          <span className="text-[#F0db18]">our team</span>
        </h2>

        <a
          href="/demo"
          className="
            bg-[#b0ea1d] text-[#080c04] 
            mt-8 sm:mt-12 md:mt-16 lg:mt-20
            px-6 py-3 text-base
            sm:px-7 sm:py-4 sm:text-lg
            md:px-8 md:py-5 md:text-xl
            lg:px-6 lg:py-2 lg:text-2xl
            rounded-3xl
            font-semibold
            hover:bg-[#6c5f31] hover:text-[#d1cebb] 
            transition-colors duration-300
            inline-block
          "
        >
          Contact CarbonCut
        </a>
      </div>

      <div className="w-full" style={{ borderTop: "1px solid #d1cebb" }}></div>
    </div>
  );
};

export default PreFooter;