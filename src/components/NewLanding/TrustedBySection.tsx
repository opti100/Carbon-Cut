"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

const TrustedBySection = () => {
    const [opacity, setOpacity] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate opacity based on scroll position
            const fadeStart = windowHeight * 0.8; // Start fading in when section is 80% from top
            const fadeEnd = windowHeight * 0.2;   // Fully visible when section is 20% from top

            if (rect.top <= fadeStart && rect.top >= fadeEnd) {
                // Fade in
                const progress = (fadeStart - rect.top) / (fadeStart - fadeEnd);
                setOpacity(Math.min(progress, 1));
            } else if (rect.top < fadeEnd && rect.bottom > windowHeight * 0.3) {
                // Fully visible
                setOpacity(1);
            } else if (rect.bottom <= windowHeight * 0.3) {
                // Fade out
                const progress = rect.bottom / (windowHeight * 0.3);
                setOpacity(Math.max(progress, 0));
            } else {
                // Not visible yet
                setOpacity(0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={sectionRef}
            style={{
                opacity: opacity,
                transition: "opacity 0.3s ease-out"
            }}
        >
            <div>
              

                <h2 className='text-6xl md:text-7xl font-semibold tracking-tight text-center  text-[#080c04] my-12'>
                    Trusted by Leading Companies
                </h2>
            </div>

            <div className="relative flex h-[400px] md:h-[600px] lg:h-[850px] w-full items-center justify-center overflow-hidden bg-[#fcfdf6]">
                {/* Gradient overlay to hide bottom of semi-circles */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fcfdf6] to-transparent z-20 pointer-events-none" />

                {/* Semi-circle 1 - 350px radius */}
                <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[280px] h-[140px] md:w-[500px] md:h-[250px] lg:w-[700px] lg:h-[350px] z-0" viewBox="0 0 700 350">
                    <path
                        d="M 0 350 A 350 350 0 0 1 700 350 L 700 350 L 0 350 Z"
                        stroke="#6c5f31"
                        strokeWidth="2"
                        fill="#ded587"
                        opacity="0.4"
                    />
                </svg>

                <div className="icon-orbit-1">
                    <Image src="/companies/nba-6.svg" alt="NBA Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px] " />
                </div>
                <div className="icon-orbit-1" style={{ animationDelay: '-4s' }}>
                    <Image src="/companies/checkr.svg" alt="Checkr Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px] " />
                </div>

                <div className="icon-orbit-1" style={{ animationDelay: '-12s' }}>
                    <Image src="/companies/checkr.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px] " />
                </div>

                {/* Semi-circle 2 - 500px radius */}
                <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[400px] h-[200px] md:w-[700px] md:h-[350px] lg:w-[1000px] lg:h-[500px]" viewBox="0 0 1000 500">
                    <path
                        d="M 0 500 A 500 500 0 0 1 1000 500 L 1000 500 L 0 500 Z"
                        fill="#e4dea3"
                        opacity="0.35"
                        stroke="#6c5f31"
                        strokeWidth="2"
                    />
                </svg>

                <div className="icon-orbit-2">
                    <Image src="/companies/twillo.svg" alt="NBA Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-2" style={{ animationDelay: '-5s' }}>
                    <Image src="/companies/checkr.svg" alt="Checkr Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-2" style={{ animationDelay: '-10s' }}>
                    <Image src="/companies/square.svg" alt="NBA Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-2" style={{ animationDelay: '-15s' }}>
                    <Image src="/companies/sendoso.svg" alt="Checkr Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>

                {/* Semi-circle 3 - 650px radius */}
                <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[520px] h-[260px] md:w-[910px] md:h-[455px] lg:w-[1300px] lg:h-[650px]" viewBox="0 0 1300 650">
                    <path
                        d="M 0 650 A 650 650 0 0 1 1300 650 L 1300 650 L 0 650 Z"
                        fill="#ebe6c0"
                        opacity="0.30"
                        stroke="#6c5f31"
                        strokeWidth="2"
                    />
                </svg>

                <div className="icon-orbit-3">
                    <Image src="/companies/square.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-3" style={{ animationDelay: '-5s' }}>
                    <Image src="/companies/twillo.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-3" style={{ animationDelay: '-10s' }}>
                    <Image src="/companies/square.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-3" style={{ animationDelay: '-15s' }}>
                    <Image src="/companies/twillo.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>

                {/* Semi-circle 4 - 800px radius */}
                <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[640px] h-80 md:w-[1120px] md:h-[560px] lg:w-[1600px] lg:h-[800px]" viewBox="0 0 1600 800">
                    <path
                        d="M 0 800 A 800 800 0 0 1 1600 800 L 1600 800 L 0 800 Z"
                        fill="#ece9d1"
                        opacity="0.25"
                        stroke="#6c5f31"
                        strokeWidth="2"
                    />
                </svg>

                <div className="icon-orbit-4">
                    <Image src="/companies/Adobe.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-4" style={{ animationDelay: '-6s' }}>
                    <Image src="/companies/sendoso.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-4" style={{ animationDelay: '-12s' }}>
                    <Image src="/companies/Adobe.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-4" style={{ animationDelay: '-18s' }}>
                    <Image src="/companies/sendoso.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-4" style={{ animationDelay: '-24s' }}>
                    <Image src="/companies/Adobe.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>
                <div className="icon-orbit-4" style={{ animationDelay: '-30s' }}>
                    <Image src="/companies/sendoso.svg" alt="Some Other Company Logo" width={50} height={50} className="w-[30px] h-[30px] md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]" />
                </div>

                <style jsx>{`
                    .icon-orbit-1,
                    .icon-orbit-2,
                    .icon-orbit-3,
                    .icon-orbit-4 {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: white;
                        border-radius: 50%;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transform-origin: 0 0;
                    }

                    @media (min-width: 768px) {
                        .icon-orbit-1,
                        .icon-orbit-2,
                        .icon-orbit-3,
                        .icon-orbit-4 {
                            width: 45px;
                            height: 45px;
                        }
                    }

                    @media (min-width: 1024px) {
                        .icon-orbit-1,
                        .icon-orbit-2,
                        .icon-orbit-3,
                        .icon-orbit-4 {
                            width: 50px;
                            height: 50px;
                        }
                    }

                    .icon-orbit-1 {
                        animation: orbit-semi-1 20s linear infinite;
                        z-index: 10 !important;
                        position: absolute;
                    }

                    .icon-orbit-2 {
                        animation: orbit-semi-2 24s linear infinite;
                        z-index: 10 !important;
                        position: absolute;
                    }

                    .icon-orbit-3 {
                        animation: orbit-semi-3 30s linear infinite;
                        z-index: 10 !important;
                        position: absolute;
                    }

                    .icon-orbit-4 {
                        animation: orbit-semi-4 36s linear infinite;
                        z-index: 10 !important;
                        position: absolute;
                    }

                    @keyframes orbit-semi-1 {
                        0% {
                            transform: translate(-50%, 0) rotate(0deg) translateY(-140px) rotate(0deg);
                        }
                        100% {
                            transform: translate(-50%, 0) rotate(360deg) translateY(-140px) rotate(-360deg);
                        }
                    }

                    @keyframes orbit-semi-2 {
                        0% {
                            transform: translate(-50%, 0) rotate(0deg) translateY(-200px) rotate(0deg);
                        }
                        100% {
                            transform: translate(-50%, 0) rotate(360deg) translateY(-200px) rotate(-360deg);
                        }
                    }

                    @keyframes orbit-semi-3 {
                        0% {
                            transform: translate(-50%, 0) rotate(0deg) translateY(-260px) rotate(0deg);
                        }
                        100% {
                            transform: translate(-50%, 0) rotate(360deg) translateY(-260px) rotate(-360deg);
                        }
                    }

                    @keyframes orbit-semi-4 {
                        0% {
                            transform: translate(-50%, 0) rotate(0deg) translateY(-320px) rotate(0deg);
                        }
                        100% {
                            transform: translate(-50%, 0) rotate(360deg) translateY(-320px) rotate(-360deg);
                        }
                    }

                    @media (min-width: 768px) {
                        @keyframes orbit-semi-1 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-250px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-250px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-2 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-350px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-350px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-3 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-455px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-455px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-4 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-560px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-560px) rotate(-360deg);
                            }
                        }
                    }

                    @media (min-width: 1024px) {
                        @keyframes orbit-semi-1 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-350px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-350px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-2 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-500px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-500px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-3 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-650px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-650px) rotate(-360deg);
                            }
                        }

                        @keyframes orbit-semi-4 {
                            0% {
                                transform: translate(-50%, 0) rotate(0deg) translateY(-800px) rotate(0deg);
                            }
                            100% {
                                transform: translate(-50%, 0) rotate(360deg) translateY(-800px) rotate(-360deg);
                            }
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default TrustedBySection;
