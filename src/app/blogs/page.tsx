import BlogDashboard from '@/components/blog/BlogDashboard'
import Header from '@/components/calculator/Header'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/NewLanding/Footer'
import Navbar from '@/components/NewLanding/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <LenisSmoothScroll>
      <BlogDashboard />
      <Footer />
      </LenisSmoothScroll>
    </div>
  )
}

export default page
