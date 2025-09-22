import React from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'

const footerSections = [
  {
    title: 'Useful Links',
    links: [
      { label: 'Content', href: '/content' },
      { label: 'How it Works', href: '/how-it-works' },
      { label: 'Create', href: '/create' },
      { label: 'Explore', href: '/explore' },
      { label: 'Terms & Services', href: '/terms' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Help Center', href: '/help-center' },
      { label: 'Partners', href: '/partners' },
      { label: 'Suggestions', href: '/suggestions' },
      { label: 'Blog', href: '/blog' },
      { label: 'Newsletters', href: '/newsletters' },
    ],
  },
  {
    title: 'Partner',
    links: [
      { label: 'Our Partner', href: '/our-partner' },
      { label: 'Become a Partner', href: '/become-partner' },
    ],
  },
]

const socialLinks = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
]

const CalculatorFooter = () => {
  return (
    <footer className="bg-tertiary py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <p className="text-white text-sm leading-relaxed">
              A new way to make the payments easy, reliable and secure.
            </p>
          </div>

          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-gray-200 font-semibold mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className="block text-white hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            Copyright © 2024 Insightful. All Rights Reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, idx) => (
              <Link
                key={idx}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CalculatorFooter
