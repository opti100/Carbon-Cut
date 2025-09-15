"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-blue-800" />
      
      {/* Grass texture at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Make your inbox a little{' '}
          <span className="text-green-300">greener!</span>
        </h2>
        
        <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Get the latest insights and tips with inspiring stories designed straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-14 bg-white border-0 text-gray-900 placeholder-gray-500 text-base"
          />
          <Button type="submit" className="h-14 px-8 bg-blue-700 hover:bg-blue-800 text-white font-medium">
            Join now →
          </Button>
        </form>
      </div>
    </section>
  )
} 

export default Newsletter
