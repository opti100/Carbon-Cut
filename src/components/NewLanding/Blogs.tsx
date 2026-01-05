"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UniversalHeading from "../UniversalHeading";
import { blogTwentyOneData } from "@/constants/blogs/blogTwentyOne-data";
import { blogTwentyData } from "@/constants/blogs/blogTwenty-data";
import { blogNineteenData } from "@/constants/blogs/blogNineteen-data";

const blogs = [
  {
    image: blogTwentyOneData.image || "/blogs/blogThirteen.png",
    date: new Date(blogTwentyOneData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogTwentyOneData.readTime,
    title: blogTwentyOneData.title,
    slug: blogTwentyOneData.slug,
  },
  {
    image: blogTwentyData.image || "/blogs/blogTwelve.png",
    date: new Date(blogTwentyData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogTwentyData.readTime,
    title: blogTwentyData.title,
    slug: blogTwentyData.slug,
  },
  {
    image: blogNineteenData.image || "/blogs/blogFourteen.png",
    date: new Date(blogNineteenData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: blogNineteenData.readTime,
    title: blogNineteenData.title,
    slug: blogNineteenData.slug,
  },
];

const Blogs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#fcfdf6] w-full pt-20">
      {/* TOP BORDER */}
      <div className="w-full border-t border-dashed border-[#6c5f31]/30 mb-12"></div>
      <UniversalHeading title=" Get Latest Insights" description="Blogs" align="right" />
    

      {/* ---------- BLOG CARDS (FULL WIDTH) ---------- */}
      <div className="w-full ">
        <div className="flex flex-col md:flex-row w-full ">
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
                <div className="overflow-hidden relative aspect-[4/3] w-full rounded-xl">
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
  );
};

export default Blogs;
