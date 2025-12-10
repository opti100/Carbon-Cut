"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronDown, ChevronRight, Menu, Radio, Scale } from "lucide-react";
import { usePathname } from "next/dist/client/components/navigation";

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const scrollContainer = document.querySelector("[data-scroll-container]");

    const getScrollY = () => {
      return scrollContainer ? scrollContainer.scrollTop : window.scrollY;
    };

    const handleScroll = () => {
      const currentScrollY = getScrollY();

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setHoveredItem(null);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="relative z-20 bg-transparent backdrop-blur-sm transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-2 h-12">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Image src="/CarbonCut-fe/CC.svg" alt="CarbonCut Logo" height={50} width={50} />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <div
              className="relative h-full py-2"
              onMouseEnter={() => setHoveredItem("Product")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${isHome
                  ? "text-white hover:text-black"
                  : "text-black hover:text-gray-700"
                  }`}
              >
                Product
              </span>
            </div>

            <Link
              href="/lubricant"
              className={`text-sm font-medium transition-colors ${isHome
                ? "text-white hover:text-black"
                : "text-black hover:text-gray-700"
                }`}
            >
              Solutions
            </Link>

            <Link
              href="/blogs"
              className={`text-sm font-medium transition-colors ${isHome
                ? "text-white hover:text-black"
                : "text-black hover:text-gray-700"
                }`}
            >
              Blogs
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${isHome
                ? "text-white hover:text-black"
                : "text-black hover:text-gray-700"
                }`}
            >
              About
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link
              href="/signup"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Product Dropdown */}
      <AnimatePresence>
        {hoveredItem === "Product" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 z-10 w-full overflow-hidden backdrop-blur-sm border-b border-white/20 shadow-sm"
            onMouseEnter={() => setHoveredItem("Product")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="mx-auto w-full px-6 py-6">
              <div className="text-3xl font-bold mb-8">Products</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carbon Calculator */}
                <Link
                  href="/calculator"
                  className="p-8 rounded-xl transition bg-[#b0ea1d] opacity-70 cursor-pointer h-full hover:shadow shadow-2xs hover:opacity-80 block"
                >
                  <Calculator />
                  <div className="font-semibold text-xl mt-6 flex justify-between">
                    CarbonCalculator
                    <span><ChevronRight /></span>
                  </div>
                </Link>

                {/* Carbon live */}
                <Link
                  href="/live"
                  className="p-8 opacity-70 rounded-xl transition bg-[#b0ea1d] cursor-pointer h-full hover:shadow shadow-2xs hover:opacity-80 block"
                >
                  <Radio />
                  <div className="font-semibold text-xl mt-6 flex justify-between">
                    CarbonLive
                    <span><ChevronRight /></span>
                  </div>
                </Link>

                {/* Carbon offset */}
                <Link
                  href="/offset"
                  className="p-8 opacity-70 rounded-xl bg-[#b0ea1d] transition cursor-pointer h-full hover:shadow shadow-2xs hover:opacity-80 block"
                >
                  <Scale />
                  <div className="font-semibold text-xl mt-6 flex justify-between">
                    CarbonOffset
                    <span><ChevronRight /></span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
