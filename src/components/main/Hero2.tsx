"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input'
import Image from 'next/image'

const Hero2 = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <section className="bg-black py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%)',
          }}
        >
          <div className="absolute inset-0">
            <Image
              src="/hero2.jpg"
              fill
              alt="Green nature background"
              className="w-full h-full  "
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Make your inbox a little{' '}
                <span className="text-cyan-400">greener!</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
                Get monthly news along with inspiring stories delivered straight
                to your inbox
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
              >
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 bg-white border-0 text-gray-900 placeholder-gray-500 rounded-none text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-none font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Join now
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-green-300/20 rounded-full"></div> */}
        </div>
      </div>
    </section>
  )
}

export default Hero2
