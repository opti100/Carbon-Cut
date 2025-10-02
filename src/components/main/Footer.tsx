import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* <Image
                src="/logo.svg"
                alt="CarbonCut Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              /> */}
              {/* <span className="text-white text-xl font-bold">CARBONCUT</span> */}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A new way to make the payments easy, reliable and secure.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Useful Links</h3>
            <div className="space-y-3">
              <Link href="/content" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Content
              </Link>
              <Link href="/how-it-works" className="block text-gray-400 hover:text-white transition-colors text-sm">
                How it Works
              </Link>
              <Link href="/create" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Create
              </Link>
              <Link href="/explore" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Explore
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Terms & Services
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="space-y-3">
              <Link href="/help-center" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Help Center
              </Link>
              <Link href="/partners" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Partners
              </Link>
              <Link href="/suggestions" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Suggestions
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Blog
              </Link>
              <Link href="/newsletters" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Newsletters
              </Link>
            </div>
          </div>

          {/* Partner */}
          <div>
            <h3 className="text-white font-semibold mb-4">Partner</h3>
            <div className="space-y-3">
              <Link href="/our-partner" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Our Partner
              </Link>
              <Link href="/become-partner" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            Copyright 2025-26 @Optiminastic SG PTE LTD & Optiminastic UK Limited
          </p>
          
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer