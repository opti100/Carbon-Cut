"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost, blogPosts } from '@/constants/blogData';
import { BlogOneContent } from '@/constants/blogs/blogone-data';
import Header from '@/components/calculator/Header';
import Footer from '@/components/main/Footer';
import PreFooter from '../main/PreFooter';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  // Get related posts from the same category
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-8">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium text-gray-800 mb-3 mt-6">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-600 mb-2 ml-4">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-600 leading-relaxed mb-4">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/blog" 
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
          
          {/* Share Button */}
        
        </header>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 w-full mb-12 rounded-xl overflow-hidden">
          <Image
            src={post.image || '/articles/article1.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.slug === 'marketing-carbon-emissions-missing-kpi' ? (
            <BlogOneContent />
          ) : post.content ? (
            <div className="text-lg leading-relaxed">
              {formatContent(post.content)}
            </div>
          ) : (
            <div className="text-gray-600 leading-relaxed space-y-6">
              <p>
                This comprehensive guide explores the various ways marketing activities contribute to carbon emissions 
                and provides actionable strategies for reduction. From digital advertising to print materials, 
                every aspect of your marketing efforts has an environmental impact.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Understanding Marketing Emissions</h2>
              <p>
                Marketing emissions come from various sources including digital advertising servers, data centers, 
                print materials, packaging, events, video production, and travel. Understanding these sources is 
                the first step toward reduction.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Measurement Strategies</h2>
              <p>
                To effectively reduce your marketing carbon footprint, you need accurate measurement tools and 
                methodologies. This includes tracking energy consumption, material usage, and digital waste across 
                all marketing channels.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Implementation Steps</h2>
              <p>
                Start with a comprehensive audit of your current marketing activities, identify high-impact areas 
                for improvement, implement sustainable alternatives, and continuously monitor your progress through 
                established KPIs and metrics.
              </p>
            </div>
          )}
        </div>



        {/* Author Bio */}


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
                        src={relatedPost.image || '/articles/article1.jpg'}
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