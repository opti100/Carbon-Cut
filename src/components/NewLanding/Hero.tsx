"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from './AnimatedHeroText';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LinkPreview } from '../ui/link-preview';

function LandingPageVideo({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="w-full h-full overflow-hidden rounded-xl">
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
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const dropdown1Ref = useRef<HTMLDivElement>(null);
    const dropdown2Ref = useRef<HTMLDivElement>(null);

    // Handle video load
    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    // Show content with animation after video loads
    useEffect(() => {
        if (isVideoLoaded) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 100); // Small delay for smooth transition
            return () => clearTimeout(timer);
        }
    }, [isVideoLoaded]);

    const toggleDropdown = (id: number) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                dropdown1Ref.current &&
                !dropdown1Ref.current.contains(target) &&
                dropdown2Ref.current &&
                !dropdown2Ref.current.contains(target)
            ) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    // Close dropdown with ESC key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenDropdown(null);
        };

        if (openDropdown !== null) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [openDropdown]);

    return (
        <section className="relative h-screen w-full" data-scroll-section>
            {/* Loading Screen */}
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

            {/* Main Content Container - Left Aligned */}
            <div
                className={`flex items-center h-full transition-opacity duration-1000 ${
                    showContent ? 'opacity-100' : 'opacity-0'
                }`}
                data-scroll
                data-scroll-speed="0.5"
            >
                <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl">
                        {/* Hero Text - Left Aligned */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight">
                            <AnimatedHeroText />
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
                            Track, reduce, and offset your carbon footprint with powerful analytics and actionable insights.
                        </p>

                        {/* ---------- BUTTON GROUP ---------- */}
                        <div className="flex flex-wrap gap-4 items-start">

                            {/* ------------ BUTTON 1 + DROPDOWN CONTAINER ----------- */}
                            <div className="relative w-full sm:w-64" ref={dropdown1Ref}>
                                <button
                                    onClick={() => toggleDropdown(1)}
                                    className="flex items-center justify-between w-full px-6 py-3 rounded-lg font-medium shadow-lg border transition hover:shadow-xl hover:scale-105"
                                    style={{ backgroundColor: "#b0ea1d", color: "#080c04", borderColor: "#b0ea1d" }}
                                >
                                    Capabilities
                                    {openDropdown === 1 ? <ChevronUp /> : <ChevronDown />}
                                </button>

                                {openDropdown === 1 && (
                                    <div
                                        className="absolute left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-lg shadow-lg border z-20 border-[#080c04]"
                                        style={{ backgroundColor: "#fcfdf6", borderColor: "#d1cebb" }}
                                    >
                                         <LinkPreview isStatic={true} imageSrc='/CarbonCut-fe/resize/SV2.jpg' > 
                                            <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"> Measure </p> 
                                         </LinkPreview>
                                         <LinkPreview isStatic={true} imageSrc='/blogs/blogFive.png' > 
                                            <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"> Reduce </p> 
                                         </LinkPreview>
                                         <LinkPreview isStatic={true} imageSrc='/blogs/blogFive.png' > 
                                            <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"> Offset </p> 
                                         </LinkPreview>
                                    </div>
                                )}
                            </div>

                            {/* ------------ BUTTON 2 + DROPDOWN CONTAINER ----------- */}
                            <div className="relative w-full sm:w-64" ref={dropdown2Ref}>
                                <button
                                    onClick={() => toggleDropdown(2)}
                                    className="flex items-center justify-between w-full px-6 py-3 rounded-lg font-medium shadow-lg border transition hover:shadow-xl hover:scale-105"
                                    style={{ backgroundColor: "#b0ea1d", color: "#080c04", borderColor: "#b0ea1d" }}
                                >
                                    Industries
                                    {openDropdown === 2 ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {openDropdown === 2 && (
                                    <div
                                        className="absolute left-0 mt-2 w-full max-h-48 overflow-y-auto rounded-lg shadow-lg border z-20 border-[#080c04]"
                                        style={{ backgroundColor: "#fcfdf6", borderColor: "#d1cebb" }}
                                    >
                                       <LinkPreview isStatic={true} imageSrc='/blogs/blogFive.png' > 
                                            <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"> Internet </p> 
                                       </LinkPreview>
                                       <LinkPreview isStatic={true} imageSrc='/blogs/blogFive.png' > 
                                            <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"> Oil & Natural Gas </p> 
                                       </LinkPreview>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-12 left-0 right-0 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-6">
                    <div className="text-xs text-white">
                        <div className="font-bold">#1</div>
                        <div className="text-white/60">The future of CO₂e starts here.</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;