"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

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

      const splitInstance = new SplitText(descriptionEl, { type: "chars" });

      gsap.set(splitInstance.chars, {
        opacity: 0,
        y: 100,
        rotation: 10,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      tl.to(splitInstance.chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.2,
        ease: "power3.out",
        stagger: 0.04,
      });

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
      <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>

      <div className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          
          {/* ---------- HEADER ---------- */}
          <div className="text-center lg:text-right mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-[#d1cebb]">
              Who Uses CarbonCut
            </h2>
          </div>

          {/* ---------- LIST ---------- */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            {Numbers.map((item, index) => (
              <div
                key={index}
                ref={(el) => { itemsRef.current[index] = el; }}
                className="py-4 sm:py-6 md:py-8 lg:py-10 border-b border-dashed border-text/10 last:border-b-0"
              >
                <div className="overflow-visible">
                  <div
                    ref={(el) => { descriptionsRef.current[index] = el; }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-text tracking-tight leading-tight inline-block"
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="w-full border-t border-dashed border-text/10 mt-4 sm:mt-6 md:mt-8"></div>
    </section>
  );
};

export default WhoUses;
