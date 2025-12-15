// Blog data management - Modular blog post structure
export interface BlogPost {
  id: string;
  slug: string; // URL slug for routing
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  readTime: string;
  image?: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  content?: React.ReactNode;
}


// Import blog data from individual files
import { blogOneData } from './blogs/blogone-data';
import { blogTwoData } from './blogs/blogtwo-data';
import { blogFourData } from './blogs/blogfour-data';
import { blogFiveData } from './blogs/blogfive-data';
import { blogThreeeData } from './blogs/blogthree-data';
import { blogSixData } from './blogs/blogsix-data';
import { blogSevenData } from './blogs/blogSeven-data';
import { blogEightData } from './blogs/blogEight-data';
import { blogNineData } from './blogs/blogNine-data';
import { blogTenData } from './blogs/blogTen-data';
import { blogElevenData } from './blogs/blogsEleven';
import { blogTwelveData } from './blogs/blogsTwelve-data';
import { blogThirteenData } from './blogs/blogThirteen-data';
import { blogFourteenData } from './blogs/blogFourteen-data';
import { blogFifteenData } from './blogs/blogFiveteen-data';
import { blogSixteenData } from './blogs/blogSixteen-data';
import { blogSeventeenData } from './blogs/blogSeventeen-data';
import { blogEighteenData } from './blogs/blogEighteen-data';



// Blog posts data
export const blogPosts: BlogPost[] = [
  blogOneData,
  blogTwoData,
  blogThreeeData,
  blogFourData,
  blogFiveData,
  blogSixData,
  blogSevenData,
  blogEightData,
  blogNineData,
  blogTenData,
  blogElevenData,
  blogTwelveData,
  blogThirteenData,
  blogFourteenData,
  blogFifteenData,
  blogSixteenData,
  blogSeventeenData,
  blogEighteenData
];

// Utility functions for blog data
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);
export const getPostBySlug = (slug: string) => blogPosts.find(post => post.slug === slug);
export const getPostsByCategory = (category: string) => blogPosts.filter(post => post.category === category);
export const getAllCategories = () => [...new Set(blogPosts.map(post => post.category))];