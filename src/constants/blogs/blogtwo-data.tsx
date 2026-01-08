import React from 'react'
import { BlogPost } from '../blogData'
import Link from 'next/link'

export const BlogTwoContent = () => {
  return (
    <div>
      <div className=" bg-white">
        <article className="">
          <header className="mb-12">
            <div className="flex items-center text-gray-600 text-sm">
              <span className="font-semibold">London</span>
              <span className="mx-2">•</span>
              <time dateTime="2025-10-09">9 October 2025</time>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              CarbonCut today announced the launch of its CliMarTech platform, a new
              category at the intersection of climate, marketing and technology. Designed
              for enterprises, agencies and media owners, CarbonCut turns the hidden
              climate cost of campaigns into clear CO₂e numbers that can be tracked,
              calculated and offset.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              The advertising industry, worth more than $800 billion globally, is
              estimated to contribute over a billion tonnes of CO₂e each year, mostly
              Scope 3 emissions spread across production, media, and digital
              infrastructure. With new disclosure frameworks tightening across the UK, EU
              and US, those emissions are moving from &quot;good to know&quot; to
              &quot;must disclose.&quot;
            </p>

            <blockquote className="border-l-4 border-gray-800 pl-6 my-12 py-4">
              <p className="text-xl font-semibold text-gray-900 mb-3 italic">
                &quot;Marketing has long measured everything except its climate
                cost,&quot;
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                said Akshae Golekar, founder of CarbonCut. &quot;After seven years
                building high-velocity campaigns, I kept seeing the same blind spot: Scope
                3 emissions scattered across studios, servers and screens with no line of
                sight. CarbonCut makes those emissions visible, defensible and simple to
                act on. Marketing should perform on two scoreboards, growth and climate.
                We exist to make the second as clear and accountable as the first.&quot;
              </p>
            </blockquote>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">How it works</h2>
            <p className="text-lg leading-relaxed mb-6">
              CarbonCut ingests activity data from marketing workflows and calculates
              campaign-level CO₂e across digital, social, OOH, print, events and more.
              Results are attributed by channel and activity, creating a single source of
              truth for finance, sustainability and marketing teams. Residual emissions
              can be neutralised through a curated portfolio of independently verified
              projects spanning nature, energy and waste solutions.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Each retirement generates both a certificate trail and an immutable
              smart-contract entry, showing what was retired, when, and against which
              campaign.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Why it matters
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              As climate disclosure frameworks tighten across major markets, marketing
              emissions, largely Scope 3, are moving from &quot;nice to know&quot; to
              non-negotiable. CarbonCut is intentionally practical: no black-box scoring
              or jargon, just auditable numbers and a straight path to action. The
              platform slots into existing cadence: fast to adopt, clear in output and
              ready for internal reporting and external claims.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              The intent behind CarbonCut is straightforward: accelerate the transition
              from &quot;marketing as usual&quot; to marketing with climate integrity. In
              the near term, that means giving brands a single, defensible source of truth
              for campaign emissions and a credible route to neutralisation. In the long
              term, it means net-zero advertising, an ecosystem in which every impression
              carries a known, minimised footprint, and every residual tonne is
              transparently addressed. This is how our industry can contribute, in
              practical terms, to the goals set for this decade.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Vision and mission
            </h2>
            <div className="grid md:grid-cols-2 gap-6 my-10">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Vision (2040)</h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Enable a net-zero marketing ecosystem, with CarbonCut recognised as a
                  leading contributor.
                </p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Mission (2030)</h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Be the go-to partner helping brands measurably cut CO₂e from marketing
                  and advertising at scale.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">Key features</h2>
            <div className="grid md:grid-cols-2 gap-5 my-10">
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Instant CO₂e results
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Campaign-level insights in minutes
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Audit-ready outputs
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Documentation aligned with SECR, CSRD and SEC frameworks
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  CarbonLive (real-time)
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Optional real-time measuring and offsetting while campaigns run
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Verified offsetting
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Curated project portfolio with transparent certificate trails and
                  smart-contract records
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors md:col-span-2">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Disclosure-friendly
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Built to support internal reporting and external claims without
                  greenwash
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              About CarbonCut
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              CarbonCut is the world&apos;s first CliMarTech platform, where Climate +
              Marketing + Tech intersect to make responsible growth standard practice. The
              product fits the pace of modern teams: fast to adopt, clear in output, and
              ready for internal reporting and external disclosure. By design, it helps
              organisations move from ad-hoc pledges to accountable performance.
            </p>
            <p className="text-lg leading-relaxed mb-12">
              The intent behind CarbonCut is straightforward: accelerate the transition
              from &quot;marketing as usual&quot; to marketing with climate integrity. In
              the near term, that means giving brands a single, defensible source of truth
              for campaign emissions and a credible route to neutralisation. In the long
              term, it means net-zero advertising, an ecosystem in which every impression
              carries a known, minimised footprint, and every residual tonne is
              transparently addressed. This is how our industry can contribute, in
              practical terms, to the goals set for this decade.
            </p>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-10 my-16 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">
                Join the shift to marketing with climate integrity
              </h2>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                If your team measures everything but CO₂e, now&apos;s the moment to change
                that. Start with clear numbers, pair them with a credible neutralisation
                path, and set a higher bar for the industry. Begin at carboncut.co.
              </p>
              <p className="text-xl leading-relaxed opacity-95">
                Try the{' '}
                <Link
                  href="/calculator"
                  className="text-tertiary hover:text-white underline"
                >
                  CarbonCalculator
                </Link>{' '}
                to instantly measure your campaign&apos;s marketing CO₂e and offset the
                remainder with verified projects and a transparent retirement certificate
                trail your auditors can trust.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

// Export blog data for the blog system
export const blogTwoData: BlogPost = {
  id: '2',
  slug: 'carboncut-launches-worlds-first-climartech-platform',
  category: 'CliMarTech platform',
  title:
    " CarbonCut launches world's first CliMarTech platform to make marketing measurable and net-zero ready",
  excerpt:
    'Built for modern marketing teams, CarbonCut quantifies Scope 3 CO₂e and links every tonne to a verifiable certificate trail.',
  date: '2025-10-8',
  author: {
    name: '',
    avatar: '/people/person1.jpg',
  },
  readTime: '5 min read',
  image: '/blogs/blogTwo.jpg',
  featured: true,
}
