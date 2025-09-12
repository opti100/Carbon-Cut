import Image from 'next/image'
import React from 'react'

const LatestArticles = () => {
  const mainArticle = {
    id: 1,
    title: "Simplify Your Sustainability Reporting",
    excerpt: "Our advanced calculator provides a detailed lifecycle analysis of your marketing emissions. Input data across digital campaigns (including ad spend, platform usage, and website traffic) and physical materials (from print production to shipping logistics) to receive a granular breakdown of your carbon footprint.",
    image: "/articles/article1.jpg",
    author: "Olivia Martinez",
    date: "September 9, 2024",
    category: "Sustainability"
  }

  const sideArticles = [
    {
      id: 2,
      title: "The Carbon Cost of Your Customer Acquisition",
      excerpt: "See the environmental impact of your marketing spend and learn how sustainable practices can improve your bottom line.",
      image: "/articles/article2.jpg",
      author: "Nina Patel",
      date: "June 30, 2023",
      category: "Marketing"
    },
    {
      id: 3,
      title: "Calculate Your Brand's Climate Story", 
      excerpt: "Turn your emissions data into a powerful narrative of transparency and commitment to authentic sustainability.",
      image: "/articles/article3.jpg",
      author: "Marcus Thorne",
      date: "June 12, 2024",
      category: "Strategy"
    },
    {
      id: 4,
      title: "Modeling Your Marketing Carbon Lifecycle",
      excerpt: "A technical overview of the calculation methodologies behind measuring emissions from digital advertising campaigns.",
      image: "/articles/article4.jpg",
      author: "Sophia Kim",
      date: "July 18, 2024",
      category: "Analytics"
    },
    {
      id: 5,
      title: "Redefining Marketing Success with Carbon Metrics",
      excerpt: "Move beyond traditional KPIs. Learn how integrating carbon accounting creates a new paradigm for measuring campaign effectiveness.",
      image: "/articles/article5.jpg",
      author: "Daniel Wright", 
      date: "June 30, 2023",
      category: "Metrics"
    }
  ]

  return (
    <section className="bg-black py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-left">Popular Articles</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <Image
                src={mainArticle.image}
                alt={mainArticle.title}
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-400 font-medium">{mainArticle.author}</span>
                <span className="text-gray-400">{mainArticle.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight hover:text-cyan-400 transition-colors cursor-pointer">
                #{mainArticle.id} {mainArticle.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {mainArticle.excerpt}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-8">
            {sideArticles.map((article, index) => (
              <div key={article.id} className="flex gap-4 group cursor-pointer">
                <div className="relative w-28  h-28 rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyan-400 font-medium">{article.author}</span>
                      <span className="text-gray-400">{article.date}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-cyan-400 transition-colors">
                      #{article.id} {article.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LatestArticles