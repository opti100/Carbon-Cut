"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DOT_COLORS = ["#b0ea1d", "#6c5f31", "#F0db18", "#d1cebb", "#f8fceb"];

export default function PreFooter() {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const totalDots = 5;
  const dotSize = 14;

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⭐ PERFECT RESPONSIVE CURVE POSITIONING
  useEffect(() => {
    if (isMobile || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // ⭐ 5 dots → equal spacing 0%, 25%, 50%, 75%, 100%
    const spacing = length / (totalDots - 1);

    for (let i = 0; i < totalDots; i++) {
      const p = path.getPointAtLength(i * spacing);
      const dot = dotsRef.current[i];
      if (dot) {
        dot.style.left = `${p.x}px`; // full width responsive
        dot.style.top = `${p.y}px`;
      }
    }
  }, [isMobile]);

  // Scroll Animation Left/Right
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const dots = dotsRef.current.filter(Boolean);

    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.to(dots, {
            x: self.direction === 1 ? 60 : -60,
            duration: 1,
            ease: "power1.out",
            overwrite: "auto",
          });
        },
      },
    });

    return () => ScrollTrigger.killAll();
  }, [isMobile]);


  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#fcfdf6]"
    >
      {/* ================= RESPONSIVE FULL WIDTH CURVE ================= */}
      {!isMobile && (
        <div className="absolute top-[10%] left-0 w-full h-[300px] pointer-events-none">

          <svg width="100%" height="300">
            {/* ⭐ Responsive curve using viewBox */}
            <path
              ref={pathRef}
              d="M 0 220 C 500 0, 1500 0, 2000 220"
              stroke="transparent"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* 5 Equal Spaced Dots */}
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { if (el) dotsRef.current[i] = el; }}
              style={{
                position: "absolute",
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: DOT_COLORS[i % DOT_COLORS.length],
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      )}

      {/* ================= CENTER CONTENT ================= */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 text-center px-4 py-20">
        <h2
          className="text-6xl md:text-7xl font-semibold tracking-tight text-[#080c04]"

        >
          Get in Contact with <br />
          <span className="text-[#F0db18]">our team</span>
        </h2>

        <a
          href="/demo"
          className="flex items-center justify-between mt-10 text-2xl px-6 py-3 rounded-lg font-medium shadow-sm border transition"
          style={{ backgroundColor: "#b0ea1d", color: "#080c04", borderColor: "#b0ea1d" }}
        >
          Contact CarbonCut
        </a>
      </div>
    </div>
  );
}
