"use client";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

import React, { useEffect, useRef, useState } from "react";
import { BlurFade } from "../ui/blur-fade";
import UniversalHeading from "../UniversalHeading";
import AnimatedHeading from "../internet/InternetHeading";


const content = [
  {
    description:
      "The world’s first platform for real-time emission Tracking & Reduction",
    title: (
      <AnimatedHeading
        text="First of Its Kind"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Purpose-built to address the biggest blind spot in carbon - Time",
    title: (
      <AnimatedHeading
        text="Impact Ready"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Reports aligned with SECR, SEC, CSRD disclosure frameworks",
    title: (
      <AnimatedHeading
        text="Audit-Ready"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Every tonne tied to a certificate trail + smart-contract record",
    title: (
      <AnimatedHeading
        text="Verified Path"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Campaign-level or operational footprints calculated in minutes — not months.",
    title: (
      <AnimatedHeading
        text="Minutes, Not Months"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Internet, Energy  and Sustainability expertise behind the platform",
    title: (
      <AnimatedHeading
        text="10+ Years"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Created by disruptors, for disruption with speed and accuracy",
    title: (
      <AnimatedHeading
        text="Built for Speed"
        className="text-3xl font-semibold"
      />
    ),
  },
  {
    description:
      "Designed for transparency, compliance and climate integrity",
    title: (
      <AnimatedHeading
        text="Trusted"
        className="text-3xl font-semibold"
      />
    ),
  },
];



export function ImpactSection() {
  return (
    <>
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <UniversalHeading title="Our Impact & Expertise at a Glance" description={<><span>A trusted platform to measure, report, and offset carbon emissions with reliable data,clear insights, and globally verified projects that drive real climate impact.</span></>} align="right" />
    
    <div className="w-full bg-[#fcfdf6]">
      <StickyScroll content={content} />
    </div>
    </div>
   
    </>
  );
}

