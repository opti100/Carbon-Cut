"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Clock, User, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { blogPosts, getAllCategories, BlogPost } from '@/constants/blogData';
import PreFooter from '../main/PreFooter';
import { Footer } from 'react-day-picker';

const BlogDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const categories = ['All', ...getAllCategories()];

  // Filter posts based on search and category
  React.useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory]);

  const BlogCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300 group-hover:scale-[1.02]">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={post.image || '/blogs/blogsOne.png'}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
           
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
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
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div> */}
              <span className="text-sm text-gray-700">{post.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1 hover:text-orange-600 font-medium text-sm group-hover:gap-2 group-hover:text-orange-600 transition-all">
              Read More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          

        </CardContent>
      </Card>
    </Link>
  );



  // Show all filtered posts in the latest articles section

  return (
    <div className="min-h-screen  mt-12">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* <Filter className="w-5 h-5 text-gray-500" /> */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Articles
              {selectedCategory !== 'All' && (
                <span className="text-orange-500"> in {selectedCategory}</span>
              )}
            </h2>
            <span className="text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No articles found</div>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogDashboard;