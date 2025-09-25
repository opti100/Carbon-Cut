"use client";

import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { PixelImage } from "../ui/pixel-image";

const processSteps = [
    {
        number: "01",
        title: "Start Your Solar Journey",
        description: "We kick off with a personalized consultation to understand your energy needs and goals.",
        position: "top-left"
    },
    {
        number: "02", 
        title: "Site Evaluation",
        description: "Our team conducts a detailed assessment of your property to determine its solar potential and ideal system.",
        position: "top-right"
    },
    {
        number: "03",
        title: "Custom System Design", 
        description: "We develop a tailored solar solution, providing you with a comprehensive proposal that outlines technical.",
        position: "bottom-left"
    },
    {
        number: "04",
        title: "Quick & Easy Installation",
        description: "Once approved, our experienced team ensures a seamless installation process, getting your solar system up.",
        position: "bottom-right"
    }
];

export default function ProvenProcess() {
    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <BlurFade delay={0.1}>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                            Our Proven Process for<br />Success
                        </h2>
                    </div>
                </BlurFade>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Central Image */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-10">
                            <BlurFade delay={0.2}>
                                <div className="relative w-full h-full">
                                    <PixelImage
                                        src="/process/process-hero.jpg"
                                        alt="Solar consultants discussing project outdoors"
                                        grid="6x4"
                                        className="w-full h-full rounded-full overflow-hidden"
                                        pixelFadeInDuration={800}
                                        maxAnimationDelay={1000}
                                        colorRevealDelay={1200}
                                        inViewMargin="-100px"
                                    />
                                </div>
                            </BlurFade>
                        </div>

                        {/* Process Steps - Desktop Grid */}
                        <div className="grid grid-cols-2 gap-x-96 gap-y-32 pt-20 pb-20">
                            {processSteps.map((step, index) => {
                                const isLeft = step.position.includes('left');
                                const isTop = step.position.includes('top');
                                
                                return (
                                    <BlurFade key={step.number} delay={0.3 + index * 0.1}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`relative ${isLeft ? 'text-right pr-12' : 'text-left pl-12'} ${isTop ? 'pb-16' : 'pt-16'}`}
                                        >
                                            {/* Step Number */}
                                            <div className={`absolute ${isLeft ? 'right-0' : 'left-0'} ${isTop ? 'top-0' : 'bottom-0'}`}>
                                                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                                    {step.number}
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className={`${isTop ? 'pt-20' : 'pb-20'}`}>
                                                <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed max-w-sm">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </BlurFade>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden">
                    {/* Central Image for Mobile */}
                    <BlurFade delay={0.2}>
                        <div className="relative w-72 h-72 mx-auto mb-12">
                            <PixelImage
                                src="/process/process-hero.jpg"
                                alt="Solar consultants discussing project outdoors"
                                grid="6x4"
                                className="w-full h-full rounded-full overflow-hidden"
                                pixelFadeInDuration={800}
                                maxAnimationDelay={1000}
                                colorRevealDelay={1200}
                                inViewMargin="-100px"
                            />
                        </div>
                    </BlurFade>

                    {/* Process Steps - Mobile Stack */}
                    <div className="space-y-8">
                        {processSteps.map((step, index) => (
                            <BlurFade key={step.number} delay={0.3 + index * 0.1}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Step Number */}
                                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                                            {step.number}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}