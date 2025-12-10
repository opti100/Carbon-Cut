"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from '../NewLanding/AnimatedHeroText';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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
                <div className="w-full h-full overflow-hidden rounded-xl  ">
                    <Image
                        src="/CarbonCut-fe/hero3.jpg"
                        alt="Carbon Cut Logo"
                        fill
                        className="object-cover"
                    />
                    {/* <div className="text-white text-xl">Loading...</div> */}
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
                <h1 className="text-5xl font-bold text-white text-center mb-12 leading-tight">Lubricants CO₂e Intelligence, accurately in Real Time</h1>


                <div className="flex flex-col md:flex-row gap-4 text-white text-lg max-w-3xl text-center">
                    Track, measure, and optimise CO₂e emissions across your entire lubricant lifecycle.
                    From base oil sourcing to blending, packaging, logistics, and downstream use.
                    No estimates. No batch data. Just accuracy, automation, and real-time visibility.
                </div>

               
            </div>
        </section>
    );
};

export default Hero;
