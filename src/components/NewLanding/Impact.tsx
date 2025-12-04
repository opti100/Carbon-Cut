"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ImpactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  const Numbers = [
    {
      number: "1M+",
      description:
        "Tons of CO2e offset through verified carbon credit projects worldwide",
    },
    {
      number: "500K+",
      description:
        "Active users globally committed to reducing their carbon footprint",
    },
    {
      number: "10K+",
      description:
        "Sustainable projects supported across different sectors and regions",
    },
    {
      number: "50+",
      description:
        "Countries reached with our carbon offsetting solutions and services",
    },
    {
      number: "200M+",
      description:
        "Trees planted as part of our reforestation and carbon sequestration initiatives",
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
    <section ref={containerRef} className="relative bg-background pt-20">
      {/* TOP BORDER */}
      <div className="w-full border-t border-dashed border-text/10 mb-10"></div>

      <div className="mx-auto max-w-7xl w-full px-6">
        {/* ---------------- HEADER ---------------- */}
        <div className="text-right">
          <p className="text-secondary/60 text-xs sm:text-sm uppercase tracking-wider">
            By The Numbers
          </p>

          <h2
            className="
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold tracking-tight 
              text-[#d1cebb] mb-12
            "
          >
            Our Impact
          </h2>
        </div>

        {/* ---------------- NUMBERS LIST ---------------- */}
        <div className="space-y-14 sm:space-y-16 md:space-y-20">
          {Numbers.map((item, index) => (
            <div
              key={index}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="
                grid grid-cols-1 md:grid-cols-2 
                gap-8 md:gap-16 
                items-center 
                py-10 
                border-b border-dashed border-text/10 
                last:border-b-0
              "
            >
              {/* Number */}
              <div className="overflow-visible">
                <div
                     ref={(el) => { numbersRef.current[index] = el; }}
                  className="
                    text-6xl sm:text-7xl md:text-8xl lg:text-9xl 
                    font-bold text-text tracking-tight leading-none inline-block
                  "
                >
                  {item.number}
                </div>
              </div>

              {/* Description */}
              <div className="overflow-hidden">
                <p
                  ref={(el) => { descriptionsRef.current[index] = el; }}
                  className="
                    text-base sm:text-lg md:text-xl 
                    text-secondary leading-relaxed
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
