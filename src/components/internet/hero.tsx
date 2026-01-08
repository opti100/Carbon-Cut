'use client'

import { motion } from 'motion/react'
import CardNav from '../CardNav'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { navData } from '../NavData'
import AnimatedHeroText from '../main/AnimatedHeroText'

export function InternetHero() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8  w-full min-h-[90vh] overflow-hidden">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <video
          src="/Internet.mp4"
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content (single column, centered) */}
      <div className="relative z-10 flex items-center min-h-screen ">
        <div className="w-full max-w-[1400px] mx-auto">
       
          <h1 className="text-white text-4xl md:text-5xl font-semibold leading-tight text-left ">
            The easiest way to become a net-zero Internet Company.
          </h1>

          <div className="mt-10 flex gap-4 ">
            <div className="nav-right-section">
              <Link href="/internet/internet-ads" className="desktop-cta-link">
                <button
                  type="button"
                  className="card-nav-cta-button"
                  style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                >
                  Internet Ads
                </button>
              </Link>
            </div>

            <div className="nav-right-section">
              <Link href="/internet/web-&-apps" className="desktop-cta-link">
                <button
                  type="button"
                  className="card-nav-cta-button"
                  style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                >
                  Web & Apps
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
