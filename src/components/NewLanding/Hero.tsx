"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from './AnimatedHeroText';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { LinkPreview } from '../ui/link-preview';
import Link from 'next/link';

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
    const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
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
        setOpenNestedDropdown(null); // Close nested dropdown when main dropdown changes
    };

    const toggleNestedDropdown = (key: string) => {
        setOpenNestedDropdown(openNestedDropdown === key ? null : key);
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
                setOpenNestedDropdown(null);
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
            if (event.key === 'Escape') {
                setOpenDropdown(null);
                setOpenNestedDropdown(null);
            }
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
                <div className="w-full h-full overflow-hidden rounded-xl  ">
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
                className={`flex flex-col items-center justify-center h-full px-6 max-w-5xl mx-auto transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'
                    }`}
                data-scroll
                data-scroll-speed="0.5"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white text-center mb-12 leading-tight">
                    <AnimatedHeroText />
                </h1>

                {/* ---------- BUTTON GROUP ---------- */}
                <div className="flex gap-4 items-start">

                    {/* ------------ BUTTON 1 + DROPDOWN CONTAINER ----------- */}
                    <div className="relative w-64" ref={dropdown1Ref}>
                        <button
                            onClick={() => toggleDropdown(1)}
                            className="flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium shadow-sm border transition"
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
                    <div className="relative w-64" ref={dropdown2Ref}>
                        <button
                            onClick={() => toggleDropdown(2)}
                            className="flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium shadow-sm border transition"
                            style={{ backgroundColor: "#b0ea1d", color: "#080c04", borderColor: "#b0ea1d" }}
                        >
                            Industries
                            {openDropdown === 2 ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {openDropdown === 2 && (
                            <div
                                className="absolute left-0 mt-2 w-full max-h-48 rounded-lg shadow-lg border z-20 border-[#080c04]"
                                style={{ backgroundColor: "#fcfdf6" }}
                            >
                                {/* INTERNET WITH NESTED DROPDOWN */}
                                <div className="relative">
                                    <div
                                        className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition flex items-center justify-between"
                                        onClick={() => toggleNestedDropdown('internet')}
                                    >
                                        <span>Internet</span>
                                        {openNestedDropdown === 'internet' ? (
                                            <ChevronLeft className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>

                                    {/* Nested dropdown for Internet */}
                                    {openNestedDropdown === 'internet' && (
                                        <div className="mt-1">
                                            <Link href="/internet/internet-ads">
                                                <LinkPreview isStatic={true} imageSrc="/blogs/blogFive.png">
                                                    <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition pl-8">
                                                        Internet Ads
                                                    </p>
                                                </LinkPreview>
                                            </Link>

                                            <Link href="/internet/website-ads">
                                                <LinkPreview isStatic={true} imageSrc="/blogs/blogFive.png">
                                                    <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition pl-8">
                                                        Website Ads
                                                    </p>
                                                </LinkPreview>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Oil & Natural Gas with nested dropdown */}
                                <div className="relative">
                                    <div
                                        className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition flex items-center justify-between"
                                        onClick={() => toggleNestedDropdown('oil-gas')}
                                    >
                                        <span>Oil & Natural Gas</span>
                                        {openNestedDropdown === 'oil-gas' ? (
                                            <ChevronLeft className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>

                                    {openNestedDropdown === 'oil-gas' && (
                                        <div className="mt-1">
                                            <Link href="/oil-and-natural-gas/lubricant">
                                                <LinkPreview isStatic={true} imageSrc="/blogs/blogFive.png">
                                                    <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition pl-8">
                                                        Lubricants
                                                    </p>
                                                </LinkPreview>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                </div>

                {/* ---------- FOOTER SECTION ---------- */}
                <div className="absolute bottom-12 left-0 right-0 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-6">
                        <div className="text-xs text-white ">
                            <div className="font-bold">#1</div>
                            <div className="text-white/60">The future of CO₂e starts here.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
