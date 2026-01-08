"use client";
import CardNav from "@/components/CardNav";
import { navData } from "@/components/NavData";
import { motion } from "motion/react";

export function HeroInternetAds() {
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
                <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-mono font-bold text-[#6c5f31] md:text-4xl lg:text-7xl ">
                    {"Track Your Internet Ads"
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
                   Track the carbon cost of every impression, click, and campaign across your advertising ecosystem.
                </motion.p>
               

            </div>
        </div>
    );
}


