"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowUpRight, Shield, User } from 'lucide-react'
import { ContainerTextFlip } from '../ui/container-text-flip'
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"
import Image from 'next/image'

const Hero = () => {

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

  return (
    <motion.div
      style={{
        backgroundImage,
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <header
        className={`
           top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
         
        `}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <div className="flex items-center">
            <Image
              src="/ccLogo.svg"
              alt="CarbonCut Logo"
              width={128}
              height={128}
              className="w-48 h-48"
            >
            </Image>
          </div>

          <div className='flex  items-center space-x-4'>
            <div className="flex items-center space-x-4">
              {/* Dropdown Container */}
              <div className="relative group">
                {/* Dropdown Trigger */}
                <Button
                  variant="ghost"
                  size={"lg"}
                  className="bg-black text-white px-6 py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer flex items-center gap-2 touch-manipulation"
                >
                  Products

                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-200 z-50 touch-manipulation">
                  <div className="py-1">
                    {/* Menu Item 1 */}
                    <Link href="/calculator">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 cursor-pointer rounded-md touch-manipulation select-none">
                        CarbonCalculator
                      </button>
                    </Link>

                    {/* Menu Item 2 */}
                    <Link href="/">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 cursor-pointer rounded-md touch-manipulation select-none">
                        CarbonOffset
                      </button>
                    </Link>

                    {/* Menu Item 3 */}
                    <Link href="/">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 cursor-pointer rounded-md touch-manipulation select-none">
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
                className="bg-black text-white px-6 py-4 text-sm font-medium hover:bg-tertiary hover:text-white rounded-sm h-9 transition-colors duration-200 cursor-pointer" >
                <User />   Login
              </Button>
            </Link>

          </div>
        </nav>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <ContainerTextFlip
                interval={1500}
                animationDuration={300}
                textClassName=''
                className="inline-block text-tertiary"
                words={["Calculate", "Report", "Offset"]}
              />
              <span className="text-black">marketing</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-black">emissions</span>
            </div>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            From digital impressions to printed collateral, we calculate campaign-level emissions with audit-ready CO₂e results and link every residual tonne to a verified offset, complete with a certificate trail.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              asChild
              size={"lg"}
              className="bg-tertiary hover:bg-tertiary/90 text-white py-2 text-lg font-semibold rounded-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden"
            >
              <Link href="/calculator" className="flex items-center space-x-3">
                <Calculator className="w-5 h-5" />
                <span>CarbonCalculator</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>

          <div className="mx-14 sm:mx-10">
            <div className="flex items-center justify-center mb-4 px-2">
              <Shield className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium text-center">
                Verified by <span className="text-orange-500 font-semibold">Leading Carbon Standards</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
              {verificationBadges.map((badge, index) => (
                <motion.div
                  key={badge.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="group relative"
                >
                  <Link href={badge.link} className="flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-orange-500/40 w-34 h-30">
                    <Image
                      src={badge.logo}
                      alt={badge.name}
                      width={1020}
                      height={1000}
                      className="object-contain max-w-full max-h-full filter grayscale hover:grayscale-0 transition-all duration-200"
                    />
                  </Link>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
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