"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BlurFade } from "../ui/blur-fade";

export function InternetAdsWebApp() {
    return (
        <>
            <div className="mt-20 font-mono max-w-7xl mx-auto px-4">
                <BlurFade delay={0.1} inView className="mb-6 text-right">

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
                        Choose Your Emission Category
                    </h2>
                    <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg leading-relaxed">
                        Understanding your digital footprint starts here. Select what matters most to your business:
                    </p>
                </BlurFade>
            </div>

            <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-[#fcfdf6] dark:bg-black w-full gap-4 mx-auto px-8">
                <Card 
                    title="Internet Ads" 
                    description="Track the carbon cost of every impression, click, and campaign across your advertising ecosystem."
                    icon={
                         <Image
                            src="/auth-hero.jpg"
                            alt="Internet Ads Background"
                            fill
                            className="object-cover"
                        />
                    }
                    hoverImage={
                        <Image
                            src="/auth-hero.jpg"
                            alt="Internet Ads Background"
                            fill
                            className="object-cover"
                        />
                    }
                />
                <Card 
                    title="Web & Apps" 
                    description="Measure the emissions from your websites, applications, and digital services your customers use daily."
                    icon={
                        <Image
                            src="/abstract-gray.jpg"
                            alt="Web & Apps"
                            fill
                            className="object-cover"
                        />
                    }
                    hoverImage={
                        <Image
                            src="/abstract-gray.jpg"
                            alt="Web & Apps Background"
                            fill
                            className="object-cover"
                        />
                    }
                />

            </div>
        </>
    );
}

const Card = ({
  title,
  description,
  icon,
  hoverImage,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  hoverImage?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem] overflow-hidden"
    >
      {/* Hover background image */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            {hoverImage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center icon */}
      <div className="relative z-20 text-center transition duration-200 group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0">
        {icon}
      </div>

      {/*>

      {/* ✅ Bottom-aligned content */}
      <div className="absolute inset-0 flex items-end p-6 z-20">
        <div className="transition-all duration-300 group-hover/canvas-card:-translate-y-2">
          <h2 className="text-xl font-bold text-white opacity-0 group-hover/canvas-card:opacity-100 transition duration-200">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-white/70 opacity-0 group-hover/canvas-card:opacity-100 transition duration-200">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};




