"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { blogNineData } from '@/constants/blogs/blogNine-data'
import { blogEightData } from '@/constants/blogs/blogEight-data'
import { blogSevenData } from '@/constants/blogs/blogSeven-data'
import { blogTenData } from '@/constants/blogs/blogTen-data'
import { blogElevenData } from '@/constants/blogs/blogsEleven'

const blogs = [
  {
    image: blogElevenData.image || '/blogs/blogEleven.png',
    date: new Date(blogElevenData.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),

    readTime: blogElevenData.readTime,
    title: blogElevenData.title,
    slug: blogElevenData.slug,
  },
  {
    image: blogTenData.image || '/blogs/blogTen.png',
    date: new Date(blogTenData.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),

    readTime: blogTenData.readTime,
    title: blogTenData.title,
    slug: blogTenData.slug,
  }
  , {
    image: blogNineData.image || '/blogs/blogNine.png',
    date: new Date(blogNineData.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),

    readTime: blogNineData.readTime,
    title: blogNineData.title,
    slug: blogNineData.slug,
  },


];

const Blogs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getFlexBasis = (index: number) => {
    if (hoveredIndex === null) {
      return '33.333%'; // Equal width when no hover
    }
    if (index === hoveredIndex) {
      return '40%'; // Hovered card takes 40%
    }
    return '30%'; // Other two cards share 60% (30% each)
  };

  return (
    <div className='bg-[#fcfdf6] w-full '>
      <div className="w-full border-t border-dashed border-[#6c5f31]/30 mb-8"></div>

      <div className="w-full ">
        <div className="mx-auto max-w-8xl  px-20">
          <h2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#d1cebb] mb-16 leading-tight'>
            Latest Insights
          </h2>
        </div>

        <div className=' rounded-2xl w-full'>
          <div className='flex flex-col md:flex-row  w-full'>
            {blogs.map((blog, index) => (
              <Link
                href={`/blogs/${blog.slug}`}
                key={index}
                className=" flex-col gap-4 transition-all duration-700 ease-out cursor-pointer group block"
                style={{
                  flexBasis: typeof window !== 'undefined' && window.innerWidth >= 768 ? getFlexBasis(index) : 'auto',
                  flexShrink: 0
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="overflow-hidden relative aspect-[4/3] w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-contain transition-all duration-700 ease-out"
                  />
               
                </div>


                <div className='flex flex-col gap-2 px-2 sm:px-4'>
                  <div className='text-xs text-[#6c5f31]/80 flex flex-wrap items-center gap-2'>
                    <span>{blog.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-xs">{blog.readTime}</span>
                  </div>

                  <h3 className={`font-medium text-[#080c04] leading-tight transition-all duration-700 ${hoveredIndex === index
                    ? 'text-lg sm:text-xl lg:text-2xl'
                    : 'text-base sm:text-lg'
                    }`}>
                    {blog.title}
                  </h3>

                  {/* Expanding description on hover */}
                  <div className={`overflow-hidden transition-all duration-700 ease-out ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <p className="text-sm text-[#6c5f31]/70 leading-relaxed">
                      Read more about this article...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs