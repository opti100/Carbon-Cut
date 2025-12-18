"use client";


import { motion } from "motion/react";
import Navbar from "../NewLanding/Navbar";
import CardNav from "../CardNav";
import { navData } from "@/app/page";
import Link from "next/link";

export function HeroOilGas() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <CardNav
					logo="/CarbonCut-fe/CC.svg"
					logoAlt="CarbonCut Logo"
					items={navData}
					baseColor="rgba(255, 255, 255, 0.1)"
					menuColor="#080c04"
					buttonBgColor="#b0ea1d"
					buttonTextColor="#080c04"
				/>
      
      <div className="px-4 py-10 md:my-20">
        <h1 className="relative z-10 mx-auto max-w-7xl text-left text-2xl font-bold text-[#6c5f31] md:text-4xl lg:text-7xl">
          {"Oil and Natural Gas Industry Solutions"
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
          className="relative z-10 mx-auto max-w-7xl py-4 text-left  font-normal text-neutral-600 dark:text-neutral-400"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, voluptatem aliquam <br />cupiditate dignissimos atque modi hic mollitia omnis nam sapiente.
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
          className="relative z-10 mt-8 flex flex-wrap items-start justify-start gap-4"
        >
          <Link href='/internet/internet-ads' className="w-60 transform rounded-lg bg-[#d1cebb] px-6 py-2 font-medium text-[#080c04] transition-all duration-300 hover:-translate-y-0.5   hover:text-[#080c04] hover:bg-[#d3cda9]">
           Internet Ads
          </Link>
          <Link href='/internet/web-apps' className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-[#080c04] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100">
           Web & Apps
          </Link>
        </motion.div>
     
      </div>
    </div>
  );
}


