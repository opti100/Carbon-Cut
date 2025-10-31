"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowBigLeft, ChevronDown, CircleChevronLeft, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"

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
    { label: 'Blogs', href: '/blog' },
    { label: 'Resources', href: '/resources' },
  ]


   const AURORA_COLORS = [
    "#00CC33",
    "#00AA2B",
    "#00EE3B",
    "#009928",
    "#00FF40",
  ]
const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)



  const color = useMotionValue(AURORA_COLORS[0])

  useEffect(() => {
    animate(color, AURORA_COLORS, {
      ease: "easeInOut",
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror",
    })
  }, [color,AURORA_COLORS])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 80%, #ffffff 50%, ${color})`

   const navigationItems = [
    {
      label: 'Products',
      hasDropdown: true,
      items: [
        { label: 'CarbonCalculator', href: '/calculator' },
        { label: 'CarbonLive', href: '/live' },
        { label: 'CarbonOffset', href: '/offset' },
        { label: 'CarbonToken', href: '/token' },
      ]
    },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Resources', href: '/resources' },
  ]
  return (
    <div>

   
        <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm" : "bg-transparent"
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
                height={64}
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
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


    </div>
  )
}

export default Header
