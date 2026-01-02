"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from './AnimatedHeroText';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';

function LandingPageVideo({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="w-full h-full overflow-hidden ">
      <video
        src="/LandingPage.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={onLoad}
        onCanPlay={onLoad}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

const Hero = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const dropdown1Ref = useRef<HTMLDivElement>(null);
  const dropdown2Ref = useRef<HTMLDivElement>(null);

  const handleVideoLoad = () => setIsVideoLoaded(true);

  useEffect(() => {
    if (isVideoLoaded) {
      const t = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(t);
    }
  }, [isVideoLoaded]);

  const toggleDropdown = (id: number) =>
    setOpenDropdown(openDropdown === id ? null : id);

  const toggleSubMenu = (name: string) =>
    setOpenSubMenu(openSubMenu === name ? null : name);

  // close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        dropdown1Ref.current &&
        !dropdown1Ref.current.contains(t) &&
        dropdown2Ref.current &&
        !dropdown2Ref.current.contains(t)
      ) {
        setOpenDropdown(null);
        setOpenSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="relative h-screen w-full" data-scroll-section>
      {!isVideoLoaded && (
        <div className="w-full h-full overflow-hidden rounded-xl">
          <Image
            src="/CarbonCut-fe/hero3.jpg"
            alt="Carbon Cut Logo"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="absolute inset-0 -z-10">
        <LandingPageVideo onLoad={handleVideoLoad} />
      </div>

      <div
        className={`flex items-center h-full transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              <AnimatedHeroText />
            </h1>

            <p className="text-base md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              Track, decarbon, and report your carbon footprint with powerful analytics and actionable insights.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">

              {/* ========== BUTTON 1 ========== */}
              <div className="relative w-full sm:w-64" ref={dropdown1Ref}>
                <button
                  onClick={() => toggleDropdown(1)}
                  className="flex items-center justify-between w-full px-6 py-3 rounded-lg font-medium shadow-lg border transition hover:shadow-xl"
                  style={{ backgroundColor: "#b0ea1d", color: "#080c04" }}
                >
                  Capabilities
                  {openDropdown === 1 ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openDropdown === 1 && (
                  <div className="absolute left-0 mt-2 w-full rounded-lg shadow-lg border z-20 bg-white max-h-64 overflow-y-auto">
                    <p className="py-2 px-3 cursor-pointer hover:bg-[#b0ea1d] rounded">
                      Measure
                    </p>
                    <p className="py-2 px-3 cursor-pointer hover:bg-[#b0ea1d] rounded">
                      Reduce
                    </p>
                    <p className="py-2 px-3 cursor-pointer hover:bg-[#b0ea1d] rounded">
                      Offset
                    </p>
                  </div>
                )}
              </div>

              {/* ========== BUTTON 2 ========== */}
              <div className="relative w-full sm:w-64" ref={dropdown2Ref}>
                <button
                  onClick={() => toggleDropdown(2)}
                  className="flex items-center justify-between w-full px-6 py-3 rounded-lg font-medium shadow-lg border transition hover:shadow-xl"
                  style={{ backgroundColor: "#b0ea1d", color: "#080c04" }}
                >
                  Industries
                  {openDropdown === 2 ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openDropdown === 2 && (
                  <div className="absolute left-0 mt-2 w-full rounded-lg shadow-lg border z-20 bg-white">

                    {/* -------- INTERNET -------- */}
                    <div className="block md:hidden">
                      <button
                        onClick={() => toggleSubMenu("internet")}
                        className="w-full flex items-center justify-between py-2 px-3"
                      >
                        Internet
                        {openSubMenu === "internet" ? <ChevronUp /> : <ChevronRight />}
                      </button>

                      {openSubMenu === "internet" && (
                        <div className="pl-4 pb-2">
                          <Link href="/internet/internet-ads">
                            <p className="py-2 px-3 rounded hover:bg-[#b0ea1d]">
                              Internet Ads
                            </p>
                          </Link>
                          <Link href="/internet/web-&-apps">
                            <p className="py-2 px-3 rounded hover:bg-[#b0ea1d]">
                              Web & Apps
                            </p>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* -------- DESKTOP INTERNET HOVER -------- */}
                    <div className="hidden md:block relative group">
                      <div className="flex items-center justify-between py-2 px-3 cursor-pointer">
                        Internet <ChevronRight className="h-4 w-4" />
                      </div>

                      <div className="absolute top-0 left-full ml-2 w-48 rounded-lg shadow-lg border bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <Link href="/internet/internet-ads">
                          <p className="py-2 px-3 hover:bg-[#b0ea1d] rounded">
                            Internet Ads
                          </p>
                        </Link>
                        <Link href="/internet/web-&-apps">
                          <p className="py-2 px-3 hover:bg-[#b0ea1d] rounded">
                            Web & Apps
                          </p>
                        </Link>
                      </div>
                    </div>

                    {/* -------- OIL & GAS -------- */}
                    <div className="block md:hidden">
                      <button
                        onClick={() => toggleSubMenu("oil")}
                        className="w-full flex items-center justify-between py-2 px-3"
                      >
                        Oil & Natural Gas
                        {openSubMenu === "oil" ? <ChevronUp /> : <ChevronRight />}
                      </button>

                      {openSubMenu === "oil" && (
                        <div className="pl-4 pb-2">
                          <Link href="/oil-and-natural-gas/lubricant">
                            <p className="py-2 px-3 rounded hover:bg-[#b0ea1d]">
                              Lubricant
                            </p>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* -------- DESKTOP OIL HOVER -------- */}
                    <div className="hidden md:block relative group">
                      <div className="flex items-center justify-between py-2 px-3 cursor-pointer">
                        Oil & Natural Gas <ChevronRight className="h-4 w-4" />
                      </div>

                      <div className="absolute top-0 left-full ml-2 w-48 rounded-lg shadow-lg border bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <Link href="/oil-and-natural-gas/lubricant">
                          <p className="py-2 px-3 hover:bg-[#b0ea1d] rounded">
                            Lubricant
                          </p>
                        </Link>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
