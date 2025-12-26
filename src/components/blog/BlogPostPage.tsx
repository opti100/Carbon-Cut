"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { BlogPost, blogPosts } from '@/constants/blogData';
import { BlogOneContent } from '@/constants/blogs/blogone-data';
import Footer from '../NewLanding/Footer';
import PreFooter from '../NewLanding/PreFooter';
import { BlogTwoContent } from '@/constants/blogs/blogtwo-data';
import { BlogThreeContent } from '@/constants/blogs/blogthree-data';
import { BlogFourContent } from '@/constants/blogs/blogfour-data';
import { blogFiveContent } from '@/constants/blogs/blogfive-data';
import { BlogSixContent } from '@/constants/blogs/blogsix-data';
import { BlogSevenContent } from '@/constants/blogs/blogSeven-data';
import { BlogEightContent } from '@/constants/blogs/blogEight-data';
import { BlogNineContent } from '@/constants/blogs/blogNine-data';
import { BlogTenContent } from '@/constants/blogs/blogTen-data';
import Navbar from '../NewLanding/Navbar';
import { BlogElevenContent } from '@/constants/blogs/blogsEleven';
import { BlogTwelveContent } from '@/constants/blogs/blogsTwelve-data';
import { BlogThirteenContent } from '@/constants/blogs/blogThirteen-data';
import { BlogFourteenContent } from '@/constants/blogs/blogFourteen-data';
import { BlogFifteenContent } from '@/constants/blogs/blogFiveteen-data';
import { BlogSixteenContent } from '@/constants/blogs/blogSixteen-data';
import { BlogSeventeenContent } from '@/constants/blogs/blogSeventeen-data';
import { BlogEighteenContent } from '@/constants/blogs/blogEighteen-data';
import { BlogNineteenContent } from '@/constants/blogs/blogNineteen-data';
import CardNav from '../CardNav';
import { navData } from '../NavData';
import { BlogTwentyContent } from '@/constants/blogs/blogTwenty-data';
import { BlogTwentyOneContent } from '@/constants/blogs/blogTwentyOne-data';
import LenisSmoothScroll from '../LenisSmoothScroll';


// Blog content component mapping
const blogContentComponents: Record<string, React.ComponentType> = {
  'how-marketing-is-killing-the-world-one-ad-at-a-time-and-what-to-do-about-it': BlogOneContent,
  'carboncut-launches-worlds-first-climartech-platform': BlogTwoContent,
  'introducing-carboncut-fast-accurate-authorised-real-time-marketing': BlogThreeContent,
  'add-a-carbon-column-to-your-media-plan': BlogFourContent,
  'are-sustainability-experts-still-experts-if-they-cant-measure-internet-emissions': blogFiveContent,
  'ai-hidden-emissions-why-the-next-era-of-innovation-needs-carbon-intelligence': BlogSixContent,
  'carbon-footprint-calculator-2-0': BlogSevenContent,
  'how-carbon-tech-international-limited-is-redefining-real-time-carbon-intelligence-through-carboncut': BlogEightContent,
  'the-science-behind-real-time-carbon-tracking': BlogNineContent,
  'your-carbon-footprint-calculator-is-lying-to-you': BlogTenContent,
  'real-time-carbon-data-competitive-advantage': BlogElevenContent,
  'google-space-data-centres-carbon-measurement': BlogTwelveContent,
  'the-carbon-illusion-why-companies-think-theyre-greener': BlogThirteenContent,
  'before-you-calculate-your-carbon-footprint': BlogFourteenContent,
  'what-is-real-time-carbon-intelligence': BlogFifteenContent,
  'fastest-way-reduce-carbon-emissions-real-time-tracking': BlogSixteenContent,
  'difference-between-real-time-carbon-data-annual-esg-reporting': BlogSeventeenContent,
  'real-time-carbon-tracking-replace-annual-reports':BlogEighteenContent,
  'real-time-visibility-missing-layer-carbon-accounting':BlogNineteenContent,
  'massive-carbon-cost-unseen-emissions':BlogTwentyContent,
  'how-to-calculate-carbon-footprint-in-minutes': BlogTwentyOneContent
  // Add future blog components here:
  // 'future-blog-slug': BlogTwoContent,
};
 
interface BlogPostPageProps {
  post: BlogPost;
}



const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CarbonCut',
    },
  };

  // Get related posts from the same category
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);



  return (
    <>
    <LenisSmoothScroll> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white ">
        {/* <Navbar /> */}

         <div className="absolute top-0 left-0 right-0 z-20">
        <CardNav
          logo="/CarbonCut-fe/CC.svg"
          logoAlt="CarbonCut Logo"
          items={navData}
          baseColor="rgba(255, 255, 255, 0.1)"
          menuColor="#080c04"
          buttonBgColor="#b0ea1d"
          buttonTextColor="#080c04"
        />
      </div>


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
          <div className="relative w-full mb-12">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[620px] rounded-xl overflow-hidden">
              <Image
                src={post.image || "/blogs/blogsOne.png"}
                alt={post.title}
                fill
                className="object-cover"
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
        <PreFooter />
        <Footer />
      </div>
      </LenisSmoothScroll>
    </>
  );
};

export default BlogPostPage;