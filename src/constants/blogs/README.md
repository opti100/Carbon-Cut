# Blog Management Guide

This guide explains how to add new blog posts to the CarbonCut blog system.

## File Structure

```
src/constants/
├── blogData.ts          # Main blog data file (imports all blogs)
└── blogs/
    ├── blogone.ts       # First blog post
    ├── blogtwo.ts       # Template for second blog post
    └── ...              # Future blog posts
```

## How to Add a New Blog Post

### Step 1: Create the Blog File

1. Create a new file in `src/constants/blogs/` named `blog[name].ts` (e.g., `blogthree.ts`)
2. Copy the template from `blogtwo.ts` or use this structure:

```typescript
import { BlogPost } from '../blogData';

export const blogThree: BlogPost = {
  id: '3',
  slug: 'your-blog-slug',
  category: 'Your Category',
  title: 'Your Blog Title',
  excerpt: 'Brief description of your blog post',
  content: `
# Your Blog Title

Your full blog content here using markdown-style formatting.

## Section 1
Content here...

## Section 2  
More content...
  `,
  date: '2025-10-01',
  author: {
    name: 'Author Name',
    avatar: '/people/person1.jpg'
  },
  readTime: '5 min read',
  image: '/articles/article3.jpg',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  featured: false
};
```

### Step 2: Import in blogData.ts

1. Open `src/constants/blogData.ts`
2. Add the import at the top:
   ```typescript
   import { blogThree } from './blogs/blogthree';
   ```
3. Add it to the blogPosts array:
   ```typescript
   export const blogPosts: BlogPost[] = [
     blogOne,
     blogTwo,
     blogThree, // Add your new blog here
   ];
   ```

### Step 3: Add to Static Generation

1. Open `src/app/blog/[slug]/page.tsx`
2. Add your slug to the `generateStaticParams` function:
   ```typescript
   export async function generateStaticParams() {
     return [
       { slug: 'one' },
       { slug: 'two' },
       { slug: 'your-blog-slug' }, // Add your slug here
     ];
   }
   ```

### Step 4: Add Images (Optional)

1. Add your blog image to `public/articles/`
2. Update the `image` field in your blog post to reference it

## Blog Post Properties

- **id**: Unique identifier (use sequential numbers)
- **slug**: URL-friendly version (e.g., 'my-blog-post' → `/blog/my-blog-post`)
- **category**: Blog category (creates filter tags)
- **title**: Full blog post title
- **excerpt**: Short description (shows on cards and social media)
- **content**: Full blog content (supports markdown-style formatting)
- **date**: Publication date (YYYY-MM-DD format)
- **author**: Author information with name and optional avatar
- **readTime**: Estimated reading time (e.g., '5 min read')
- **image**: Blog post image path (optional)
- **tags**: Array of relevant tags for filtering
- **featured**: Set to `true` to make it stand out (optional)

## Content Formatting

The `content` field supports simple markdown-like formatting:
- `# Title` → Large heading
- `## Section` → Medium heading  
- `### Subsection` → Small heading
- `- Item` → Bullet point
- Regular paragraphs are automatically formatted

## Categories and Tags

Choose appropriate categories and tags to help users find your content:
- **Categories**: Broad topics (Digital Marketing, Analytics, etc.)
- **Tags**: Specific keywords (SEO, Campaign Optimization, etc.)

## Tips

- Keep excerpts under 160 characters for better SEO
- Use descriptive, SEO-friendly slugs
- Estimate reading time: ~200 words per minute
- Choose high-quality images that relate to your content
- Test your blog post by visiting `/blog/your-slug` after adding it