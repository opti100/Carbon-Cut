"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const StickyScroll = ({
  content,
}: {
  content: {
    title: React.ReactNode;
    description?: string;
  }[];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      content.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `.content-section-${index}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveCard(index),
          onEnterBack: () => setActiveCard(index),
        });
      });

      titleRefs.current.forEach((title, index) => {
        if (!title) return;

        gsap.fromTo(
          title,
          { opacity: 0.3, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.content-section-${index}`,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      descriptionRefs.current.forEach((desc, index) => {
        if (!desc) return;

        gsap.fromTo(
          desc,
          { opacity: 0.3, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.content-section-${index}`,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={containerRef}
      className="bg-[#fcfdf6] py-24 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto space-y-28">
        {content.map((item, index) => (
          <div
            key={index}
            className={`content-section-${index} grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`}
          >
            {/* Left: Title */}
            <h2
              ref={(el) => { titleRefs.current[index] = el; }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#080c04] font-mono leading-tight"

            >
              {item.title}
            </h2>

            {/* Right: Description */}
            <p
              ref={(el) => { descriptionRefs.current[index] = el; }}
              className="text-xl md:text-2xl text-[#6c5f31] leading-relaxed font-mono max-w-xl"
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
