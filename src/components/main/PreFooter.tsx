"use client";
import React, { useEffect, useRef, useState } from "react";

const DOT_COLORS = ["#ff3b30", "#34c759", "#ffcc00", "#af52de", "#0fb9b1"];

const PreFooter = () => {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  let lastScroll = 0;

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Hide dots below lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Real-time scroll animation
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScroll ? "down" : "up";
      lastScroll = scrollY;

      dotsRef.current.forEach((dot) => {
        if (!dot) return;

        // Get current X translation from dataset
        const currentX = parseFloat(dot.dataset.x || "0");

        // Move in small steps for real-time animation
        const newX = direction === "down" ? currentX - 8 : currentX + 8;

        // Store new X value
        dot.dataset.x = newX.toString();

        // Animate
        dot.animate(
          [
            { transform: `translateX(${currentX}px)` },
            { transform: `translateX(${newX}px)` }
          ],
          {
            duration: 100,
            easing: "linear",
            fill: "forwards"
          }
        );
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const totalDots = 8;
  const curveHeight = 300;

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#fcfdf6]">

      {/* ================= UPWARD ARC DOTS (Desktop Only) ================= */}
      {!isMobile && (
        <div className="absolute top-[12%] w-full left-0 pointer-events-none">
          {Array.from({ length: totalDots }).map((_, i) => {
            const t = i / (totalDots - 1);
            const xPercent = t * 100;
            const y = curveHeight * Math.pow(2 * t - 1, 2);

            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) dotsRef.current[i] = el;
                }}
                data-x="0"
                style={{
                  position: "absolute",
                  left: `${xPercent}%`,
                  top: `${y}px`,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: DOT_COLORS[i % DOT_COLORS.length],
                  transform: "translateX(-50%)",
                  opacity: 0.9
                }}
              />
            );
          })}
        </div>
      )}

      {/* ================= CENTER CONTENT ================= */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center px-4 sm:px-6 md:px-8 py-12 md:py-16">

        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-black leading-tight tracking-tight">
          Get in contact with <br />
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
            lg:px-10 lg:py-6 lg:text-2xl
            rounded-md 
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
