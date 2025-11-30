import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { User } from 'lucide-react'

const CalculatorNav = () => {
  return (
    <div className="relative  bg-gray-900 overflow-hidden">
          {/* <div className="absolute inset-0">
            <Image
              src="/hero.jpg"
              alt="Carbon Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gray-900/70" />
          </div>
     */}
          <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="CarbonCut Logo"
                width={196}
                height={20}
                // className="w-48 h-48"
              />
            
            </div>
    
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-white hover:text-cyan-400 transition-colors text-sm">
                How it works
              </Link>
              <Link href="/about" className="text-white hover:text-cyan-400 transition-colors text-sm">
                Marketplace
              </Link>
              <Link href="/blogs" className="text-white hover:text-cyan-400 transition-colors text-sm">
                Blog
              </Link>
              <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors text-sm">
                About
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
    
        </div>
  )
}

export default CalculatorNav
