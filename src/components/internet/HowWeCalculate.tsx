"use client";
import React, { useEffect, useRef, useState } from "react";
import { BlurFade } from "../ui/blur-fade";

const services = [
    {
        title: "80-85% Digital Operations",
        description: "This is where your real footprint lives:",
    },
    {
        title: "15-20% Physical Operations",
        description: "Your traditional footprint still matters:",    
    },
    {
        title: "100% Reporting Accuracy Achievable",
        description: "Unlike traditional methods that estimate and approximate, we track actual data. This doubles your reporting accuracy and gives you credible, audit-ready emission reports that stakeholders, investors, and regulators actually trust.",      
    },
];

export default function HowWeCalculate() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const containerTop = containerRef.current.offsetTop;
            const containerHeight = containerRef.current.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            const scrollStart = containerTop - windowHeight;
            const scrollEnd = containerTop + containerHeight;
            const scrollRange = scrollEnd - scrollStart;

            const progress = Math.max(
                0,
                Math.min(1, (scrollY - scrollStart) / scrollRange)
            );
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const cardsTranslateY = scrollProgress * -2000;

    return (
        <>

            <div className="w-full border-t border-dashed border-text/10 mb-4 sm:mb-6 md:mb-8"></div>
            <div className="min-h-screen bg-[#fcfdf6] text-[#080c04] py-20 px-6">
                <div ref={containerRef} className="relative pb-[60vh]" style={{ height: "250vh" }}>
                    <div className="mx-auto max-w-7xl px-4">

                        <BlurFade delay={0.1} inView className="mb-2 md:mb-4 lg:mb-6 text-right font-mono">
                            <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg font-normal tracking-tight text-right  leading-relaxed">
                                We've built the most comprehensive digital emission tracking methodology that actually reflects reality:
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] text-right leading-[1.15]">
                              How We Calculate Your Emissions
                            </h2>
                        </BlurFade>



                        <div className="hidden md:flex gap-8 lg:gap-12">
                            {/* LEFT — TEXT ONLY (NO VIDEO) */}
                            <div className="w-full lg:w-1/2 sticky top-8 h-[600px] flex items-center">
                                <div>
                                    <h3 className="text-5xl font-medium leading-tight text-[#080c04]">
                                        This isn't just reporting
                                        <br />
                                        <span className="text-[#b0ea1d]">Verified Outcomes.</span>
                                    </h3>
                                    <p className="mt-6 text-2xl text-[#6c5f31] max-w-md">
                                       it's your roadmap to becoming a net-zero company.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT — SCROLLING CARDS */}
                            <div className="w-full lg:w-1/2 relative">
                                <div
                                    className="flex flex-col gap-6 lg:gap-8 pt-[600px]"
                                    style={{
                                        transform: `translateY(${cardsTranslateY}px)`,
                                        transition: "transform 0.1s linear",
                                    }}
                                >
                                    {services.map((service, index) => (
                                        <div key={index} className="w-full max-w-7xl ml-auto">
                                            <div className="group relative overflow-hidden min-h-[330px] rounded-xl bg-white p-10 shadow-sm hover:shadow-md transition-all">
                                                {/* Hover Image */}
                                                <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                                    {/* <img
                                                        src={service.image}
                                                        alt={service.title}
                                                        className="h-full w-full object-cover"
                                                    /> */}
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-none" />
                                                </div>

                                                {/* Text */}
                                                <div className="relative z-10">
                                                    <div className="text-3xl font-medium text-[#ffffff] group-hover:text-white transition-colors">
                                                        {service.title}
                                                    </div>
                                                    <p className="mt-4 text-2xl text-white group-hover:text-gray-100 transition-colors">
                                                        {service.description}
                                                    </p>
                                                </div>


                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
        </>
    );
}
