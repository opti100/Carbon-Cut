"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowUpRight, Shield, User, Menu, X, ChevronDown } from 'lucide-react'
import { ContainerTextFlip } from '../ui/container-text-flip'
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"
import Image from 'next/image'

const AURORA_COLORS = [
  "#00CC33",
  "#00AA2B",
  "#00EE3B",
  "#009928",
  "#00FF40",
]
const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCarbonCutDropdownOpen, setIsCarbonCutDropdownOpen] = useState(false) // Add this state

  const color = useMotionValue(AURORA_COLORS[0])

  useEffect(() => {
    animate(color, AURORA_COLORS, {
      ease: "easeInOut",
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror",
    })
  }, [color])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 80%, #ffffff 50%, ${color})`

  const verificationBadges = [
    { name: "Verra", code: "VCS", logo: "/certified/VERRA.png", link: "https://verra.org/", status: "active" },
    { name: "Gold Standard", code: "GS", logo: "/certified/GA.png", link: "https://www.goldstandard.org/", status: "pending" },
    { name: "American Carbon Registry", code: "ACR", logo: "/certified/ACR.svg", link: "https://www.americancarbonregistry.org/", status: "pending" },
    { name: "Climate Action Reserve", code: "CAR", logo: "/certified/CAR.png", link: "https://www.climateactionreserve.org/", status: "pending" }
  ]

  const navigationItems = [
    {
      label: 'Products',
      hasDropdown: true,
      items: [
        { label: 'CarbonCalculator', href: '/calculator' },
        { label: 'CarbonLive', href: '/live' },
        { label: 'CarbonOffset', href: '/offset' },

      ]
    },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Resources', href: '/resources' },
  ]

  const CarbonCutNav = [
    {
      label: 'CarbonCut',
      hasDropdown: true,
      items: [
        { label: 'CarbonCalculator', href: '/calculator' },
        { label: 'CarbonLive', href: '/live' },
        { label: 'CarbonOffset', href: '/offset' },

      ]
    },
  ]

  return (
    <motion.div
      style={{
        backgroundImage,
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/ccLogo.svg"
                alt="CarbonCut Logo"
                width={128}
                height={128}
                className="w-32  sm:w-40  lg:w-48 "
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group focus-within:z-10">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
                      >
                        <span className="font-medium">{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                      </Button>

                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 backdrop-blur-md">
                        <div className="py-2">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 font-medium">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-2.5 font-medium shadow-sm">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <motion.div
          id="mobile-menu"
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200/20"
        >
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 px-3 py-2">{item.label}</div>
                    <div className="pl-4 space-y-1">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200/50 space-y-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-700">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Get started</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.header>


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 text-center pt-24 sm:pt-28 md:pt-32 lg:pt-40">
        <div className="max-w-6xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <ContainerTextFlip
                interval={1500}
                animationDuration={300}
                textClassName=''
                className="inline-block text-tertiary"
                words={["Calculate", "Reduce", "Offset"]}
              />
              <span className="text-black">carbon </span>
            </div>
            <div className="mt-0 sm:mt-1 md:mt-2 flex justify-center">
              <span className="text-black text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">emissions — in real-time</span>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 text-center"
          >
            From internet advertising to energy & beyond, CarbonCut Tracks and Reduces emissions as they happen. Our AI-driven reduction agents analyse live activity data, cut unnecessary emissions, and auto-offset every residual tonne with verified carbon credits.
            Because real impact doesn&apos;t wait — it happens <span className='font-bold'> in real-time.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 md:mb-12"
          >
            {/* CarbonCut Dropdown Button */}
            {CarbonCutNav.map((item) => (
              <div key={item.label} className="relative group w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() => setIsCarbonCutDropdownOpen(!isCarbonCutDropdownOpen)}
                  className="bg-tertiary hover:bg-tertiary/90 text-white px-6 py-2 sm:px-8 sm:py-3.5 md:px-10 md:py-2 text-base sm:text-lg md:text-xl font-semibold rounded-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform ${isCarbonCutDropdownOpen ? 'rotate-180' : ''} group-hover:rotate-180`} />
                  </span>
                </Button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 transition-all duration-200 backdrop-blur-md z-50 ${
                  isCarbonCutDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                } sm:group-hover:opacity-100 sm:group-hover:visible`}>
                  <div className="py-2">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsCarbonCutDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-tertiary hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{subItem.label}</span>
                        <ArrowUpRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-2 sm:mx-6 md:mx-10 lg:mx-14"
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-5 px-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium text-center">
                Verified by <span className="text-orange-500 font-semibold">Leading Carbon Standards</span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {verificationBadges.map((badge, index) => (
                <motion.div
                  key={badge.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="group relative"
                >
                  {badge.status === "active" ? (
                    <Link
                      href={badge.link}
                      className="flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-orange-500/40 w-full h-20 sm:h-24"
                    >
                      <Image
                        src={badge.logo}
                        alt={badge.name}
                        width={1020}
                        height={1000}
                        className="object-contain w-full h-full max-w-[80px] sm:max-w-[100px] filter grayscale hover:grayscale-0 transition-all duration-200"
                      />
                    </Link>
                  ) : (
                    <div className="relative flex items-center justify-center bg-gray-50/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm w-full h-20 sm:h-24 cursor-not-allowed">
                      <Image
                        src={badge.logo}
                        alt={badge.name}
                        width={1020}
                        height={1000}
                        className="object-contain w-full h-full max-w-[80px] sm:max-w-[100px] filter grayscale opacity-30"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gray-600/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tooltip for larger screens */}
                  <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    {badge.name} {badge.status === "pending" && "(Pending)"}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Hero