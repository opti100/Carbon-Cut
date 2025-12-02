"use client"
import React from "react";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import {  Link004 } from "./ui/skiper-ui/skiper40";

const Footer = () => {
  return (
    <footer className="w-full min-h-screen relative overflow-hidden bg-black backdrop-blur-3xl">
      {/* ThreeScene Background */}
      <div className="absolute inset-0 z-0 ">
        {/* <ThreeScene /> */}
      </div>
 
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <div className=" flex items-center lg:justify-between justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">Useful Links</h3>
              <div className="space-y-1.5 md:space-y-2">
                <Link004 href="/content" className=" text-sm md:text-base  text-white hover:text-white" >Content</Link004>
                <Link004 href="/how-it-works" className=" text-sm md:text-base  text-white hover:text-white">How it Works</Link004>
                <Link004 href="/create" className=" text-sm md:text-base  text-white hover:text-white">Create</Link004>
                <Link004 href="/explore" className=" text-sm md:text-base  text-white hover:text-white">Explore</Link004>
                <Link004 href="/terms" className="text-sm md:text-base  text-white hover:text-white">Terms & Services</Link004>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">Community</h3>
              <div className="space-y-1.5 md:space-y-2">
                <Link004 href="/help-center" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Help Center</Link004>
                <Link004 href="/partners" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Partners</Link004>
                <Link004 href="/suggestions" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Suggestions</Link004>
                <Link004 href="/blog" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Blog</Link004>
                <Link004 href="/newsletters" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Newsletters</Link004>
              </div>
            </div>

            <div className="text-right space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">Partner</h3>
              <div className="space-y-1.5 md:space-y-2">
                <Link004 href="/our-partner" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Our Partner</Link004>
                <Link004 href="/become-partner" className=" text-sm md:text-base hover:underline text-white/80 hover:text-white">Become a Partner</Link004>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COPYRIGHT + SOCIAL ================= */}
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between py-4 md:py-6 gap-4">

          <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
            <a href="https://www.instagram.com/carboncut.co" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Instagram className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61580263412275" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Facebook className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a href="https://x.com/CarbonCut_co" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Twitter className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a href="https://www.linkedin.com/company/carboncut-co/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>

        {/* ================= LINE ================= */}
        {/* <div className="w-full border-t border-white/20"></div> */}
        {/* ================= BOTTOM IMAGE ================= */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
          <Image
            src="/CarbonCut-fe/cc-croped.svg"
            alt="CarbonCut Logo"
            width={1200}
            height={400}
            className="w-full h-auto object-contain max-w-full inverted-colors:invert"
            style={{ maxHeight: "400px", filter: "brightness(0) invert(1)" }}
          />
          {/* <Noir7TextAnimation 
          {/* <Noir7TextAnimation 
  text="STUDIO"
  fontSize="clamp(4rem, 10vw, 10rem)"
  color="#ffffff"
  backgroundColor="#000000"
  animationDelay={1}
  staggerDelay={0.15}
  holdDuration={1.5}
/> */}
{/* <Noir7TextAnimation 
              text="CARBONCUT"
              fontSize="clamp(12rem, 8vw, 12rem)"
              color="#ffffff"
              backgroundColor="transparent"
              animationDelay={1}
              staggerDelay={0.1}
              holdDuration={2}
            /> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;