import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/constants/blogData';
import { generateBlogMetadata } from '@/utils/blogMetadata';
import BlogPostPage from '@/components/blog/BlogPostPage';
import LenisSmoothScroll from '@/components/LenisSmoothScroll';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return generateBlogMetadata(post);
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const { blogPosts } = await import('@/constants/blogData');
  
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
    <LenisSmoothScroll>

    <BlogPostPage post={post} />
    </LenisSmoothScroll>
    
    </>
  )
}