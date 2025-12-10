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
    {
      description: "Lubricant manufacturers",
    },
    {
      description: "Industrial oil suppliers",
    },
    {
      description: "Automotive OEM partnerships",
    },
    {
      description: "Fuel & energy distributors",
    },
    {
      description: "B2B clients & tender-facing teams",
    },
    {
      description: "Sustainability & reporting teams",
    },
    {
      description: "Supply chain & procurement",
    },
  ];

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
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      tl.to(splitInstance.chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      });

      // Store split instance for cleanup
      (descriptions[index] as any)._splitText = splitInstance;
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      descriptionsRef.current.forEach((desc) => {
        const inst = (desc as any)?._splitText;
        inst && inst.revert();
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-background py-20">
      {/* TOP BORDER */}
      <div className="w-full border-t border-dashed border-text/10 mb-10"></div>

      <div className="mx-auto max-w-7xl w-full px-6">
        {/* ---------------- HEADER ---------------- */}
        <div className="text-right">
          <h2
            className="
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold tracking-tight 
              text-[#d1cebb] mb-12
            "
          >
            Who Uses
          </h2>
        </div>

        {/* ---------------- DESCRIPTIONS LIST ---------------- */}
        <div className="space-y-14 sm:space-y-16 md:space-y-20">
          {Numbers.map((item, index) => (
            <div
              key={index}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="
                py-10 
                border-b border-dashed border-text/10 
                last:border-b-0
              "
            >
              {/* Description */}
              <div className="overflow-visible">
                <div
                  ref={(el) => { descriptionsRef.current[index] = el; }}
                  className="
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                    font-bold text-text tracking-tight leading-none inline-block
                  "
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoUses;
