import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/constants/blogData';
import BlogPostPage from '@/components/blog/BlogPostPage';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} />;
}

// Generate static params for known blog posts
export async function generateStaticParams() {
  // This will generate static pages for the single blog post
  return [
    { slug: 'one' }
  ];
}