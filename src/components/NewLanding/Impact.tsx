"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import UniversalHeading from "../UniversalHeading";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ImpactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLParagraphElement | null)[]>([]);

const Numbers = [
  {
    title: "First of Its Kind",
    description:
      "The world’s first platform for real-time emission Tracking & Reduction",
  },
  {
    title: "Impact Ready",
    description:
      "Purpose-built to address the biggest blind spot in carbon - Time",
  },
  {
    title: "Audit-Ready",
    description:
      "Reports aligned with SECR, SEC, CSRD disclosure frameworks",
  },
  {
    title: "Verified Path",
    description:
      "Every tonne tied to a certificate trail + smart-contract record",
  },
  {
    title: "Minutes, Not Months",
    description:
      "Campaign-level or operational footprints calculated in minutes — not months.",
  },
  {
    title: "10+ Years",
    description:
      "Internet, Energy and Sustainability expertise behind the platform",
  },
  {
    title: "Built for Speed",
    description:
      "Created by disruptors, for disruption with speed and accuracy",
  },
  {
    title: "Trusted",
    description:
      "Designed for transparency, compliance and climate integrity",
  },
];


  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    const numbers = numbersRef.current.filter(Boolean) as HTMLDivElement[];
    const descriptions = descriptionsRef.current.filter(
      Boolean
    ) as HTMLParagraphElement[];

    if (!items.length) return;

    gsap.set(descriptions, { opacity: 0, x: -80 });

    items.forEach((item, index) => {
      const numberEl = numbers[index];
      if (!numberEl) return;

      const splitInstance = new SplitText(numberEl, { type: "chars" });

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

      tl.to(
        descriptions[index],
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Store split instance
      (numbers[index] as any)._splitText = splitInstance;
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      numbersRef.current.forEach((num) => {
        const inst = (num as any)?._splitText;
        inst && inst.revert();
      });
    };
  }, []);

return (
  <section ref={containerRef} className="relative bg-background pt-4">
    {/* TOP BORDER */}
    <div className="w-full border-t border-dashed border-text/10 mb-3"></div>

    <div className="mx-auto max-w-7xl w-full px-3">
      {/* HEADER */}
      <UniversalHeading
        title="Our Impact"
        description="By The Numbers"
        align="right"
      />

      {/* NUMBERS LIST */}
      <div className="space-y-1">
        {Numbers.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="
              grid grid-cols-1 md:grid-cols-2
              gap-2 md:gap-4
              items-center
              border-b border-dashed border-text/10
              last:border-b-0
              py-2
            "
          >
            {/* Title */}
            <div className="overflow-visible">
              <div
                ref={(el) => {
                  numbersRef.current[index] = el;
                }}
                className="
                  text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                  font-bold text-text
                  tracking-tight
                  leading-[0.95]
                "
              >
                {item.title}
              </div>
            </div>

            {/* Description */}
            <div className="overflow-hidden">
              <p
                ref={(el) => {
                  descriptionsRef.current[index] = el;
                }}
                className="
                  text-sm sm:text-base
                  text-secondary
                  leading-tight
                "
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


};

export default ImpactSection;
