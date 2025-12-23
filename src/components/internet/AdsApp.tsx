"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BlurFade } from "../ui/blur-fade";
import Link from "next/link";
import { PinContainer } from "../ui/3d-pin";
import UniversalHeading from "../UniversalHeading";

export function InternetAdsWebApp() {
  return (
    <>
      

      <UniversalHeading title="Choose Your Emission Category" description="Understanding your digital footprint starts here. Select what matters most to your business." align="right" />

      <div className="py-20 flex flex-col lg:flex-row items-center justify-evenly bg-[#fcfdf6] dark:bg-black max-w-7xl  mx-auto px-8">
        <PinContainer
          title="Internet Ads"
          href="/internet/internet-ads"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
           
            <div className="text-base !m-0 !p-0 font-normal">
              <span className="text-slate-500 ">
                Track the carbon cost of every impression, click, and campaign across your advertising ecosystem.
              </span>
            </div>
            <div className="relative flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
              <Image
                src="/abstract-gray.jpg"
                alt="Internet Ads"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </PinContainer>


          <PinContainer
          title="Web & Apps"
          href="/internet/web-&-apps"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
           
            <div className="text-base !m-0 !p-0 font-normal">
              <span className="text-slate-500 ">
                Measure the emissions from your websites, applications, and digital services your customers use daily.
              </span>
            </div>
            <div className="relative flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
              <Image
                src="/auth-hero.jpg"
                alt="Web & Apps"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </PinContainer>

      </div>

       <div className="w-full border-t border-dashed border-text/10 mb-8"></div>
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






