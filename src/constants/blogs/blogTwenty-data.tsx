import React from 'react'
import { BlogPost } from '../blogData'
import Link from 'next/link'

export const BlogTwentyContent = () => {
  return (
    <div>
      <div className="bg-white">
        <article className="">
          <div className="prose prose-lg max-w-none">
            <div className=" mb-8">
              <p className="text-lg leading-relaxed mb-4">
                Most organisations believe their emissions are under control because they
                report them.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                The reality is different. A large part of your Carbon Cost is created when
                no one is actively measuring it.
              </p>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              Carbon emissions do not follow reporting calendars. They are generated
              continuously, overnight, between reporting cycles, and during unattended
              digital and operational activity. When emissions are only reviewed quarterly
              or annually, large portions remain invisible. This gap quietly increases
              risk, weakens credibility, and makes reduction harder than it should be.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Hidden Carbon Cost Most Companies Never See
            </h2>

            <div className="p-8 border-l-4 border-black bg-gray-50 rounded-r-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Emissions Don't Stop When Reporting Does
              </h3>
              <p className="text-lg leading-relaxed mb-4">
                Carbon is generated every minute, not once a year.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Servers keep running. Facilities stay powered. Logistics continue moving.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Overnight operations, idle systems, and background processes quietly add
                up. The real Carbon Cost sits outside formal reporting windows. When teams
                rely on delayed data, emissions already created cannot be undone or
                optimised.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                This is why real-time carbon emissions matter. Without them, organisations
                only see a snapshot, not the full picture.
              </p>
            </div>

            <div className="p-8 border border-black rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Where Invisible Emissions Typically Occur
              </h3>
              <p className="text-lg leading-relaxed mb-4">
                Unseen emissions often come from familiar places:
              </p>
              <ul className="list-disc list-inside text-lg leading-relaxed space-y-2 mb-4">
                <li>Cloud infrastructure running 24/7</li>
                <li>Digital systems and data transfers during low-activity hours</li>
                <li>Facilities, HVAC, and fleets operating without active oversight</li>
              </ul>
              <p className="text-lg leading-relaxed">
                The International Energy Agency estimates that digital and cloud
                infrastructure contributes 3-4% of global emissions, much of it generated
                continuously rather than during office hours. These emissions rarely show
                up clearly in traditional carbon tracking models.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Why Traditional Carbon Reporting Misses These Emissions
            </h2>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reporting Cycles vs Continuous Carbon Reality
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  Many organisations still rely on annual or quarterly manual carbon
                  reporting.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Data is collected late. Calculations happen later. Decisions come last.
                </p>
                <p className="text-lg leading-relaxed">
                  Emissions created between reporting cycles remain unmeasured. This
                  creates persistent carbon reporting gaps that compound over time. By the
                  time emissions appear in reports, reduction opportunities are already
                  gone.
                </p>
              </div>

              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  The Spreadsheet Blind Spot
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  Manual carbon reporting often depends on spreadsheets and static
                  templates.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Averages replace actual activity. Assumptions replace evidence.
                </p>
                <p className="text-lg leading-relaxed">
                  Unattended emissions are estimated, not measured. As a result, carbon
                  accounting accuracy suffers. Delayed and fragmented data weakens
                  confidence across teams, auditors, and regulators.
                </p>
              </div>
            </div>

            <div className="my-8 p-6 border border-black rounded-lg">
              <p className="text-lg leading-relaxed">
                <Link
                  href="/blogs/real-time-visibility-missing-layer-carbon-accounting"
                  className="text-black hover:text-gray-800 underline font-semibold"
                >
                  This visibility gap is explored further in Why Real-Time Visibility Is
                  the Missing Layer in Carbon Accounting, which breaks down how delayed
                  data weakens carbon decisions.
                </Link>
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Operational Sources of Unseen Carbon Cost
            </h2>

            <div className="space-y-8 mb-12">
              <div className="p-6 border border-black rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Cloud and Digital Infrastructure After Hours
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Cloud systems do not pause when teams log off.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Workloads scale automatically. Data flows continue. Regions with higher
                  grid intensity may be used unknowingly.
                </p>
                <p className="text-lg leading-relaxed">
                  Without real-time carbon emissions visibility, emission spikes remain
                  hidden. Timing and location matter, yet traditional reporting rarely
                  captures either. This inflates the true Carbon Cost without triggering
                  action.
                </p>
              </div>

              <div className="p-6 border border-black rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Facilities, Fleets, and Background Operations
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Facilities consume energy constantly.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  HVAC systems regulate temperature overnight. Fleets idle or operate
                  during off-hours.
                </p>
                <p className="text-lg leading-relaxed">
                  Fuel use and electricity consumption accumulate silently. Without
                  continuous carbon tracking, inefficiencies persist unnoticed. These
                  small, repeated gaps add up faster than most organisations expect.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              How Carbon Reporting Gaps Increase Risk
            </h2>

            <div className="space-y-8 mb-12">
              <div className="p-6 border-l-4 border-black bg-gray-50 rounded-r-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  From Missed Emissions to ESG Greenwashing
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Incomplete data often leads to confident claims that lack full evidence.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  This is where ESG greenwashing appears, not always by intent, but by
                  structure.
                </p>
                <p className="text-lg leading-relaxed">
                  When emissions are underestimated, reported numbers understate the true
                  Carbon Cost. Stakeholders see confidence, but auditors see gaps. Over
                  time, trust erodes.
                </p>
              </div>

              <div className="p-6 border-l-4 border-black bg-gray-50 rounded-r-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Regulatory Pressure Is Closing the Gap
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  CSRD, SECR, and the SEC climate rule increasingly demand traceable and
                  defensible data. Delayed reporting weakens audit confidence and
                  increases rework.
                </p>
                <p className="text-lg leading-relaxed">
                  According to the European Commission's CSRD guidance, organisations must
                  demonstrate consistency, transparency, and data integrity across
                  disclosures. Without better visibility, sustainability reporting
                  challenges grow harder to manage each year.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Why Carbon Cannot Be Managed on a Part-Time Basis
            </h2>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Carbon Is a Live Signal, Not a Retrospective Metric
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  Emissions fluctuate hour by hour.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Energy intensity changes by location and time. Activity levels shift
                  constantly.
                </p>
                <p className="text-lg leading-relaxed">
                  Annual summaries miss operational context. Effective decisions require
                  real-time ESG data, not historical averages. Treating carbon as a static
                  number limits both control and accountability.
                </p>
              </div>

              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  The Cost of Not Seeing Carbon in Real Time
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  When emissions are invisible, reduction stalls.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Inefficient systems continue unchecked. Teams react late or not at all.
                </p>
                <p className="text-lg leading-relaxed font-semibold">
                  The true Carbon Cost compounds quietly. By the time it appears in
                  reports, it is already locked in.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              What Real-Time Carbon Visibility Changes
            </h2>

            <div className="space-y-8 mb-12">
              <div className="p-6 border border-black rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Seeing Emissions as They Happen
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Real-time carbon emissions reveal when and where carbon is created.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Teams can link emissions directly to systems, activities, and timing.
                </p>
                <p className="text-lg leading-relaxed">
                  This improves carbon accounting accuracy by replacing assumptions with
                  evidence. Instead of guessing, organisations observe patterns as they
                  form.
                </p>
              </div>

              <div className="p-6 border border-black rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  From Reporting to Managing Carbon
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Visibility enables action, not just disclosure.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  With continuous insight, carbon tracking becomes operational rather than
                  administrative.
                </p>
                <p className="text-lg leading-relaxed font-semibold">
                  Real-time insight reduces reliance on estimates. Just as finance teams
                  moved from monthly summaries to live dashboards, carbon management is
                  shifting toward continuous monitoring.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              Why the Shift Away from Manual Carbon Reporting Is Accelerating
            </h2>

            <div className="space-y-8 mb-12">
              <div className="p-6 border-l-4 border-black bg-gray-50 rounded-r-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Growing Scrutiny from Investors and Regulators
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Investors increasingly question how emissions are calculated, not just
                  what is reported. Spreadsheet-driven workflows struggle to provide clear
                  answers.
                </p>
                <p className="text-lg leading-relaxed">
                  As scrutiny rises, manual carbon reporting exposes organisations to
                  higher risk. Confidence now depends on data quality, not presentation.
                </p>
              </div>

              <div className="p-6 border-l-4 border-black bg-gray-50 rounded-r-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  The Role of Sustainability Data Infrastructure
                </h4>
                <p className="text-lg leading-relaxed mb-4">
                  Modern reporting requires integrated systems, not disconnected files.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Real-time ESG data supports transparency, internal alignment, and audit
                  readiness.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Technology replaces guesswork with evidence. This shift strengthens
                  trust across regulators, investors, and internal teams.
                </p>
                <p className="text-lg leading-relaxed">
                  According to a CIO feature on digital sustainability systems,
                  organisations using continuous data see faster response times and fewer
                  audit issues than those relying on periodic reporting.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">
              The Inevitable Rethink of Carbon Cost
            </h2>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  From Periodic Reporting to Continuous Awareness
                </h3>
                <p className="text-lg leading-relaxed">
                  More organisations are recognising the limits of snapshots.
                </p>
                <p className="text-lg leading-relaxed mt-2">
                  Periodic reviews cannot capture continuous activity.
                </p>
                <p className="text-lg leading-relaxed mt-2 font-semibold">
                  Continuous visibility reveals the full Carbon Cost of operations,
                  including emissions created when no one is watching.
                </p>
              </div>

              <div className="bg-white border border-black p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Preparing for a Real-Time Reporting World
                </h3>
                <p className="text-lg leading-relaxed">
                  Forward-looking teams are aligning early with evolving regulations.
                </p>
                <p className="text-lg leading-relaxed mt-2">
                  Reducing carbon reporting gaps now prevents future compliance stress.
                </p>
                <p className="text-lg leading-relaxed mt-2 font-semibold">
                  Better visibility today lowers risk tomorrow.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-black pl-6 my-12 py-4">
              <p className="text-2xl font-semibold text-gray-900 mb-3">
                You Can't Reduce What You Don't See
              </p>
            </blockquote>

            <div className="p-8 border border-black rounded-lg mb-8">
              <p className="text-lg leading-relaxed mb-4">
                The biggest Carbon Cost is often created in the quiet hours.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Delayed reporting masks real emissions and real exposure.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                Real-time carbon emissions visibility is becoming essential for credible
                sustainability. Without it, organisations remain reactive. With it, carbon
                becomes measurable, manageable, and reducible.
              </p>
            </div>

            <div className="my-8 p-6 border border-black rounded-lg">
              <p className="text-lg leading-relaxed mb-4">
                For teams reassessing their current approach, understanding how continuous
                carbon visibility changes decisions is a logical next step. Real-time
                insight shows what reports miss and why reporting cycles alone are no
                longer enough.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                The first step to reducing carbon cost is seeing it in real time. Explore
                CarbonCut's approach to continuous carbon visibility.
              </p>
            </div>

            <div className="bg-gray-50 text-black rounded-lg p-10 my-16 border border-black">
              <h2 className="text-3xl font-bold mb-6">
                Ready to See What Happens When You're Not Looking?
              </h2>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                Discover the hidden carbon cost in your operations and start measuring
                emissions continuously.
              </p>
              <p className="text-xl leading-relaxed opacity-95">
                Explore CarbonCut's continuous carbon visibility platform and see how
                real-time monitoring can reveal emissions you're currently missing.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export const blogTwentyData: BlogPost = {
  id: '20',
  slug: 'massive-carbon-cost-unseen-emissions',
  category: '',
  title:
    "The Massive Carbon Cost Your Company Creates in the Hours You're Not Even Looking",
  excerpt:
    'Discover how unseen emissions accumulate when no one is measuring them and why real-time visibility is essential for accurate carbon accounting.',
  date: '2025-12-22',
  author: {
    name: '',
    avatar: '/team/carboncut-insights.jpg',
  },
  readTime: '10 min read',
  image: '/blogs/blogTwenty.png',
  featured: true,
}
