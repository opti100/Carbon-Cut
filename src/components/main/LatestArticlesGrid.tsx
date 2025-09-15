"use client"
import Image from 'next/image'
import React, { useState } from 'react'

const LatestArticlesGrid = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const articles = [
    {
      id: 1,
      title: "How to Conduct a Marketing Carbon Audit",
      excerpt: "A practical, step-by-step guide to measuring emissions from your digital and physical marketing activities.",
      image: "/article-2/article1.jpg",
      author: "Our Sustainability Lead",
      date: "April 15, 2024",
      category: "Audit"
    },
    {
      id: 2,
      title: "Measure Your Marketing Carbon Footprint",
      excerpt: "Get a clear, actionable report on your carbon emissions across digital ads, content creation, and events.",
      image: "/article-2/article2.jpg",
      author: "Dr. Elena Reed",
      date: "October 26, 2023",
      category: "Measurement"
    },
    {
      id: 3,
      title: "Embedding Carbon Awareness into Your Strategy",
      excerpt: "Use our calculator to identify emission hotspots and receive tailored recommendations for reducing your environmental impact.",
      image: "/article-2/article3.jpg",
      author: "CarbonCut Analytics",
      date: "November 30, 2023",
      category: "Strategy"
    },
    {
      id: 4,
      title: "Benchmark Your Marketing Carbon Output",
      excerpt: "Input your campaign data to see how your emissions compare to industry averages and uncover opportunities for improvement.",
      image: "/article-2/article4.jpg",
      author: "James Wright",
      date: "February 22, 2024",
      category: "Benchmarking"
    },
    {
      id: 5,
      title: "Mapping Your Marketing Carbon Footprint",
      excerpt: "Visualize the climate impact of your entire marketing funnel and build a strategy for sustainable growth.",
      image: "/article-2/article5.jpg",
      author: "Linda Gibson",
      date: "March 5, 2024",
      category: "Mapping"
    },
    {
      id: 6,
      title: "Future-Proof Your Marketing with Carbon Metrics",
      excerpt: "Learn how measuring your emissions now can drive innovation, reduce costs, and build brand trust for long-term success.",
      image: "/article-2/article6.jpg",
      author: "Thomas Reed",
      date: "April 30, 2024",
      category: "Future"
    }
  ]

  const articlesPerPage = 6
  const totalPages = Math.ceil(articles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = articles.slice(startIndex, startIndex + articlesPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section className="bg-[#031B27] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-left">Latest Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentArticles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="relative h-60 rounded-lg overflow-hidden mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-400 font-medium">{article.author}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-cyan-400 text-black'
                      : 'text-white hover:bg-black'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            {totalPages > 5 && (
              <span className="text-gray-400 px-2">...</span>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <span>Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default LatestArticlesGrid
