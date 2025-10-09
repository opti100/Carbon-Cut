import React from 'react';
import { BlogPost } from '../blogData';
import Link from 'next/link';

export const BlogOneContent = () => {
  return (

    <div>  
  <div className="min-h-screen bg-white">
  <div className="  ">
    <div className="prose prose-lg max-w-none text-gray-900">
      <p className="text-xl leading-relaxed mb-6">
        If you lead growth, brand, or performance, your dashboards tell you almost everything: what drove lift, what dropped CPA, what creative nailed attention. One line is still missing. Every click you buy, every view you serve, every measurement ping, rides on energy servers, networks, data centres, devices, studios, travel. That energy has a carbon cost. Most of it lives in your value chain (Scope 3), and in many sectors Scope 3 is the biggest slice of the corporate footprint. Ignoring it is like optimising media with the conversion pixel turned off.
      </p>

      <p className="mb-8">
        Now zoom out. Advertising is vast and still growing. Global ad spend in 2025 is forecast to reach about $1.17 trillion. When an industry at that scale treats carbon as an externality, &ldquo;small per-ad&rdquo; impacts compounds visible to regulators, investors and your customers.    
          Add a single KPI to your stack: marketing carbon emissions (CO₂e) so leaders can weigh performance and impact in the same view.
        </p>
               

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">The Regulatory Landscape</h2>
      <p className="mb-6">
        Regulation is catching up. In Europe, the Corporate Sustainability Reporting Directive (CSRD) brings value-chain impacts into scope for large and listed companies. In the UK, SECR guidance expects organisations to explain material Scope 3 and be clear about data quality. In the US, the SEC&rsquo;s climate disclosure rule, adopted in March 2024, hit legal headwinds; on 27 March 2025 the SEC voted to stop defending it. Markets, however, still want decision-useful climate data.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">What is CliMarTech and Why It Matters</h2>
      <p className="mb-6">
        CliMarTech sits where climate, marketing and technology meet. Think of it as tools that make campaign CO₂e measurable, auditable and actionable inside the workflows you already use: planning, buying, trafficking, optimisation, reporting. It&rsquo;s not a black-box score; it quantifies the energy and material inputs tied to choices you control: formats, frequency, partners and paths.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Where does it plug in?</h3>
      <p className="mb-6">
        Right alongside CPM, CPA, ROAS and Brand Lift. If you can see kgCO₂e per 1,000 impressions (eCPMe), per click, per acquisition, plus your total campaign footprint, you can trade off creative weight, supply paths and verification just as you do with spend and performance. It also gives Finance and ESG a clean line of sight to CSRD/SECR-aligned disclosures using GHG Protocol concepts.
      </p>

      <div className="border-l-4 border-gray-300 pl-6 my-8">
        <p className="font-semibold text-gray-900">The Upshot</p>
        <p className="text-gray-900 mt-2">
          When CO₂e sits next to ROAS, you can say no to waste twice: once for budget, again for carbon.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Where the Emissions Hide and Why They&rsquo;re Missed</h2>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Media and Ad-serving</h3>
      <p className="mb-6">
        Every impression triggers computation and data transfer. Heavier files and longer supply paths increase work for exchanges, CDNs and verification layers; video magnifies the effect. Peer-reviewed and industry research point in the same direction: complexity and file weight reliably drive energy demand.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Programmatic Complexity</h3>
      <p className="mb-6">
        The ANA&rsquo;s transparency work shows how duplication across SSPs/DSPs explodes the number of pathways for a single impression. More paths often mean more computation without guaranteed performance.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Creative and Production</h3>
      <p className="mb-6">
        Shoots, travel, lighting, renders, large file transfers especially for video-led campaigns sit outside your office electricity bill, which is why they&rsquo;re easy to miss.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Offline Channels</h3>
      <p className="mb-6">
        Print runs, OOH build and logistics, event power and fabrication aren&rsquo;t on your ad-tech diagram—but they are firmly in Scope 3.
      </p>

      <div className="border-l-4 border-gray-300 pl-6 my-8">
        <p className="font-semibold text-gray-900">Leadership Takeaway</p>
        <p className="text-gray-900 mt-2">
          Treat CO₂e as a core KPI, not a CSR footnote.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Put CO₂e on the Dashboard You Already Use</h2>
      <p className="mb-6">
        You don&rsquo;t need a new religion, just a few disciplined metrics:
      </p>

      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="border border-gray-200 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Intensity</h4>
          <p className="text-gray-900 text-sm">
            Track eCPMe (kgCO₂e per 1,000 impressions) and CO₂e per acquisition. That makes like-for-like comparisons possible between formats, partners and scenarios.
          </p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Total Footprint</h4>
          <p className="text-gray-900 text-sm">
            Show the whole number per campaign and split it Media / Creative / Ops. This is the line your CFO and sustainability lead need.
          </p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Trend</h4>
          <p className="text-gray-900 text-sm">
            Plot intensity over time and against channel benchmarks to show improvement.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Decision Rules to Actually Enforce</h2>
      <ul className="list-disc pl-6 space-y-3 mb-8 text-gray-900">
        <li>Prefer lower-intensity supply paths and formats when performance is equal</li>
        <li>Cap creative weight where attention gains flatten</li>
        <li>Consolidate vendors to avoid duplicative processing and stray auctions</li>
        <li>Keep audit trail assumptions, supplier data, emission factors, certificate IDs so Finance can map campaigns into CSRD/SECR reporting without a hunt</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Quick Wins This Quarter (No Performance Penalty)</h2>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Media Buying</h3>
      <p className="mb-6">
        Shorten your supply path, fewer hops, fewer resellers. Where performance is equal, prefer direct or verified paths with transparent log-level data. The ANA finds that consolidation and proper data access unlock measurable gains.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Creative Hygiene</h3>
      <p className="mb-6">
        Right-size files; use adaptive encoding; limit autoplay where attention is low; reuse masters; consider remote direction or virtual production to avoid unnecessary travel.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Measurement Sanity</h3>
      <p className="mb-6">
        Remove redundant pixels; sample where acceptable; rationalise third-party tags in pages and apps. The quickest way to cut computation is to stop asking the web to do the same job twice.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Ops Choices</h3>
      <p className="mb-6">
        For shoots, favour rail over short-haul flights where practical, pick renewable-powered stages, and consolidate days. For events, ask about on-site power and reuse builds.
      </p>

      <div className="border-l-4 border-gray-300 pl-6 my-8">
        <p className="font-semibold text-gray-900">Why This Works</p>
        <p className="text-gray-900 mt-2">
          Leaner paths and lighter assets often lower costs while trimming emissions—savings twice.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Claims That Pass Scrutiny (And Keep Legal Calm)</h2>
      <p className="mb-6">If you plan to speak publicly, keep it evidence-led:</p>
      <ul className="list-disc pl-6 space-y-3 mb-8 text-gray-900">
        <li>Say what you measured, show the proof: &ldquo;We measured campaign CO₂e across media, creative and ops, and retired verified credits against the residual—here are the certificate IDs.&rdquo;</li>
        <li>Keep a tidy file: Data sources, factors, vendors, retirement IDs, dates and volumes</li>
        <li>Avoid the traps: Vague claims, no proof trail, double-counting—these invite trouble</li>
      </ul>
      <p className="mb-8">
        Three anchors matter to reviewers and auditors: GHG Protocol methods, CSRD expectations for value-chain impacts, and SECR guidance on material Scope 3 and data quality.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Reality Check: The Regulatory Backdrop</h2>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">EU (CSRD)</h3>
      <p className="mb-6">
        Large and listed companies must report on sustainability risks, opportunities and impacts—including significant Scope 3 using European standards (ESRS). If marketing emissions are material, they belong in scope, with a method you can explain and defend.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">US (SEC Rule)</h3>
      <p className="mb-6">
        Adopted March 2024, later stayed; on 27 March 2025 the SEC voted to stop defending it. Timelines are fluid, but investors still expect decision-useful climate data.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">UK (SECR)</h3>
      <p className="mb-6">
        Government guidance for 2025–26 reiterates Scope 3 where material and stresses clarity on boundaries, data quality and the handling of offsets.
      </p>

      <p className="mb-8 font-semibold text-gray-900">
        Translation: marketing can&rsquo;t remain invisible to corporate sustainability reporting.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Mini Scenarios: What &ldquo;Good&rdquo; Looks Like</h2>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Q4 Video Push</h3>
      <p className="mb-6">
        Baseline eCPMe for CTV/online video, trim bitrates on low-attention placements, cap frequency, and shift a small slice to equally effective, lower-intensity channels. Reach and CPA hold; intensity drops and so does the bill.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Always-on Display</h3>
      <p className="mb-6">
        Collapse supply paths to a preferred set of partners, remove duplicative verification and standardise lightweight templates. Pages load faster; auctions shrink; your audit trail is clean.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Experiential Plus Digital</h3>
      <p className="mb-6">
        Book a venue on renewable power, reuse last year&rsquo;s build, plan travel sensibly. Online, avoid heavy assets in low-attention scroll zones. Retire credits against the residual and link certificates to the campaign ID. The wrap report contains a measurable claim, not a slogan.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">The Quiet Plot Twist</h2>
      <p className="mb-8 text-lg leading-relaxed">
        Interrogating marketing carbon emissions tends to reward classic craft: simpler paths, lighter files, fewer pointless checks, right-sized production. It&rsquo;s the discipline we admire: clarity, restraint, precision—applied to an externality we&rsquo;ve ignored. Because advertising is enormous, marginal gains scale fast.
      </p>

      <div className="border-2 border-gray-300 rounded-lg p-8 my-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">A Practical Way Forward</h2>
        <p className="text-lg mb-6 text-gray-900">
          If you&rsquo;ve read this far, you don&rsquo;t need a sermon; you need a first step. We built CarbonCut to be useful: a lightweight way to measure campaign CO₂e, keep an audit trail and neutralise the residual with on-record certificates. Use it to add the missing KPI next to your performance metrics, not to replace them.
        </p>
        <p className="text-lg mb-6 text-gray-900">
          Try the{" "}
          <Link href="/calculator" className='text-tertiary hover:text-black underline' >CarbonCalculator</Link>
          
            {" "}to instantly measure your campaign&rsquo;s marketing CO₂e and offset the remainder with verified projects and retirement certificates your auditors can trust.
        </p>
      </div>
    </div>
  </div>
</div>
     </div>
  );
};

// Export blog data for the blog system
export const blogOneData: BlogPost = {
  id: '1',
  slug: '1',
  category: 'Sustainable Marketing',
  title: 'How Marketing Is Killing the World One Ad at a Time (And What To Do About It)',
  excerpt: 'Discover why CO₂e should be your next core KPI and how to measure marketing carbon emissions alongside performance metrics like ROAS and CPA.',
  date: '2025-10-1',
  author: {
    name: '',
    avatar: '/people/person1.jpg'
  },
  readTime: '8 min read',
  image: '/blogs/blogsOne.png',
  featured: true,

  
 
};

