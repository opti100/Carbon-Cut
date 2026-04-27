'use client'

import Link from 'next/link'

const LearnMore = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full border-t border-dashed border-text/10 mb-12" />

      <div className="max-w-[1400px] mx-auto">
        <div className="bg-[#fcfdf6] rounded-2xl border border-[#d1cebb] px-8 sm:px-12 py-16 flex flex-col items-center text-center gap-6">
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[#6c5f31]/80">
            The Future of Digital Operations
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#080c04] leading-tight max-w-3xl">
            Built for the hyper internet operations age.
          </h2>

          <p className="text-base md:text-lg text-[#6c5f31] max-w-2xl leading-relaxed">
            Net-zero internet operations are achievable. Discover how CarbonCut helps
            digital teams track, reduce, and offset emissions at every layer.
          </p>

          <Link href="/internet" className="mt-2">
            <button
              className="px-8 py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:opacity-90"
              style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
            >
              Learn more
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LearnMore
