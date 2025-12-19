"use client";

import { motion } from "motion/react";
import CardNav from "../CardNav";
import { navData } from "@/app/page";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export function HeroInternet() {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/auth-hero.jpg"
          alt="Abstract Green"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center  px-6 md:px-16 lg:px-24">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-3xl font-normal leading-tight text-white md:text-4xl lg:text-5xl"
          >
            How can we assist you today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-xl text-base text-white"
          >
            Learn more about our core areas of expertise by selecting your topic
            of interest.
          </motion.p>

          {/* Dropdown CTAs */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/internet/internet-ads" className="flex w-full items-center justify-between rounded-full border border-white bg-transparent px-6 py-3 text-sm text-white sm:w-[220px]">
              Internet Ads
              <ArrowUpRight size={18} />
            </Link>

            <Link href="/internet/" className="flex w-full items-center justify-between rounded-full border border-white bg-transparent px-6 py-3 text-sm text-white sm:w-[220px]">
              Web & Apps
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE (empty, image is behind) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
