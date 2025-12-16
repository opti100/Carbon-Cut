"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { BlurFade } from "../ui/blur-fade";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  "Base Oil",
  "Additives",
  "Blending",
  "Packaging",
  "Logistics",
  "End-Use",
];

const ContactSection = () => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }

      // Steps staggered animation
      const stepElements = stepsRef.current.filter(Boolean);
      if (stepElements.length) {
        tl.fromTo(
          stepElements,
          { opacity: 0, y: 60, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.15,
          },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Top Divider */}
      <div className="w-full border-t border-dashed border-text/10 py-10"></div>

      <section
        ref={containerRef}
        className="bg-[#fcfdf6] text-black  w-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full h-full ">
          {/* Heading Section */}
             <BlurFade delay={0.1} inView className="mb-6 text-right">
          <div className=" mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-right">
            <h2
              ref={titleRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight text-[#d1cebb]"
            >
              Ready to Calculate Your Lubricants CO₂e?
            </h2>
            <p
              ref={subtitleRef}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#d1cebb] max-w-7xl mx-auto leading-relaxed"
            >
              Get a custom CO₂e model for your lubricant portfolio:
            </p>
          </div>
          </BlurFade>

          {/* Steps Container */}
          <div className="flex-1 flex items-center justify-center py-20">
            {/* Mobile/Tablet: Vertical Layout */}
            <div className="block lg:hidden w-full max-w-md mx-auto">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      stepsRef.current[index] = el;
                    }}
                    className="flex items-center space-x-4 p-4 sm:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#d1cebb] hover:border-[#b0ea1d] transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b0ea1d] flex items-center justify-center text-black font-bold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#080c04] group-hover:text-[#6c5f31] transition-colors duration-300">
                      {step}
                    </p>
                    {/* Vertical connector line */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-6 sm:left-7 top-full w-1 h-4 sm:h-6 bg-[#d1cebb]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal Layout */}
            <div className="hidden lg:block w-full">
              <div className="flex justify-between items-center relative">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      stepsRef.current[index] = el;
                    }}
                    className="flex flex-col items-center flex-1 relative group"
                  >
                    {/* Step Circle */}
                    <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-[#b0ea1d] flex items-center justify-center text-black font-bold text-xl xl:text-2xl mb-4 xl:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      {index + 1}
                    </div>

                    {/* Step Label */}
                    <p className="text-lg xl:text-xl font-semibold text-[#080c04] text-center px-2 group-hover:text-[#6c5f31] transition-colors duration-300">
                      {step}
                    </p>

                    {/* Connector Line */}
                    {index !== steps.length - 1 && (
                      <div className="absolute top-8 xl:top-10 left-1/2 w-full h-1 bg-[#d1cebb] -z-10 group-hover:bg-[#b0ea1d] transition-colors duration-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        
        </div>
      </section>

      {/* Bottom Divider */}
      <div className="w-full border-t border-dashed border-text/10"></div>
    </>
  );
};

export default ContactSection;
