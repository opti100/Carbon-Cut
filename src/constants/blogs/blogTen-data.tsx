import React from 'react'
import { BlogPost } from '../blogData'
import Link from 'next/link'

export const BlogTenContent = () => {
  return (
    <div>
      <div className="bg-white">
        <article className="">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Most organisations trust the numbers produced by their carbon footprint
              calculator. It feels simple: enter data, generate your emissions, download a
              clean report. But the uncomfortable truth is that most calculators are
              quietly underreporting your CO₂e. Not because your sustainability team is
              doing anything wrong, but because the tools themselves were built for a
              world that no longer exists.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Modern businesses operate in real time. Cloud systems auto-scale every
              minute. Marketing platforms run millions of auctions per second. Apps fire
              thousands of events with every user session. Digital infrastructure changes
              constantly. A traditional carbon calculator cannot capture any of this. And
              when your data is incomplete, every decision based on that data becomes
              incomplete too.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Hard Truth: Most Carbon Footprint Calculators Are Wrong
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Traditional calculators rely on historic emission factors and broad annual
              averages. These frameworks were designed for slow-moving operations such as
              manufacturing and fleet travel. They were never built to measure
              programmatic bidding, live CDN routing, or real-time compute usage.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Industry research makes the gap clear. Legacy carbon calculators can
              underestimate emissions by 30–70%, especially in digital-heavy environments.
              PwC found that 71% of companies still use outdated emissions factors, making
              most sustainability reports inaccurate from the start.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              The issue isn&apos;t intent, it&apos;s the limitations of legacy tools.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Where Traditional Calculators Fail, And Why It Matters
            </h2>

            <div className="space-y-6 my-10">
              <div className="bg-white border-2 border-red-200 p-6 rounded-xl hover:border-red-400 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1. Outdated Emission Factors
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Many calculators still use grid averages from 2018–2020. Grid carbon
                  intensity now changes hourly, sometimes dramatically, depending on
                  renewable availability. A single cloud workload can have completely
                  different footprints depending on the time of day.
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 p-6 rounded-xl hover:border-orange-400 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  2. Annual Averages for Real-Time Systems
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Cloud workloads scale automatically. Ad platforms generate emissions
                  with every impression, bid, and content load. Traditional calculators
                  flatten all of this into annual estimates.
                </p>
              </div>

              <div className="bg-white border-2 border-yellow-200 p-6 rounded-xl hover:border-yellow-400 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  3. No Measurement of Digital Activity
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Key digital emissions points, such as retargeting, CRM workflows,
                  streaming behaviour, API calls, or AI model workloads, simply never
                  appear in traditional outputs.
                </p>
              </div>

              <div className="bg-white border-2 border-green-200 p-6 rounded-xl hover:border-green-400 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  4. Hidden Supply Chain Emissions
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Agencies, DSPs, CDPs, analytics tools, and cloud vendors all consume
                  energy. Legacy calculators cannot track these supply chain layers.
                </p>
              </div>

              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-400 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  5. User Behaviour Left Out
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Two thousand low-energy sessions and two thousand long HD sessions are
                  not equivalent. However, traditional models treat them as identical.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              Each of these blind spots compounds into a significantly distorted
              footprint.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Why Inaccurate Calculators Are a Business Risk
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              When emissions are underestimated, reduction strategies become misaligned.
              Cloud and marketing teams optimise blindly. Investments are misinformed. And
              sustainability teams unintentionally submit disclosures that do not reflect
              reality.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Under SECR, CSRD, and the SEC Climate Rule, regulators expect verifiable,
              timestamped, audit-ready data. Static calculators cannot produce audit
              trails. Submitting estimated numbers instead of measured ones exposes
              organisations to compliance and reputational risk, including accusations of
              greenwashing.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              2025 and Beyond: The Shift to Real-Time Carbon Intelligence
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Modern operations do not run on yearly cycles. Emissions must be measured
              the way digital systems behave — in real time.
            </p>

            <p className="text-lg leading-relaxed mb-4">This shift includes:</p>

            <div className="space-y-3 my-8 ml-6">
              <ul className="list-disc pl-6">
                <li className="text-lg leading-relaxed">
                  Live grid intensity instead of outdated databases
                </li>
                <li className="text-lg leading-relaxed">
                  Impression-level and event-level CO₂e tracking
                </li>
                <li className="text-lg leading-relaxed">
                  Telemetry directly from cloud platforms
                </li>
                <li className="text-lg leading-relaxed">
                  Per-compute, per-transfer, per-route measurements
                </li>
                <li className="text-lg leading-relaxed">
                  Digital behaviour tracked as it happens
                </li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              A traditional carbon footprint calculator cannot model these dynamics.
              Real-time systems can.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              How Modern Platforms Fix What Calculators Miss
            </h2>

            <p className="text-lg leading-relaxed mb-8">
              This is where platforms like CarbonCut change the landscape.
            </p>

            <div className="grid md:grid-cols-1 gap-6 my-10">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  1. CarbonCut Real Time Tracker
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  The carboncut real time tracker integrates directly with cloud
                  providers, ad platforms, websites, and analytics tools. It measures
                  activity using verified emission factors and real telemetry rather than
                  assumptions.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  2. CarbonCut&apos;s Carbon Calculators
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                  CarbonCut offers a modern suite of tools, including:
                </p>
                <div className="space-y-2 ml-6">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    The carboncut carbon calculator
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    The carboncut carbon footprint calculator
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    Modules to carboncut estimate carbon footprint
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    The carboncut carbon emissions calculator
                  </p>
                </div>
                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                  These tools capture real operational complexity and provide GHG
                  Protocol–aligned accuracy.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Visibility Across the Digital Supply Chain
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Hidden emissions across DSPs, CDPs, ad networks, and cloud vendors
                  become visible for the first time.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Real-Time Compliance
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  SECR, CSRD, and SEC-ready reports can be generated in hours instead of
                  months.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Real Reduction, Not Just Measurement
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  With real-time insights, organisations can reduce carbon emissions
                  through automated, data-led recommendations.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              How to Know if Your Calculator Is Lying to You
            </h2>

            <p className="text-lg leading-relaxed mb-6">A simple test:</p>

            <div className="bg-gray-50 border-l-4 border-gray-800 p-8 my-10">
              <div className="space-y-3">
                <p className="text-lg text-gray-800 leading-relaxed">
                  Does your calculator use old emission factors?
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Does it rely on annual averages?
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Does it track digital workloads?
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Does it show CO₂e per event, request, or compute cycle?
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Can it integrate with your systems?
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Can it generate audit-ready logs automatically?
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              If the answer to any of these is &quot;no,&quot; your footprint is
              incomplete.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Estimated Numbers Won&apos;t Survive What&apos;s Coming
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Static calculators and annual-average methodologies are becoming obsolete.
              Regulators, investors, customers, and partners now expect transparent,
              verifiable, real-world data, not projections or assumptions.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Real-time carbon intelligence is no longer a premium feature. It is rapidly
              becoming the baseline for responsible organisations.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              For teams looking to understand the difference between estimation and
              measurement, exploring CarbonCut&apos;s live ecosystem or using the
              CarbonCut carbon calculator is the simplest starting point.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              See the Difference for Yourself
            </h2>

            <div className="text-black rounded-2xl p-10 my-16 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
              <p className="text-xl mb-6 leading-relaxed">
                If you want to understand your real emissions and see how real-time
                measurement works in practice,{' '}
                <Link
                  href="https://carboncut.co/"
                  className="text-tertiary hover:text-black underline font-semibold"
                >
                  visit CarbonCut
                </Link>
              </p>
              <p className="text-xl leading-relaxed">
                To compare your traditional calculator&apos;s output against real-time
                data, you can also try the{' '}
                <Link
                  href="/calculator"
                  className="text-tertiary hover:text-black underline font-semibold"
                >
                  CarbonCut Carbon Calculator
                </Link>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export const blogTenData: BlogPost = {
  id: '10',
  slug: 'your-carbon-footprint-calculator-is-lying-to-you',
  category: 'Carbon Calculator Accuracy',
  title: "Your Carbon Footprint Calculator Is Lying to You: Here's What It Misses",
  excerpt:
    'Most organisations trust the numbers produced by their carbon footprint calculator. But the uncomfortable truth is that most calculators are quietly underreporting your CO₂e.',
  date: '2025-12-2',
  author: {
    name: '',
    avatar: '/',
  },
  readTime: '10 min read',
  image: '/blogs/blogTen.png',
  featured: true,
}
