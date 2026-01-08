# Blog Management Guide

This guide explains how to add new blog posts to the CarbonCut blog system.

## Current File Structure

```
src/constants/
├── blogData.ts                    # Main blog data file (imports all blogs)
└── blogs/
    ├── blogone-data.tsx          # First blog post with React content
    └── README.md                 # This guide
```

## Current Blog System

The current system uses only one blog post (`blogone-data.tsx`) which contains:

- A React component (`BlogOneContent`) for rich content formatting
- Blog metadata (`blogOneData`) exported as a `BlogPost` object

## How to Add a New Blog Post

### Step 1: Create the Blog File

1. Create a new file in `src/constants/blogs/` named `blog[name]-data.tsx` (e.g., `blogtwo-data.tsx`)
2. Use this structure following the current pattern:

```typescript
import React from 'react';
import { BlogPost } from '../blogData';
import Link from 'next/link';

export const BlogTwoContent = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-900">
      <p className="text-xl leading-relaxed mb-6">
        Your blog content here with proper React JSX formatting...
      </p>
      {/* Add more content with proper HTML structure */}
    </div>
  );
};

export const blogTwoData: BlogPost = {
  id: '2',
  slug: 'your-blog-slug',
  category: 'Your Category',
  title: 'Your Blog Title',
  excerpt: 'Brief description of your blog post',
  date: '2025-10-01',
  author: {
    name: 'Author Name',
    avatar: '/people/person1.jpg'
  },
  readTime: '5 min read',
  image: '/blogs/yourImage.png',
  featured: false
};
```

### Step 2: Import in blogData.ts

1. Open `src/constants/blogData.ts`
2. Add the import at the top:
   ```typescript
   import { blogTwoData } from './blogs/blogtwo-data'
   ```
3. Add it to the blogPosts array:
   ```typescript
   export const blogPosts: BlogPost[] = [
     blogOneData,
     blogTwoData, // Add your new blog here
   ]
   ```

### Step 3: Update Blog Components

1. Open `src/components/blog/BlogPostPage.tsx`
2. Import your new content component:
   ```typescript
   import { BlogTwoContent } from '@/constants/blogs/blogtwo-data'
   ```
3. Add it to the content rendering logic where `BlogOneContent` is used

### Step 4: Add Images

1. Add your blog image to `public/blogs/` (not `public/articles/`)
2. Update the `image` field in your blog post to reference it

## Blog Post Properties

- **id**: Unique identifier (use sequential numbers)
- **slug**: URL-friendly version (e.g., 'my-blog-post' → `/blog/my-blog-post`)
- **category**: Blog category (creates filter tags)
- **title**: Full blog post title
- **excerpt**: Short description (shows on cards and social media)
- **date**: Publication date (YYYY-MM-DD format)
- **author**: Author information with name and optional avatar
- **readTime**: Estimated reading time (e.g., '5 min read')
- **image**: Blog post image path (should be in `/blogs/` directory)
- **featured**: Set to `true` to make it stand out (optional)

## Content Formatting

Content should be created as React components with proper JSX formatting:

- Use semantic HTML elements (`<h2>`, `<p>`, `<div>`, etc.)
- Apply Tailwind CSS classes for styling
- Use the `prose` classes for consistent typography
- Include proper accessibility attributes

## Important Notes

- Images should be stored in `public/blogs/` directory
- Content is rendered as React components, not markdown
- The blog system currently supports one active blog post
- All styling should use Tailwind CSS classes
- Test your blog post by visiting `/blog/your-slug` after adding it

## Current Active Blog

- **Slug**: `marketing-carbon-emissions-missing-kpi`
- **Title**: "How Marketing Is Killing the World One Ad at a Time (And What To Do About It)"
- **Image**: `/blogs/blogsOne.png`
