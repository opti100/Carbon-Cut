"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function PreFooter() {
  return (
    <section className="relative min-h-screen w-full bg-[#fcfdf6] overflow-hidden">
      
      {/* Decorative Circles */}
      <AnimatedCircles />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-16 pb-20">
        
        <div className="flex flex-row justify-between items-center">  
        {/* Text Block */}
        <div className="max-w-4xl">
          <p className="mb-6 text-xs tracking-widest text-black/80 uppercase">
            Get accurate reporting
          </p>

          <h1 className="text-[64px] leading-[1.05] font-normal text-black">
            
          </h1>

           <h1  className=" font-bold font-mono
          text-[#6c5f31]
          leading-[1.15]
          text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          xl:text-5xl" > 
              Get in Contact with <br />
            Our Team
           </h1>

          <p className="mt-8 max-w-xl font-mono text-xs tracking-wider text-black/80">
            Every request consumes energy. We help you measure the emissions behind it.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-end">
          <Link href="/demo" className="desktop-cta-link">
            <button
              type="button"
              className="card-nav-cta-button"
              style={{ backgroundColor: "#b0ea1d", color: "#080c04" }}
            >
              Contact CarbonCut
            </button>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}




export function AnimatedCircles() {
  return (
    <div className="absolute left-16 top-20">
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        animate={{
          rotate: 360,
          y: [0, -8, 0],
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