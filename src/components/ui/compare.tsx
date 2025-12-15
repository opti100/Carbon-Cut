"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";

interface CompareProps {
  firstImage?: string | React.ReactNode;
  secondImage?: string | React.ReactNode;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare = ({
  firstImage = <FirstSection />,
  secondImage = <SecondSection />,
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress =
        (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseLeaveHandler() {
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("w-full h-[500px] rounded-2xl overflow-hidden", className)}
      style={{
        position: "relative",
        cursor: slideMode === "drag" ? "grab" : "col-resize",
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={mouseLeaveHandler}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* SLIDER LINE */}
      <motion.div
        className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent via-indigo-500 to-transparent"
        style={{
          left: `${sliderXPercent}%`,
          zIndex: 40,
        }}
        transition={{ duration: 0 }}
      >
        <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent opacity-50" />

        {showHandlebar && (
          <div className="h-6 w-6 rounded-md top-1/2 -translate-y-1/2 bg-white -right-3 absolute flex items-center justify-center shadow">
            <IconDotsVertical className="h-4 w-4 text-black" />
          </div>
        )}
      </motion.div>

      {/* FIRST SECTION */}
      <motion.div
        className={cn(
          "absolute inset-0 z-20 select-none",
          firstImageClassName
        )}
        style={{
          clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
        }}
        transition={{ duration: 0 }}
      >
        {firstImage}
      </motion.div>

      {/* SECOND SECTION */}
      <motion.div
        className={cn(
          "absolute top-0 left-0 z-[19] select-none w-full h-full",
          secondImageClassname
        )}
      >
        {secondImage}
      </motion.div>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);

/* -----------------------------
   CUSTOM CONTENT SECTIONS
-------------------------------- */

function FirstSection() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-10 bg-[#fcfdf6] text-[#080c04]">
      <h3 className="text-4xl font-bold mb-4 text-[#6c5f31]">
        Traditional ESG systems rely on:
      </h3>

      <ul className="space-y-2 leading-relaxed text-3xl">
        <li>• Annual sustainability reporting</li>
        <li>• Generic emission factors</li>
        <li>• Vendor PDFs and manual spreadsheets</li>
        <li>• No product-level accuracy</li>
        <li>• No real-time traceability</li>
      </ul>
    </div>
  );
}

function SecondSection() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-10 bg-[#fcfdf6] text-[#080c04] text-end">
      <h3 className="text-4xl font-bold mb-4 text-[#6c5f31]">This leads to:</h3>

      <ul className="space-y-2  leading-relaxed text-3xl">
        <li>• Incorrect emission disclosures</li>
        <li>• Higher carbon taxes</li>
        <li>• Poor ESG scores</li>
        <li>• Lost B2B contracts</li>
        <li>• Zero visibility on scope 1/2/3 breakdown</li>
      </ul>
    </div>
  );
}
