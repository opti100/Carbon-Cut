"use client";
import CardNav from "@/components/CardNav";
import { description } from "@/components/dashboard/Chart-Area-Interactive";
import { navData } from "@/components/NavData";
import { CardContent } from "@/components/ui/card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import UniversalHeading from "@/components/UniversalHeading";
import { motion } from "motion/react";

export function HeroSectionWebApps() {
    return (
        <div className="relative mx-auto my-10 flex max-w-8xl flex-col items-center justify-center">
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

            <div className="px-4 py-10 md:py-20">
                <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-[#6c5f31] md:text-4xl lg:text-7xl ">
                    {"Track Your Digital Product"
                        .split(" ")
                        .map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: "easeInOut",
                                }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                </h1>


                <motion.p
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 0.8,
                    }}
                    className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
                >
                    Install our SDK to start tracking carbon emissions from your website or application
                </motion.p>
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1,
                    }}
                    className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                        Explore Now
                    </button>
                    <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                        Contact Support
                    </button>
                </motion.div>

            </div>

            <div className="max-w-5xl mx-auto px-8">
                <HoverEffect items={projects} />
            </div>

          <CardContent className="w-full mx-auto max-w-5xl ">

                {/* Instructions */}
                <div className="rounded-xl bg-[#d1cebb] p-6">
                    <h3 className="font-semibold text-black mb-3">
                        Web & Apps Specific Instructions
                    </h3>

                    <ul className="text-black space-y-2 text-sm leading-relaxed">

                        <>
                            <li>• Add the SDK script to your website's head tag</li>
                            <li>• Test the integration in development first</li>
                            <li>• Monitor real-time emissions in your dashboard</li>
                        </>

                    </ul>
                </div>
            </CardContent>
        </div>
    );
}


const projects = [
    {
        title: "Add the SDK script to your website's head tag",
        description:
            "Copy and paste the script tag into your code to get started",
    },
    {
        title: "Test the integration in development first",
        description:
            "Verify the SDK is working correctly before deploying to production",
    },
    {
        title: "Monitor real-time emissions in your dashboard",
        description:
            "View detailed analytics and insights about your digital carbon footprint",
    },
   
];