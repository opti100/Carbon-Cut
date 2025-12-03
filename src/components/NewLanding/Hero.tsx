"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from './AnimatedHeroText';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Hero = () => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const dropdown1Ref = useRef<HTMLDivElement>(null);
    const dropdown2Ref = useRef<HTMLDivElement>(null);

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
            <div className="absolute inset-0 -z-10">
                <video
                    src="/CarbonCut-fe/LandingPage.mp4"
                    autoPlay
                    loop
                    muted
                    className="object-cover w-full h-full"
                />
            </div>

            <div
                className="flex flex-col items-center justify-center h-full px-6 max-w-5xl mx-auto"
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
                                {[
                                    "Measure",
                                    "Reduce",
                                    "Offset",
                                ].map((item, i) => (
                                    <p
                                        key={i}
                                        className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition"
                                    >
                                        {item}
                                    </p>
                                ))}
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
                                className="absolute left-0 mt-2 w-full max-h-48 overflow-y-auto rounded-lg shadow-lg border z-20  border-[#080c04]"
                                style={{ backgroundColor: "#fcfdf6", borderColor: "#d1cebb" }}
                            >
                                <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition">
                                    Internet
                                </p>
                                <p className="py-2 px-3 cursor-pointer rounded hover:bg-[#b0ea1d] hover:text-white transition">
                                    Oil & Natural Gas
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* ---------- FOOTER SECTION ---------- */}
                <div className="absolute bottom-12 left-0 right-0 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">★</span>
                            <span className="text-white font-semibold">Trustpilot</span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-green-500">★</span>
                                ))}
                            </div>
                            <span className="text-white/80 text-sm">4.8 (2,004 reviews)</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-white/60 text-sm">Backed by industry leaders</span>
                            <div className="flex items-center gap-6 opacity-70">
                                <span className="text-white text-sm font-semibold">MERCURY</span>
                                <span className="text-white text-sm font-semibold">ANTHROPIC</span>
                                <span className="text-white text-sm font-semibold">yahoo!</span>
                            </div>
                        </div>

                        <div className="text-xs text-white">
                            <div className="font-bold">#1</div>
                            <div className="text-white/60">Most Innovative</div>
                            <div className="text-white/60">Companies</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
