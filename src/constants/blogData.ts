// Blog data management - Modular blog post structure
export interface BlogPost {
  id: string;
  slug: string; // URL slug for routing
  category: string;
  title: string;
  excerpt: string;
  content?: string; // Full content for individual pages
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  readTime: string;
  image?: string;
  featured?: boolean;
}

// Import blog data from individual files
import { blogOneData } from './blogs/blogone-data';

// Blog posts data
export const blogPosts: BlogPost[] = [
  blogOneData
];

// Utility functions for blog data
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);
export const getPostBySlug = (slug: string) => blogPosts.find(post => post.slug === slug);
export const getPostsByCategory = (category: string) => blogPosts.filter(post => post.category === category);
export const getAllCategories = () => [...new Set(blogPosts.map(post => post.category))];