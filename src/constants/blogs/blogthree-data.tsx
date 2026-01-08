import React from 'react'
import { BlogPost } from '../blogData'
import Link from 'next/link'

export const BlogThreeContent = () => {
  return (
    <div>
      <div className="bg-white">
        <article className="">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              CarbonCut is the world&apos;s first CliMarTech platform that helps marketing
              teams, procurement leaders, and ESG/compliance professionals measure,
              report, and offset carbon emission at campaign level. This makes progress
              toward net zero targets and regulatory compliance practical, transparent,
              and traceable end-to-end.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Hidden Climate Cost of Marketing
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Marketing Emissions - A Growing Concern
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              Marketing activities contribute meaningfully to scope 3 emissions. While
              direct operational impacts draw attention, the off-platform footprint of ad
              delivery, content production, data transfer, events, and print often goes
              uncounted. Industry analyses show emissions linked to commercial functions
              like marketing can exceed the combined Scope 1 and 2 in consumer sectors.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Every touchpoint, programmatic delivery, studios, logistics, venue, carries
              a carbon cost that adds to a brand&apos;s carbon footprint.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Regulatory pressure is intensifying. UK SECR, EU CSRD, and US SEC rules
              expect disclosures that include CO2 emissions across the value chain. Teams
              that cannot evidence campaign-level greenhouse emissions risk compliance
              gaps and credibility issues.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Scope 3 Emissions - Why They Matter
            </h3>
            <p className="text-lg leading-relaxed mb-8">
              For many brands, scope 3 emissions represent the majority of overall
              emissions. Treating marketing as a measurable workstream, alongside
              operations and supply chain, helps leaders align spend with climate
              commitments. CarbonCut turns campaign activity into auditable CO2 data and
              connects it to credible carbon offsets so residual CO2 emissions are
              neutralised in line with policy and stakeholder expectations.
            </p>

            <blockquote className="border-l-4 border-gray-800 pl-6 my-12 py-4">
              <p className="text-xl font-semibold text-gray-900 mb-3 italic">
                &quot;Marketing has long measured everything except its climate cost&quot;
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                CarbonCut brings emissions and offsets into the same workflow, making
                sustainability as measurable as ROI for modern marketing teams.
              </p>
            </blockquote>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              CarbonCut - A Solution for Real-time, Measurable, Auditable Marketing
              Emissions
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              What is CarbonCut?
            </h3>
            <p className="text-lg leading-relaxed mb-8">
              CarbonCut quantifies campaign carbon emission across digital, print, OOH,
              and events, and connects residuals to verified carbon credits for instant
              offsets. Outputs map to SECR, CSRD, and SEC formats, making reporting
              straightforward for marketing leadership, procurement, and ESG teams. The
              platform is designed for speed, accuracy, and authorisation, bringing
              emissions and offsets into the same workflow.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Product & Services
            </h2>

            <div className="grid md:grid-cols-2 gap-5 my-10">
              <div className="bg-white border-2 border-green-200 p-6 rounded-xl hover:border-green-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">CarbonCalculator</h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Quantifies CO₂e across digital, print, OOH, events, delivering
                  campaign-level numbers in minutes.
                </p>
                <p className="text-sm text-gray-600">
                  Built on GHG Protocol + ISO 14064; outputs mapped to SECR, CSRD, and
                  SEC.
                </p>
              </div>

              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  CarbonLive (Enterprise API)
                </h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Direct API integration for real-time carbon estimates based on live
                  campaign data.
                </p>
                <p className="text-sm text-gray-600">
                  Secure endpoints, role-based access, and webhook callbacks.
                </p>
              </div>

              <div className="bg-white border-2 border-purple-200 p-6 rounded-xl hover:border-purple-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">CarbonOffset</h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Curated access to verified carbon credits with blockchain smart contract
                  records.
                </p>
                <p className="text-sm text-gray-600">
                  Dual interfaces: Compliance Market + Global VCM.
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 p-6 rounded-xl hover:border-orange-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  CarbonESG (Live Dashboard)
                </h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Centralised dashboard converting campaign activity into audit-ready ESG
                  disclosures.
                </p>
                <p className="text-sm text-gray-600">
                  Real-time tracking and exportable outputs in regulatory formats.
                </p>
              </div>

              <div className="bg-white border-2 border-teal-200 p-6 rounded-xl hover:border-teal-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  C3 Seal (CarbonCut Certified)
                </h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Independent proof of action with verifiable certificate trail for
                  climate accountability.
                </p>
                <p className="text-sm text-gray-600">
                  Suitable for ad creatives, investor decks, and ESG filings.
                </p>
              </div>

              <div className="bg-white border-2 border-indigo-200 p-6 rounded-xl hover:border-indigo-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  CarbonToken (CTN)
                </h4>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Tokenisation of retired credits creating secondary liquidity layer for
                  carbon assets.
                </p>
                <p className="text-sm text-gray-600">
                  Backed by real, retired credits with proprietary tokenomics.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              What Does &quot;Audit-Ready&quot; Mean for Marketers?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-10">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Building Trust Through Transparency
                </h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Audit-ready means every figure and every retirement can be traced and
                  verified. CarbonCut records carbon credits retirements on smart
                  contracts, creating an immutable certificate trail that links CO2
                  emissions to corresponding offsets.
                </p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Certification and the C3 Seal
                </h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  The C3 Seal gives stakeholders a clear signal: the campaign&apos;s
                  emissions and carbon offsets follow recognised structure and carry a
                  verifiable record for public materials and investor updates.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Benefits Across the Organization
            </h2>

            <div className="grid md:grid-cols-2 gap-5 my-10">
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  For Marketing Teams
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Clear, comparable emissions data to align budgets with net zero plans
                  and demonstrate climate accountability.
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">For ESG Leaders</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Automated, audit-ready outputs mapped to SECR, CSRD, and SEC reduce
                  manual effort and deliver consistent numbers.
                </p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-400 transition-colors md:col-span-2">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  For Compliance Officers
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Straightforward reporting with defensible disclosures that avoid claims
                  of greenwash while meeting regulatory requirements.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Key Advantages
            </h2>

            <div className="space-y-4 my-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Full-Spectrum Marketing Emissions Coverage
                </h4>
                <p className="text-gray-700">
                  Digital, print, OOH, and events in one place: a single source of truth
                  for campaign emissions, carbon cost, CO2 emissions, and offset status.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Blockchain-Backed Credits and Tokenisation
                </h4>
                <p className="text-gray-700">
                  Smart-contract records plus CTNs deliver proof-of-retirement and
                  optional liquidity, bringing transparency, permanence, and market access
                  to carbon offsets.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Future of Marketing and Sustainability
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-10">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Toward Net-Zero Advertising
                </h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  CarbonCut&apos;s mission is to decarbonise the digital economy—one
                  impression, one API call, one offset at a time. Evolving from
                  advertising emissions to tracking CO2 from internet activity globally.
                </p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  2028 Impact Target
                </h4>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Enable offsetting of 8-10 MtCO₂e annually while building a secondary
                  market for tokenised offsets that broadens access to climate-positive
                  assets.
                </p>
              </div>
            </div>

            <div className=" text-black rounded-2xl p-10 my-16 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">
                Take Control of Your Marketing Carbon Footprint
              </h2>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                As pressure on marketing to address its carbon impact grows, tracking and
                offsetting carbon emission in campaigns is essential. CarbonCut
                streamlines measurement, reporting, and neutralisation of marketing CO₂ so
                teams can present clear, verifiable data alongside performance metrics.
              </p>
              <p className="text-xl leading-relaxed opacity-95">
                Don&apos;t wait for regulations to catch up. Try the{' '}
                <Link
                  href="/calculator"
                  className="text-tertiary hover:text-black underline"
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

export const blogThreeeData: BlogPost = {
  id: '3',
  slug: 'introducing-carboncut-fast-accurate-authorised-real-time-marketing',
  category: 'Introducing CarbonCut',
  title:
    'Introducing CarbonCut: Fast, Accurate, Authorised, Real-Time Marketing Carbon Emissions & Auto-Offsetting.',
  excerpt:
    'As the world pushes for credible sustainability, businesses are under mounting pressure not only to measure and report their environmental impact but also to neutralise what they can’t avoid.',
  date: '2025-10-15',
  author: {
    name: '',
    avatar: '/',
  },
  readTime: '12 min read',
  image: '/blogs/blogThree.jpg',
  featured: true,
}
