"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BlurFade } from "../ui/blur-fade";
import Link from "next/link";

export function InternetAdsWebApp() {
  return (
    <>
      <div className="mt-20 font-mono max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView className="mb-6 text-right">

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
            Choose Your Emission Category
          </h2>
          <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg leading-relaxed">
            Understanding your digital footprint starts here. Select what matters most to your business:
          </p>
        </BlurFade>
      </div>

      <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-[#fcfdf6] dark:bg-black max-w-7xl  mx-auto px-8">

        <Card
          title="Internet Ads"
          description="Track the carbon cost of every impression, click, and campaign across your advertising ecosystem."
          href="/internet/internet-ads"
          icon={
            <Image
              src="/auth-hero.jpg"
              alt="Internet Ads Background"
              fill
              className="object-cover"
            />
          }
        />

        <Card
          title="Web & Apps"
          description="Measure the emissions from your websites, applications, and digital services your customers use daily."
          href="/internet/web-&-apps"
          icon={
            <Image
              src="/abstract-gray.jpg"
              alt="Web & Apps"
              fill
              className="object-cover"
            />
          }
        />

      </div>
    </>
  );
}

const Card = ({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="relative block h-[25rem] max-w-sm w-full mx-auto 
                 border border-black/[0.2] dark:border-white/[0.2]
                 rounded-2xl overflow-hidden group"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-10">
        {icon}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hover text */}
      <div className="absolute inset-0 flex items-end p-6 z-20">
        <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-white/70">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};






