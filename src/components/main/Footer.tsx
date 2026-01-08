'use client'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Link004 } from './ui/skiper-ui/skiper40'
import { useLenis } from 'lenis/react'

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)

  const [logoOffset, setLogoOffset] = useState(0)
  const [linksOffset, setLinksOffset] = useState(0)
  const [socialOffset, setSocialOffset] = useState(0)

  useLenis(() => {
    if (!footerRef.current) return

    const rect = footerRef.current.getBoundingClientRect()
    const scrollProgress = rect.top / window.innerHeight

    setLogoOffset(-scrollProgress * 120)
    setLinksOffset(-scrollProgress * 80)
    setSocialOffset(-scrollProgress * 50)
  })

  return (
    <footer
      ref={footerRef}
      className="w-full min-h-screen relative overflow-hidden bg-black backdrop-blur-3xl"
    >
      {/* ThreeScene Background */}
      <div className="absolute inset-0 z-0 ">{/* <ThreeScene /> */}</div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Links Section with Parallax */}
        <div
          ref={linksRef}
          style={{
            transform: `translateY(${linksOffset}px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="flex items-start lg:justify-between justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-start text-left space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">
                Useful Links
              </h3>
              <div className="space-y-1.5 md:space-y-2 flex flex-col items-start">
                <Link004
                  href="/content"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Content
                </Link004>
                <Link004
                  href="/how-it-works"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  How it Works
                </Link004>
                <Link004
                  href="/create"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Create
                </Link004>
                <Link004
                  href="/explore"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Explore
                </Link004>
                <Link004
                  href="/terms"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Terms & Services
                </Link004>
              </div>
            </div>

            <div className="flex flex-col items-start text-left space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">Community</h3>
              <div className="space-y-1.5 md:space-y-2 flex flex-col items-start">
                <Link004
                  href="/help-center"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Help Center
                </Link004>
                <Link004
                  href="/partners"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Partners
                </Link004>
                <Link004
                  href="/suggestions"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Suggestions
                </Link004>
                <Link004
                  href="/blog"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Blog
                </Link004>
                <Link004
                  href="/newsletters"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Newsletters
                </Link004>
              </div>
            </div>

            <div className="flex flex-col items-start text-left space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-white">Partner</h3>
              <div className="space-y-1.5 md:space-y-2 flex flex-col items-start">
                <Link004
                  href="/our-partner"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Our Partner
                </Link004>
                <Link004
                  href="/become-partner"
                  className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                >
                  Become a Partner
                </Link004>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons with Parallax */}
        <div
          ref={socialRef}
          style={{
            transform: `translateY(${socialOffset}px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between py-4 md:py-6 gap-4"
        >
          <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
            <a
              href="https://www.instagram.com/carboncut.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61580263412275"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="https://x.com/CarbonCut_co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/carboncut-co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>

        {/* Logo with Parallax */}
        <div
          ref={logoRef}
          style={{
            transform: `translateY(${logoOffset}px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12"
        >
          <Image
            src="/CarbonCut-fe/cc-croped.svg"
            alt="CarbonCut Logo"
            width={1200}
            height={400}
            className="w-full h-auto object-contain max-w-full inverted-colors:invert"
            style={{ maxHeight: '400px', filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
