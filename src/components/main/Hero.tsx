"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowUpRight, Shield, User, Menu, X } from 'lucide-react'
import { ContainerTextFlip } from '../ui/container-text-flip'
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"
import Image from 'next/image'

const Hero = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const AURORA_COLORS = [
    "#00CC33",
    "#00AA2B",
    "#00EE3B",
    "#009928",
    "#00FF40",
  ]

  const color = useMotionValue(AURORA_COLORS[0])

  useEffect(() => {
    animate(color, AURORA_COLORS, {
      ease: "easeInOut",
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror",
    })
  }, [color])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 80%, #ffffff 50%, ${color})`

  const verificationBadges = [
    { name: "Verra", code: "VCS", logo: "/certified/VERRA.png", link: "https://verra.org/" },
    { name: "Gold Standard", code: "GS", logo: "/certified/GA.png", link: "https://www.goldstandard.org/" },
    { name: "American Carbon Registry", code: "ACR", logo: "/certified/ACR.svg", link: "https://www.americancarbonregistry.org/" },
    { name: "Climate Action Reserve", code: "CAR", logo: "/certified/CAR.png", link: "https://www.climateactionreserve.org/" }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      style={{
        backgroundImage,
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <header className="top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/ccLogo.svg"
              alt="CarbonCut Logo"
              width={128}
              height={128}
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
            />
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            <div className="flex items-center space-x-4">
              {/* Dropdown Container */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size={"lg"}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                >
                  Products
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <div className="py-1">
                    <Link href="/calculator">
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer rounded-md"
                      >
                        CarbonCalculator
                      </button>
                    </Link>
                    <Link href="/offset">
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer rounded-md"
                      >
                        CarbonOffset
                      </button>
                    </Link>
                    <Link href="/token">
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer rounded-md"
                      >
                        CarbonToken
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/login">
              <Button
                variant="ghost"
                size={"lg"}
                className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer"
              >
                <User className="w-4 h-4" />   
                <span className="ml-2">Login</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-black text-white p-2 rounded-sm h-9 transition-colors duration-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Products Dropdown */}
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 flex items-center justify-between"
                >
                  Products
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <Link href="/calculator">
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        CarbonCalculator
                      </button>
                    </Link>
                    <Link href="/offset">
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        CarbonOffset
                      </button>
                    </Link>
                    <Link href="/token">
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        CarbonToken
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Login */}
              <Link href="/login">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 text-center pt-8 sm:pt-16">
        <div className="max-w-6xl mx-auto w-full">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
              <ContainerTextFlip
                interval={1500}
                animationDuration={300}
                textClassName='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
                className="inline-block text-tertiary"
                words={["Calculate", "Report", "Offset"]}
              />
              <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">marketing</span>
            </div>
            <div className="mt-1 sm:mt-0">
              <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">emissions</span>
            </div>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            From digital impressions to printed collateral, we calculate campaign-level emissions with audit-ready CO₂e results and link every residual tonne to a verified offset, complete with a certificate trail.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10">
            <Button
              asChild
              size={"lg"}
              className="bg-tertiary hover:bg-tertiary/90 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden w-full sm:w-auto px-6"
            >
              <Link href="/calculator" className="flex items-center justify-center space-x-2 sm:space-x-3">
                <Calculator className="w-5 h-5" />
                <span>CarbonCalculator</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>

          {/* Verification Section */}
          <div className="mx-2 sm:mx-4">
            <div className="flex items-center justify-center mb-4 px-2">
              <Shield className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium text-center">
                Verified by <span className="text-orange-500 font-semibold">Leading Carbon Standards</span>
              </span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4  max-w-2xl mx-auto">
              {verificationBadges.map((badge, index) => (
                <motion.div
                  key={badge.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="group relative"
                >
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

                  {/* Tooltip for larger screens */}
                  <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    {badge.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Hero