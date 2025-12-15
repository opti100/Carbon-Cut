"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description?: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContentRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set up scroll trigger for each content item
      content.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `.content-section-${index}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveCard(index),
          onEnterBack: () => setActiveCard(index),
        });
      });

      // Animate titles and descriptions
      titleRefs.current.forEach((title, index) => {
        if (title) {
          gsap.fromTo(title, 
            { opacity: 0.3, y: 50 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: `.content-section-${index}`,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              }
            }
          );
        }
      });

      descriptionRefs.current.forEach((desc, index) => {
        if (desc) {
          gsap.fromTo(desc, 
            { opacity: 0.3, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: `.content-section-${index}`,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              }
            }
          );
        }
      });

      // Animate sticky content
      if (stickyContentRef.current) {
        gsap.fromTo(stickyContentRef.current,
          { opacity: 0, scale: 0.95 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, [content]);

  const backgroundColors = [
    "#fcfdf6", // Light beige background
    "#fcfdf6", // Lighter green background  
    "#fcfdf6", // Light beige background
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #fcfdf6, #fcfdf6)", // CarbonCut dark theme
    "linear-gradient(to bottom right, #fcfdf6, #fcfdf6)", // CarbonCut green theme
    "linear-gradient(to bottom right, #fcfdf6, #fcfdf6)", // CarbonCut neutral theme
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <div
      ref={containerRef}
      className="min-h-[50rem] py-20 px-4 md:px-8 lg:px-16 flex justify-center relative bg-[#fcfdf6]"
    >
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2 relative">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className={`content-section-${index} py-20 first:pt-0`}
            >
              <h2
                ref={(el) => {titleRefs.current[index] = el}}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#080c04] leading-tight mb-8"
              >
                {item.title}
              </h2>
              <p
                ref={(el) => {descriptionRefs.current[index] = el}}
                className="text-xl md:text-2xl text-[#6c5f31] max-w-2xl leading-relaxed"
              >
                {item.description}
              </p>
            </div>
          ))}
          <div className="h-32" />
        </div>
        
        <div className="lg:w-1/2 lg:sticky lg:top-20 lg:self-start">
          <div
            ref={stickyContentRef}
            className={cn(
              "h-[28rem] md:h-[32rem] w-full rounded-2xl bg-white shadow-2xl overflow-hidden",
              contentClassName,
            )}
            style={{ background: backgroundGradient }}
          >
            {content[activeCard].content ?? null}
          </div>
        </div>
      </div>
    </div>
  );
};

