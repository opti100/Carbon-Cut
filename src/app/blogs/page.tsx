import BlogDashboard from '@/components/blog/BlogDashboard'
import LenisSmoothScroll from '@/components/LenisSmoothScroll'
import Footer from '@/components/main/Footer'
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
