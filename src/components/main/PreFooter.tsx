"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function PreFooter() {
  return (
    <>
      <div className="w-full border-t border-dashed border-text/10 my-8"></div>
      <section className="relative w-full h-screen bg-[#fcfdf6] overflow-hidden">

        {/* Decorative Circles — visible only on large screens */}
        <div className="hidden lg:block">
          <AnimatedCircles />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 pb-16 pt-28 sm:pt-40 lg:pt-60">

          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-4 items-start lg:items-center">

            {/* Text Block */}
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] sm:text-xs tracking-widest text-black/80 uppercase">
                Get accurate reporting
              </p>

              <h2 className="font-bold text-[#6c5f31] leading-[1.1] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Get in Contact with <br className="hidden sm:block" />
                Our Team
              </h2>

              <p className="mt-6 max-w-xl font-mono text-[10px] sm:text-xs tracking-wider text-black/80">
                Every request consumes energy. We help you measure the emissions behind it.
              </p>
            </div>

            {/* CTA */}
            <div className="w-full lg:w-auto flex lg:justify-end">
              <Link href="/early-adopters">
                <button
                  type="button"
                  className="card-nav-cta-button px-5 py-3 rounded-xl text-sm sm:text-base"
                  style={{ backgroundColor: "#b0ea1d", color: "#080c04" }}
                >
                  Contact CarbonCut
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export function AnimatedCircles() {
  return (
    <div className="absolute left-4 top-6 sm:left-10 sm:top-10 md:left-16 md:top-20 opacity-80">
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 120 120"
        fill="none"
        animate={{
          rotate: 360,
          y: [0, -12, 0],
        }}
        transition={{
          rotate: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <circle cx="60" cy="60" r="36" stroke="#111" />
        <circle cx="64" cy="56" r="36" stroke="#111" />
        <circle cx="56" cy="64" r="36" stroke="#111" />
      </motion.svg>
    </div>
  );
}

