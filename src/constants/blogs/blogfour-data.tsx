import React from 'react';
import { BlogPost } from '../blogData';
import Link from 'next/link';

export const BlogFourContent = () => {
  return (
    <div> 
      <div className="bg-white">
        <article className="">
          <div className="prose prose-lg max-w-none">
           

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Marketing&apos;s Invisible Footprint</h3>
            <p className="text-lg leading-relaxed mb-6">
              Every campaign from search ads to billboards, drives performance metrics, but it also releases CO₂e emissions through servers, screens, devices, and production processes. These emissions are real, measurable, and increasingly reportable. Yet, most media plans still overlook them.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Research from the Carbon Trust shows that Scope 3 emissions account for around 70 - 90% of an organisation&apos;s total carbon footprint. For marketing teams, that includes the entire ecosystem of content creation, ad delivery, event production, and media operations.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Even something as small as a digital impression has a footprint. Industry studies indicate that one million ad impressions can generate roughly one tonne of CO₂e, depending on geography, channel, and data chain efficiency. Multiply that across a global campaign, and the environmental cost becomes impossible to ignore.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              It&apos;s time to treat climate impact as a performance metric.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why It Matters Now</h3>
            <p className="text-lg leading-relaxed mb-8">
              The shift is already happening. Regulations such as CSRD (EU), SECR (UK), and the SEC Climate Rule (US) are making Scope 3 marketing emissions reporting mandatory for enterprises and listed companies.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              At the same time, agencies and brands face growing expectations to prove their sustainability commitments. Consumers and investors want auditable sustainability data, not just pledges or campaigns that sound good on paper.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              That&apos;s where the concept of a Carbon Column comes in a practical, data-backed way to include the carbon footprint of marketing campaigns right inside your media plan.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              If marketing is measurable by reach and ROI, it should be measurable by CO₂e too. The first step? Add one more column to your spreadsheet and transform how you measure performance.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Meet the &quot;Carbon Column&quot; - Where Media Metrics Meet Climate Metrics
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">What It Is</h3>
            <p className="text-lg leading-relaxed mb-6">
              The Carbon Column is a simple yet powerful addition to your media plan. It&apos;s a new field that quantifies each channel&apos;s CO₂e marketing measurement.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Placed alongside your budget, impressions, or CPM, this column shows the carbon emissions tracking for campaigns in real numbers, so sustainability becomes visible, actionable, and accountable.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              It&apos;s not a new system. It&apos;s simply a smarter way to make your existing media plan carbon calculation complete.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why It Works</h3>
            <div className="grid md:grid-cols-2 gap-5 my-10">
              <div className="bg-white border-2 border-green-200 p-6 rounded-xl hover:border-green-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Visibility</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Turns unseen emissions into a measurable metric for every campaign.
                </p>
              </div>
              
              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Accountability</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Connects sustainability directly to strategy and spend.
                </p>
              </div>
              
              <div className="bg-white border-2 border-purple-200 p-6 rounded-xl hover:border-purple-400 transition-colors md:col-span-2">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Audit Readiness</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Simplifies reporting under SECR, CSRD, and ESG frameworks.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              By adding one simple column, marketers can track performance and planet side-by-side, making every media plan an environmental action plan.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              How to Turn Your Media Plan Into CO₂e - Step by Step
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Step 1 - Gather Your Campaign Data</h3>
            <p className="text-lg leading-relaxed mb-6">
              To start, compile detailed data on your marketing activities:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6 space-y-2">
              <li><strong>Digital:</strong> display, video, social, search</li>
              <li><strong>Print:</strong> newspapers, magazines</li>
              <li><strong>Out-of-home:</strong> billboards, transit, digital screens</li>
              <li><strong>Events:</strong> travel, production, venue energy use</li>
            </ul>
            <p className="text-lg leading-relaxed mb-8">
              The aim is to capture every element that contributes to your marketing carbon footprint. The more accurate your data, the clearer your path to sustainability.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Step 2 - Calculate Your Campaign Footprint</h3>
            <p className="text-lg leading-relaxed mb-6">
              Use a carbon footprint calculator or CO₂ calculator built on globally recognised frameworks like the GHG Protocol and ISO 14064.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              On average, one digital impression produces about 1 gram of CO₂e, according to industry modelling from DoubleVerify and Scope3. That means 1 million impressions = 1 tonne of CO₂e (equivalent to the emissions from a small car travelling roughly 2,500 miles).
            </p>
            <p className="text-lg leading-relaxed mb-8">
              The CarbonCut platform simplifies this process. Its CarbonCalculator converts your campaign data into real-time CO₂e marketing measurement across all channels, from display ads to event logistics and generates results ready for ESG submission.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Step 3 - Add Your Carbon Column</h3>
            <p className="text-lg leading-relaxed mb-6">
              Once your CO₂e values are calculated, it&apos;s time to insert them into your media plan.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Add a dedicated Carbon Column right beside your cost, impressions, or reach metrics.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold">Channel</th>
                    <th className="text-left py-3 px-4 font-semibold">Spend (£)</th>
                    <th className="text-left py-3 px-4 font-semibold">Impressions</th>
                    <th className="text-left py-3 px-4 font-semibold">CO₂e (kg)</th>
                    <th className="text-left py-3 px-4 font-semibold">£ per kg CO₂e</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Video Ads</td>
                    <td className="py-3 px-4">10,000</td>
                    <td className="py-3 px-4">1,000,000</td>
                    <td className="py-3 px-4">1,000</td>
                    <td className="py-3 px-4">£10</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Social</td>
                    <td className="py-3 px-4">8,000</td>
                    <td className="py-3 px-4">900,000</td>
                    <td className="py-3 px-4">900</td>
                    <td className="py-3 px-4">£8.88</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Print</td>
                    <td className="py-3 px-4">5,000</td>
                    <td className="py-3 px-4">—</td>
                    <td className="py-3 px-4">2,000</td>
                    <td className="py-3 px-4">£2.50</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-lg leading-relaxed mb-6">
              This format helps you see carbon efficiency as clearly as you see cost efficiency.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              By pairing financial and environmental data, your team can make informed decisions about where to optimise, reduce, or offset.
            </p>

            <blockquote className="border-l-4 border-gray-800 pl-6 my-12 py-4">
              <p className="text-xl font-semibold text-gray-900 mb-3 italic">
                &quot;When you can see it, you can manage it. The Carbon Column makes carbon impact visible and manageable.&quot;
              </p>
            </blockquote>

            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Step 4 - Offset What Remains</h3>
            <p className="text-lg leading-relaxed mb-4">
              After calculating your campaign-level carbon footprint, the next step is to address unavoidable emissions.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Offsetting doesn&apos;t replace reduction, it completes the cycle of responsibility.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Support verified carbon offset for advertising initiatives such as reforestation, renewable energy, or community-based sustainability programmes.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              With CarbonCut&apos;s CarbonOffset module, you can select projects certified by trusted registries like Verra, Gold Standard, and ACR.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Every tonne of CO₂e you retire is recorded transparently on blockchain, ensuring traceability and preventing double counting. This provides auditable proof that your offsets are real, measurable, and permanent.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              From Compliance Burden to Competitive Advantage
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Turning Measurement Into Marketing Value</h3>
            <p className="text-lg leading-relaxed mb-6">
              What was once a compliance necessity is now a brand differentiator.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Adding a Carbon Column to your media plan turns sustainability into a selling point — one that clients, investors, and consumers can verify.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Agencies can include transparent carbon reporting for agencies in client proposals, proving that every pound spent contributes to responsible marketing.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Brands can showcase real, verifiable impact in ESG reports and investor updates.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Procurement teams can benchmark partners using data-backed sustainable media planning metrics.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              The result is clear: sustainability data strengthens credibility and wins trust in the marketplace.
            </p>

            <blockquote className="border-l-4 border-gray-800 pl-6 my-12 py-4">
              <p className="text-xl font-semibold text-gray-900 mb-3 italic">
                &quot;Carbon accountability isn&apos;t just good ethics, it&apos;s good business.&quot;
              </p>
            </blockquote>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Making It Fast and Frictionless</h3>
            <p className="text-lg leading-relaxed mb-6">
              Historically, carbon emissions tracking for campaigns was seen as complex, manual, or too technical. CarbonCut removes those barriers.
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6 space-y-2">
              <li>Uses your existing campaign data, no new integration needed</li>
              <li>Generates instant, auditable reports with blockchain-verified offsets</li>
              <li>Keeps everything GDPR-compliant and secure</li>
            </ul>
            <p className="text-lg leading-relaxed mb-8">
              This approach turns sustainability from a quarterly task into a daily habit, woven into every marketing decision.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Discover how CarbonCut connects seamlessly with your existing planning tools and makes sustainable advertising effortless.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Marketing&apos;s Role in Tackling Scope 3 Emissions
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why It Matters</h3>
            <p className="text-lg leading-relaxed mb-6">
              Indirect (Scope 3) emissions, those created across a company&lsquo;s supply chain, account for around 75% of total corporate emissions according to the World Resources Institute (WRI).
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Marketing plays a major part: servers powering ads, devices displaying them, paper used in print, travel for events, all contribute to this hidden footprint.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Adding a Carbon Column empowers marketers to take control of their share of these emissions. It helps them align creative output with corporate sustainability goals, ensuring marketing becomes part of the climate solution, not the problem.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">From Measurement to Verified Action</h3>
            <p className="text-lg leading-relaxed mb-6">
              CarbonCut closes the loop between measurement and accountability:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6 space-y-2">
              <li><strong>Verified offsets:</strong> Every tonne retired is logged transparently</li>
              <li><strong>Alignment with ESG frameworks:</strong> Outputs plug directly into enterprise reporting cycles</li>
            </ul>
            <p className="text-lg leading-relaxed mb-8">
              This is how marketing teams move from estimating to demonstrating, from intention to verified action.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The CarbonCut Difference - Simple, Fast, Auditable
            </h2>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Designed for Marketers, Trusted by ESG Teams</h3>
            <p className="text-lg leading-relaxed mb-6">
              The CarbonCut platform is purpose-built to make the carbon footprint of marketing campaigns measurable, auditable, and offsettable.
            </p>
            <div className="grid md:grid-cols-2 gap-5 my-10">
              <div className="bg-white border-2 border-green-200 p-6 rounded-xl hover:border-green-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Coverage</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Digital, print, OOH, and events.
                </p>
              </div>
              
              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Compliance-Ready Outputs</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Compatible with SECR, CSRD, and SEC disclosures.
                </p>
              </div>
              
              <div className="bg-white border-2 border-purple-200 p-6 rounded-xl hover:border-purple-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Transparent by Design</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Blockchain ensures accountability and trust.
                </p>
              </div>
              
              <div className="bg-white border-2 border-orange-200 p-6 rounded-xl hover:border-orange-400 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Ease of Use</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  Intuitive dashboard, instant insights, exportable reports.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-gray-800 pl-6 my-12 py-4">
              <p className="text-xl font-semibold text-gray-900 mb-3 italic">
                &quot;With CarbonCut, adding a Carbon Column is as effortless as adding a metric, but the impact lasts far beyond the campaign.&quot;
              </p>
            </blockquote>

            <p className="text-lg leading-relaxed mb-8">
              See how the CarbonCut platform helps you calculate, report, and offset - all in one place.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Final Thoughts - Start Measuring What Matters
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Adding a Carbon Column isn&apos;t just a sustainability gesture, it&apos;s a step toward smarter, more responsible marketing.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              It empowers teams to quantify their marketing carbon footprint, take verified action, and contribute to company-wide climate goals.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Every click, every print run, and every event has a carbon cost. With CliMarTech solutions like CarbonCut, that cost becomes visible, accountable, and offsettable.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              The next era of marketing isn&apos;t just about creative impact, it&apos;s about climate impact.
            </p>

            <p className="text-xl font-semibold text-gray-900 mb-8 text-center">
              Marketing has ROI. Now it has CO₂e.
            </p>

            <p className="text-xl font-semibold text-gray-900 mb-8 text-center">
              Add your Carbon Column with CarbonCut - Calculate • Report • Reduce and Offset Carbon Emissions.
            </p>

            <div className="bg-gray-100 text-black rounded-2xl p-10 my-16 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Add Your Carbon Column?
              </h2>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                Start measuring what matters with CarbonCut&apos;s comprehensive platform designed specifically for marketing teams.
              </p>
              <p className="text-xl leading-relaxed opacity-95">
                Try the {" "}
                <Link href="/calculator" className='text-tertiary hover:text-black underline'>CarbonCalculator</Link>
                {" "} today to instantly measure your campaign&apos;s carbon footprint and begin your journey toward sustainable, accountable marketing.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export const blogFourData: BlogPost = {
  id: '4',
  slug: '4',
  category: 'Sustainable Marketing',
  title: 'Add a Carbon Column to Your Media Plan',
  excerpt: 'The Hidden Metric Missing From Every Campaign',
  date: '2025-11-23',
  author: {
    name: '',
    avatar: '/'
  },
  readTime: '8 min read',
  image: '/blogs/blogThree.jpg',
  featured: true,
};