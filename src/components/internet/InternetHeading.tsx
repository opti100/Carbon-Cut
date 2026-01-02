"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeading = ({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      {
        opacity: 0.3,
      },
      {
        opacity: 1,
        stagger: 0.1,        // slower word-by-word
        ease: "none",         // required for scrub
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 45%",     // longer scroll distance = slower feel
          scrub: 1.5,         // smooth slow reverse both ways
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <h1 ref={containerRef} className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="word inline-block opacity-20 mr-2"
        >
          {word}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedHeading;
