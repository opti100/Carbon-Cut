"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { blogPosts, getAllCategories, BlogPost } from "@/constants/blogData";

const colors = {
  text: "#080c04",
  background: "#fcfdf6",
  primary: "#b0ea1d",
  secondary: "#6c5f31",
  accent: "#F0db18",
  tint: "#d1cebb",
};

const BlogDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // Prepare Popular Posts
  const popularPosts = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Search Filter Logic
  useEffect(() => {
    let filtered = [...blogPosts];

    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery]);

  // Blog Card Reusable Component
  const BlogCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <Card className="h-full rounded-xl overflow-hidden border border-gray-200 hover:border-[#b0ea1d] hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image || "/blogs/blogsOne.png"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6c5f31] transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800">
              {post.author.name}
            </span>

            <div className="flex items-center gap-1 text-sm font-medium group-hover:text-[#6c5f31] transition-all group-hover:gap-2">
              Read More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div
      className="min-h-screen mt-16"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* ----------------------------- SECTION 1: LATEST INSIGHTS ----------------------------- */}
        <div className="text-center mb-16">
         

          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: colors.text }}>
            Get The Latest Insights
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Explore the latest trends, metrics, and technologies to accurately calculate and minimize your marketing emissions.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b0ea1d] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* ----------------------------- SECTION 2: POPULAR ARTICLES ----------------------------- */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: BIG FEATURED CARD */}
            <div className="lg:col-span-2 space-y-8">
              {/* FIRST CARD */}
              <Link href={`/blogs/${popularPosts[0].slug}`} className="group block">
                <div className="relative h-[340px] rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all">

                  {/* IMAGE */}
                  <Image
                    src={popularPosts[0].image || "/blogs/blogsOne.png"}
                    alt={popularPosts[0].title}
                    fill
                    className="object-contain "
                  />

                  {/* HIDDEN TEXT → APPEARS ON HOVER */}
                  <div className="
        absolute inset-0 
        bg-gradient-to-t from-black/70 to-transparent 
        opacity-0 group-hover:opacity-100 
        translate-y-6 group-hover:translate-y-0
        transition-all duration-500 ease-out 
        p-6 flex flex-col justify-end
      ">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {popularPosts[0].title}
                    </h3>
                    <p className="text-gray-200 line-clamp-2">
                      {popularPosts[0].excerpt}
                    </p>
                  </div>
                </div>
              </Link>


              {/* SECOND CARD */}
              <Link href={`/blogs/${popularPosts[1].slug}`} className="group block">
                <div className="relative h-[340px] rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all">

                  {/* IMAGE */}
                  <Image
                    src={popularPosts[1].image || "/blogs/blogsOne.png"}
                    alt={popularPosts[1].title}
                    fill
                    className="object-contain "
                  />

                  {/* HIDDEN TEXT → APPEARS ON HOVER */}
                  <div className="
        absolute inset-0 
        bg-gradient-to-t from-black/70 to-transparent 
        opacity-0 group-hover:opacity-100 
        translate-y-6 group-hover:translate-y-0 
        transition-all duration-500 ease-out
        p-6 flex flex-col justify-end
      ">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {popularPosts[1].title}
                    </h3>
                    <p className="text-gray-200 line-clamp-2">
                      {popularPosts[1].excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>


            {/* RIGHT: STACK OF SMALL CARDS */}
            <div className="flex flex-col gap-6">
              {popularPosts.slice(1, 6).map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="group flex gap-4 border border-gray-200 rounded-xl p-4 hover:border-[#b0ea1d] hover:shadow-sm transition-all"
                >
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={post.image || "/blogs/blogsOne.png"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#6c5f31] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------------------- SECTION 3: LATEST ARTICLES ----------------------------- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>

          {filteredPosts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No articles found</p>
              <p className="text-gray-400">Try adjusting your search keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDashboard;
