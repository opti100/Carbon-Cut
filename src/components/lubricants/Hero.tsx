"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeroText from '../NewLanding/AnimatedHeroText';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { LinkPreview } from '../ui/link-preview';
import Link from 'next/link';
import CardNav from '../CardNav';
import { navData } from '../NavData';


function LandingPageVideo({ onLoad }: { onLoad: () => void }) {
    return (
        <div className="w-full h-full overflow-hidden ">
            <video
                src="/Lubricants.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={onLoad}
                onCanPlay={onLoad}
                className="w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-black/50"></div>
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
        <>
       
        <section className="relative h-screen w-full" data-scroll-section>
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
            {/* Loading Screen */}
            {!isVideoLoaded && (
                <div className="w-full h-full overflow-hidden   ">
                    <Image
                        src="/CarbonCut-fe/Lubricant.png"
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
                className={`flex flex-col items-start justify-center h-full px-6 max-w-7xl mx-auto transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'
                    }`}
                data-scroll
                data-scroll-speed="0.5"
            >
                
                <h1 className="text-5xl font-bold font-mono text-white  mb-12 leading-tight">Lubricants CO₂e Intelligence,<br />  accurately in Real Time</h1>
               
            </div>

            
        </section>
        
        {/* Bottom Divider */}
        <div className="w-full border-t border-dashed border-text/10 mt-4 sm:mt-6 md:mt-8"></div>
         </>
    );
};

export default Hero;
