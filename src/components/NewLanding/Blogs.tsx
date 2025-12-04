"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { blogNineData } from "@/constants/blogs/blogNine-data";
import { blogTenData } from "@/constants/blogs/blogTen-data";
import { blogElevenData } from "@/constants/blogs/blogsEleven";

const blogs = [
  {
    image: blogElevenData.image || "/blogs/blogEleven.png",
    date: new Date(blogElevenData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogElevenData.readTime,
    title: blogElevenData.title,
    slug: blogElevenData.slug,
  },
  {
    image: blogTenData.image || "/blogs/blogTen.png",
    date: new Date(blogTenData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogTenData.readTime,
    title: blogTenData.title,
    slug: blogTenData.slug,
  },
  {
    image: blogNineData.image || "/blogs/blogNine.png",
    date: new Date(blogNineData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogNineData.readTime,
    title: blogNineData.title,
    slug: blogNineData.slug,
  },
];

const Blogs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#fcfdf6] w-full pt-20">
      {/* TOP BORDER */}
      <div className="w-full border-t border-dashed border-[#6c5f31]/30 mb-12"></div>

      {/* FULL WIDTH CONTAINER (same as IMPACT) */}
      <div className="mx-auto max-w-7xl w-full px-6">
        {/* ---------- HEADING (Perfectly aligned like IMPACT) ---------- */}
        <div className="text-right">
          <p className="text-secondary/60 text-xs sm:text-sm uppercase tracking-wider">
            Blogs
          </p>

          <h2
            className="
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold tracking-tight 
              text-[#d1cebb] mb-12
            "
          >
            Get Latest Insights
          </h2>
        </div>

        {/* ---------- BLOG CARDS ---------- */}
        <div className="rounded-2xl w-full">
          <div className="flex flex-col md:flex-row w-full">
            {blogs.map((blog, index) => {
              const isActive = hoveredIndex === index;

              return (
                <Link
                  href={`/blogs/${blog.slug}`}
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    flex flex-col gap-4 transition-all duration-700 ease-out cursor-pointer group
                    md:flex-shrink-0
                    ${
                      hoveredIndex === null
                        ? "md:basis-1/3"
                        : isActive
                        ? "md:basis-[40%]"
                        : "md:basis-[30%]"
                    }
                  `}
                >
                  {/* Image */}
                  <div className="overflow-hidden relative aspect-[4/3] w-full">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-contain transition-all duration-700 ease-out"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2 px-2 sm:px-4">
                    <div className="text-xs text-[#6c5f31]/80 flex flex-wrap items-center gap-2">
                      <span>{blog.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{blog.readTime}</span>
                    </div>

                    <h3
                      className={`
                        font-medium text-[#080c04] leading-tight transition-all duration-700
                        ${isActive ? "text-lg sm:text-xl lg:text-2xl" : "text-base sm:text-lg"}
                      `}
                    >
                      {blog.title}
                    </h3>

                    {/* Expandable description */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-700 ease-out
                        ${isActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <p className="text-sm text-[#6c5f31]/70 leading-relaxed">
                        Read more about this article...
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
