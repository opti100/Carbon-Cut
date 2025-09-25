"use client";

import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Leaf, Zap, Battery, Users } from "lucide-react";
import Image from "next/image";
import { PixelImage } from "../ui/pixel-image";

const solutions = [
    {
        icon: Leaf,
        title: "Solar Energy Solutions",
        description: "Affordable residential and commercial solar panels.",
        color: "text-green-600"
    },
    {
        icon: Zap,
        title: "Wind Power Systems",
        description: "Community-scale wind turbines with smart grid integration.",
        color: "text-green-600"
    },
    {
        icon: Battery,
        title: "Energy Storage & Efficiency",
        description: "Battery storage, smart energy monitoring, and sustainable home upgrades.",
        color: "text-green-600"
    },
    {
        icon: Users,
        title: "Consulting & Education",
        description: "Workshops, audits, and strategy sessions for businesses and schools.",
        color: "text-green-600"
    }
];

export default function OurSolutions() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                    <BlurFade delay={0.1}>
                        <div className="relative h-[calc(100vh-95px)]">
                            <PixelImage
                                src="/solutions/Solutions-hero.png"
                                alt="Solar engineer with laptop in front of wind turbine"
                                grid="8x8"
                                className="w-full h-full"
                                pixelFadeInDuration={800}
                                maxAnimationDelay={1000}
                                colorRevealDelay={1200}
                                inViewMargin="-50px" // Triggers when 50px into view
                            />
                        </div>
                    </BlurFade>

                    <div className="h-[calc(100vh-95px)] flex flex-col justify-between space-y-8">
                        <BlurFade delay={0.2}>
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                                    Our Solutions
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Climate change isn't coming—it's here. Transitioning to sustainable
                                    energy isn't just a choice; it's a necessity. We believe in:
                                </p>
                            </div>
                        </BlurFade>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {solutions.map((solution, index) => (
                                <BlurFade key={solution.title} delay={0.3 + index * 0.1}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="group p-6 rounded-xl border border-gray-100 hover:border-green-200  transition-all duration-300 bg-white"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                                                    <solution.icon className={`w-6 h-6 ${solution.color}`} />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-green-700 transition-colors duration-300">
                                                    {solution.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {solution.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}