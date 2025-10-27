"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { BlogPost, blogPosts } from '@/constants/blogData';
import { BlogOneContent } from '@/constants/blogs/blogone-data';
import Header from '@/components/calculator/Header';
import Footer from '@/components/main/Footer';
import PreFooter from '../main/PreFooter';
import { BlogTwoContent } from '@/constants/blogs/blogtwo-data';
import { BlogThreeContent } from '@/constants/blogs/blogthree-data';
import { BlogFourContent } from '@/constants/blogs/blogfour-data';

// Blog content component mapping
const blogContentComponents: Record<string, React.ComponentType> = {
  '1': BlogOneContent,
  '2': BlogTwoContent,
  '3': BlogThreeContent,
  '4': BlogFourContent
  // Add future blog components here:
  // 'future-blog-slug': BlogTwoContent,
};

interface BlogPostPageProps {
  post: BlogPost;
}



const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  // Get related posts from the same category
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);



  return (
    <div className="min-h-screen bg-white ">
      <Header />
      
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Back Button */}
        <div className="mb-2 -mt-6">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
         {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              {/* <User className="w-5 h-5" /> */}
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
          </div>

        </header>

        {/* Featured Image */}
      <div className="relative w-full mb-12 rounded-xl overflow-hidden">
  <div className="aspect-video relative"> {/* 16:9 aspect ratio */}
    <Image
      src={post.image || '/blogs/blogsOne.png'}
      alt={post.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
    />
  </div>
</div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {(() => {
            const BlogComponent = blogContentComponents[post.slug];
            return BlogComponent ? <BlogComponent /> : <div>Blog content not found</div>;
          })()}
        </div>


        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300">
                    <div className="relative h-32 w-full">
                      <Image
                        src={relatedPost.image || '/blogs/blogsOne.png'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

      
      </article>
      <PreFooter/>
      <Footer />
    </div>
  );
};

export default BlogPostPage;