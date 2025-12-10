import { Metadata } from 'next';
import { BlogPost } from '@/constants/blogData';

export function generateBlogMetadata(post: BlogPost): Metadata {
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [
        {
          url: post.image || '/blogs/default-blog-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      authors: [post.author.name],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [post.image || '/blogs/default-blog-image.png'],
    },
  };
}