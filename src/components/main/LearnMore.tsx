'use client'

import Link from 'next/link'

const LearnMore = () => {
  return (
    <section className="flex justify-center items-center py-20 px-4 bg-background">
      <div className="text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#080c04]">
          Understand your Internet Carbon Emissions
        </h2>

        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8">
          Measure, track, and reduce the carbon footprint of your digital usage.
        </p>

        <Link href="/internet">
          <button
            className="px-8 py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
          >
            Learn more
          </button>
        </Link>
      </div>
    </section>
  )
}

export default LearnMore
