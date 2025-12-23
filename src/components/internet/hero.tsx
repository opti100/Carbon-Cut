"use client";

import { motion } from "motion/react";
import CardNav from "../CardNav";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { navData } from "../NavData";

export function InternetHero() {
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
        <div className="flex flex-col justify-center max-w-6xl  px-6 md:px-12 lg:px-18">
          
          <div className="text-white text-5xl whitespace-nowrap">

            The easiest way to become a <br /> net-zero Internet Company.
          </div>
          

         
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

      <div className="nav-right-section">
            <Link href="/internet/internet-ads" className="desktop-cta-link">
              <button
                type="button"
                className="card-nav-cta-button"
                style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
              >
                 Internet Ads
              </button>
            </Link>
                    </div>

                     <div className="nav-right-section">
            <Link href="/internet/web-&-apps" className="desktop-cta-link">
              <button
                type="button"
                className="card-nav-cta-button"
                style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
              >
                 Web & Apps
              </button>
            </Link>
                    </div>


          </div>
        </div>

     
      </div>
    </section>
  );
}