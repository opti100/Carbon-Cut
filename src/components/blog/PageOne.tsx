import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
}

const PageOne: React.FC = () => {
  const blogPosts: BlogPost[] = [
   
    {
      id: 1,
      category: "Marketing Strategy",
      title: "A GENICY - ONE POINT OF FAIR",
      excerpt: "Relying on one marketing agency may seem efficient—but it's risky. Learn how a multi-agency approach...",
      date: "30/07/2025",
      author: "A gency, a one-hosting agent.",
      readTime: "4 min read"
    },
    {
      id: 2,
      category: "Technology",
      title: "Why Tech-Driven Marketing Agencies Are Dominating",
      excerpt: "Discover why tech-driven marketing agencies deliver 35% higher ROI and how proprietary technology...",
      date: "25/07/2025",
      author: "Tech Marketing Insights",
      readTime: "6 min read"
    },
    {
      id: 3,
      category: "Global Markets",
      title: "How Indian Marketing Agencies Are Transforming D2C Brands",
      excerpt: "Learn how Indian marketing agencies are helping D2C brands break through sales plateaus with innovative...",
      date: "16/07/2025",
      author: "Global Marketing Review",
      readTime: "7 min read"
    },
    {
      id: 4,
      category: "Content Strategy",
      title: "Treat content like product",
      excerpt: "If it only lasts 48 hours, you have to prepare new ones. Learn the art of creating evergreen content...",
      date: "10/07/2025",
      author: "Content Masters",
      readTime: "3 min read"
    },
    {
      id: 5,
      category: "Social Media",
      title: "Exposing the 3-Second Reel Myth",
      excerpt: "NODK Gaming Serving Tickets - The truth behind short-form content and engagement metrics...",
      date: "05/07/2025",
      author: "Social Media Pro",
      readTime: "4 min read"
    }
  ];

 

  const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <div style={styles.blogCard}>
      <div style={styles.cardHeader}>
        <span style={{...styles.categoryTag, backgroundColor: post.id % 2 === 0 ? '#22c55e' : '#f97316'}}>
          {post.category}
        </span>
        <span style={styles.date}>{post.date}</span>
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{post.title}</h3>
        <p style={styles.cardExcerpt}>{post.excerpt}</p>
      </div>
      <div style={styles.cardFooter}>
        <span style={styles.author}>{post.author}</span>
        <span style={styles.readTime}>{post.readTime}</span>
      </div>
    </div>
  );

  return (
    <div style={styles.blogPage}>
     <header
        className={`
           top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
         
        `}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="CarbonCut Logo"
              width={32}
              height={32}
              className="w-36 h-36"
            >
            </Image>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size={"lg"}
                className="bg-black text-white px-4 py-1 text-sm font-medium hover:bg-black hover:text-white rounded-lg h-8 transition-colors duration-200"
              >
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

     

      {/* Blog Grid */}
      <section style={styles.blogGridSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Latest Articles</h2>
            <div style={styles.filterTabs}>
              <button style={styles.filterBtnActive}>All</button>
              <button style={styles.filterBtn}>Popular</button>
              <button style={styles.filterBtn}>Recent</button>
            </div>
          </div>
          
          <div style={styles.blogGrid}>
            {blogPosts.slice(1).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={styles.newsletterSection}>
        <div style={styles.container}>
          <div style={styles.newsletterCard}>
            <h3 style={styles.newsletterTitle}>Stay Updated</h3>
            <p style={styles.newsletterText}>Get the latest marketing insights delivered to your inbox</p>
            <div style={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={styles.emailInput}
              />
              <button style={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.blogFooter}>
        <div style={styles.container}>
          <p style={styles.footerText}>&copy; 2025 Optiminastic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Styles object with all CSS
const styles = {
  blogPage: {
    backgroundColor: '#ffffff',
    color: '#000000',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  blogHeader: {
    padding: '40px 0 20px 0',
    borderBottom: '1px solid #e5e5e5',
  },
  blogTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#000000',
  },
  blogSubtitle: {
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '30px',
  },
  blogNav: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: 500,
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
  },
  navLinkActive: {
    textDecoration: 'none',
    color: '#22c55e',
    fontWeight: 500,
    padding: '8px 0',
    borderBottom: '2px solid #22c55e',
    transition: 'all 0.3s ease',
  },
  featuredSection: {
    padding: '40px 0',
  },
  featuredPost: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '12px',
    padding: '40px',
    position: 'relative' as 'relative',
    borderLeft: '4px solid #f97316',
  },
  featuredBadge: {
    position: 'absolute' as 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#f97316',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  categoryTag: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'inline-block',
    marginBottom: '15px',
  },
  postContent: {
    textAlign: 'left' as 'left',
  },
  postTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '15px',
    lineHeight: 1.3,
    color: '#000000',
  },
  postExcerpt: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: '#666',
    marginBottom: '20px',
  },
  postMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
    fontSize: '0.9rem',
    color: '#888',
  },
  date: {
    color: '#f97316',
    fontWeight: 600,
  },
  author: {
    fontWeight: 500,
  },
  readTime: {
    color: '#888',
  },
  readMoreBtn: {
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  blogGridSection: {
    padding: '40px 0 60px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#000000',
  },
  filterTabs: {
    display: 'flex',
    gap: '10px',
  },
  filterBtn: {
    background: 'none',
    border: '2px solid #e5e5e5',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
  },
  filterBtnActive: {
    background: '#22c55e',
    border: '2px solid #22c55e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
  },
  blogCard: {
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    padding: '25px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardContent: {
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '12px',
    lineHeight: 1.4,
    color: '#000000',
  },
  cardExcerpt: {
    color: '#666',
    lineHeight: 1.5,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#888',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px',
  },
  newsletterSection: {
    padding: '60px 0',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #fffbeb 100%)',
  },
  newsletterCard: {
    textAlign: 'center' as 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  newsletterTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '15px',
    color: '#000000',
  },
  newsletterText: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '1.1rem',
  },
  newsletterForm: {
    display: 'flex',
    gap: '10px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  emailInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e5e5e5',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  subscribeBtn: {
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  blogFooter: {
    padding: '30px 0',
    borderTop: '1px solid #e5e5e5',
    textAlign: 'center' as 'center',
  },
  footerText: {
    color: '#666',
  },
};

export default PageOne;