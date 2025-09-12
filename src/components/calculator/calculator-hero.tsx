"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  User } from 'lucide-react'

const CalculatorHero = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/calculator-hero.jpg"
          alt="Carbon Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gray-900/70" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="CarbonCut Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-white text-xl font-bold tracking-wide">CARBONCUT</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-white hover:text-cyan-400 transition-colors text-sm">
            Features
          </Link>
          <Link href="/about" className="text-white hover:text-cyan-400 transition-colors text-sm">
            About
          </Link>
          <Link href="/blog" className="text-white hover:text-cyan-400 transition-colors text-sm">
            Blog
          </Link>
          <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors text-sm">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/calculator" className="text-white hover:text-cyan-400 transition-colors text-sm">
            Calculator
          </Link>
          <Button asChild className="bg-[#1F4960] hover:bg-blue-800 text-white px-6 py-2 text-sm rounded-none">
            <Link href="/login" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </Button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh)] px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold  text-cyan-400 mb-8 max-w-5xl leading-tight">
          Get The Latest <span className="text-cyan-400">Insights</span>
        </h1>
        
        <p className="text-lg text-gray-300 mb-12 max-w-3xl leading-relaxed">
          Explore the latest trends, metrics, and technologies to accurately calculate and minimize 
          your marketing emissions from digital campaigns to physical collateral.
        </p>

        <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
          <Input
            type="text"
            placeholder="Search articles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-14 bg-white border-0 text-gray-900 placeholder-gray-500 rounded-none text-base"
          />
          <Button 
            type="submit" 
            className="h-14 px-8 bg-[#1F4960] hover:bg-blue-800 border-0 rounded-none text-white"
          >
            <span className="mr-2">Search</span>
            <span>→</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CalculatorHero