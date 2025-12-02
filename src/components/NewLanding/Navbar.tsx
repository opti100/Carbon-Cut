"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
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
        // scrolling down → hide
        setIsVisible(false);
        setHoveredItem(null);
      } else {
        // scrolling up → show
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
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/CarbonCut-fe/CC.svg" alt="CarbonCut Logo" height={50} width={50} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {["Product", "Solutions", "Blogs", "About"].map((item) => (
              <div
                key={item}
                className="relative h-full py-2"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* if the background is light , then text-black */}
                <Link
                  href={`${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${isHome
                      ? "text-white hover:text-black" // home page styles
                      : "text-black hover:text-gray-700" // other pages
                    }`}
                >
                  {item}
                </Link>

              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link href="/signup">
              <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
                Sign Up
              </button>
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
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="grid grid-cols-[25%,35%,1fr] gap-8">
                <div className="text-3xl font-bold">Products</div>

                <div className="border-l border-black pl-6 space-y-6">
                  <div>
                    <Link href="/calculator" className="font-semibold">
                      <div className="font-semibold">CarbonCalculator</div>

                    </Link>
                  </div>

                  <div>
                    <Link href="/live" className="font-semibold">
                      <div className="font-semibold">CarbonLive</div>

                    </Link>
                  </div>

                  <div>
                    <Link href="/offset" className="font-semibold">
                      <div className="font-semibold">CarbonOffset</div>

                    </Link>
                  </div>
                </div>

                <div className="border-l border-black pl-6">
                  <div className="h-full w-full rounded-xl bg-amber-50"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
