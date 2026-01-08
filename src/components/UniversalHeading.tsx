"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const UniversalHeading = ({
  title,
  description,
  align = "right",
  className
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      { opacity: 0.1 },
      {
        opacity: 1,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: 1.2,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const alignmentClass =
    align === "left"
      ? "text-left"
      : align === "center"
      ? "text-center"
      : "text-right";

  return (
    <div className="mt-4 sm:mt-6 md:mt-8  mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 md:mb-8">
      {/* DESCRIPTION */}
      {description && (
        <p
          className={`text-[#6c5f31] ${alignmentClass}
            text-xs sm:text-sm md:text-base 
            leading-relaxed opacity-80 mb-2 sm:mb-3`}
        >
          {description}
        </p>
      )}

      {/* TITLE */}
      <h1
        ref={containerRef}
        className={`
          ${alignmentClass}
          font-bold font-mono text-[#6c5f31]
          text-xl
          sm:text-3xl
          md:text-4xl
          lg:text-4xl
        `}
      >
        {typeof title === "string"
          ? title.split(" ").map((word, i, arr) => (
              <span
                key={i}
                className="word inline-block opacity-20 tracking-tight sm:tracking-normal"
              >
                {word}
                {i < arr.length - 1 ? "\u00A0" : ""}
              </span>
            ))
          : title}
      </h1>
    </div>
  );
};

export default UniversalHeading;
