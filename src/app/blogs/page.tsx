import BlogDashboard from '@/components/blog/BlogDashboard'
import Header from '@/components/calculator/Header'
import Footer from '@/components/main/Footer'
import Navbar from '@/components/NewLanding/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
      <BlogDashboard />
      <Footer />
    </div>
  )
}

export default page
