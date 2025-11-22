import React from "react";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full min-h-screen bg-[#fcfdf6] flex flex-col">

      {/* ================= TOP SECTION - LINKS ================= */}
      <div className="flex-1 flex items-center lg:justify-end justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-20 lg:text-right text-left w-full sm:w-auto max-w-2xl lg:max-w-none">

          {/* Useful Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg" style={{ color: "#6c5f31" }}>Useful Links</h3>
            <div className="space-y-1.5 md:space-y-2">
              <a href="/content" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Content</a>
              <a href="/how-it-works" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>How it Works</a>
              <a href="/create" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Create</a>
              <a href="/explore" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Explore</a>
              <a href="/terms" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Terms & Services</a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg" style={{ color: "#6c5f31" }}>Community</h3>
            <div className="space-y-1.5 md:space-y-2">
              <a href="/help-center" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Help Center</a>
              <a href="/partners" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Partners</a>
              <a href="/suggestions" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Suggestions</a>
              <a href="/blog" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Blog</a>
              <a href="/newsletters" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Newsletters</a>
            </div>
          </div>

          {/* Partner */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg" style={{ color: "#6c5f31" }}>Partner</h3>
            <div className="space-y-1.5 md:space-y-2">
              <a href="/our-partner" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Our Partner</a>
              <a href="/become-partner" className="block text-sm md:text-base hover:underline" style={{ color: "#080c04" }}>Become a Partner</a>
            </div>
          </div>

        </div>
      </div>

      {/* ================= COPYRIGHT + SOCIAL ================= */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between py-4 md:py-6 gap-4">
        {/* LEFT */}
        <p className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl text-center sm:text-left" style={{ color: "#6c5f31" }}>
          Copyright 2025-26 @CARBON TECH INTERNATIONAL LIMITED
        </p>

        {/* RIGHT */}
        <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
          <a href="https://www.instagram.com/carboncut.co" target="_blank" rel="noopener noreferrer" style={{ color: "#6c5f31" }}>
            <Instagram className="w-5 h-5 md:w-6 md:h-6 hover:text-[#F0db18] transition-colors" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61580263412275" target="_blank" rel="noopener noreferrer" style={{ color: "#6c5f31" }}>
            <Facebook className="w-5 h-5 md:w-6 md:h-6 hover:text-[#F0db18] transition-colors" />
          </a>
          <a href="https://x.com/CarbonCut_co" target="_blank" rel="noopener noreferrer" style={{ color: "#6c5f31" }}>
            <Twitter className="w-5 h-5 md:w-6 md:h-6 hover:text-[#F0db18] transition-colors" />
          </a>
          <a href="https://www.linkedin.com/company/carboncut-co/" target="_blank" rel="noopener noreferrer" style={{ color: "#6c5f31" }}>
            <Linkedin className="w-5 h-5 md:w-6 md:h-6 hover:text-[#F0db18] transition-colors" />
          </a>
        </div>
      </div>

      {/* ================= LINE ================= */}
      <div className="w-full" style={{ borderTop: "1px solid #d1cebb" }}></div>

      {/* ================= BOTTOM IMAGE ================= */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
        <img
          src="/CarbonCut-cropped.svg"
          alt="CarbonCut Logo"
          className="w-full h-auto object-contain max-w-full"
          style={{ maxHeight: "400px" }}
        />
      </div>

    </footer>
  );
};

export default Footer;