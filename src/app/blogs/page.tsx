import BlogDashboard from '@/components/blog/BlogDashboard'
import Header from '@/components/calculator/Header'
import Footer from '@/components/main/Footer'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header />
      <BlogDashboard />
      <Footer />
    </div>
  )
}

export default page
