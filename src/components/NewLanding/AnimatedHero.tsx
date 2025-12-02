"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const words = ["Reduce", "Measure", "Offset"];

const ActionWordCarousel = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLSpanElement>("[data-word]");

      // Initial state - start with first word visible
      gsap.set(spans, { y: 0, opacity: 0 });
      gsap.set(spans[0], { y: 0, opacity: 1 });

      const tl = gsap.timeline({ 
        repeat: -1, 
        defaults: { ease: "power2.inOut" },
        delay: 1 // Initial delay to show first word
      });

      spans.forEach((span, index) => {
        tl.to(span, {
          y: -50,
          opacity: 0,
          duration: 0.6,
        }, index === 0 ? 2 : "+=2") // First word stays longer
          .set(span, { y: 50 })
          .to(spans[(index + 1) % spans.length], {
            y: 0,
            opacity: 1,
            duration: 0.6,
          }, "-=0.3");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-10 md:h-14 lg:h-16 overflow-hidden items-center justify-center min-w-[120px] md:min-w-[180px] lg:min-w-[200px]"
    >
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-emerald-300 rounded-lg"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default ActionWordCarousel;
