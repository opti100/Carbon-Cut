"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import UniversalHeading from "../UniversalHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);

const WhoUses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const Numbers = [
    { description: "Lubricant manufacturers" },
    { description: "Industrial oil suppliers" },
    { description: "Automotive OEM partnerships" },
    { description: "Fuel & energy distributors" },
    { description: "B2B clients & tender-facing teams" },
    { description: "Sustainability & reporting teams" },
    { description: "Supply chain & procurement" },
  ];

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    const descriptions = descriptionsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!items.length) return;

    items.forEach((item, index) => {
      const descriptionEl = descriptions[index];
      if (!descriptionEl) return;

      // ✅ Split by WORDS + CHARS (preserves spacing)
      const splitInstance = new SplitText(descriptionEl, {
        type: "words,chars",
      });

      gsap.set(splitInstance.chars, {
        opacity: 0,
        y: 40,
        rotation: 6,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(splitInstance.chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.15,
        ease: "power3.out",
        stagger: {
          each: 0.02,
          from: "start",
        },
      });

      // store instance for cleanup
      (descriptions[index] as any)._splitText = splitInstance;
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      descriptionsRef.current.forEach((desc) => {
        const inst = (desc as any)?._splitText;
        inst && inst.revert();
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-background">

      {/* Top Border */}
      <div className="w-full border-t border-dashed border-text/10" />

      <div className="py-10">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <UniversalHeading title="Who Uses this?" description="CarbonCut powers real-time CO₂e" align="right" />

          {/* LIST */}
          <div className="space-y-4">
            {Numbers.map((item, index) => (
              <div
                key={index}
                ref={(el) => {(itemsRef.current[index] = el)}}
                className="py-4 border-b border-dashed border-text/10 last:border-b-0"
              >
                <div
                  ref={(el) => {(descriptionsRef.current[index] = el)}}
                  className="
                    text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
                    font-bold text-text tracking-tight leading-tight
                    whitespace-pre-wrap
                  "
                >
                  {item.description}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Border */}
      <div className="w-full border-t border-dashed border-text/10" />
    </section>
  );
};

export default WhoUses;
