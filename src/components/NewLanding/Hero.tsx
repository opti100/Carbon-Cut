import Image from 'next/image'
import React from 'react'
import AnimatedHeroText from './AnimatedHeroText'
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative h-screen w-full" data-scroll-section>
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/CarbonCut-fe/hero3.jpg"
                    alt="Background Hero"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Dark overlay */}
                {/* <div className="absolute inset-0 bg-white/50"></div> */}
            </div>
            <div
                className="flex flex-col items-center justify-center h-full px-6 max-w-5xl mx-auto"
                data-scroll
                data-scroll-speed="0.5"
            >

              

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center mb-6 leading-tight">

                    <AnimatedHeroText />
                </h1>

                {/* <SplitTextComponent className="text-white/90 text-lg md:text-xl text-center mb-10 max-w-3xl">
              Unlock the power of seamless transactions and smart
              financial management at your fingertips.
            </SplitTextComponent> */}

        <Link href="/calculator">
                <button className="bg-[#D4FF00] hover:bg-[#c4ef00] text-black font-semibold px-6 py-2 rounded-full text-lg transition-all duration-300 hover:scale-105">
                    Get Started
                </button>
        </Link>

                <div className="absolute bottom-12 left-0 right-0 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className="text-green-500 text-xl">★</span>
                                <span className="text-white font-semibold">Trustpilot</span>
                            </div>
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

                        <div className="flex items-center gap-2 text-white">
                            {/* <SplitTextComponent> 
                    Forbes
                  </SplitTextComponent>  */}
                            {/* <span className="text-sm font-semibold">Forbes</span> */}
                            <div className="text-xs">
                                <div className="font-bold">#1</div>
                                <div className="text-white/60">Most Innovative</div>
                                <div className="text-white/60">Companies</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
